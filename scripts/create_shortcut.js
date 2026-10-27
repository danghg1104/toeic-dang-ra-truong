const { execSync } = require('child_process');
const path = require('path');

const psCode = `
$sh = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = [System.IO.Path]::Combine($desktop, "Cùng Đăng Ra Trường — Luyện thi TOEIC & VSTEP.lnk")
$icoPath = "C:\\Users\\Admin\\Documents\\antigravity\\noble-franklin\\app.ico"
$browserExe = "C:\\Program Files\\CocCoc\\Browser\\Application\\browser.exe"

if (-not (Test-Path $browserExe)) {
    $browserExe = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
}

$sc = $sh.CreateShortcut($shortcutPath)
$sc.TargetPath = $browserExe
$sc.Arguments = "--app=http://localhost:3000"
$sc.WorkingDirectory = "C:\\Users\\Admin\\Documents\\antigravity\\noble-franklin"
$sc.IconLocation = "$icoPath,0"
$sc.Description = "Nền tảng luyện thi TOEIC & VSTEP toàn diện miễn phí với Lý thuyết chuyên sâu, Nghe chính tả CEFR, Sổ tay Take Note, Từ điển & Luyện chép từ vựng"
$sc.Save()

Write-Host "Created Desktop shortcut: $shortcutPath"
Write-Host "Target: $($sc.TargetPath) $($sc.Arguments)"
Write-Host "Icon: $($sc.IconLocation)"
`;

const b64 = Buffer.from(psCode, 'utf16le').toString('base64');
const out = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${b64}`, { encoding: 'utf8' });
console.log(out);
