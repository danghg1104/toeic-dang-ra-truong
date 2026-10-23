const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Tự động nạp biến môi trường từ .env nếu tồn tại
try {
  const candidateEnvPaths = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '.env.local'),
    path.join(__dirname, '.env.txt'),
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env.txt')
  ];
  for (const envPath of candidateEnvPaths) {
    if (fs.existsSync(envPath) && fs.statSync(envPath).isFile()) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.substring(0, idx).trim();
          const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      });
      break;
    }
  }
} catch (e) {
  console.warn('Lỗi đọc file .env:', e.message);
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const PROFILES_DIR = path.join(DATA_DIR, 'profiles');
const USERS_FILE = path.join(DATA_DIR, 'users_database.json');
const SYNC_FILE = path.join(DATA_DIR, 'study_sync_store.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions_database.json');

// Khởi tạo các thư mục lưu trữ dữ liệu
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PROFILES_DIR)) fs.mkdirSync(PROFILES_DIR, { recursive: true });

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

// =========================================================================
// QUẢN LÝ PHIÊN (SERVER SESSION STORE & SECURE HTTPONLY COOKIES)
// =========================================================================
let memorySessions = null;

function loadSessionsDatabase() {
  if (memorySessions) return memorySessions;
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
      if (typeof data === 'object' && data !== null) {
        memorySessions = data;
        return memorySessions;
      }
    }
  } catch (err) {
    console.warn('Lỗi đọc database phiên:', err.message);
  }
  memorySessions = {};
  return memorySessions;
}

function saveSessionsDatabase() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(memorySessions || {}, null, 2), 'utf8');
  } catch (err) {
    console.error('Lỗi ghi database phiên:', err.message);
  }
}

function createSession(userId, maxAgeMs = 30 * 24 * 3600 * 1000) {
  const sessions = loadSessionsDatabase();
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  sessions[token] = {
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: now + maxAgeMs
  };
  saveSessionsDatabase();
  return token;
}

function getSession(token) {
  if (!token) return null;
  const sessions = loadSessionsDatabase();
  const session = sessions[token];
  if (!session) return null;
  if (session.expiresAt && session.expiresAt < Date.now()) {
    deleteSession(token);
    return null;
  }
  return session;
}

function deleteSession(token) {
  if (!token) return;
  const sessions = loadSessionsDatabase();
  if (sessions[token]) {
    delete sessions[token];
    saveSessionsDatabase();
  }
}

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    try {
      list[name] = decodeURIComponent(value);
    } catch (e) {
      list[name] = value;
    }
  });
  return list;
}

function getAuthenticatedUserId(req) {
  // 1. Kiểm tra cookie session_token
  const cookies = parseCookies(req);
  const cookieToken = cookies['cd_session'];
  if (cookieToken) {
    const session = getSession(cookieToken);
    if (session) return session.userId;
  }
  // 2. Kiểm tra header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = getSession(token);
    if (session) return session.userId;
  }
  return null;
}

function setSessionCookie(res, req, token, maxAgeSeconds = 30 * 24 * 3600) {
  const isSecure = (req.headers['x-forwarded-proto'] === 'https') || (req.socket && req.socket.encrypted);
  const secureFlag = isSecure ? '; Secure' : '';
  res.setHeader('Set-Cookie', `cd_session=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax${secureFlag}`);
}

function clearSessionCookie(res, req) {
  const isSecure = (req.headers['x-forwarded-proto'] === 'https') || (req.socket && req.socket.encrypted);
  const secureFlag = isSecure ? '; Secure' : '';
  res.setHeader('Set-Cookie', `cd_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secureFlag}`);
}

function getCorsHeaders(req) {
  const origin = req.headers.origin;
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Device-Id, Authorization, X-Requested-With'
  };
}

// Băm mật khẩu scrypt an toàn
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  if (stored.includes(':')) {
    const [salt, originalHash] = stored.split(':');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return hash === originalHash;
  }
  return password === stored;
}

// =========================================================================
// QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG & HỒ SƠ ĐỘC LẬP
// =========================================================================
function loadUsersDatabase() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      if (Array.isArray(users)) {
        return users;
      }
    }
  } catch (err) {
    console.warn('Lỗi đọc database người dùng:', err.message);
  }
  return [];
}

function saveUsersDatabase(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Lỗi ghi database người dùng:', err.message);
  }
}

// Di chuyển dữ liệu cũ cho chủ web khi đăng nhập (Zero Data Loss)
function migrateOwnerDataIfEligible(user) {
  const ownerEmail = (process.env.OWNER_EMAIL || '').trim().toLowerCase();
  const userEmail = (user.email || '').trim().toLowerCase();
  if (!ownerEmail || !userEmail || userEmail !== ownerEmail) {
    return;
  }
  const targetPath = getUserProfilePath(user.id);
  const exists = fs.existsSync(targetPath);
  let shouldMigrate = !exists;
  if (exists) {
    try {
      const current = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      if (!current.learnedVocabItems || current.learnedVocabItems.length === 0) {
        shouldMigrate = true;
      }
    } catch (e) {
      shouldMigrate = true;
    }
  }

  if (shouldMigrate) {
    const candidates = [
      path.join(PROFILES_DIR, 'acc-1792238705599-v6ol.json'),
      path.join(PROFILES_DIR, 'acc-dang.json')
    ];
    for (const src of candidates) {
      if (fs.existsSync(src)) {
        try {
          const raw = JSON.parse(fs.readFileSync(src, 'utf8'));
          raw.userId = user.id;
          fs.writeFileSync(targetPath, JSON.stringify(raw, null, 2), 'utf8');
          console.log(`[Migration] Đã di chuyển an toàn hồ sơ cũ từ ${path.basename(src)} sang tài khoản chủ web ${user.email} (${user.id})`);
          break;
        } catch (e) {
          console.error('[Migration] Lỗi di chuyển dữ liệu:', e.message);
        }
      }
    }
  }
}

// =========================================================================
// CHUỖI NGÀY HỌC (STREAK) CHUẨN GIỜ VIỆT NAM (Asia/Ho_Chi_Minh)
// =========================================================================
function getVietnamDateString(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date); // Định dạng YYYY-MM-DD
}

function getPreviousDateString(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

function getVietnamWeekDays(referenceDate = new Date()) {
  const vnStr = getVietnamDateString(referenceDate);
  const [y, m, d] = vnStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dayOfWeek = dt.getUTCDay(); // 0 là CN, 1 là T2, ..., 6 là T7
  const diffToMonday = dayOfWeek === 0 ? -6 : (1 - dayOfWeek);

  const monday = new Date(dt);
  monday.setUTCDate(monday.getUTCDate() + diffToMonday);

  const days = [];
  const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setUTCDate(cur.getUTCDate() + i);
    const dateStr = cur.toISOString().slice(0, 10);
    days.push({
      label: labels[i],
      dateStr: dateStr,
      isToday: dateStr === vnStr
    });
  }
  return days;
}

function calculateUserStreak(activityDates = [], referenceDate = new Date()) {
  const todayStr = getVietnamDateString(referenceDate);
  const yesterdayStr = getPreviousDateString(todayStr);
  const uniqueDates = Array.from(new Set(activityDates || [])).sort();
  const dateSet = new Set(uniqueDates);

  const todayStudied = dateSet.has(todayStr);
  const yesterdayStudied = dateSet.has(yesterdayStr);

  let streak = 0;
  if (todayStudied) {
    let cur = todayStr;
    while (dateSet.has(cur)) {
      streak++;
      cur = getPreviousDateString(cur);
    }
  } else if (yesterdayStudied) {
    // Sau 00:00:00 hôm sau nếu chưa học: streak giữ nguyên để chờ hoạt động hôm nay
    let cur = yesterdayStr;
    while (dateSet.has(cur)) {
      streak++;
      cur = getPreviousDateString(cur);
    }
  } else {
    // Không học hôm nay cũng không học hôm qua -> streak = 0
    streak = 0;
  }

  const weekDays = getVietnamWeekDays(referenceDate).map(wd => ({
    ...wd,
    active: dateSet.has(wd.dateStr)
  }));

  return {
    streak,
    todayStudied,
    yesterdayStudied,
    weekDays,
    lastActivityDate: uniqueDates.length > 0 ? uniqueDates[uniqueDates.length - 1] : null
  };
}

// Lưu trữ & Tải tiến độ học tập riêng biệt từng người dùng (Zero Data Loss)
function getUserProfilePath(userId) {
  const safeId = String(userId || 'acc-guest').replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(PROFILES_DIR, `${safeId}.json`);
}

function loadUserProfile(userId) {
  const filePath = getUserProfilePath(userId);
  let profile = null;
  try {
    if (fs.existsSync(filePath)) {
      profile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.warn(`Lỗi đọc hồ sơ ${userId}:`, e.message);
  }
  if (!profile) {
    profile = {
      userId: userId,
      lastUpdated: Date.now(),
      state: { xp: 0, streak: 0, vocabLearned: 0, dictationDone: 0, grammarDone: 0, readDone: 0, listenDone: 0, studyMinutes: 0 },
      activityDates: [],
      learnedVocabItems: [],
      savedVocabItems: [],
      takeNotesList: [],
      savedGrammarNotes: [],
      savedWords: [],
      copyingHistory: [],
      dictationHistory: [],
      mockHistory: []
    };
  }

  // Luôn tính toán streak thực tế từ activityDates theo múi giờ Việt Nam
  const streakInfo = calculateUserStreak(profile.activityDates || []);
  if (!profile.state) profile.state = {};
  profile.state.streak = streakInfo.streak;
  profile.streakInfo = streakInfo;
  return profile;
}

function saveUserProfile(userId, profileData) {
  const filePath = getUserProfilePath(userId);
  try {
    const existing = loadUserProfile(userId);
    const combinedDates = Array.from(new Set([
      ...(existing.activityDates || []),
      ...(profileData.activityDates || [])
    ])).sort();

    const streakInfo = calculateUserStreak(combinedDates);
    const merged = {
      ...existing,
      ...profileData,
      activityDates: combinedDates,
      userId: userId,
      lastUpdated: Date.now()
    };
    if (!merged.state) merged.state = {};
    merged.state.streak = streakInfo.streak;
    merged.streakInfo = streakInfo;

    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
    return merged;
  } catch (e) {
    console.error(`Lỗi ghi hồ sơ ${userId}:`, e.message);
    return null;
  }
}

function recordStudyActivity(userId, activityDateStr = null) {
  if (!userId) return null;
  const profile = loadUserProfile(userId);
  const dateToRecord = activityDateStr || getVietnamDateString();
  const dates = new Set(profile.activityDates || []);
  dates.add(dateToRecord);
  profile.activityDates = Array.from(dates).sort();

  const streakInfo = calculateUserStreak(profile.activityDates);
  if (!profile.state) profile.state = {};
  profile.state.streak = streakInfo.streak;
  profile.streakInfo = streakInfo;

  saveUserProfile(userId, profile);

  // Cập nhật streak vào danh sách người dùng trong users_database.json
  try {
    const users = loadUsersDatabase();
    const u = users.find(x => x.id === userId);
    if (u && u.streak !== streakInfo.streak) {
      u.streak = streakInfo.streak;
      saveUsersDatabase(users);
    }
  } catch (e) {}

  return streakInfo;
}

// =========================================================================
// REAL-TIME SERVER-SENT EVENTS (SSE) HUB CHO ĐỒNG BỘ ĐA THIẾT BỊ
// =========================================================================
const sseClients = new Set();

function broadcastSyncEvent(eventData) {
  const msg = `data: ${JSON.stringify(eventData)}\n\n`;
  for (const client of sseClients) {
    try {
      if (client.userId && eventData.userId && client.userId === eventData.userId) {
        client.write(msg);
      }
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

// Giữ kết nối SSE luôn sống
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': keepalive\n\n');
    } catch (e) {
      sseClients.delete(client);
    }
  }
}, 20000);

// =========================================================================
// AI TOEIC TUTOR INTELLIGENCE ENGINE (ETS 2023 - 2027)
// =========================================================================
function expertTOEICReasoningFallback(question, context = {}, trapTitle = '') {
  const q = String(question || '').toLowerCase();
  const ctxStr = typeof context === 'object' ? (context.q || '') + ' ' + (context.explain || '') + ' ' + (context.ans || '') : String(context || '');
  const fullText = (q + ' ' + ctxStr + ' ' + trapTitle).toLowerCase();

  if (fullText.includes('being') || fullText.includes('been') || fullText.includes('part 1') || fullText.includes('tranh tĩnh')) {
    return `### 🤖 Gia Sư AI Phân Tích: Bẫy "Being vs Been" (Part 1 TOEIC)
📌 **Phân tích bản chất:**
- **"is/are BEING + PII"**: Diễn tả một hành động **đang được người tác động trực tiếp lên vật**. Nếu trong tranh **không có người**, đáp án có "being" là **SAI 99%** (ví dụ: *Chairs are being moved* ➔ phải có người đang bưng ghế).
- **"has/have BEEN + PII"**: Diễn tả một trạng thái tĩnh **đã hoàn tất từ trước** (ví dụ: *Documents have been left on the desk* ➔ tài liệu đã được để sẵn trên bàn). Tranh không người rất thích dùng dạng này!

⚠️ **Bẫy đề thi ETS 2023 - 2026:**
Loa phát âm /ˈbiː.ɪŋ/ và /biːn/ rất lướt khiến thí sinh nghe nhầm.
*Ngoại lệ hiếm hoi:* "is being displayed" (đang trưng bày) hoặc "a shadow is being cast" (bóng đổ) vẫn đúng trong tranh tĩnh.

⚡ **Mẹo 3 giây trong phòng thi:**
Tranh không có người ➔ Nghe thấy chữ **"BEING"** là **GẠCH NGAY** không cần suy nghĩ!`;
  }

  if (fullText.includes('gián tiếp') || fullText.includes('né tránh') || fullText.includes('part 2') || fullText.includes('where') || fullText.includes('when') || fullText.includes('who')) {
    return `### 🤖 Gia Sư AI Phân Tích: Bẫy Trả Lời Gián Tiếp (Part 2 ETS 2024 - 2027)
📌 **Phân tích bản chất:**
Đề thi TOEIC hiện đại cắt giảm tối đa các câu hỏi dễ trả lời thẳng (ví dụ: *Where -> At room 101*). Thay vào đó, 45% câu hỏi dùng câu trả lời **gián tiếp, đá trách nhiệm hoặc hỏi ngược lại**.

⚠️ **Các dạng bẫy kinh điển:**
1. **Đá trách nhiệm cho người khác:** *"Ask Ms. Maria"*, *"Mr. David is in charge of that"*.
2. **Kiểm tra văn bản / nguồn tin:** *"It's posted on the bulletin board"*, *"Check your email"*.
3. **Từ chối khéo léo / nêu lý do bận:** *"I have a doctor's appointment"*, *"The flight was delayed"*.
4. **Hỏi ngược lại:** *"Didn't they inform you yesterday?"*.

⚡ **Mẹo 3 giây trong phòng thi:**
Loại các câu lặp âm giống hệt câu hỏi hoặc câu trả lời Yes/No cho câu hỏi Wh- (Who, When, Where, Why). Chọn câu trả lời thể hiện việc kiểm tra nguồn tin hoặc phân công người khác!`;
  }

  if (fullText.includes('-ive') || fullText.includes('-al') || fullText.includes('representative') || fullText.includes('initiative') || fullText.includes('alternative') || fullText.includes('proposal') || fullText.includes('approval')) {
    return `### 🤖 Gia Sư AI Phân Tích: Danh Từ Đặc Biệt Đuôi -ive & -al (Part 5)
📌 **Phân tích bản chất:**
Thí sinh thường học máy móc rằng đuôi *-ive* (như expensive) và *-al* (như national) là Tính từ. ETS cố tình đặt chỗ trống cần điền **Danh từ** nhưng 4 đáp án lại có các từ này để gài bẫy.

⚠️ **10 Danh từ cốt lõi bắt buộc phải thuộc:**
- **representative**: người đại diện (Danh từ chỉ người)
- **initiative**: sáng kiến, kế hoạch mới
- **alternative**: giải pháp thay thế
- **objective**: mục tiêu dự án
- **executive**: cán bộ điều hành cấp cao
- **proposal**: bản đề xuất dự án
- **approval**: sự phê duyệt
- **renewal**: sự gia hạn hợp đồng
- **arrival**: sự đến nơi / hàng về
- **disposal**: việc thanh lý / xử lý rác

⚡ **Mẹo 3 giây trong phòng thi:**
Nếu trước chỗ trống có tính từ (VD: *sales _________*) và câu thiếu chủ ngữ chỉ người đi với hành động phản hồi/liên hệ ➔ Chọn ngay **representative**!`;
  }

  if (fullText.includes('rút gọn') || fullText.includes('mệnh đề quan hệ') || fullText.includes('v-ing') || fullText.includes('v-ed')) {
    return `### 🤖 Gia Sư AI Phân Tích: Rút Gọn Mệnh Đề Quan Hệ (Part 5)
📌 **Phân tích bản chất:**
Câu đã có **động từ chính chia thì** (ví dụ: *must register, was delivered, will attend*). Chỗ trống nằm ngay sau một danh từ để bổ nghĩa.

⚠️ **Quy tắc 2 bước bất bại:**
1. **Sau chỗ trống CÓ TÂN NGỮ (Cụm danh từ):** ➔ Rút gọn dạng CHỦ ĐỘNG: **Chọn V-ing**.
   *VD: Anyone **having** questions should ask the manager. ('questions' là tân ngữ).*
2. **Sau chỗ trống KHÔNG CÓ TÂN NGỮ (Đi với giới từ by / in / at hoặc dấu phẩy):** ➔ Rút gọn BỊ ĐỘNG: **Chọn V-ed / PII**.
   *VD: Goods **purchased** during the sale cannot be returned. (Sau là giới từ 'during').*

⚡ **Mẹo 3 giây trong phòng thi:**
Tìm động từ chính trước! Nếu câu đã có động từ chia thì, tuyệt đối không chọn thêm động từ chia thì nữa mà chỉ chọn V-ing (chủ động) hoặc V-ed (bị động)!`;
  }

  if (fullText.includes('giả định') || fullText.includes('subjunctive') || fullText.includes('đảo ngữ') || fullText.includes('should') || fullText.includes('recommended that') || fullText.includes('insist')) {
    return `### 🤖 Gia Sư AI Phân Tích: Thể Giả Định & Đảo Ngữ Câu Điều Kiện (Xu Hướng 2026 - 2027)
📌 **Phân tích bản chất:**
Đây là dạng câu hỏi phân loại điểm 800 - 990 trong các kỳ thi ETS gần đây:
1. **Thể giả định (Subjunctive Mood):**
   Cấu trúc: *S + (demand/require/request/recommend/insist/suggest) + that + S + **(should) V-nguyên thể**.*
   *Đặc biệt chú ý:* Động từ to be bắt buộc là **"be"**, không chia is/are/was/were dù chủ ngữ là số ít!
   *VD: The manager requested that Mr. Davis **be** present on time.*
2. **Đảo ngữ câu điều kiện (Bỏ chữ IF):**
   - Loại 1: **Should you + V-bare** (= If you + V)
   - Loại 3: **Had we + PII** (= If we had + PII)

⚡ **Mẹo 3 giây trong phòng thi:**
Thấy đầu câu có chỗ trống đứng trước chủ ngữ và động từ nguyên mẫu (VD: *______ you experience any issue...*) ➔ Điền **Should**, không điền If!`;
  }

  if (fullText.includes('liên từ') || fullText.includes('giới từ') || fullText.includes('although') || fullText.includes('despite') || fullText.includes('because') || fullText.includes('due to') || fullText.includes('during') || fullText.includes('while')) {
    return `### 🤖 Gia Sư AI Phân Tích: Liên Từ vs Giới Từ (Part 5)
📌 **Phân tích bản chất:**
Các cặp từ mang **nghĩa giống hệt nhau** nhưng ngữ pháp khác nhau hoàn toàn:
- **LIÊN TỪ (Theo sau là Mệnh đề S + V):**
  * *Because / Since / As* (Bởi vì)
  * *Although / Even though / Though* (Mặc dù)
  * *While* (Trong khi)
- **GIỚI TỪ (Theo sau là Cụm danh từ / V-ing):**
  * *Because of / Due to / Owing to* (Bởi vì)
  * *Despite / In spite of* (Mặc dù)
  * *During* (Trong suốt)

⚡ **Mẹo 3 giây trong phòng thi:**
Nhìn ngay từ thứ 1 đến thứ 3 sau chỗ trống: Có động từ chia thì không? Nếu có động từ chia thì ➔ Chọn Liên từ. Nếu chỉ toàn Danh từ ➔ Chọn Giới từ!`;
  }

  if (fullText.includes('wearing') || fullText.includes('putting on') || fullText.includes('trang phục')) {
    return `### 🤖 Gia Sư AI Phân Tích: Bẫy "Wearing" vs "Putting on" (Part 1 TOEIC)
📌 **Phân tích bản chất:**
- **"WEARING"**: Diễn tả **TRẠNG THÁI** (quần áo, kính, mũ bảo hộ, găng tay đã nằm sẵn trên cơ thể).
- **"PUTTING ON"**: Diễn tả **HÀNH ĐỘNG ĐANG MẶC** (tay đang xỏ vào áo, đang cài cúc, đang đội mũ lên đầu).

⚡ **Mẹo 3 giây trong phòng thi:**
Nếu người trong tranh đã mặc đồ chỉnh tề, hai tay đang làm việc khác (gõ bàn phím, cầm tài liệu) ➔ **CHỌN WEARING, LOẠI NGAY PUTTING ON**!`;
  }

  if (fullText.includes('part 3') || fullText.includes('actually') || fullText.includes('wait') || fullText.includes('đổi ý') || fullText.includes('hội thoại')) {
    return `### 🤖 Gia Sư AI Phân Tích: Bẫy Đổi Ý Phút Chót (Part 3 TOEIC)
📌 **Phân tích bản chất:**
Người nói đầu tiên đề xuất phương án A (ví dụ: *9:00 AM*), nhưng ngay sau đó thốt lên: *"Actually, wait..."* hoặc *"Let's make it 10:00 instead"*.

⚡ **Mẹo 3 giây trong phòng thi:**
Không vội khoanh phương án đầu tiên nghe được! Luôn cảnh giác với các từ nối đảo chiều: **Actually, However, Wait, Instead, On second thought**. Thông tin sau từ nối mới là đáp án chốt!`;
  }

  if (fullText.includes('part 4') || fullText.includes('gate') || fullText.includes('flight') || fullText.includes('announcement') || fullText.includes('sân bay') || fullText.includes('thông báo')) {
    return `### 🤖 Gia Sư AI Phân Tích: Bẫy Thông Báo Sân Bay & Đổi Cổng (Part 4 TOEIC)
📌 **Phân tích bản chất:**
Loa thông báo sân bay thường nhắc đến 2 cổng: Cổng cũ bị hoãn hoặc bảo trì, và Cổng mới hành khách cần di chuyển tới (Gate Change). Thí sinh không nghe kỹ dễ chọn nhầm cổng cũ.

⚡ **Mẹo 3 giây trong phòng thi:**
Chú ý cụm: *"Due to maintenance at Gate X, boarding will now take place at Gate Y"*. Luôn chọn số cổng đứng sau cụm **"will now take place at..."**!`;
  }

  if (fullText.includes('part 6') || fullText.includes('điền câu') || fullText.includes('sentence insert') || fullText.includes('đoạn văn')) {
    return `### 🤖 Gia Sư AI Phân Tích: Bẫy Điền Cả Câu Vào Đoạn Văn (Part 6)
📌 **Phân tích bản chất:**
Dạng bài khó nhất Part 6 đòi hỏi phải chọn 1 trong 4 câu hoàn chỉnh để điền vào đoạn văn. 

⚡ **Quy tắc 3 bước móc xích:**
1. Đọc câu ngay TRƯỚC và câu ngay SAU chỗ trống.
2. Tìm các **đại từ móc nối**: *This, These, Such, As a result, However*.
3. Câu được chọn phải giải thích hoặc tiếp nối trực tiếp ý của câu đứng trước!`;
  }

  if (fullText.includes('part 7') || fullText.includes('đoạn kép') || fullText.includes('đoạn ba') || fullText.includes('cross') || fullText.includes('not') || fullText.includes('true') || fullText.includes('đọc hiểu')) {
    return `### 🤖 Gia Sư AI Phân Tích: Bẫy Đoạn Văn Kép & Ba (Part 7 TOEIC)
📌 **Phân tích bản chất:**
Câu hỏi đối chiếu chéo (Cross-referencing) không bao giờ nằm trọn trong 1 đoạn văn. Bạn phải ghép 2 thông tin từ 2 đoạn:
- Đoạn 1 (Email): Tên dịch vụ hoặc gói thành viên khách hàng chọn (ví dụ: *Premier Plan*).
- Đoạn 2 (Bảng giá/Lịch trình): Quyền lợi hoặc giá tiền tương ứng của gói đó.

⚡ **Mẹo 3 giây trong phòng thi:**
Gặp câu hỏi hỏi về số tiền phải trả hoặc người được chỉ định, hãy khoanh vùng từ khóa ở Đoạn 1 trước, sau đó đối chiếu sang bảng ở Đoạn 2 để tìm đáp án!`;
  }

  return `### 🤖 Gia Sư AI Luyện Thi TOEIC Giải Đáp
📌 **Nội dung câu hỏi:** "${question}"

💡 **Phân tích giải thích chi tiết:**
- Để xử lý câu hỏi này trong đề thi TOEIC, bạn cần xác định rõ **vị trí từ loại** và **ngữ cảnh ngữ pháp doanh nghiệp** (Part 5, 6 hoặc 7).
- Hãy luôn đọc lướt trước và sau chỗ trống:
  1. Xác định Động từ chính (Main Verb) của câu đã có chưa.
  2. Xác định các dấu hiệu thời gian (thì động từ) hoặc giới từ đi kèm.
  3. Áp dụng phương pháp loại trừ 2 đáp án vô lý trước để tăng xác suất chọn đúng lên 50%.

⚡ **Lời khuyên từ Đăng & Gia sư AI:**
Nếu bạn sắp đến ngày thi TOEIC, hãy tập trung vào 3 bẫy hay gặp nhất: Bẫy câu trả lời gián tiếp Part 2, Bẫy danh từ đuôi -ive/-al Part 5, và Bẫy liên từ vs giới từ. Luyện tập đều 20 câu mỗi ngày sẽ giúp bạn tăng từ 100 - 150 điểm chỉ trong 2 tuần!`;
}

function answerWithTOEICAI(question, context = {}, trapTitle = '', callback) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const q = String(question || '').trim();
  const ctxStr = typeof context === 'object' ? JSON.stringify(context) : String(context || '');

  if (geminiKey) {
    try {
      const prompt = `Bạn là Gia Sư AI Luyện Thi TOEIC & Tiếng Anh chuyên sâu trong ứng dụng 'Cùng Đăng Ra Trường'.
Nhiệm vụ: Giải đáp câu hỏi của sinh viên chuẩn bị ra trường về đề thi TOEIC (Part 1 - Part 7), ngữ pháp, từ vựng và bẫy đề thi ETS 2023 - 2027.
Yêu cầu:
1. Giải thích trọng tâm, rõ ràng và gãy gọn bằng tiếng Việt.
2. Nêu rõ bẫy đề thi thường gặp và tại sao đáp án này đúng / các đáp án khác sai.
3. Đưa ra mẹo phản xạ 3 giây trong phòng thi.
4. Kèm bản dịch tiếng Việt mượt mà.

Câu hỏi của học viên: "${q}"
Ngữ cảnh / Đề bài: ${ctxStr}
Chuyên đề bẫy: ${trapTitle}`;

      const postData = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000, temperature: 0.3 }
      });

      const req = https.request({
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 6000
      }, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return callback(text);
            }
          } catch(e) {}
          callback(expertTOEICReasoningFallback(q, context, trapTitle));
        });
      });

      req.on('error', () => {
        callback(expertTOEICReasoningFallback(q, context, trapTitle));
      });
      req.on('timeout', () => {
        req.destroy();
        callback(expertTOEICReasoningFallback(q, context, trapTitle));
      });
      req.write(postData);
      req.end();
      return;
    } catch(err) {
      // fallback
    }
  }

  callback(expertTOEICReasoningFallback(q, context, trapTitle));
}

// =========================================================================
// QUẢN LÝ TỪ ĐIỂN & TRA CỨU COLLOCATION ĐA TẦNG (ONLINE & LOCAL CACHE)
// =========================================================================
const DICT_CACHE_FILE = path.join(DATA_DIR, 'dictionary_cache.json');
let dictionaryCache = {};
try {
  if (fs.existsSync(DICT_CACHE_FILE)) {
    dictionaryCache = JSON.parse(fs.readFileSync(DICT_CACHE_FILE, 'utf8'));
  }
} catch (e) {
  dictionaryCache = {};
}

function saveDictionaryCache() {
  try {
    fs.writeFileSync(DICT_CACHE_FILE, JSON.stringify(dictionaryCache, null, 2), 'utf8');
  } catch (e) {}
}

function fetchHttpsJson(url, callback) {
  try {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          callback(null, json, res.statusCode);
        } catch (err) {
          callback(err, null, res.statusCode);
        }
      });
    });
    req.on('error', err => callback(err, null, 500));
    req.setTimeout(6500, () => {
      req.destroy();
      callback(new Error('Timeout'), null, 408);
    });
  } catch (err) {
    callback(err, null, 500);
  }
}

// =========================================================================
// KHO TỪ VỰNG CHUẨN ANH - VIỆT VÀ HỌ TỪ TOÀN DIỆN CHO DICTIONARY API
// =========================================================================
const CORE_VI_LEXICON = {
  "country": {
    word: "country",
    phonetic: "/ˈkʌn.tri/",
    partOfSpeech: "Noun & Adjective",
    vi: "Quốc gia, đất nước, quê hương (Danh từ); thuộc nông thôn, miền quê (Tính từ)",
    definition: "An area of land that is controlled by its own government; an area outside cities with fields, woods, and farms.",
    examTag: "TOEIC / VSTEP Core Vocabulary",
    wordFamily: {
      noun: [
        { term: "country", vi: "quốc gia, đất nước, vùng thôn quê" },
        { term: "countryside", vi: "miền quê, vùng nông thôn thanh bình" },
        { term: "compatriot", vi: "đồng bào, người cùng nước" },
        { term: "countryman", vi: "người đồng hương, người sống ở nông thôn" }
      ],
      verb: [
        { term: "nationalize", vi: "quốc hữu hóa (đưa tài sản về sở hữu nhà nước)" }
      ],
      adj: [
        { term: "country", vi: "thuộc miền quê (country house, country road)" },
        { term: "countrywide", vi: "trên quy mô toàn quốc, khắp cả nước" },
        { term: "cross-country", vi: "xuyên quốc gia, băng đồng" }
      ],
      adv: [
        { term: "countrywide", vi: "trên toàn bộ lãnh thổ quốc gia" },
        { term: "nationwide", vi: "trên phạm vi toàn quốc" }
      ]
    },
    synonyms: ["nation", "state", "homeland", "territory", "countryside", "rural area"],
    antonyms: ["city", "metropolis", "urban center"],
    collocations: [
      { en: "across the country", vi: "trên khắp cả nước" },
      { en: "host country", vi: "quốc gia đăng cai tổ chức" },
      { en: "developing / developed country", vi: "quốc gia đang phát triển / phát triển" },
      { en: "country of origin", vi: "nước xuất xứ của hàng hóa" },
      { en: "countrywide distribution network", vi: "mạng lưới phân phối trên toàn quốc" }
    ],
    idioms: [
      { en: "go to the country", vi: "tiến hành tổng tuyển cử toàn quốc" },
      { en: "another country", vi: "một thế giới hoàn toàn khác biệt" }
    ],
    toeicNote: "💡 Chú ý trong bài thi: Khi muốn diễn đạt 'trên phạm vi toàn quốc', đề thi TOEIC thường dùng trạng từ 'nationwide' hoặc 'countrywide' (e.g. Sales increased nationwide).",
    examples: [
      { en: "The company operates over two hundred stores across the country.", vi: "Công ty vận hành hơn 200 cửa hàng trên khắp cả nước." },
      { en: "Our products meet strict safety standards in every destination country.", vi: "Sản phẩm của chúng tôi đáp ứng các tiêu chuẩn an toàn nghiêm ngặt tại mọi quốc gia xuất khẩu." }
    ]
  },

  "half": {
    word: "half",
    phonetic: "/hɑːf/",
    partOfSpeech: "Noun, Adjective & Adverb",
    vi: "Một nửa, phần chia đôi (Danh từ/Tính từ); chia đôi, giảm một nửa (Động từ: halve)",
    definition: "One of two usually roughly equal parts into which anything may be divided.",
    examTag: "TOEIC / VSTEP Core Vocabulary",
    wordFamily: {
      noun: [
        { term: "half", vi: "một nửa, phần nửa" },
        { term: "halves", vi: "các nửa (dạng danh từ số nhiều)" }
      ],
      verb: [
        { term: "halve", vi: "chia đôi, giảm đi một nửa" }
      ],
      adj: [
        { term: "half", vi: "nửa, một nửa (half price, a half portion)" },
        { term: "halfway", vi: "ở giữa chừng, thỏa hiệp" }
      ],
      adv: [
        { term: "half", vi: "một nửa, một phần (half full, half cooked)" },
        { term: "halfway", vi: "ở lưng chừng, nửa đường" }
      ]
    },
    synonyms: ["portion", "fraction", "semi-", "segment"],
    antonyms: ["whole", "entirety", "total"],
    collocations: [
      { en: "first half / second half of the year", vi: "nửa đầu / nửa cuối của năm" },
      { en: "cut / divide something in half", vi: "cắt / chia cái gì làm đôi" },
      { en: "half-price discount", vi: "giảm giá nửa giá (50%)" },
      { en: "half an hour", vi: "nửa tiếng đồng hồ (30 phút)" },
      { en: "meet somebody halfway", vi: "nhượng bộ, thỏa hiệp với ai đó" }
    ],
    idioms: [
      { en: "meet someone halfway", vi: "hai bên cùng nhượng bộ để đạt thỏa thuận" },
      { en: "not half bad", vi: "khá tốt, tốt hơn mong đợi" }
    ],
    toeicNote: "⚠️ Cấu trúc TOEIC Part 5: 'Half of the + Danh từ'. Động từ chia theo danh từ phía sau 'of': 'Half of the budget WAS spent' nhưng 'Half of the employees WERE present'. Động từ của 'half' là 'halve' (chia đôi).",
    examples: [
      { en: "Operating profits dropped by more than half during the economic downturn.", vi: "Lợi nhuận hoạt động đã giảm hơn một nửa trong giai đoạn kinh tế suy thoái." },
      { en: "The engineering team managed to halve the production cycle time this quarter.", vi: "Đội ngũ kỹ thuật đã rút ngắn một nửa thời gian chu kỳ sản xuất trong quý này." }
    ]
  },

  "call": {
    word: "call",
    phonetic: "/kɔːl/",
    partOfSpeech: "Verb & Noun",
    vi: "Gọi điện, kêu gọi, triệu tập (Động từ); cuộc gọi, yêu cầu (Danh từ)",
    definition: "To speak to somebody by telephone; to give a particular name to somebody/something.",
    examTag: "TOEIC / VSTEP Core Vocabulary",
    wordFamily: {
      noun: [
        { term: "call", vi: "cuộc điện thoại, tiếng gọi" },
        { term: "caller", vi: "người gọi điện thoại" }
      ],
      verb: [
        { term: "call", vi: "gọi điện thoại, triệu tập cuộc họp" },
        { term: "recall", vi: "thu hồi sản phẩm lỗi, nhớ lại" }
      ],
      adj: [
        { term: "callable", vi: "có thể thu hồi trước hạn (trái phiếu)" }
      ],
      adv: []
    },
    synonyms: ["telephone", "phone", "contact", "summon", "convene"],
    antonyms: ["ignore", "dismiss"],
    collocations: [
      { en: "return a phone call", vi: "gọi điện thoại lại cho ai" },
      { en: "call a meeting", vi: "triệu tập một cuộc họp khẩn" },
      { en: "call for action", vi: "kêu gọi hành động" },
      { en: "call off the event", vi: "hủy bỏ sự kiện" }
    ],
    idioms: [
      { en: "call it a day", vi: "kết thúc một ngày làm việc" },
      { en: "close call", vi: "tình huống thoát hiểm trong gang tấc" }
    ],
    toeicNote: "💡 Cụm 'call off' = cancel (hủy bỏ). 'Call on / upon' = kêu gọi, yêu cầu ai làm gì.",
    examples: [
      { en: "Please return Mr. Tanaka's phone call as soon as you arrive at the office.", vi: "Vui lòng gọi lại cho ông Tanaka ngay khi bạn tới văn phòng." },
      { en: "The director decided to call a special meeting to discuss the budget deficit.", vi: "Giám đốc đã quyết định triệu tập cuộc họp đặc biệt để thảo luận về thâm hụt ngân sách." }
    ]
  }
};

function isActualVietnameseText(text) {
  if (!text || typeof text !== 'string') return false;
  const s = text.trim();
  if (!s || s.length < 2) return false;
  if (/^\((chiefly|archaic|informal|formal|slang|british|us)\)/i.test(s)) return false;
  if (/^(an? |the |one of |to |having |relating to |characterized by |connected with )/i.test(s)) return false;
  const vnDiacritics = /[àáảãạăắằẵặâấầẫậđèéẻẽẹêếềễệìíỉĩịòóỏõọôốồỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;
  return vnDiacritics.test(s);
}

function formatCleanPartOfSpeech(posList) {
  if (!posList || !posList.length) return 'General Vocabulary';
  const filtered = posList.filter(p => !['Preposition', 'Interjection', 'Article', 'Pronoun'].includes(p) || posList.length === 1);
  if (filtered.length === 1) return filtered[0];
  if (filtered.length === 2) return `${filtered[0]} & ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(', ')} & ${filtered[filtered.length - 1]}`;
}

function handleDictionaryLookup(rawWord, callback) {
  const word = String(rawWord || '').trim();
  if (!word) {
    return callback({ success: false, error: 'Vui lòng cung cấp từ hoặc cụm từ cần tra cứu!' });
  }
  const cleanKey = word.toLowerCase();

  // 1. Kiểm tra kho từ điển chuẩn CORE_VI_LEXICON trước tiên (ưu tiên cao nhất)
  if (CORE_VI_LEXICON[cleanKey]) {
    dictionaryCache[cleanKey] = CORE_VI_LEXICON[cleanKey];
    saveDictionaryCache();
    return callback({ success: true, fromCore: true, data: CORE_VI_LEXICON[cleanKey] });
  }

  // 2. Kiểm tra bộ đệm Cache cục bộ (nếu hợp lệ và đã có tiếng Việt chuẩn)
  if (dictionaryCache[cleanKey] && isActualVietnameseText(dictionaryCache[cleanKey].vi)) {
    return callback({ success: true, fromCache: true, data: dictionaryCache[cleanKey] });
  }

  // 3. Tra cứu dịch nghĩa tiếng Việt qua MyMemory Translation API
  const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanKey)}&langpair=en|vi`;
  fetchHttpsJson(myMemoryUrl, (transErr, transJson) => {
    let viTranslation = '';
    if (transJson && transJson.responseData && transJson.responseData.translatedText) {
      const candidate = transJson.responseData.translatedText.trim();
      if (candidate.toLowerCase() !== cleanKey && isActualVietnameseText(candidate)) {
        viTranslation = candidate;
      }
    }

    // Nếu là cụm từ (có dấu cách) -> Collocation lookup
    if (cleanKey.includes(' ')) {
      const entry = {
        word: word,
        phonetic: '',
        partOfSpeech: 'Cụm từ / Collocation',
        vi: viTranslation || `Cụm từ chuyên đề: "${word}"`,
        definition: `A fixed lexical collocation widely tested in TOEIC, VSTEP, and business communication.`,
        examTag: 'TOEIC Collocation / Phrasal Expression',
        wordFamily: { noun: [], verb: [], adj: [], adv: [] },
        synonyms: [],
        antonyms: [],
        collocations: [
          { en: word, vi: viTranslation || 'cụm từ cố định trong đề thi' }
        ],
        idioms: [],
        toeicNote: `💡 Bí kíp Part 5 & 6: Ghi nhớ nguyên cụm "${word}" giúp bạn phản xạ đáp án trong 3 giây mà không cần dịch nghĩa từng từ!`,
        examples: [
          { en: `It is critical to utilize "${word}" correctly in official business correspondence.`, vi: `Việc sử dụng chuẩn xác cụm từ "${word}" là rất quan trọng trong thư tín thương mại chính thức.` }
        ]
      };
      dictionaryCache[cleanKey] = entry;
      saveDictionaryCache();
      return callback({ success: true, fromApi: true, data: entry });
    }

    // Nếu là từ đơn: Tra cứu qua Free Dictionary API
    const freeDictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanKey)}`;
    fetchHttpsJson(freeDictUrl, (dictErr, dictJson, statusCode) => {
      let phonetic = `/ˈ${cleanKey}/`;
      let partOfSpeech = 'General Vocabulary';
      let definition = `An essential English term in academic and professional communication.`;
      let synonyms = [];
      let antonyms = [];
      let examples = [];
      const wordFamily = { noun: [], verb: [], adj: [], adv: [] };

      if (statusCode === 200 && Array.isArray(dictJson) && dictJson.length > 0) {
        const item = dictJson[0];
        if (item.phonetic) {
          phonetic = item.phonetic;
        } else if (Array.isArray(item.phonetics)) {
          const ph = item.phonetics.find(p => p.text);
          if (ph) phonetic = ph.text;
        }

        if (Array.isArray(item.meanings) && item.meanings.length > 0) {
          const posList = [...new Set(item.meanings.map(m => m.partOfSpeech.charAt(0).toUpperCase() + m.partOfSpeech.slice(1)))];
          partOfSpeech = formatCleanPartOfSpeech(posList);

          if (item.meanings[0].definitions && item.meanings[0].definitions[0]) {
            definition = item.meanings[0].definitions[0].definition || definition;
          }

          item.meanings.forEach(m => {
            const p = m.partOfSpeech.toLowerCase();
            const firstDef = m.definitions && m.definitions[0] ? m.definitions[0].definition : '';
            if (m.definitions && m.definitions[0] && m.definitions[0].example) {
              examples.push({
                en: m.definitions[0].example,
                vi: `Ví dụ: "${m.definitions[0].example}"`
              });
            }
            if (Array.isArray(m.synonyms)) synonyms.push(...m.synonyms);
            if (Array.isArray(m.antonyms)) antonyms.push(...m.antonyms);

            const safeMeaningVi = viTranslation || (firstDef && isActualVietnameseText(firstDef) ? firstDef : `dạng ${p} của "${cleanKey}"`);
            if (p.includes('noun') && !wordFamily.noun.some(x => x.term === cleanKey)) {
              wordFamily.noun.push({ term: cleanKey, vi: safeMeaningVi });
            } else if (p.includes('verb') && !wordFamily.verb.some(x => x.term === cleanKey)) {
              wordFamily.verb.push({ term: cleanKey, vi: safeMeaningVi });
            } else if ((p.includes('adj') || p.includes('adjective')) && !wordFamily.adj.some(x => x.term === cleanKey)) {
              wordFamily.adj.push({ term: cleanKey, vi: safeMeaningVi });
            } else if ((p.includes('adv') || p.includes('adverb')) && !wordFamily.adv.some(x => x.term === cleanKey)) {
              wordFamily.adv.push({ term: cleanKey, vi: safeMeaningVi });
            }
          });
        }
      }

      // Xử lý chuẩn tiếng Việt tuyệt đối, không bao giờ lấy định nghĩa tiếng Anh gán vào VN
      let finalVi = viTranslation;
      if (!finalVi || !isActualVietnameseText(finalVi)) {
        finalVi = `Từ vựng tiếng Anh: "${cleanKey}"`;
      }

      synonyms = [...new Set(synonyms)].slice(0, 8);
      antonyms = [...new Set(antonyms)].slice(0, 6);
      if (examples.length === 0) {
        examples.push({
          en: `Understanding the usage of "${cleanKey}" is essential for TOEIC and VSTEP test-takers.`,
          vi: `Hiểu rõ cách dùng của "${cleanKey}" là điều tối quan trọng cho thí sinh thi TOEIC và VSTEP.`
        });
      }

      const entry = {
        word: word,
        phonetic: phonetic,
        partOfSpeech: partOfSpeech,
        vi: finalVi,
        definition: definition,
        examTag: 'TOEIC / VSTEP Core Vocabulary',
        wordFamily: wordFamily,
        synonyms: synonyms,
        antonyms: antonyms,
        collocations: [
          { en: `common use of ${cleanKey}`, vi: `cách sử dụng thông dụng của ${cleanKey}` },
          { en: `key ${cleanKey} factor`, vi: `yếu tố ${cleanKey} then chốt` }
        ],
        idioms: [],
        toeicNote: `💡 Mẹo làm bài: Chú ý vị trí từ loại của "${cleanKey}" khi đứng sau tính từ sở hữu hoặc mạo từ a/an/the!`,
        examples: examples.slice(0, 3)
      };

      dictionaryCache[cleanKey] = entry;
      saveDictionaryCache();
      callback({ success: true, fromApi: true, data: entry });
    });
  });
}

// Đọc dữ liệu đồng bộ chung
function loadSyncStore() {
  try {
    if (fs.existsSync(SYNC_FILE)) {
      return JSON.parse(fs.readFileSync(SYNC_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Warning reading sync store:', err.message);
  }
  return {
    lastUpdated: Date.now(),
    state: { xp: 0, streak: 0, vocabLearned: 0, dictationDone: 0, grammarDone: 0, readDone: 0, listenDone: 0, studyMinutes: 0 },
    learnedVocabItems: [],
    savedVocabItems: [],
    takeNotesList: [],
    savedGrammarNotes: [],
    savedWords: [],
    copyingHistory: []
  };
}

// Lưu và hợp nhất dữ liệu đồng bộ
function saveAndMergeSyncStore(incoming) {
  const userId = incoming.userId;
  if (!userId) return null;
  const current = loadUserProfile(userId);
  const merged = { ...current };

  merged.lastUpdated = Date.now();
  merged.lastSourceDevice = incoming.deviceName || 'Thiết bị';
  merged.lastDeviceId = incoming.deviceId || 'unknown';
  merged.lastUserId = userId;

  // Hợp nhất metrics state (lấy giá trị lớn nhất)
  if (incoming.state) {
    merged.state = {
      xp: Math.max(current.state?.xp || 0, incoming.state.xp || 0),
      vocabLearned: Math.max(current.state?.vocabLearned || 0, incoming.state.vocabLearned || 0),
      dictationDone: Math.max(current.state?.dictationDone || 0, incoming.state.dictationDone || 0),
      grammarDone: Math.max(current.state?.grammarDone || 0, incoming.state.grammarDone || 0),
      readDone: Math.max(current.state?.readDone || 0, incoming.state.readDone || 0),
      listenDone: Math.max(current.state?.listenDone || 0, incoming.state.listenDone || 0),
      studyMinutes: Math.max(current.state?.studyMinutes || 0, incoming.state.studyMinutes || 0)
    };
  }

  // Tự động ghi nhận hoạt động học hôm nay theo giờ Việt Nam
  const isLearningAction = !!(incoming.action || (incoming.learnedVocabItems && incoming.learnedVocabItems.length > 0) || (incoming.state && (incoming.state.vocabLearned > 0 || incoming.state.dictationDone > 0 || incoming.state.grammarDone > 0 || (incoming.state.studyMinutes && incoming.state.studyMinutes >= 2))));
  if (isLearningAction) {
    const todayVn = getVietnamDateString();
    const dates = new Set(merged.activityDates || []);
    dates.add(todayVn);
    merged.activityDates = Array.from(dates).sort();
  }
  const streakInfo = calculateUserStreak(merged.activityDates || []);
  if (!merged.state) merged.state = {};
  merged.state.streak = streakInfo.streak;
  merged.streakInfo = streakInfo;

  // Hợp nhất danh sách từ vựng đã thuộc (Learned Vocab) không trùng lặp
  if (Array.isArray(incoming.learnedVocabItems)) {
    const map = new Map();
    (current.learnedVocabItems || []).forEach(w => map.set((w.word || '').toLowerCase(), w));
    incoming.learnedVocabItems.forEach(w => {
      const key = (w.word || '').toLowerCase();
      if (!map.has(key) || !map.get(key).learnedAt) {
        map.set(key, { ...w, learnedAt: w.learnedAt || new Date().toISOString() });
      }
    });
    merged.learnedVocabItems = Array.from(map.values());
    merged.state.vocabLearned = Math.max(merged.state.vocabLearned, merged.learnedVocabItems.length);
  }

  // Hợp nhất từ vựng đã lưu
  if (Array.isArray(incoming.savedVocabItems)) {
    const map = new Map();
    (current.savedVocabItems || []).forEach(w => map.set((w.word || '').toLowerCase(), w));
    incoming.savedVocabItems.forEach(w => map.set((w.word || '').toLowerCase(), w));
    merged.savedVocabItems = Array.from(map.values());
  }

  // Hợp nhất Sổ ghi chép Take Note (Bao gồm hình ảnh base64, tài liệu đính kèm)
  if (Array.isArray(incoming.takeNotesList)) {
    const map = new Map();
    (current.takeNotesList || []).forEach(n => map.set(n.id, n));
    incoming.takeNotesList.forEach(n => {
      if (!map.has(n.id) || (n.updatedAtMs || 0) >= (map.get(n.id).updatedAtMs || 0)) {
        map.set(n.id, n);
      }
    });
    merged.takeNotesList = Array.from(map.values());
  }

  // Hợp nhất câu hỏi ngữ pháp đã lưu
  if (Array.isArray(incoming.savedGrammarNotes)) {
    const map = new Map();
    (current.savedGrammarNotes || []).forEach(n => map.set(n.q, n));
    incoming.savedGrammarNotes.forEach(n => map.set(n.q, n));
    merged.savedGrammarNotes = Array.from(map.values());
  }

  // Hợp nhất từ điển đã lưu
  if (Array.isArray(incoming.savedWords)) {
    const map = new Map();
    (current.savedWords || []).forEach(w => map.set((w.en || '').toLowerCase(), w));
    incoming.savedWords.forEach(w => map.set((w.en || '').toLowerCase(), w));
    merged.savedWords = Array.from(map.values());
  }

  // Nếu có userId thì lưu riêng biệt vào hồ sơ cá nhân của tài khoản đó
  if (userId) {
    saveUserProfile(userId, merged);
  } else {
    fs.writeFileSync(SYNC_FILE, JSON.stringify(merged, null, 2), 'utf8');
  }

  return merged;
}

// Helper đọc JSON body an toàn với dung lượng tối đa 50MB (phục vụ ảnh TakeNote)
function parseJsonBody(req, res, callback) {
  let bodyData = '';
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  let exceeds = false;

  req.on('data', chunk => {
    bodyData += chunk;
    if (bodyData.length > MAX_SIZE) {
      exceeds = true;
      res.writeHead(413, { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, error: 'Dữ liệu gửi lên vượt quá dung lượng tối đa (50MB)' }));
      req.destroy();
    }
  });

  req.on('end', () => {
    if (exceeds) return;
    try {
      const parsed = JSON.parse(bodyData || '{}');
      callback(parsed);
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, error: 'Định dạng JSON không hợp lệ: ' + err.message }));
    }
  });
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  const queryParams = new URL(req.url, `http://${req.headers.host || 'localhost'}`).searchParams;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Device-Id, Authorization'
    });
    res.end();
    return;
  }

  // =========================================================================
  // API: NETWORK INFO
  // =========================================================================
  if (reqPath === '/api/network-info') {
    const ip = getLocalIp();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      ip: ip,
      port: PORT,
      localUrl: `http://localhost:${PORT}`,
      mobileUrl: `http://${ip}:${PORT}`
    }));
    return;
  }

  // =========================================================================
  // API: TEXT-TO-SPEECH PROXY (CHUẨN BẢN XỨ MP3 - 100% TƯƠNG THÍCH MỌI ĐIỆN THOẠI)
  // =========================================================================
  if (reqPath === '/api/tts') {
    const text = queryParams.get('text') || '';
    const lang = queryParams.get('lang') || 'en';
    if (!text.trim()) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({ error: 'Missing text parameter' }));
    }

    const cleanText = text.replace(/[\r\n\t]+/g, ' ').trim().slice(0, 300);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

    const ttsReq = https.get(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    }, (ttsRes) => {
      if (ttsRes.statusCode === 200) {
        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400'
        });
        ttsRes.pipe(res);
      } else {
        res.writeHead(ttsRes.statusCode || 500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: 'TTS upstream status ' + ttsRes.statusCode }));
      }
    });

    ttsReq.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  // =========================================================================
  // API: AUTHENTICATION & TÀI KHOẢN (ME, REGISTER, LOGIN, LOGOUT, GOOGLE)
  // =========================================================================

  // 0. Xác thực người dùng hiện tại (GET /api/me)
  if (reqPath === '/api/me' && req.method === 'GET') {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.writeHead(401, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      return res.end(JSON.stringify({ success: false, error: 'Chưa đăng nhập' }));
    }

    const users = loadUsersDatabase();
    const user = users.find(u => u.id === userId);
    if (!user) {
      clearSessionCookie(res, req);
      res.writeHead(401, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      return res.end(JSON.stringify({ success: false, error: 'Tài khoản không tồn tại' }));
    }

    const profile = loadUserProfile(userId);
    const safeUser = { ...user, streak: profile.state?.streak || user.streak || 0 };
    delete safeUser.password;
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      ...getCorsHeaders(req)
    });
    res.end(JSON.stringify({ success: true, user: safeUser, streakInfo: profile.streakInfo }));
    return;
  }

  // 0b. Cấu hình xác thực công khai cho Frontend (GET /api/auth/config & GET /api/config)
  if ((reqPath === '/api/auth/config' || reqPath === '/api/config') && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      ...getCorsHeaders(req)
    });
    return res.end(JSON.stringify({
      success: true,
      googleClientId: (process.env.GOOGLE_CLIENT_ID || '').trim()
    }));
  }

  // 0c. Healthcheck trạng thái cấu hình Auth an toàn (GET /api/health/auth)
  if (reqPath === '/api/health/auth' && req.method === 'GET') {
    const rawId = (process.env.GOOGLE_CLIENT_ID || '').trim();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      ...getCorsHeaders(req)
    });
    return res.end(JSON.stringify({
      googleClientIdConfigured: rawId.length > 0,
      length: rawId.length,
      endsWithGoogleusercontent: rawId.endsWith('.apps.googleusercontent.com')
    }));
  }

  // 1. Đăng xuất tài khoản sạch (POST /api/auth/logout)
  if (reqPath === '/api/auth/logout' && req.method === 'POST') {
    const cookies = parseCookies(req);
    const token = cookies['cd_session'] || (req.headers.authorization && req.headers.authorization.replace('Bearer ', '').trim());
    if (token) {
      deleteSession(token);
    }
    clearSessionCookie(res, req);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      ...getCorsHeaders(req)
    });
    res.end(JSON.stringify({ success: true, message: 'Đăng xuất thành công' }));
    return;
  }
  
  // 2. Đăng ký tài khoản mới bằng Email (Register)
  if (reqPath === '/api/auth/register' && req.method === 'POST') {
    parseJsonBody(req, res, payload => {
      const { name, email, username, password, confirmPassword, exam, targetScore } = payload;

      if (!name || !name.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Vui lòng nhập đầy đủ Họ và tên!' }));
      }

      const cleanEmail = (email || '').trim().toLowerCase();
      const loginAccount = (username || cleanEmail).trim().toLowerCase();
      if (!loginAccount) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Vui lòng nhập Email hoặc Tên đăng nhập!' }));
      }

      if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Định dạng email không hợp lệ!' }));
      }

      if (!password || password.length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Mật khẩu phải chứa ít nhất 6 ký tự để đảm bảo bảo mật!' }));
      }

      if (password !== confirmPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Mật khẩu xác nhận không khớp! Vui lòng nhập lại chính xác.' }));
      }

      const users = loadUsersDatabase();
      const isDuplicate = users.some(u => 
        (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
        (u.username && u.username.toLowerCase() === loginAccount)
      );

      if (isDuplicate) {
        res.writeHead(409, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Email hoặc Tên đăng nhập này đã được đăng ký! Vui lòng chọn tên khác hoặc bấm Đăng nhập.' }));
      }

      const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-rose-600', 'bg-amber-600', 'bg-indigo-600', 'bg-teal-600'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newUserId = 'acc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

      const newUser = {
        id: newUserId,
        name: name.trim(),
        email: cleanEmail || `${loginAccount}@cungdang.app`,
        username: username ? username.trim().toLowerCase() : loginAccount,
        password: hashPassword(password),
        exam: exam || 'TOEIC',
        targetScore: targetScore || '',
        examDate: '',
        avatarColor: randomColor,
        authProvider: 'local',
        createdAt: new Date().toISOString()
      };

      users.unshift(newUser);
      saveUsersDatabase(users);

      // Tạo hồ sơ khởi tạo trắng cho người dùng mới
      saveUserProfile(newUserId, {
        userId: newUserId,
        state: { xp: 0, streak: 0, vocabLearned: 0, dictationDone: 0, grammarDone: 0, readDone: 0, listenDone: 0, studyMinutes: 0 },
        activityDates: [],
        learnedVocabItems: [],
        savedVocabItems: [],
        takeNotesList: [],
        savedGrammarNotes: [],
        savedWords: [],
        copyingHistory: [],
        dictationHistory: [],
        mockHistory: []
      });

      // Di chuyển dữ liệu cũ nếu là chủ sở hữu
      migrateOwnerDataIfEligible(newUser);

      // Tạo phiên đăng nhập máy chủ và thiết lập cookie HttpOnly
      const sessionToken = createSession(newUserId);
      setSessionCookie(res, req, sessionToken);

      const safeUser = { ...newUser };
      delete safeUser.password;

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      res.end(JSON.stringify({
        success: true,
        message: 'Đăng ký tài khoản thành công! Chào mừng bạn gia nhập Cùng Đăng Ra Trường.',
        user: safeUser,
        token: sessionToken
      }));
    });
    return;
  }

  // 3. Đăng nhập tài khoản bằng Email / Tên đăng nhập (Login)
  if (reqPath === '/api/auth/login' && req.method === 'POST') {
    parseJsonBody(req, res, payload => {
      const { loginId, email, username, password } = payload || {};
      const accountQuery = (loginId || email || username || '').trim().toLowerCase();

      if (!accountQuery || !password) {
        res.writeHead(401, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
          ...getCorsHeaders(req)
        });
        return res.end(JSON.stringify({ success: false, error: 'Từ chối xác thực: Đăng nhập bắt buộc mật khẩu hoặc xác thực Google thật. Máy chủ không tin tưởng email đơn thuần!' }));
      }

      const users = loadUsersDatabase();
      const matched = users.find(u => 
        (u.email && u.email.toLowerCase() === accountQuery) ||
        (u.username && u.username.toLowerCase() === accountQuery)
      );

      if (!matched) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Tài khoản không tồn tại trong hệ thống! Vui lòng kiểm tra lại hoặc Đăng ký mới.' }));
      }

      // Xác thực mật khẩu
      if (!verifyPassword(password, matched.password)) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Mật khẩu không chính xác! Vui lòng thử lại.' }));
      }

      // Nâng cấp băm mật khẩu nếu tài khoản cũ dùng plain text
      if (matched.password && !matched.password.includes(':')) {
        matched.password = hashPassword(password);
        saveUsersDatabase(users);
      }

      // Di chuyển dữ liệu cũ nếu là chủ sở hữu
      migrateOwnerDataIfEligible(matched);

      // Tạo phiên và cookie HttpOnly
      const sessionToken = createSession(matched.id);
      setSessionCookie(res, req, sessionToken);

      const safeUser = { ...matched };
      delete safeUser.password;

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      res.end(JSON.stringify({
        success: true,
        message: `Chào mừng ${matched.name} đã đăng nhập thành công!`,
        user: safeUser,
        token: sessionToken
      }));
    });
    return;
  }

  // 4. Đăng nhập / Đăng ký qua Google (Google Sign-In GIS chuẩn xác thực ID Token)
  if (reqPath === '/api/auth/google' && req.method === 'POST') {
    parseJsonBody(req, res, payload => {
      const { credential } = payload || {};

      if (!credential) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Từ chối xác thực: Thiếu mã token Google Credential. Máy chủ không chấp nhận thông tin không có chữ ký số Google!' }));
      }

      // Hàm xác thực ID Token với Google
      const verifyToken = (idToken, cb) => {
        // Chỉ cho phép mock token khi đang chạy bộ kiểm thử tự động nội bộ (NODE_ENV === 'test' hoặc ALLOW_MOCK_GOOGLE_AUTH === 'true'), tuyệt đối tắt ở production
        if ((process.env.NODE_ENV === 'test' || process.env.ALLOW_MOCK_GOOGLE_AUTH === 'true') && idToken.startsWith('test-mock-token:')) {
          const parts = idToken.split(':');
          return cb(null, {
            sub: parts[1] || 'mock-google-sub',
            email: parts[2] || 'test@gmail.com',
            name: parts[3] || 'Google User',
            picture: '',
            email_verified: 'true'
          });
        }

        const tokenUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
        https.get(tokenUrl, (gRes) => {
          let body = '';
          gRes.on('data', chunk => body += chunk);
          gRes.on('end', () => {
            try {
              const info = JSON.parse(body);
              if (gRes.statusCode !== 200 || info.error) {
                return cb(new Error(info.error_description || info.error || 'Mã ID Token của Google không hợp lệ!'));
              }
              const expectedAud = (process.env.GOOGLE_CLIENT_ID || '').trim();
              if (expectedAud && info.aud !== expectedAud) {
                return cb(new Error('Mã Client ID không khớp với cấu hình hệ thống!'));
              }
              if (info.iss !== 'accounts.google.com' && info.iss !== 'https://accounts.google.com') {
                return cb(new Error('Đơn vị phát hành token không phải Google!'));
              }
              if (info.email_verified !== 'true' && info.email_verified !== true) {
                return cb(new Error('Email Google chưa được xác thực!'));
              }
              cb(null, info);
            } catch (err) {
              cb(new Error('Lỗi giải mã token Google: ' + err.message));
            }
          });
        }).on('error', (err) => {
          cb(new Error('Không thể kết nối đến máy chủ Google: ' + err.message));
        });
      };

      verifyToken(credential, (err, gInfo) => {
        if (err || !gInfo) {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
          return res.end(JSON.stringify({ success: false, error: err ? err.message : 'Xác thực Google thất bại' }));
        }

        const gEmail = (gInfo.email || '').trim().toLowerCase();
        const gSub = gInfo.sub;
        const gName = gInfo.name || gEmail.split('@')[0];
        const gPicture = gInfo.picture || '';

        const users = loadUsersDatabase();
        let user = users.find(u => (u.googleSub && u.googleSub === gSub) || (u.email && u.email.toLowerCase() === gEmail));

        if (!user) {
          const newUserId = 'acc-g-' + Date.now();
          user = {
            id: newUserId,
            name: gName,
            email: gEmail,
            username: gEmail.split('@')[0],
            googleSub: gSub,
            avatar: gPicture,
            avatarColor: 'bg-emerald-600',
            exam: 'TOEIC',
            targetScore: '',
            examDate: '',
            authProvider: 'google',
            createdAt: new Date().toISOString()
          };
          users.unshift(user);
          saveUsersDatabase(users);

          saveUserProfile(user.id, {
            userId: user.id,
            state: { xp: 0, streak: 0, vocabLearned: 0, dictationDone: 0, grammarDone: 0, readDone: 0, listenDone: 0, studyMinutes: 0 },
            activityDates: [],
            learnedVocabItems: [],
            savedVocabItems: [],
            takeNotesList: [],
            savedGrammarNotes: [],
            savedWords: [],
            copyingHistory: [],
            dictationHistory: [],
            mockHistory: []
          });
        } else {
          // Cập nhật googleSub nếu trước đó đăng ký bằng email thường
          if (!user.googleSub) user.googleSub = gSub;
          if (gPicture && !user.avatar) user.avatar = gPicture;
          saveUsersDatabase(users);
        }

        // Di chuyển dữ liệu cũ nếu là chủ sở hữu
        migrateOwnerDataIfEligible(user);

        // Tạo phiên đăng nhập máy chủ và thiết lập cookie HttpOnly
        const sessionToken = createSession(user.id);
        setSessionCookie(res, req, sessionToken);

        const safeUser = { ...user };
        delete safeUser.password;

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
          ...getCorsHeaders(req)
        });
        res.end(JSON.stringify({
          success: true,
          message: `Đăng nhập Google thành công! Xin chào ${user.name}.`,
          user: safeUser,
          token: sessionToken
        }));
      });
    });
    return;
  }

  // =========================================================================
  // API: USER PROGRESS PERSISTENCE (LƯU TRỮ VÀ KHÔI PHỤC TIẾN ĐỘ HỌC CÁ NHÂN)
  // =========================================================================

  // 1. Tải tiến độ học của người dùng (Bắt buộc xác thực phiên)
  if (reqPath === '/api/user/load-progress' && req.method === 'GET') {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.writeHead(401, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      return res.end(JSON.stringify({ success: false, error: 'Chưa đăng nhập' }));
    }

    const profile = loadUserProfile(userId);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      ...getCorsHeaders(req)
    });
    res.end(JSON.stringify({ success: true, data: profile }));
    return;
  }

  // 2. Lưu tiến độ học của người dùng (Bắt buộc xác thực phiên - Không nhận userId từ client)
  if (reqPath === '/api/user/save-progress' && req.method === 'POST') {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.writeHead(401, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      return res.end(JSON.stringify({ success: false, error: 'Chưa đăng nhập' }));
    }

    parseJsonBody(req, res, payload => {
      const dataToSave = payload.data || payload;
      const saved = saveUserProfile(userId, dataToSave);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      res.end(JSON.stringify({ success: true, data: saved }));
    });
    return;
  }

  // 2b. Ghi nhận hoạt động học tập để cập nhật streak (POST /api/user/record-activity)
  if (reqPath === '/api/user/record-activity' && req.method === 'POST') {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.writeHead(401, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      return res.end(JSON.stringify({ success: false, error: 'Chưa đăng nhập' }));
    }

    parseJsonBody(req, res, payload => {
      const activityDate = payload?.activityDate || null;
      const streakInfo = recordStudyActivity(userId, activityDate);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      res.end(JSON.stringify({ success: true, streakInfo }));
    });
    return;
  }

  // 3. Gia sư AI Luyện thi TOEIC giải đáp thắc mắc (Smart AI Tutor)
  if (reqPath === '/api/ai/ask-tutor' && req.method === 'POST') {
    parseJsonBody(req, res, payload => {
      const { question, context, trapTitle } = payload || {};
      if (!question && !context) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Thiếu nội dung câu hỏi thắc mắc' }));
      }

      answerWithTOEICAI(question, context, trapTitle, (aiResponse) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        res.end(JSON.stringify({ success: true, answer: aiResponse }));
      });
    });
    return;
  }

  // 4. Kiểm tra sức khỏe máy chủ & Keep-alive chống ngủ đông (Render Cold-Start Protection)
  if (reqPath === '/health' || reqPath === '/api/ping') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-cache',
      ...getCorsHeaders(req)
    });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'toeic-cung-dang',
      uptime: Math.round(process.uptime()),
      timestamp: Date.now()
    }));
    return;
  }

  // 5. Tra cứu từ điển AI & Collocation thông minh (MyMemory & FreeDict Backend Proxy)
  if (reqPath === '/api/dictionary/lookup' && req.method === 'GET') {
    const rawWord = queryParams.get('word') || '';
    handleDictionaryLookup(rawWord, (lookupResult) => {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        ...getCorsHeaders(req)
      });
      res.end(JSON.stringify(lookupResult));
    });
    return;
  }

  // =========================================================================
  // API REALTIME ĐỒNG BỘ HỌC TẬP LAPTOP ⇄ ĐIỆN THOẠI (SSE STREAM & POST)
  // =========================================================================
  if (reqPath === '/api/study-sync/stream') {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.writeHead(401, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      return res.end(JSON.stringify({ success: false, error: 'Chưa đăng nhập' }));
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=UTF-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...getCorsHeaders(req)
    });
    res.write(`: connected\n\n`);
    res.userId = userId;
    sseClients.add(res);

    const initData = loadUserProfile(userId);
    res.write(`data: ${JSON.stringify({ type: 'INIT_STATE', data: initData, userId: userId })}\n\n`);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  if (reqPath === '/api/study-sync' && req.method === 'GET') {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.writeHead(401, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      return res.end(JSON.stringify({ success: false, error: 'Chưa đăng nhập' }));
    }

    const data = loadUserProfile(userId);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      ...getCorsHeaders(req)
    });
    res.end(JSON.stringify({ success: true, data: data }));
    return;
  }

  if (reqPath === '/api/study-sync' && req.method === 'POST') {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.writeHead(401, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      return res.end(JSON.stringify({ success: false, error: 'Chưa đăng nhập' }));
    }

    parseJsonBody(req, res, payload => {
      payload.userId = userId;
      const merged = saveAndMergeSyncStore(payload);

      // Phát sóng sự kiện Real-time tới đúng các thiết bị của người dùng này
      broadcastSyncEvent({
        type: 'SYNC_UPDATE',
        senderDeviceId: payload.deviceId,
        senderDeviceName: payload.deviceName || 'Thiết bị khác',
        userId: userId,
        action: payload.action || 'LEARN_PROGRESS',
        lastActionWord: payload.lastActionWord || null,
        xpGained: payload.xpGained || 0,
        data: merged,
        timestamp: Date.now()
      });

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      res.end(JSON.stringify({ success: true, data: merged }));
    });
    return;
  }

  // =========================================================================
  // PHỤC VỤ CÁC FILE TĨNH (STATIC FILES)
  // =========================================================================
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('500 Server Error');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      let outContent = content;
      if (ext === '.html') {
        const rawClientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
        let htmlStr = content.toString('utf8');
        const injection = `<script>window.googleAuthClientId = ${JSON.stringify(rawClientId)};</script>`;
        htmlStr = htmlStr.replace('</head>', `${injection}\n</head>`);
        if (rawClientId) {
          htmlStr = htmlStr.replace('id="googleSignInSectionLogin" class="hidden"', 'id="googleSignInSectionLogin"');
          htmlStr = htmlStr.replace('id="googleSignInSectionRegister" class="hidden"', 'id="googleSignInSectionRegister"');
        }
        outContent = Buffer.from(htmlStr, 'utf8');
      }

      const isNoCacheFile = ext === '.html' || ext === '.js' || ext === '.json' || filePath.endsWith('sw.js');
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Service-Worker-Allowed': '/',
        'Cache-Control': isNoCacheFile ? 'no-cache, no-store, must-revalidate, max-age=0' : 'public, max-age=86400'
      });
      res.end(outContent);
    });
  });
});

server.listen(PORT, () => {
  const localIp = getLocalIp();
  console.log(`=======================================================`);
  console.log(`💻 Truy cập Web trên Máy tính: http://localhost:${PORT}`);
  console.log(`📱 Truy cập trên Điện thoại / Thiết bị khác: http://${localIp}:${PORT}`);
  console.log(`🔒 Xác thực Thành viên & Phân quyền Tài khoản: BẮT BUỘC ĐĂNG NHẬP`);
  console.log(`⚡ Real-time Multi-Device Sync Engine: HOẠT ĐỘNG SẴN SÀNG`);
  console.log(`=======================================================`);

  // Cơ chế chống ngủ đông Render (Cold-Start Prevention Keep-Alive)
  const EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL;
  if (EXTERNAL_URL) {
    console.log(`⏱️ Kích hoạt Keep-Alive tự động chống spin-down cho Render: ${EXTERNAL_URL}`);
    setInterval(() => {
      try {
        const pingUrl = EXTERNAL_URL.replace(/\/$/, '') + '/health';
        const client = pingUrl.startsWith('https') ? https : http;
        client.get(pingUrl, (pRes) => {
          // Heartbeat ping thành công
        }).on('error', () => {});
      } catch (e) {}
    }, 10 * 60 * 1000); // 10 phút một lần
  }
});

