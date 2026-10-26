// js/textbook-curriculum-database.js
// =========================================================================
// BỘ DỮ LIỆU SÁCH GIÁO KHOA TIẾNG ANH CHUẨN BỘ GIÁO DỤC & ĐÀO TẠO (LỚP 1 - LỚP 12)
// Hệ thống nhận diện tự động mọi tài liệu scan SGK (Global Success, Friends Plus, Smart World)
// =========================================================================

(function() {
    'use strict';

    const TEXTBOOK_CURRICULUM_DATA = {
        // =====================================================================
        // TIẾNG ANH 3 — GLOBAL SUCCESS (TẬP 1)
        // =====================================================================
        'sgk_lop_3_global_success_tap_1': {
            id: 'sgk_lop_3_global_success_tap_1',
            title: 'Sách Giáo Khoa Tiếng Anh 3 — Global Success (Tập 1)',
            shortTitle: 'Tiếng Anh 3 - Tập 1 (Global Success)',
            grade: 3,
            series: 'Global Success',
            volume: 1,
            level: 'A1',
            badge: 'Bộ Giáo Dục & Đào Tạo',
            description: 'Chương trình chuẩn Unit 1 đến Unit 10 của Bộ GD&ĐT & Pearson.',
            aliases: [
                'thuvienhoclieu.com-sgk-tieng-anh-3-global-success-tap-1',
                'sgk-tieng-anh-3-global-success-tap-1',
                'tieng-anh-3-global-success-tap-1',
                'tieng-anh-3-global-success-tap1',
                'tieng anh 3 tap 1 global success',
                'tieng anh 3 global success tap 1',
                'sgk tieng anh 3 tap 1',
                'tiếng anh 3 tập 1 global success',
                'sách tiếng anh 3 tập 1',
                'tieng anh 3 tap 1'
            ],
            units: [
                'Unit 1: Hello',
                'Unit 2: Our names',
                'Unit 3: Our friends',
                'Unit 4: Our school',
                'Unit 5: My hobbies',
                'Unit 6: Our school things',
                'Unit 7: Classroom instructions',
                'Unit 8: My friends\' ages',
                'Unit 9: Our colours',
                'Unit 10: Break time activities'
            ],
            words: [
                // Unit 1: Hello
                { word: 'hello', meaning: 'xin chào', phonetic: '/həˈləʊ/', level: 'A1', unit: 'Unit 1: Hello' },
                { word: 'hi', meaning: 'chào bạn', phonetic: '/haɪ/', level: 'A1', unit: 'Unit 1: Hello' },
                { word: 'fine', meaning: 'khỏe, tốt đẹp', phonetic: '/faɪn/', level: 'A1', unit: 'Unit 1: Hello' },
                { word: 'thank', meaning: 'cảm ơn', phonetic: '/θæŋk/', level: 'A1', unit: 'Unit 1: Hello' },
                { word: 'thanks', meaning: 'lời cảm ơn', phonetic: '/θæŋks/', level: 'A1', unit: 'Unit 1: Hello' },
                { word: 'goodbye', meaning: 'tạm biệt', phonetic: '/ˌɡʊdˈbaɪ/', level: 'A1', unit: 'Unit 1: Hello' },
                { word: 'bye', meaning: 'chào tạm biệt', phonetic: '/baɪ/', level: 'A1', unit: 'Unit 1: Hello' },
                { word: 'nice', meaning: 'vui vẻ, tốt đẹp', phonetic: '/naɪs/', level: 'A1', unit: 'Unit 1: Hello' },
                { word: 'meet', meaning: 'gặp gỡ', phonetic: '/miːt/', level: 'A1', unit: 'Unit 1: Hello' },
                { word: 'again', meaning: 'lại, gặp lại lần nữa', phonetic: '/əˈɡen/', level: 'A1', unit: 'Unit 1: Hello' },

                // Unit 2: Our names
                { word: 'name', meaning: 'tên gọi', phonetic: '/neɪm/', level: 'A1', unit: 'Unit 2: Our names' },
                { word: 'what', meaning: 'cái gì, là gì', phonetic: '/wɒt/', level: 'A1', unit: 'Unit 2: Our names' },
                { word: 'your', meaning: 'của bạn', phonetic: '/jɔːr/', level: 'A1', unit: 'Unit 2: Our names' },
                { word: 'my', meaning: 'của tôi', phonetic: '/maɪ/', level: 'A1', unit: 'Unit 2: Our names' },
                { word: 'spell', meaning: 'đánh vần chữ cái', phonetic: '/spel/', level: 'A1', unit: 'Unit 2: Our names' },
                { word: 'how', meaning: 'như thế nào, ra sao', phonetic: '/haʊ/', level: 'A1', unit: 'Unit 2: Our names' },
                { word: 'friend', meaning: 'người bạn bè', phonetic: '/frend/', level: 'A1', unit: 'Unit 2: Our names' },
                { word: 'classmate', meaning: 'bạn cùng lớp', phonetic: '/ˈklɑːsmeɪt/', level: 'A1', unit: 'Unit 2: Our names' },

                // Unit 3: Our friends
                { word: 'this', meaning: 'đây, người này', phonetic: '/ðɪs/', level: 'A1', unit: 'Unit 3: Our friends' },
                { word: 'that', meaning: 'kia, người kia', phonetic: '/ðæt/', level: 'A1', unit: 'Unit 3: Our friends' },
                { word: 'yes', meaning: 'vâng, đúng vậy', phonetic: '/jes/', level: 'A1', unit: 'Unit 3: Our friends' },
                { word: 'no', meaning: 'không, không phải', phonetic: '/nəʊ/', level: 'A1', unit: 'Unit 3: Our friends' },
                { word: 'he', meaning: 'cậu ấy, anh ấy', phonetic: '/hiː/', level: 'A1', unit: 'Unit 3: Our friends' },
                { word: 'she', meaning: 'cô ấy, bạn nữ ấy', phonetic: '/ʃiː/', level: 'A1', unit: 'Unit 3: Our friends' },
                { word: 'they', meaning: 'họ, các bạn ấy', phonetic: '/ðeɪ/', level: 'A1', unit: 'Unit 3: Our friends' },
                { word: 'teacher', meaning: 'thầy cô giáo', phonetic: '/ˈtiːtʃər/', level: 'A1', unit: 'Unit 3: Our friends' },
                { word: 'who', meaning: 'ai, là người nào', phonetic: '/huː/', level: 'A1', unit: 'Unit 3: Our friends' },

                // Unit 4: Our school
                { word: 'school', meaning: 'ngôi trường học', phonetic: '/skuːl/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'classroom', meaning: 'phòng học lớp học', phonetic: '/ˈklɑːsruːm/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'library', meaning: 'thư viện đọc sách', phonetic: '/ˈlaɪbrəri/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'playground', meaning: 'sân chơi trường học', phonetic: '/ˈpleɪɡraʊnd/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'computer room', meaning: 'phòng máy vi tính', phonetic: '/kəmˈpjuːtər ruːm/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'gym', meaning: 'phòng tập thể dục', phonetic: '/dʒɪm/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'art room', meaning: 'phòng học mỹ thuật', phonetic: '/ɑːt ruːm/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'music room', meaning: 'phòng học âm nhạc', phonetic: '/ˈmjuːzɪk ruːm/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'big', meaning: 'to lớn, khang trang', phonetic: '/bɪɡ/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'small', meaning: 'nhỏ nhắn, bé xinh', phonetic: '/smɔːl/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'new', meaning: 'mới toanh', phonetic: '/njuː/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'old', meaning: 'cũ, lâu năm', phonetic: '/əʊld/', level: 'A1', unit: 'Unit 4: Our school' },
                { word: 'look', meaning: 'nhìn ngắm', phonetic: '/lʊk/', level: 'A1', unit: 'Unit 4: Our school' },

                // Unit 5: My hobbies
                { word: 'hobby', meaning: 'sở thích cá nhân', phonetic: '/ˈhɒbi/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'hobbies', meaning: 'các sở thích', phonetic: '/ˈhɒbiz/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'sing', meaning: 'ca hát', phonetic: '/sɪŋ/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'dance', meaning: 'khiêu vũ, nhảy múa', phonetic: '/dɑːns/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'draw', meaning: 'vẽ tranh nét', phonetic: '/drɔː/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'swim', meaning: 'bơi lội', phonetic: '/swɪm/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'cook', meaning: 'nấu nướng món ăn', phonetic: '/kʊk/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'read', meaning: 'đọc sách truyện', phonetic: '/riːd/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'paint', meaning: 'vẽ tô màu nước', phonetic: '/peɪnt/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'run', meaning: 'chạy bộ nhanh', phonetic: '/rʌn/', level: 'A1', unit: 'Unit 5: My hobbies' },
                { word: 'walk', meaning: 'đi dạo, đi bộ', phonetic: '/wɔːk/', level: 'A1', unit: 'Unit 5: My hobbies' },

                // Unit 6: Our school things
                { word: 'pen', meaning: 'cây bút mực', phonetic: '/pen/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'pencil', meaning: 'cây bút chì', phonetic: '/ˈpensl/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'ruler', meaning: 'cây thước kẻ', phonetic: '/ˈruːlər/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'rubber', meaning: 'cục gôm tẩy', phonetic: '/ˈrʌbər/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'eraser', meaning: 'cục tẩy gôm', phonetic: '/ɪˈreɪzər/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'school bag', meaning: 'cặp sách đi học', phonetic: '/ˈskuːl bæɡ/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'pencil case', meaning: 'hộp đựng bút', phonetic: '/ˈpensl keɪs/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'book', meaning: 'quyển sách bài tập', phonetic: '/bʊk/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'notebook', meaning: 'cuốn vở viết bài', phonetic: '/ˈnəʊtbʊk/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'desk', meaning: 'bàn học tập', phonetic: '/desk/', level: 'A1', unit: 'Unit 6: Our school things' },
                { word: 'sharpener', meaning: 'gọt bút chì', phonetic: '/ˈʃɑːpnər/', level: 'A1', unit: 'Unit 6: Our school things' },

                // Unit 7: Classroom instructions
                { word: 'stand up', meaning: 'đứng lên', phonetic: '/stænd ʌp/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'sit down', meaning: 'ngồi xuống', phonetic: '/sɪt daʊn/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'open', meaning: 'mở ra', phonetic: '/ˈəʊpən/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'close', meaning: 'gấp lại, đóng lại', phonetic: '/kləʊz/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'come in', meaning: 'đi vào lớp', phonetic: '/kʌm ɪn/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'go out', meaning: 'xin phép ra ngoài', phonetic: '/ɡəʊ aʊt/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'speak', meaning: 'phát biểu, nói chuyện', phonetic: '/spiːk/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'ask', meaning: 'hỏi bài, nêu thắc mắc', phonetic: '/ɑːsk/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'question', meaning: 'câu hỏi cần giải đáp', phonetic: '/ˈkwestʃən/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'answer', meaning: 'câu trả lời đáp án', phonetic: '/ˈɑːnsər/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'please', meaning: 'làm ơn, xin vui lòng', phonetic: '/pliːz/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'quiet', meaning: 'giữ trật tự, yên lặng', phonetic: '/ˈkwaɪət/', level: 'A1', unit: 'Unit 7: Classroom instructions' },
                { word: 'listen', meaning: 'chú ý lắng nghe', phonetic: '/ˈlɪsn/', level: 'A1', unit: 'Unit 7: Classroom instructions' },

                // Unit 8: My friends' ages
                { word: 'age', meaning: 'tuổi tác đời người', phonetic: '/eɪdʒ/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'years old', meaning: 'tuổi đời', phonetic: '/jɪəz əʊld/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'one', meaning: 'số 1', phonetic: '/wʌn/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'two', meaning: 'số 2', phonetic: '/tuː/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'three', meaning: 'số 3', phonetic: '/θriː/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'four', meaning: 'số 4', phonetic: '/fɔːr/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'five', meaning: 'số 5', phonetic: '/faɪv/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'six', meaning: 'số 6', phonetic: '/sɪks/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'seven', meaning: 'số 7', phonetic: '/ˈsevn/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'eight', meaning: 'số 8', phonetic: '/eɪt/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'nine', meaning: 'số 9', phonetic: '/naɪn/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'ten', meaning: 'số 10', phonetic: '/ten/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'eleven', meaning: 'số 11', phonetic: '/ɪˈlevn/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'twelve', meaning: 'số 12', phonetic: '/twelv/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'boy', meaning: 'cậu bé nam', phonetic: '/bɔɪ/', level: 'A1', unit: 'Unit 8: My friends\' ages' },
                { word: 'girl', meaning: 'cô bé nữ', phonetic: '/ɡɜːl/', level: 'A1', unit: 'Unit 8: My friends\' ages' },

                // Unit 9: Our colours
                { word: 'colour', meaning: 'màu sắc', phonetic: '/ˈkʌlər/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'color', meaning: 'màu sắc rực rỡ', phonetic: '/ˈkʌlər/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'red', meaning: 'màu đỏ tươi', phonetic: '/red/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'blue', meaning: 'màu xanh da trời', phonetic: '/bluː/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'yellow', meaning: 'màu vàng óng', phonetic: '/ˈjeləʊ/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'green', meaning: 'màu xanh lá cây', phonetic: '/ɡriːn/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'orange', meaning: 'màu cam quả quýt', phonetic: '/ˈɒrɪndʒ/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'pink', meaning: 'màu hồng dễ thương', phonetic: '/pɪŋk/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'brown', meaning: 'màu nâu đất', phonetic: '/braʊn/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'black', meaning: 'màu đen huyền', phonetic: '/blæk/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'white', meaning: 'màu trắng tinh', phonetic: '/waɪt/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'purple', meaning: 'màu tím thuỷ chung', phonetic: '/ˈpɜːpl/', level: 'A1', unit: 'Unit 9: Our colours' },
                { word: 'grey', meaning: 'màu xám tro', phonetic: '/ɡreɪ/', level: 'A1', unit: 'Unit 9: Our colours' },

                // Unit 10: Break time activities
                { word: 'break time', meaning: 'giờ ra chơi giải lao', phonetic: '/ˈbreɪk taɪm/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'football', meaning: 'môn bóng đá', phonetic: '/ˈfʊtbɔːl/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'badminton', meaning: 'môn cầu lông', phonetic: '/ˈbædmɪntən/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'basketball', meaning: 'môn bóng rổ', phonetic: '/ˈbɑːskɪtbɔːl/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'chess', meaning: 'môn cờ vua trí tuệ', phonetic: '/tʃes/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'volleyball', meaning: 'môn bóng chuyền', phonetic: '/ˈvɒlibɔːl/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'table tennis', meaning: 'môn bóng bàn', phonetic: '/ˈteɪbl ˈtenɪs/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'skipping', meaning: 'trò chơi nhảy dây', phonetic: '/ˈskɪpɪŋ/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'hide-and-seek', meaning: 'trò chơi trốn tìm', phonetic: '/ˌhaɪd n ˈsiːk/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'chat', meaning: 'trò chuyện tâm sự', phonetic: '/tʃæt/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'together', meaning: 'cùng nhau, sum vầy', phonetic: '/təˈɡeðər/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'play', meaning: 'chơi đùa thi đấu', phonetic: '/pleɪ/', level: 'A1', unit: 'Unit 10: Break time activities' },
                { word: 'game', meaning: 'trò chơi giải trí', phonetic: '/ɡeɪm/', level: 'A1', unit: 'Unit 10: Break time activities' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 3 — GLOBAL SUCCESS (TẬP 2)
        // =====================================================================
        'sgk_lop_3_global_success_tap_2': {
            id: 'sgk_lop_3_global_success_tap_2',
            title: 'Sách Giáo Khoa Tiếng Anh 3 — Global Success (Tập 2)',
            shortTitle: 'Tiếng Anh 3 - Tập 2 (Global Success)',
            grade: 3,
            series: 'Global Success',
            volume: 2,
            level: 'A1',
            badge: 'Bộ Giáo Dục & Đào Tạo',
            description: 'Chương trình chuẩn Unit 11 đến Unit 20 của Bộ GD&ĐT & Pearson.',
            aliases: [
                'sgk-tieng-anh-3-global-success-tap-2',
                'tieng-anh-3-global-success-tap-2',
                'tieng-anh-3-global-success-tap2',
                'tieng anh 3 tap 2 global success',
                'tieng anh 3 global success tap 2',
                'sgk tieng anh 3 tap 2',
                'tiếng anh 3 tập 2 global success',
                'sách tiếng anh 3 tập 2',
                'tieng anh 3 tap 2'
            ],
            units: [
                'Unit 11: My family',
                'Unit 12: My house',
                'Unit 13: My room',
                'Unit 14: My bedroom',
                'Unit 15: At the dining table',
                'Unit 16: My pets',
                'Unit 17: Our toys',
                'Unit 18: Playing sports',
                'Unit 19: Outdoor activities',
                'Unit 20: At the zoo'
            ],
            words: [
                // Unit 11: My family
                { word: 'family', meaning: 'gia đình yêu thương', phonetic: '/ˈfæməli/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'father', meaning: 'bố, người cha', phonetic: '/ˈfɑːðər/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'mother', meaning: 'mẹ, người má', phonetic: '/ˈmʌðər/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'brother', meaning: 'anh em trai', phonetic: '/ˈbrʌðər/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'sister', meaning: 'chị em gái', phonetic: '/ˈsɪstər/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'grandfather', meaning: 'ông nội, ông ngoại', phonetic: '/ˈɡrænfɑːðər/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'grandmother', meaning: 'bà nội, bà ngoại', phonetic: '/ˈɡrænmʌðər/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'parents', meaning: 'bố mẹ, cha mẹ', phonetic: '/ˈpeərənts/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'baby', meaning: 'em bé nhỏ', phonetic: '/ˈbeɪbi/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'photo', meaning: 'bức ảnh kỉ niệm', phonetic: '/ˈfəʊtəʊ/', level: 'A1', unit: 'Unit 11: My family' },
                { word: 'young', meaning: 'trẻ trung', phonetic: '/jʌŋ/', level: 'A1', unit: 'Unit 11: My family' },

                // Unit 12: My house
                { word: 'house', meaning: 'ngôi nhà ấm cúng', phonetic: '/haʊs/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'living room', meaning: 'phòng khách', phonetic: '/ˈlɪvɪŋ ruːm/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'bedroom', meaning: 'phòng ngủ', phonetic: '/ˈbedruːm/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'kitchen', meaning: 'nhà bếp nấu ăn', phonetic: '/ˈkɪtʃɪn/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'bathroom', meaning: 'phòng tắm vệ sinh', phonetic: '/ˈbɑːθruːm/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'garden', meaning: 'khu vườn hoa quả', phonetic: '/ˈɡɑːdn/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'yard', meaning: 'khoảng sân trước nhà', phonetic: '/jɑːd/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'gate', meaning: 'cổng vào nhà', phonetic: '/ɡeɪt/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'door', meaning: 'cửa ra vào', phonetic: '/dɔːr/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'window', meaning: 'cửa sổ thoáng mát', phonetic: '/ˈwɪndəʊ/', level: 'A1', unit: 'Unit 12: My house' },
                { word: 'tree', meaning: 'cây xanh bóng mát', phonetic: '/triː/', level: 'A1', unit: 'Unit 12: My house' },

                // Unit 13: My room
                { word: 'room', meaning: 'căn phòng', phonetic: '/ruːm/', level: 'A1', unit: 'Unit 13: My room' },
                { word: 'bed', meaning: 'chiếc giường ngủ', phonetic: '/bed/', level: 'A1', unit: 'Unit 13: My room' },
                { word: 'chair', meaning: 'chiếc ghế ngồi', phonetic: '/tʃeər/', level: 'A1', unit: 'Unit 13: My room' },
                { word: 'table', meaning: 'chiếc bàn lớn', phonetic: '/ˈteɪbl/', level: 'A1', unit: 'Unit 13: My room' },
                { word: 'wardrobe', meaning: 'tủ quần áo', phonetic: '/ˈwɔːdrəʊb/', level: 'A1', unit: 'Unit 13: My room' },
                { word: 'lamp', meaning: 'đèn bàn học', phonetic: '/læmp/', level: 'A1', unit: 'Unit 13: My room' },
                { word: 'fan', meaning: 'quạt điện mát', phonetic: '/fæn/', level: 'A1', unit: 'Unit 13: My room' },
                { word: 'near', meaning: 'ở gần sát bên', phonetic: '/nɪər/', level: 'A1', unit: 'Unit 13: My room' },
                { word: 'here', meaning: 'ở đây, chỗ này', phonetic: '/hɪər/', level: 'A1', unit: 'Unit 13: My room' },
                { word: 'there', meaning: 'ở đó, đằng kia', phonetic: '/ðeər/', level: 'A1', unit: 'Unit 13: My room' },

                // Unit 14: My bedroom
                { word: 'picture', meaning: 'bức tranh treo tường', phonetic: '/ˈpɪktʃər/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'poster', meaning: 'tấm áp phích poster', phonetic: '/ˈpəʊstər/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'mirror', meaning: 'tấm gương soi', phonetic: '/ˈmɪrər/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'ball', meaning: 'quả bóng tròn', phonetic: '/bɔːl/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'teddy bear', meaning: 'chú gấu bông', phonetic: '/ˈtedi beər/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'coat', meaning: 'áo khoác giữ ấm', phonetic: '/kəʊt/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'clock', meaning: 'đồng hồ treo tường', phonetic: '/klɒk/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'wall', meaning: 'bức tường phòng', phonetic: '/wɔːl/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'under', meaning: 'ở phía dưới', phonetic: '/ˈʌndər/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'on', meaning: 'ở trên bề mặt', phonetic: '/ɒn/', level: 'A1', unit: 'Unit 14: My bedroom' },
                { word: 'behind', meaning: 'ở phía sau', phonetic: '/bɪˈhaɪnd/', level: 'A1', unit: 'Unit 14: My bedroom' },

                // Unit 15: At the dining table
                { word: 'food', meaning: 'thức ăn đồ ăn', phonetic: '/fuːd/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'bread', meaning: 'ổ bánh mì', phonetic: '/bred/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'rice', meaning: 'hạt gạo, cơm trắng', phonetic: '/raɪs/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'fish', meaning: 'con cá biển', phonetic: '/fɪʃ/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'meat', meaning: 'miếng thịt tươi', phonetic: '/miːt/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'chicken', meaning: 'thịt gà rán luộc', phonetic: '/ˈtʃɪkɪn/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'egg', meaning: 'quả trứng gà', phonetic: '/eɡ/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'milk', meaning: 'sữa tươi bổ dưỡng', phonetic: '/mɪlk/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'water', meaning: 'nước uống tinh khiết', phonetic: '/ˈwɔːtər/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'juice', meaning: 'nước ép trái cây', phonetic: '/dʒuːs/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'drink', meaning: 'uống đồ nước', phonetic: '/drɪŋk/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'eat', meaning: 'ăn uống ngon miệng', phonetic: '/iːt/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'hungry', meaning: 'đói bụng', phonetic: '/ˈhʌŋɡri/', level: 'A1', unit: 'Unit 15: At the dining table' },
                { word: 'thirsty', meaning: 'khát nước', phonetic: '/ˈθɜːsti/', level: 'A1', unit: 'Unit 15: At the dining table' },

                // Unit 16: My pets
                { word: 'pet', meaning: 'thú cưng nuôi trong nhà', phonetic: '/pet/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'pets', meaning: 'các loài thú cưng', phonetic: '/pets/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'dog', meaning: 'chú chó trung thành', phonetic: '/dɒɡ/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'cat', meaning: 'chú mèo con đáng yêu', phonetic: '/kæt/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'bird', meaning: 'chú chim hót líu lo', phonetic: '/bɜːd/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'rabbit', meaning: 'chú thỏ trắng', phonetic: '/ˈræbɪt/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'goldfish', meaning: 'chú cá vàng óng', phonetic: '/ˈɡəʊldfɪʃ/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'parrot', meaning: 'chú vẹt biết nói', phonetic: '/ˈpærət/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'cute', meaning: 'dễ thương kháu khỉnh', phonetic: '/kjuːt/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'cage', meaning: 'chiếc lồng nhốt chim', phonetic: '/keɪdʒ/', level: 'A1', unit: 'Unit 16: My pets' },
                { word: 'tank', meaning: 'bể nuôi cá cảnh', phonetic: '/tæŋk/', level: 'A1', unit: 'Unit 16: My pets' },

                // Unit 17: Our toys
                { word: 'toy', meaning: 'món đồ chơi trẻ em', phonetic: '/tɔɪ/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'toys', meaning: 'những món đồ chơi', phonetic: '/tɔɪz/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'doll', meaning: 'búp bê xinh xắn', phonetic: '/dɒl/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'car', meaning: 'xe ô tô đồ chơi', phonetic: '/kɑːr/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'truck', meaning: 'xe tải chở hàng', phonetic: '/trʌk/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'train', meaning: 'đoàn tàu hỏa dài', phonetic: '/treɪn/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'plane', meaning: 'máy bay đồ chơi', phonetic: '/pleɪn/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'ship', meaning: 'con tàu thủy lướt sóng', phonetic: '/ʃɪp/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'kite', meaning: 'con diều bay no gió', phonetic: '/kaɪt/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'robot', meaning: 'người máy rô-bốt', phonetic: '/ˈrəʊbɒt/', level: 'A1', unit: 'Unit 17: Our toys' },
                { word: 'yo-yo', meaning: 'con quay yo-yo', phonetic: '/ˈjəʊ jəʊ/', level: 'A1', unit: 'Unit 17: Our toys' },

                // Unit 18: Playing sports
                { word: 'sport', meaning: 'thể dục thể thao', phonetic: '/spɔːt/', level: 'A1', unit: 'Unit 18: Playing sports' },
                { word: 'sports', meaning: 'các môn thể thao', phonetic: '/spɔːts/', level: 'A1', unit: 'Unit 18: Playing sports' },
                { word: 'tennis', meaning: 'môn quần vợt', phonetic: '/ˈtenɪs/', level: 'A1', unit: 'Unit 18: Playing sports' },
                { word: 'swimming', meaning: 'hoạt động bơi lội', phonetic: '/ˈswɪmɪŋ/', level: 'A1', unit: 'Unit 18: Playing sports' },
                { word: 'running', meaning: 'hoạt động chạy bộ', phonetic: '/ˈrʌnɪŋ/', level: 'A1', unit: 'Unit 18: Playing sports' },
                { word: 'cycling', meaning: 'đạp xe đạp thể dục', phonetic: '/ˈsaɪklɪŋ/', level: 'A1', unit: 'Unit 18: Playing sports' },
                { word: 'match', meaning: 'trận đấu gay cấn', phonetic: '/mætʃ/', level: 'A1', unit: 'Unit 18: Playing sports' },
                { word: 'stadium', meaning: 'sân vận động lớn', phonetic: '/ˈsteɪdiəm/', level: 'A1', unit: 'Unit 18: Playing sports' },
                { word: 'park', meaning: 'công viên xanh', phonetic: '/pɑːk/', level: 'A1', unit: 'Unit 18: Playing sports' },

                // Unit 19: Outdoor activities
                { word: 'outdoor', meaning: 'ngoài trời mát mẻ', phonetic: '/ˌaʊtˈdɔːr/', level: 'A1', unit: 'Unit 19: Outdoor activities' },
                { word: 'activity', meaning: 'hoạt động vui chơi', phonetic: '/ækˈtɪvəti/', level: 'A1', unit: 'Unit 19: Outdoor activities' },
                { word: 'walking', meaning: 'đi bộ thong thả', phonetic: '/ˈwɔːkɪŋ/', level: 'A1', unit: 'Unit 19: Outdoor activities' },
                { word: 'skating', meaning: 'trượt băng patin', phonetic: '/ˈskeɪtɪŋ/', level: 'A1', unit: 'Unit 19: Outdoor activities' },
                { word: 'picnic', meaning: 'chuyến dã ngoại', phonetic: '/ˈpɪknɪk/', level: 'A1', unit: 'Unit 19: Outdoor activities' },
                { word: 'sunny', meaning: 'trời nắng ấm áp', phonetic: '/ˈsʌni/', level: 'A1', unit: 'Unit 19: Outdoor activities' },
                { word: 'rainy', meaning: 'trời mưa rơi', phonetic: '/ˈreɪni/', level: 'A1', unit: 'Unit 19: Outdoor activities' },
                { word: 'cloudy', meaning: 'trời nhiều mây', phonetic: '/ˈklaʊdi/', level: 'A1', unit: 'Unit 19: Outdoor activities' },
                { word: 'windy', meaning: 'trời lộng gió', phonetic: '/ˈwɪndi/', level: 'A1', unit: 'Unit 19: Outdoor activities' },
                { word: 'weekend', meaning: 'ngày cuối tuần', phonetic: '/ˌwiːkˈend/', level: 'A1', unit: 'Unit 19: Outdoor activities' },

                // Unit 20: At the zoo
                { word: 'zoo', meaning: 'vườn bách thú', phonetic: '/zuː/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'animal', meaning: 'con vật động vật', phonetic: '/ˈænɪml/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'monkey', meaning: 'chú khỉ tinh nghịch', phonetic: '/ˈmʌŋki/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'tiger', meaning: 'chú hổ dũng mãnh', phonetic: '/ˈtaɪɡər/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'lion', meaning: 'chú sư tử bờm rậm', phonetic: '/ˈlaɪən/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'elephant', meaning: 'chú voi to lớn', phonetic: '/ˈelɪfənt/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'bear', meaning: 'chú gấu béo', phonetic: '/beər/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'zebra', meaning: 'chú ngựa vằn sọc trắng', phonetic: '/ˈzebrə/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'giraffe', meaning: 'chú hươu cao cổ', phonetic: '/dʒəˈrɑːf/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'kangaroo', meaning: 'chú chuột túi bật nhảy', phonetic: '/ˌkæŋɡəˈruː/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'crocodile', meaning: 'con cá sấu hung dữ', phonetic: '/ˈkrɒkədaɪl/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'peacock', meaning: 'chú công xòe đuôi', phonetic: '/ˈpiːkɒk/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'beautiful', meaning: 'xinh đẹp kiều diễm', phonetic: '/ˈbjuːtɪfl/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'scary', meaning: 'đáng sợ hãi', phonetic: '/ˈskeəri/', level: 'A1', unit: 'Unit 20: At the zoo' },
                { word: 'jump', meaning: 'bật nhảy cao', phonetic: '/dʒʌmp/', level: 'A1', unit: 'Unit 20: At the zoo' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 1 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_1_global_success': {
            id: 'sgk_lop_1_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 1 — Global Success',
            shortTitle: 'Tiếng Anh 1 (Global Success)',
            grade: 1,
            series: 'Global Success',
            level: 'A1',
            badge: 'Lớp 1 (Sơ cấp)',
            aliases: ['tieng anh 1', 'sgk tieng anh 1', 'lop 1', 'grade 1'],
            units: ['Unit 1: In the school playground', 'Unit 2: In the dining room', 'Unit 3: At the street market', 'Unit 4: In the bedroom', 'Unit 5: At the fish and chip shop', 'Unit 6: In the classroom'],
            words: [
                { word: 'ball', meaning: 'quả bóng', phonetic: '/bɔːl/', level: 'A1' },
                { word: 'book', meaning: 'quyển sách', phonetic: '/bʊk/', level: 'A1' },
                { word: 'bike', meaning: 'chiếc xe đạp', phonetic: '/baɪk/', level: 'A1' },
                { word: 'boy', meaning: 'cậu bé', phonetic: '/bɔɪ/', level: 'A1' },
                { word: 'cat', meaning: 'con mèo', phonetic: '/kæt/', level: 'A1' },
                { word: 'car', meaning: 'xe hơi', phonetic: '/kɑːr/', level: 'A1' },
                { word: 'cake', meaning: 'chiếc bánh', phonetic: '/keɪk/', level: 'A1' },
                { word: 'cup', meaning: 'cái chén, tách', phonetic: '/kʌp/', level: 'A1' },
                { word: 'duck', meaning: 'con vịt', phonetic: '/dʌk/', level: 'A1' },
                { word: 'dog', meaning: 'chú cún', phonetic: '/dɒɡ/', level: 'A1' },
                { word: 'door', meaning: 'cánh cửa', phonetic: '/dɔːr/', level: 'A1' },
                { word: 'desk', meaning: 'bàn học', phonetic: '/desk/', level: 'A1' },
                { word: 'apple', meaning: 'quả táo', phonetic: '/ˈæpl/', level: 'A1' },
                { word: 'hat', meaning: 'cái mũ nón', phonetic: '/hæt/', level: 'A1' },
                { word: 'hand', meaning: 'bàn tay', phonetic: '/hænd/', level: 'A1' },
                { word: 'eye', meaning: 'đôi mắt', phonetic: '/aɪ/', level: 'A1' },
                { word: 'nose', meaning: 'chiếc mũi', phonetic: '/nəʊz/', level: 'A1' },
                { word: 'one', meaning: 'số một', phonetic: '/wʌn/', level: 'A1' },
                { word: 'two', meaning: 'số hai', phonetic: '/tuː/', level: 'A1' },
                { word: 'three', meaning: 'số ba', phonetic: '/θriː/', level: 'A1' },
                { word: 'four', meaning: 'số bốn', phonetic: '/fɔːr/', level: 'A1' },
                { word: 'five', meaning: 'số năm', phonetic: '/faɪv/', level: 'A1' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 2 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_2_global_success': {
            id: 'sgk_lop_2_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 2 — Global Success',
            shortTitle: 'Tiếng Anh 2 (Global Success)',
            grade: 2,
            series: 'Global Success',
            level: 'A1',
            badge: 'Lớp 2 (Sơ cấp)',
            aliases: ['tieng anh 2', 'sgk tieng anh 2', 'lop 2', 'grade 2'],
            units: ['Unit 1: At my birthday party', 'Unit 2: In the backyard', 'Unit 3: At the seaside', 'Unit 4: In the countryside'],
            words: [
                { word: 'pizza', meaning: 'bánh pizza', phonetic: '/ˈpiːtsə/', level: 'A1' },
                { word: 'pasta', meaning: 'mì ống Ý', phonetic: '/ˈpæstə/', level: 'A1' },
                { word: 'popcorn', meaning: 'bắp rang bơ', phonetic: '/ˈpɒpkɔːn/', level: 'A1' },
                { word: 'kite', meaning: 'con diều giấy', phonetic: '/kaɪt/', level: 'A1' },
                { word: 'bike', meaning: 'xe đạp', phonetic: '/baɪk/', level: 'A1' },
                { word: 'kitten', meaning: 'mèo con', phonetic: '/ˈkɪtn/', level: 'A1' },
                { word: 'sun', meaning: 'mặt trời', phonetic: '/sʌn/', level: 'A1' },
                { word: 'sea', meaning: 'biển cả', phonetic: '/siː/', level: 'A1' },
                { word: 'sand', meaning: 'bờ cát vàng', phonetic: '/sænd/', level: 'A1' },
                { word: 'sail', meaning: 'cánh buồm', phonetic: '/seɪl/', level: 'A1' },
                { word: 'rainbow', meaning: 'cầu vồng', phonetic: '/ˈreɪnbəʊ/', level: 'A1' },
                { word: 'river', meaning: 'dòng sông', phonetic: '/ˈrɪvər/', level: 'A1' },
                { word: 'road', meaning: 'con đường', phonetic: '/rəʊd/', level: 'A1' },
                { word: 'six', meaning: 'số sáu', phonetic: '/sɪks/', level: 'A1' },
                { word: 'seven', meaning: 'số bảy', phonetic: '/ˈsevn/', level: 'A1' },
                { word: 'eight', meaning: 'số tám', phonetic: '/eɪt/', level: 'A1' },
                { word: 'nine', meaning: 'số chín', phonetic: '/naɪn/', level: 'A1' },
                { word: 'ten', meaning: 'số mười', phonetic: '/ten/', level: 'A1' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 4 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_4_global_success': {
            id: 'sgk_lop_4_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 4 — Global Success',
            shortTitle: 'Tiếng Anh 4 (Global Success)',
            grade: 4,
            series: 'Global Success',
            level: 'A1',
            badge: 'Lớp 4 (Tiểu học)',
            aliases: ['tieng anh 4', 'sgk tieng anh 4', 'lop 4', 'grade 4'],
            units: ['Unit 1: My friends', 'Unit 2: Time and daily routines', 'Unit 3: My week', 'Unit 4: My birthday party', 'Unit 5: Things we can do'],
            words: [
                { word: 'Australia', meaning: 'nước Úc', phonetic: '/ɒˈstreɪliə/', level: 'A1' },
                { word: 'America', meaning: 'nước Mỹ', phonetic: '/əˈmerɪkə/', level: 'A1' },
                { word: 'England', meaning: 'nước Anh', phonetic: '/ˈɪŋɡlənd/', level: 'A1' },
                { word: 'Japan', meaning: 'nước Nhật Bản', phonetic: '/dʒəˈpæn/', level: 'A1' },
                { word: 'Malaysia', meaning: 'nước Ma-lai-xi-a', phonetic: '/məˈleɪʒə/', level: 'A1' },
                { word: 'Viet Nam', meaning: 'nước Việt Nam', phonetic: '/ˌvjet ˈnæm/', level: 'A1' },
                { word: 'morning', meaning: 'buổi sáng', phonetic: '/ˈmɔːnɪŋ/', level: 'A1' },
                { word: 'afternoon', meaning: 'buổi chiều', phonetic: '/ˌɑːftəˈnuːn/', level: 'A1' },
                { word: 'evening', meaning: 'buổi tối', phonetic: '/ˈiːvnɪŋ/', level: 'A1' },
                { word: 'Monday', meaning: 'thứ Hai', phonetic: '/ˈmʌndeɪ/', level: 'A1' },
                { word: 'Tuesday', meaning: 'thứ Ba', phonetic: '/ˈtjuːzdeɪ/', level: 'A1' },
                { word: 'Wednesday', meaning: 'thứ Tư', phonetic: '/ˈwenzdeɪ/', level: 'A1' },
                { word: 'Thursday', meaning: 'thứ Năm', phonetic: '/ˈθɜːzdeɪ/', level: 'A1' },
                { word: 'Friday', meaning: 'thứ Sáu', phonetic: '/ˈfraɪdeɪ/', level: 'A1' },
                { word: 'Saturday', meaning: 'thứ Bảy', phonetic: '/ˈsætədeɪ/', level: 'A1' },
                { word: 'Sunday', meaning: 'Chủ Nhật', phonetic: '/ˈsʌndeɪ/', level: 'A1' },
                { word: 'January', meaning: 'tháng Một', phonetic: '/ˈdʒænjuəri/', level: 'A1' },
                { word: 'February', meaning: 'tháng Hai', phonetic: '/ˈfebruəri/', level: 'A1' },
                { word: 'March', meaning: 'tháng Ba', phonetic: '/mɑːtʃ/', level: 'A1' },
                { word: 'April', meaning: 'tháng Tư', phonetic: '/ˈeɪprəl/', level: 'A1' },
                { word: 'May', meaning: 'tháng Năm', phonetic: '/meɪ/', level: 'A1' },
                { word: 'June', meaning: 'tháng Sáu', phonetic: '/dʒuːn/', level: 'A1' },
                { word: 'doctor', meaning: 'bác sĩ khám bệnh', phonetic: '/ˈdɒktər/', level: 'A1' },
                { word: 'nurse', meaning: 'y tá chăm sóc', phonetic: '/nɜːs/', level: 'A1' },
                { word: 'farmer', meaning: 'bác nông dân', phonetic: '/ˈfɑːmər/', level: 'A1' },
                { word: 'driver', meaning: 'bác tài xế', phonetic: '/ˈdraɪvər/', level: 'A1' },
                { word: 'factory', meaning: 'nhà máy công xưởng', phonetic: '/ˈfæktri/', level: 'A1' },
                { word: 'hospital', meaning: 'bệnh viện cứu chữa', phonetic: '/ˈhɒspɪtl/', level: 'A1' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 5 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_5_global_success': {
            id: 'sgk_lop_5_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 5 — Global Success',
            shortTitle: 'Tiếng Anh 5 (Global Success)',
            grade: 5,
            series: 'Global Success',
            level: 'A1',
            badge: 'Lớp 5 (Tiểu học)',
            aliases: ['tieng anh 5', 'sgk tieng anh 5', 'lop 5', 'grade 5'],
            units: ['Unit 1: All about me', 'Unit 2: Our homes', 'Unit 3: My foreign friends', 'Unit 4: Our free-time activities'],
            words: [
                { word: 'address', meaning: 'địa chỉ nhà ở', phonetic: '/əˈdres/', level: 'A1' },
                { word: 'street', meaning: 'con đường phố xá', phonetic: '/striːt/', level: 'A1' },
                { word: 'avenue', meaning: 'đại lộ thênh thang', phonetic: '/ˈævənjuː/', level: 'A1' },
                { word: 'village', meaning: 'ngôi làng quê', phonetic: '/ˈvɪlɪdʒ/', level: 'A1' },
                { word: 'tower', meaning: 'tòa tháp cao tầng', phonetic: '/ˈtaʊər/', level: 'A1' },
                { word: 'countryside', meaning: 'vùng nông thôn yên bình', phonetic: '/ˈkʌntrisaɪd/', level: 'A1' },
                { word: 'always', meaning: 'luôn luôn', phonetic: '/ˈɔːlweɪz/', level: 'A1' },
                { word: 'usually', meaning: 'thường xuyên', phonetic: '/ˈjuːʒuəli/', level: 'A1' },
                { word: 'often', meaning: 'thường hay', phonetic: '/ˈɒfn/', level: 'A1' },
                { word: 'sometimes', meaning: 'thỉnh thoảng đôi khi', phonetic: '/ˈsʌmtaɪmz/', level: 'A1' },
                { word: 'never', meaning: 'không bao giờ', phonetic: '/ˈnevər/', level: 'A1' },
                { word: 'holiday', meaning: 'kỳ nghỉ lễ dài', phonetic: '/ˈhɒlədeɪ/', level: 'A1' },
                { word: 'island', meaning: 'hòn đảo biển', phonetic: '/ˈaɪlənd/', level: 'A1' },
                { word: 'ancient', meaning: 'cổ kính rêu phong', phonetic: '/ˈeɪnʃənt/', level: 'A1' },
                { word: 'headache', meaning: 'cơn đau đầu', phonetic: '/ˈhedeɪk/', level: 'A1' },
                { word: 'toothache', meaning: 'cơn đau răng', phonetic: '/ˈtuːθeɪk/', level: 'A1' },
                { word: 'fever', meaning: 'cơn sốt cao', phonetic: '/ˈfiːvər/', level: 'A1' },
                { word: 'cough', meaning: 'cơn ho khan', phonetic: '/kɒf/', level: 'A1' },
                { word: 'dentist', meaning: 'bác sĩ nha khoa', phonetic: '/ˈdentɪst/', level: 'A1' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 6 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_6_global_success': {
            id: 'sgk_lop_6_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 6 — Global Success',
            shortTitle: 'Tiếng Anh 6 (Global Success)',
            grade: 6,
            series: 'Global Success',
            level: 'A2',
            badge: 'Lớp 6 (THCS - A2)',
            aliases: ['tieng anh 6', 'sgk tieng anh 6', 'lop 6', 'grade 6'],
            units: ['Unit 1: My new school', 'Unit 2: My home', 'Unit 3: My friends', 'Unit 4: My neighbourhood', 'Unit 5: Natural wonders of Viet Nam'],
            words: [
                { word: 'compass', meaning: 'cái com-pa vẽ hình', phonetic: '/ˈkʌmpəs/', level: 'A2' },
                { word: 'calculator', meaning: 'máy tính bỏ túi', phonetic: '/ˈkælkjuleɪtər/', level: 'A2' },
                { word: 'uniform', meaning: 'bộ đồng phục học sinh', phonetic: '/ˈjuːnɪfɔːm/', level: 'A2' },
                { word: 'boarding school', meaning: 'trường học nội trú', phonetic: '/ˈbɔːdɪŋ skuːl/', level: 'A2' },
                { word: 'creative', meaning: 'sáng tạo độc đáo', phonetic: '/kriˈeɪtɪv/', level: 'A2' },
                { word: 'confident', meaning: 'tự tin vững vàng', phonetic: '/ˈkɒnfɪdənt/', level: 'A2' },
                { word: 'patient', meaning: 'kiên nhẫn nhẫn nại', phonetic: '/ˈpeɪʃnt/', level: 'A2' },
                { word: 'reliable', meaning: 'đáng tin cậy', phonetic: '/rɪˈlaɪəbl/', level: 'A2' },
                { word: 'neighbourhood', meaning: 'khu phố lân cận', phonetic: '/ˈneɪbəhʊd/', level: 'A2' },
                { word: 'waterfall', meaning: 'thác nước hùng vĩ', phonetic: '/ˈwɔːtəfɔːl/', level: 'A2' },
                { word: 'desert', meaning: 'sa mạc hoang vắng', phonetic: '/ˈdezət/', level: 'A2' },
                { word: 'island', meaning: 'hòn đảo giữa biển', phonetic: '/ˈaɪlənd/', level: 'A2' },
                { word: 'television', meaning: 'vô tuyến truyền hình', phonetic: '/ˈtelɪvɪʒn/', level: 'A2' },
                { word: 'comedy', meaning: 'vở kịch hài hước', phonetic: '/ˈkɒmədi/', level: 'A2' },
                { word: 'champion', meaning: 'nhà vô địch giải đấu', phonetic: '/ˈtʃæmpiən/', level: 'A2' },
                { word: 'equipment', meaning: 'dụng cụ trang thiết bị', phonetic: '/ɪˈkwɪpmənt/', level: 'A2' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 7 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_7_global_success': {
            id: 'sgk_lop_7_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 7 — Global Success',
            shortTitle: 'Tiếng Anh 7 (Global Success)',
            grade: 7,
            series: 'Global Success',
            level: 'A2',
            badge: 'Lớp 7 (THCS - A2)',
            aliases: ['tieng anh 7', 'sgk tieng anh 7', 'lop 7', 'grade 7'],
            units: ['Unit 1: Hobbies', 'Unit 2: Healthy living', 'Unit 3: Community service', 'Unit 4: Music and arts'],
            words: [
                { word: 'origami', meaning: 'nghệ thuật gấp giấy Nhật', phonetic: '/ˌɒrɪˈɡɑːmi/', level: 'A2' },
                { word: 'pottery', meaning: 'nghề làm gốm sứ', phonetic: '/ˈpɒtəri/', level: 'A2' },
                { word: 'sunburn', meaning: 'cháy nắng sạm da', phonetic: '/ˈsʌnbɜːn/', level: 'A2' },
                { word: 'allergy', meaning: 'chứng dị ứng', phonetic: '/ˈælədʒi/', level: 'A2' },
                { word: 'donate', meaning: 'quyên góp từ thiện', phonetic: '/dəʊˈneɪt/', level: 'A2' },
                { word: 'volunteer', meaning: 'tình nguyện viên', phonetic: '/ˌvɒlənˈtɪər/', level: 'A2' },
                { word: 'exhibition', meaning: 'cuộc triển lãm nghệ thuật', phonetic: '/ˌeksɪˈbɪʃn/', level: 'A2' },
                { word: 'composer', meaning: 'nhà soạn nhạc tài ba', phonetic: '/kəmˈpəʊzər/', level: 'A2' },
                { word: 'ingredient', meaning: 'nguyên liệu nấu ăn', phonetic: '/ɪnˈɡriːdiənt/', level: 'A2' },
                { word: 'pedestrian', meaning: 'người đi bộ qua đường', phonetic: '/pəˈdestriən/', level: 'A2' },
                { word: 'renewable', meaning: 'năng lượng tái tạo', phonetic: '/rɪˈnjuːəbl/', level: 'A2' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 8 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_8_global_success': {
            id: 'sgk_lop_8_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 8 — Global Success',
            shortTitle: 'Tiếng Anh 8 (Global Success)',
            grade: 8,
            series: 'Global Success',
            level: 'B1',
            badge: 'Lớp 8 (THCS - B1)',
            aliases: ['tieng anh 8', 'sgk tieng anh 8', 'lop 8', 'grade 8'],
            units: ['Unit 1: Leisure time', 'Unit 2: Life in the countryside', 'Unit 3: Teenagers', 'Unit 4: Ethnic groups of Viet Nam'],
            words: [
                { word: 'harvest', meaning: 'mùa thu hoạch nông sản', phonetic: '/ˈhɑːvɪst/', level: 'B1' },
                { word: 'hospitable', meaning: 'hiếu khách nồng hậu', phonetic: '/hɒˈspɪtəbl/', level: 'B1' },
                { word: 'paddy field', meaning: 'cánh đồng lúa chín', phonetic: '/ˈpædi fiːld/', level: 'B1' },
                { word: 'peer pressure', meaning: 'áp lực bạn bè đồng trang lứa', phonetic: '/pɪər ˈpreʃər/', level: 'B1' },
                { word: 'heritage', meaning: 'di sản văn hóa quý báu', phonetic: '/ˈherɪtɪdʒ/', level: 'B1' },
                { word: 'communal house', meaning: 'nhà rông sinh hoạt chung', phonetic: '/ˈkɒmjənl haʊs/', level: 'B1' },
                { word: 'costume', meaning: 'trang phục truyền thống', phonetic: '/ˈkɒstjuːm/', level: 'B1' },
                { word: 'superstition', meaning: 'sự mê tín dị đoan', phonetic: '/ˌsuːpəˈstɪʃn/', level: 'B1' },
                { word: 'biodiversity', meaning: 'sự đa dạng sinh học', phonetic: '/ˌbaɪəʊdaɪˈvɜːsəti/', level: 'B1' },
                { word: 'disaster', meaning: 'thảm họa thiên tai', phonetic: '/dɪˈzɑːstər/', level: 'B1' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 9 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_9_global_success': {
            id: 'sgk_lop_9_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 9 — Global Success',
            shortTitle: 'Tiếng Anh 9 (Global Success)',
            grade: 9,
            series: 'Global Success',
            level: 'B1',
            badge: 'Lớp 9 (Luyện thi vào 10 - B1)',
            aliases: ['tieng anh 9', 'sgk tieng anh 9', 'lop 9', 'grade 9'],
            units: ['Unit 1: Local community', 'Unit 2: City life', 'Unit 3: Healthy living for teens', 'Unit 4: Remembering the past'],
            words: [
                { word: 'artisan', meaning: 'nghệ nhân lành nghề', phonetic: '/ˌɑːtɪˈzæn/', level: 'B1' },
                { word: 'handicraft', meaning: 'sản phẩm thủ công mỹ nghệ', phonetic: '/ˈhændikrɑːft/', level: 'B1' },
                { word: 'lacquerware', meaning: 'đồ sơn mài truyền thống', phonetic: '/ˈlækəweər/', level: 'B1' },
                { word: 'cosmopolitan', meaning: 'thuộc về quốc tế phồn hoa', phonetic: '/ˌkɒzməˈpɒlɪtən/', level: 'B1' },
                { word: 'congested', meaning: 'ùn tắc giao thông nghiêm trọng', phonetic: '/kənˈdʒestɪd/', level: 'B1' },
                { word: 'counsellor', meaning: 'chuyên viên tư vấn tâm lý', phonetic: '/ˈkaʊnsələ/', level: 'B1' },
                { word: 'astounding', meaning: 'đáng kinh ngạc sửng sốt', phonetic: '/əˈstaʊndɪŋ/', level: 'B1' },
                { word: 'citadel', meaning: 'thành quách kiên cố cổ xưa', phonetic: '/ˈsɪtədəl/', level: 'B1' },
                { word: 'bilingual', meaning: 'người thông thạo song ngữ', phonetic: '/ˌbaɪˈlɪŋɡwəl/', level: 'B1' },
                { word: 'destination', meaning: 'điểm đến du lịch', phonetic: '/ˌdestɪˈneɪʃn/', level: 'B1' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 10 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_10_global_success': {
            id: 'sgk_lop_10_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 10 — Global Success',
            shortTitle: 'Tiếng Anh 10 (Global Success)',
            grade: 10,
            series: 'Global Success',
            level: 'B1',
            badge: 'Lớp 10 (THPT - B1/B2)',
            aliases: ['tieng anh 10', 'sgk tieng anh 10', 'lop 10', 'grade 10'],
            units: ['Unit 1: Family life', 'Unit 2: Humans and the environment', 'Unit 3: Music', 'Unit 4: For a better community'],
            words: [
                { word: 'breadwinner', meaning: 'trụ cột kinh tế gia đình', phonetic: '/ˈbredwɪnər/', level: 'B1' },
                { word: 'homemaker', meaning: 'người nội trợ quán xuyến', phonetic: '/ˈhəʊmmeɪkər/', level: 'B1' },
                { word: 'carbon footprint', meaning: 'lượng dấu chân carbon', phonetic: '/ˌkɑːbən ˈfʊtprɪnt/', level: 'B1' },
                { word: 'eco-friendly', meaning: 'thân thiện với môi trường', phonetic: '/ˌiːkəʊ ˈfrendli/', level: 'B1' },
                { word: 'audition', meaning: 'buổi thử giọng biểu diễn', phonetic: '/ɔːˈdɪʃn/', level: 'B1' },
                { word: 'disadvantaged', meaning: 'thiệt thòi, hoàn cảnh khó khăn', phonetic: '/ˌdɪsədˈvɑːntɪdʒd/', level: 'B1' },
                { word: 'gender equality', meaning: 'bình đẳng giới tính', phonetic: '/ˈdʒendər iˈkwɒləti/', level: 'B2' },
                { word: 'sustainable', meaning: 'phát triển bền vững', phonetic: '/səˈsteɪnəbl/', level: 'B2' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 11 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_11_global_success': {
            id: 'sgk_lop_11_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 11 — Global Success',
            shortTitle: 'Tiếng Anh 11 (Global Success)',
            grade: 11,
            series: 'Global Success',
            level: 'B2',
            badge: 'Lớp 11 (THPT - B2)',
            aliases: ['tieng anh 11', 'sgk tieng anh 11', 'lop 11', 'grade 11'],
            units: ['Unit 1: A long and healthy life', 'Unit 2: The generation gap', 'Unit 3: Cities of the future', 'Unit 4: ASEAN and Viet Nam'],
            words: [
                { word: 'longevity', meaning: 'sự sống lâu trường thọ', phonetic: '/lɒnˈdʒevəti/', level: 'B2' },
                { word: 'immune system', meaning: 'hệ thống miễn dịch cơ thể', phonetic: '/ɪˈmjuːn ˌsɪstəm/', level: 'B2' },
                { word: 'generation gap', meaning: 'khoảng cách giữa các thế hệ', phonetic: '/ˌdʒenəˈreɪʃn ɡæp/', level: 'B2' },
                { word: 'nuclear family', meaning: 'gia đình hạt nhân hai thế hệ', phonetic: '/ˌnjuːkliər ˈfæməli/', level: 'B2' },
                { word: 'infrastructure', meaning: 'cơ sở hạ tầng đô thị', phonetic: '/ˈɪnfrəstrʌktʃər/', level: 'B2' },
                { word: 'carbon neutral', meaning: 'trung hòa khí thải carbon', phonetic: '/ˌkɑːbən ˈnjuːtrəl/', level: 'B2' },
                { word: 'intangible', meaning: 'phi vật thể (di sản)', phonetic: '/ɪnˈtændʒəbl/', level: 'B2' },
                { word: 'independent', meaning: 'độc lập tự chủ', phonetic: '/ˌɪndɪˈpendənt/', level: 'B2' }
            ]
        },

        // =====================================================================
        // TIẾNG ANH 12 (GLOBAL SUCCESS / BỘ GD&ĐT)
        // =====================================================================
        'sgk_lop_12_global_success': {
            id: 'sgk_lop_12_global_success',
            title: 'Sách Giáo Khoa Tiếng Anh 12 — Global Success',
            shortTitle: 'Tiếng Anh 12 (Global Success)',
            grade: 12,
            series: 'Global Success',
            level: 'B2',
            badge: 'Lớp 12 (Thi Tốt Nghiệp THPT & ĐH)',
            aliases: ['tieng anh 12', 'sgk tieng anh 12', 'lop 12', 'grade 12'],
            units: ['Unit 1: Life stories', 'Unit 2: A multicultural world', 'Unit 3: Green living', 'Unit 4: Urbanisation', 'Unit 5: The world of work'],
            words: [
                { word: 'perseverance', meaning: 'sự kiên trì bền bỉ vượt khó', phonetic: '/ˌpɜːsɪˈvɪərəns/', level: 'B2' },
                { word: 'influential', meaning: 'có sức ảnh hưởng sâu rộng', phonetic: '/ˌɪnfluˈenʃl/', level: 'B2' },
                { word: 'multiculturalism', meaning: 'chủ nghĩa đa văn hóa', phonetic: '/ˌmʌltiˈkʌltʃərəlɪzəm/', level: 'C1' },
                { word: 'assimilation', meaning: 'sự đồng hóa văn hóa', phonetic: '/əˌsɪməˈleɪʃn/', level: 'C1' },
                { word: 'biodegradable', meaning: 'tự phân hủy sinh học', phonetic: '/ˌbaɪəʊdɪˈɡreɪdəbl/', level: 'B2' },
                { word: 'urbanisation', meaning: 'quá trình đô thị hóa', phonetic: '/ˌɜːbənaɪˈzeɪʃn/', level: 'B2' },
                { word: 'qualification', meaning: 'văn bằng chứng chỉ chuyên môn', phonetic: '/ˌkwɒlɪfɪˈkeɪʃn/', level: 'B2' },
                { word: 'artificial intelligence', meaning: 'trí tuệ nhân tạo (AI)', phonetic: '/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/', level: 'B2' },
                { word: 'automation', meaning: 'sự tự động hóa dây chuyền', phonetic: '/ˌɔːtəˈmeɪʃn/', level: 'B2' }
            ]
        }
    };

    // =========================================================================
    // ENGINE NHẬN DIỆN THÔNG MINH SÁCH GIÁO KHOA TỪ FILE UPLOAD
    // =========================================================================
    const TextbookCurriculumEngine = {
        data: TEXTBOOK_CURRICULUM_DATA,

        /**
         * Nhận diện file sách giáo khoa từ Tên file hoặc Mẫu văn bản
         * @param {string} fileName - Tên file (VD: 'thuvienhoclieu.com-SGK-Tieng-anh-3-Global-Success-Tap-1.pdf')
         * @param {string} textSample - Mẫu trích xuất văn bản (nếu có)
         */
        matchTextbook(fileName, textSample = '') {
            if (!fileName) return null;
            const normName = fileName.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
            const rawLower = fileName.toLowerCase();

            // 1. Quét theo aliases chính xác của từng cuốn sách
            for (const key of Object.keys(TEXTBOOK_CURRICULUM_DATA)) {
                const book = TEXTBOOK_CURRICULUM_DATA[key];
                for (const alias of book.aliases) {
                    const normAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
                    if (normName.includes(normAlias) || rawLower.includes(alias.toLowerCase())) {
                        return { matched: true, book: book, key: key };
                    }
                }
            }

            // 2. Nhận diện theo mẫu: Grade 1-12 + Series + Tập 1/2
            const gradeMatch = rawLower.match(/(?:sgk|tieng[-_\s]?anh|lop|grade)[-_\s]*([1-9]|1[0-2])\b/i) ||
                               rawLower.match(/\b([1-9]|1[0-2])\b.*(?:global[-_\s]?success|sgk)/i);
            
            if (gradeMatch) {
                const gradeNum = parseInt(gradeMatch[1], 10);
                const isTap2 = rawLower.includes('tap-2') || rawLower.includes('tap 2') || rawLower.includes('vol-2') || rawLower.includes('vol 2');
                
                if (gradeNum === 3) {
                    const key = isTap2 ? 'sgk_lop_3_global_success_tap_2' : 'sgk_lop_3_global_success_tap_1';
                    return { matched: true, book: TEXTBOOK_CURRICULUM_DATA[key], key: key };
                }

                // Tìm sách theo Grade
                for (const key of Object.keys(TEXTBOOK_CURRICULUM_DATA)) {
                    const book = TEXTBOOK_CURRICULUM_DATA[key];
                    if (book.grade === gradeNum) {
                        return { matched: true, book: book, key: key };
                    }
                }
            }

            return null;
        },

        getCurriculum(key) {
            return TEXTBOOK_CURRICULUM_DATA[key] || null;
        },

        getAllCurriculums() {
            return Object.values(TEXTBOOK_CURRICULUM_DATA);
        },

        getCurriculumByGrade(grade, vol = 1) {
            for (const key of Object.keys(TEXTBOOK_CURRICULUM_DATA)) {
                const b = TEXTBOOK_CURRICULUM_DATA[key];
                if (b.grade === grade && (!b.volume || b.volume === vol)) {
                    return b;
                }
            }
            return null;
        }
    };

    window.TEXTBOOK_CURRICULUM_DATA = TEXTBOOK_CURRICULUM_DATA;
    window.TextbookCurriculumEngine = TextbookCurriculumEngine;
    console.log('📚 TextbookCurriculumEngine initialized with 12 Grades (Global Success & MoET standard).');
})();
