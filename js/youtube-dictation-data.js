/**
 * VOCATYPE PRO - BỘ SƯU TẬP BÀI HÁT YOUTUBE ĐƯỢC TUYỂN CHỌN
 * Đồng bộ câu hát tự nhiên theo nhịp điệu (phrases 3.5s - 6.5s)
 * 100% Vietsub chuẩn xác, hỗ trợ luyện nghe chép chính tả & tự gõ
 */
const YOUTUBE_DICTATION_SONGS = [
    {
        "id": "heather-conan-gray",
        "title": "Heather",
        "artist": "Conan Gray",
        "youtubeId": "24u3NoPvgMw",
        "thumbnail": "https://img.youtube.com/vi/24u3NoPvgMw/hqdefault.jpg",
        "level": "B1",
        "genre": "Indie Pop",
        "accent": "Mỹ (US)",
        "description": "Bản hit acoustic chạm tới triệu trái tim của Conan Gray. Ca từ sâu lắng về tình yêu đơn phương.",
        "lines": [
            {
                "index": 1,
                "start": 24.5,
                "end": 32,
                "text": "I still remember, third of December, me in your sweater",
                "vietsub": "Em vẫn nhớ như in ngày mùng 3 tháng 12, khi em mặc chiếc áo len của anh.",
                "blanks": [
                    "still",
                    "remember",
                    "third"
                ]
            },
            {
                "index": 2,
                "start": 32,
                "end": 37.5,
                "text": "You said it looked better on me than it did you",
                "vietsub": "Anh bảo em mặc chiếc áo ấy còn đẹp hơn cả khi anh mặc.",
                "blanks": [
                    "You",
                    "said",
                    "looked"
                ]
            },
            {
                "index": 3,
                "start": 37.5,
                "end": 42.6,
                "text": "Only if you knew how much I liked you",
                "vietsub": "Giá như anh biết được em đã từng thích anh nhiều đến nhường nào.",
                "blanks": [
                    "Only",
                    "you",
                    "knew"
                ]
            },
            {
                "index": 4,
                "start": 42.6,
                "end": 47.9,
                "text": "But I watch your eyes as she, Walks by",
                "vietsub": "Nhưng ánh mắt anh giờ đây chỉ mải dõi theo khi cô ấy.., ...bước ngang qua.",
                "blanks": [
                    "But",
                    "watch",
                    "Walks"
                ]
            },
            {
                "index": 5,
                "start": 47.9,
                "end": 52.8,
                "text": "What a sight for sore eyes",
                "vietsub": "Cô ấy thật đẹp, hình bóng khiến ai cũng phải ngẩn ngơ ngắm nhìn.",
                "blanks": [
                    "What",
                    "sight"
                ]
            },
            {
                "index": 6,
                "start": 52.8,
                "end": 58.3,
                "text": "Brighter than the blue sky",
                "vietsub": "Rực rỡ và tươi sáng hơn cả bầu trời xanh biếc.",
                "blanks": [
                    "Brighter",
                    "than"
                ]
            },
            {
                "index": 7,
                "start": 58.3,
                "end": 66.1,
                "text": "She's got you mesmerized while I die",
                "vietsub": "Cô ấy hớp trọn tâm trí anh, trong khi cõi lòng em đang vỡ vụn.",
                "blanks": [
                    "Shes",
                    "got",
                    "you"
                ]
            },
            {
                "index": 8,
                "start": 66.1,
                "end": 71.1,
                "text": "Why would you ever kiss me?",
                "vietsub": "Cớ sao anh lại chẳng bao giờ trao em một nụ hôn?",
                "blanks": [
                    "Why",
                    "would"
                ]
            },
            {
                "index": 9,
                "start": 71.1,
                "end": 76.2,
                "text": "I'm not even half as pretty",
                "vietsub": "Em thậm chí còn chẳng xinh đẹp bằng một nửa của cô ấy.",
                "blanks": [
                    "not",
                    "even"
                ]
            },
            {
                "index": 10,
                "start": 76.2,
                "end": 81.4,
                "text": "You gave her your sweater, it's just polyester",
                "vietsub": "Anh trao cô ấy chiếc áo len của mình, dẫu nó chỉ là sợi vải polyester tầm thường.",
                "blanks": [
                    "You",
                    "gave",
                    "her"
                ]
            },
            {
                "index": 11,
                "start": 81.4,
                "end": 87.3,
                "text": "But you like her better, Wish I were Heather",
                "vietsub": "Thế nhưng anh lại thích cô ấy hơn em, Ước gì em có thể là Heather.",
                "blanks": [
                    "But",
                    "you",
                    "Wish"
                ]
            },
            {
                "index": 12,
                "start": 87.3,
                "end": 91.6,
                "text": "Watch as she stands with her, holding your hand",
                "vietsub": "Em đứng nhìn cô ấy sánh bước bên anh, bàn tay đan chặt lấy tay anh.",
                "blanks": [
                    "Watch",
                    "she",
                    "stands"
                ]
            },
            {
                "index": 13,
                "start": 91.6,
                "end": 97.3,
                "text": "Put your arm 'round her shoulder, now I'm getting colder",
                "vietsub": "Anh khoác tay qua bờ vai cô ấy, còn lòng em đang dần lạnh ngắt.",
                "blanks": [
                    "Put",
                    "your",
                    "arm"
                ]
            },
            {
                "index": 14,
                "start": 97.3,
                "end": 102.9,
                "text": "But how could I hate her? She's such an angel",
                "vietsub": "Nhưng làm sao em có thể ghét cô ấy được chứ? Cô ấy thuần khiết tựa thiên thần.",
                "blanks": [
                    "But",
                    "how",
                    "could"
                ]
            },
            {
                "index": 15,
                "start": 102.9,
                "end": 108.3,
                "text": "But then again, kinda wish she were dead as she",
                "vietsub": "Nhưng rồi em lại thầm ước giá như cô ấy biến mất khi...",
                "blanks": [
                    "But",
                    "then",
                    "again"
                ]
            },
            {
                "index": 16,
                "start": 108.3,
                "end": 115.6,
                "text": "Walks by, What a sight for sore eyes",
                "vietsub": "...cô ấy bước qua, Một vẻ đẹp khiến ai cũng phải đắm say ngắm nhìn.",
                "blanks": [
                    "Walks",
                    "What",
                    "sight"
                ]
            },
            {
                "index": 17,
                "start": 115.6,
                "end": 121.1,
                "text": "Brighter than the blue sky",
                "vietsub": "Rực rỡ hơn cả vòm trời trong xanh.",
                "blanks": [
                    "Brighter",
                    "than"
                ]
            },
            {
                "index": 18,
                "start": 121.1,
                "end": 128.7,
                "text": "She's got you mesmerized while I die",
                "vietsub": "Cô ấy hoàn toàn mê hoặc anh, trong khi tim em đang chết lặng.",
                "blanks": [
                    "Shes",
                    "got",
                    "you"
                ]
            },
            {
                "index": 19,
                "start": 128.7,
                "end": 133.5,
                "text": "Why would you ever kiss me?",
                "vietsub": "Vì sao anh lại không một lần hôn em?",
                "blanks": [
                    "Why",
                    "would"
                ]
            },
            {
                "index": 20,
                "start": 133.5,
                "end": 138.8,
                "text": "I'm not even half as pretty",
                "vietsub": "Bởi em đâu xinh đẹp bằng một góc của cô ấy.",
                "blanks": [
                    "not",
                    "even"
                ]
            },
            {
                "index": 21,
                "start": 138.8,
                "end": 144.3,
                "text": "You gave her your sweater, it's just polyester",
                "vietsub": "Anh trao cô ấy chiếc áo của mình, dẫu chỉ là vải polyester đơn sơ.",
                "blanks": [
                    "You",
                    "gave",
                    "her"
                ]
            },
            {
                "index": 22,
                "start": 144.3,
                "end": 147,
                "text": "But you like her better",
                "vietsub": "Thế nhưng anh lại yêu cô ấy nhiều hơn.",
                "blanks": [
                    "But",
                    "you"
                ]
            },
            {
                "index": 23,
                "start": 147,
                "end": 152.5,
                "text": "I wish I were Heather",
                "vietsub": "Ước gì em được là Heather.",
                "blanks": [
                    "wish"
                ]
            },
            {
                "index": 24,
                "start": 152.5,
                "end": 158.9,
                "text": "(Oh), I wish I were Heather",
                "vietsub": "(Ôi...), Ước chi em là Heather.",
                "blanks": [
                    "wish"
                ]
            },
            {
                "index": 25,
                "start": 158.9,
                "end": 164.1,
                "text": "(Oh, oh)",
                "vietsub": "(Ôi...)",
                "blanks": []
            },
            {
                "index": 26,
                "start": 167.9,
                "end": 175.5,
                "text": "Wish I were Heather, Why would you ever kiss me?",
                "vietsub": "Ước gì em được là Heather, Cớ sao anh chẳng hề yêu em?",
                "blanks": [
                    "Wish",
                    "Why",
                    "would"
                ]
            },
            {
                "index": 27,
                "start": 175.5,
                "end": 180.7,
                "text": "I'm not even half as pretty",
                "vietsub": "Em đâu thể nào rạng ngời như cô ấy.",
                "blanks": [
                    "not",
                    "even"
                ]
            },
            {
                "index": 28,
                "start": 180.7,
                "end": 186.1,
                "text": "You gave her your sweater, it's just polyester",
                "vietsub": "Anh trao cô ấy áo len của anh, dẫu chỉ là sợi vải tầm thường.",
                "blanks": [
                    "You",
                    "gave",
                    "her"
                ]
            },
            {
                "index": 29,
                "start": 186.1,
                "end": 193.3,
                "text": "But you like her better, Wish I were-",
                "vietsub": "Nhưng trong mắt anh, cô ấy là tất cả, Ước gì em là Heather...",
                "blanks": [
                    "But",
                    "you",
                    "Wish"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "remember",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "december",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "sweater",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "looked",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "better",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "brighter",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 102
    },
    {
        "id": "until-i-found-you",
        "title": "Until I Found You",
        "artist": "Stephen Sanchez",
        "youtubeId": "GxldQ9eX2wo",
        "thumbnail": "https://img.youtube.com/vi/GxldQ9eX2wo/hqdefault.jpg",
        "level": "A2",
        "genre": "Retro Ballad",
        "accent": "Mỹ (US)",
        "description": "Giai điệu hoài niệm phong cách thập niên 60s, phát âm tròn vành rõ chữ rất dễ nghe.",
        "lines": [
            {
                "index": 1,
                "start": 10.4,
                "end": 16.7,
                "text": "Georgia, wrap me up in all your-",
                "vietsub": "Georgia ơi, hãy ôm trọn lấy anh trong vòng tay em...",
                "blanks": [
                    "Georgia",
                    "wrap"
                ]
            },
            {
                "index": 2,
                "start": 16.7,
                "end": 22.1,
                "text": "I want you in my arms",
                "vietsub": "Anh muốn có em trong vòng tay này.",
                "blanks": [
                    "want"
                ]
            },
            {
                "index": 3,
                "start": 22.1,
                "end": 27.6,
                "text": "Oh, let me hold you",
                "vietsub": "Ôi, xin hãy để anh được ôm lấy em.",
                "blanks": [
                    "let"
                ]
            },
            {
                "index": 4,
                "start": 27.6,
                "end": 33.3,
                "text": "I'll never let you go again like I did",
                "vietsub": "Anh sẽ không bao giờ để lạc mất em thêm một lần nào nữa.",
                "blanks": [
                    "Ill",
                    "never",
                    "let"
                ]
            },
            {
                "index": 5,
                "start": 33.3,
                "end": 37.2,
                "text": "Oh, I used to say",
                "vietsub": "Ôi, anh đã từng tự nhủ với lòng...",
                "blanks": [
                    "used"
                ]
            },
            {
                "index": 6,
                "start": 37.2,
                "end": 44.3,
                "text": "\"I would never fall in love again until I found her\"",
                "vietsub": "\"Rằng anh sẽ chẳng bao giờ yêu ai thêm lần nào nữa cho đến khi gặp được nàng\"",
                "blanks": [
                    "would",
                    "never",
                    "fall"
                ]
            },
            {
                "index": 7,
                "start": 44.3,
                "end": 51.1,
                "text": "I said, \"I would never fall unless it's you I fall into\"",
                "vietsub": "Anh đã nói: \"Anh sẽ chẳng trao tim mình trừ khi người đó chính là em\"",
                "blanks": [
                    "said",
                    "would",
                    "never"
                ]
            },
            {
                "index": 8,
                "start": 51.1,
                "end": 58.2,
                "text": "I was lost within the darkness, but then I found her",
                "vietsub": "Anh từng lạc lối giữa màn đêm tăm tối, nhưng rồi anh đã tìm thấy nàng.",
                "blanks": [
                    "was",
                    "lost",
                    "within"
                ]
            },
            {
                "index": 9,
                "start": 58.2,
                "end": 64.9,
                "text": "I found you",
                "vietsub": "Anh đã tìm thấy em.",
                "blanks": [
                    "found"
                ]
            },
            {
                "index": 10,
                "start": 67.8,
                "end": 72,
                "text": "Georgia, pulled me in",
                "vietsub": "Georgia đã kéo anh lại gần bên em.",
                "blanks": [
                    "Georgia"
                ]
            },
            {
                "index": 11,
                "start": 72,
                "end": 79.1,
                "text": "I asked to love her once again",
                "vietsub": "Anh lại khát khao được yêu em thêm một lần nữa.",
                "blanks": [
                    "asked",
                    "love"
                ]
            },
            {
                "index": 12,
                "start": 79.1,
                "end": 84.7,
                "text": "You fell, I caught you",
                "vietsub": "Khi em ngã xuống, anh đã kịp dang tay đỡ lấy em.",
                "blanks": [
                    "You",
                    "fell"
                ]
            },
            {
                "index": 13,
                "start": 84.7,
                "end": 90.3,
                "text": "I'll never let you go again like I did",
                "vietsub": "Anh thề sẽ không bao giờ để mất em như những lỗi lầm xưa cũ.",
                "blanks": [
                    "Ill",
                    "never",
                    "let"
                ]
            },
            {
                "index": 14,
                "start": 90.3,
                "end": 94,
                "text": "Oh, I used to say",
                "vietsub": "Ôi, anh từng nói với chính mình...",
                "blanks": [
                    "used"
                ]
            },
            {
                "index": 15,
                "start": 94,
                "end": 101.2,
                "text": "\"I would never fall in love again until I found her\"",
                "vietsub": "\"Rằng anh sẽ không bao giờ mở lòng yêu ai cho tới khi tìm thấy nàng\"",
                "blanks": [
                    "would",
                    "never",
                    "fall"
                ]
            },
            {
                "index": 16,
                "start": 101.2,
                "end": 108.3,
                "text": "I said, \"I would never fall unless it's you I fall into\"",
                "vietsub": "Anh đã bảo: \"Anh sẽ chẳng rung động trước bất kỳ ai ngoài em\"",
                "blanks": [
                    "said",
                    "would",
                    "never"
                ]
            },
            {
                "index": 17,
                "start": 108.3,
                "end": 115,
                "text": "I was lost within the darkness, but then I found her",
                "vietsub": "Anh từng chìm đắm trong bóng tối, nhưng rồi anh đã gặp được nàng.",
                "blanks": [
                    "was",
                    "lost",
                    "within"
                ]
            },
            {
                "index": 18,
                "start": 115,
                "end": 123.6,
                "text": "I found you",
                "vietsub": "Anh đã tìm thấy em.",
                "blanks": [
                    "found"
                ]
            },
            {
                "index": 19,
                "start": 136.8,
                "end": 143.9,
                "text": "I would never fall in love again until I found her",
                "vietsub": "Anh sẽ không bao giờ yêu thêm ai cho đến khi anh tìm thấy em.",
                "blanks": [
                    "would",
                    "never",
                    "fall"
                ]
            },
            {
                "index": 20,
                "start": 143.9,
                "end": 151.1,
                "text": "I said, \"I would never fall unless it's you I fall into\"",
                "vietsub": "Trái tim anh chỉ thuộc về duy nhất một mình em mà thôi.",
                "blanks": [
                    "said",
                    "would",
                    "never"
                ]
            },
            {
                "index": 21,
                "start": 151.1,
                "end": 158,
                "text": "I was lost within the darkness, but then I found her",
                "vietsub": "Màn đêm tăm tối đã tan biến kể từ ngày anh gặp được em.",
                "blanks": [
                    "was",
                    "lost",
                    "within"
                ]
            },
            {
                "index": 22,
                "start": 158,
                "end": 162.5,
                "text": "I found you",
                "vietsub": "Anh đã tìm thấy em rồi.",
                "blanks": [
                    "found"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "georgia",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "unless",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "within",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "darkness",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "pulled",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "caught",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 100
    },
    {
        "id": "perfect-ed-sheeran",
        "title": "Perfect",
        "artist": "Ed Sheeran",
        "youtubeId": "2Vv-BfVoq4g",
        "thumbnail": "https://img.youtube.com/vi/2Vv-BfVoq4g/hqdefault.jpg",
        "level": "A2",
        "genre": "Romantic Pop",
        "accent": "Anh (UK)",
        "description": "Tuyệt phẩm lãng mạn kinh điển của Ed Sheeran, thích hợp luyện nối âm và ngữ điệu chuẩn Anh-Anh.",
        "lines": [
            {
                "index": 1,
                "start": 3,
                "end": 10.4,
                "text": "I found a love, for me",
                "vietsub": "Anh đã tìm thấy một tình yêu đích thực dành riêng cho mình.",
                "blanks": [
                    "found"
                ]
            },
            {
                "index": 2,
                "start": 10.4,
                "end": 17.7,
                "text": "Darling, just dive right in and follow my lead",
                "vietsub": "Em hỡi, hãy cứ mở lòng và đi theo tiếng gọi của con tim.",
                "blanks": [
                    "Darling",
                    "just",
                    "dive"
                ]
            },
            {
                "index": 3,
                "start": 17.7,
                "end": 25.4,
                "text": "Well, I found a girl, beautiful and sweet",
                "vietsub": "Hãy nghe theo sự dẫn lối của anh.",
                "blanks": [
                    "Well",
                    "found",
                    "girl"
                ]
            },
            {
                "index": 4,
                "start": 25.4,
                "end": 31.9,
                "text": "Oh, I never knew you were the someone waiting for me",
                "vietsub": "Anh đã tìm thấy một cô gái, xinh đẹp và ngọt ngào biết bao.",
                "blanks": [
                    "never",
                    "knew",
                    "you"
                ]
            },
            {
                "index": 5,
                "start": 31.9,
                "end": 36.8,
                "text": "'Cause we were just kids when we fell in love",
                "vietsub": "Anh chưa từng nghĩ rằng em chính là người bấy lâu nay anh tìm kiếm.",
                "blanks": [
                    "Cause",
                    "were",
                    "just"
                ]
            },
            {
                "index": 6,
                "start": 36.8,
                "end": 40.7,
                "text": "Not knowing what it was",
                "vietsub": "Bởi vì thuở ấy chúng mình chỉ là những đứa trẻ ngây thơ chưa hiểu chữ tình.",
                "blanks": [
                    "Not",
                    "knowing"
                ]
            },
            {
                "index": 7,
                "start": 40.7,
                "end": 48.1,
                "text": "I will not give you up this time",
                "vietsub": "Chẳng hề hay biết tình yêu thực sự là gì.",
                "blanks": [
                    "will",
                    "not",
                    "give"
                ]
            },
            {
                "index": 8,
                "start": 48.1,
                "end": 51.9,
                "text": "But darling, just kiss me slow",
                "vietsub": "Giờ đây anh sẽ không bao giờ buông tay em đâu.",
                "blanks": [
                    "But",
                    "darling"
                ]
            },
            {
                "index": 9,
                "start": 51.9,
                "end": 55.8,
                "text": "Your heart is all I own",
                "vietsub": "Em yêu ơi, hãy cứ trao anh nụ hôn chậm rãi.",
                "blanks": [
                    "Your",
                    "heart"
                ]
            },
            {
                "index": 10,
                "start": 55.8,
                "end": 62.4,
                "text": "And in your eyes, you're holding mine",
                "vietsub": "Trái tim em là tất cả những gì anh gìn giữ.",
                "blanks": [
                    "And",
                    "your",
                    "eyes"
                ]
            },
            {
                "index": 11,
                "start": 62.4,
                "end": 69.8,
                "text": "Baby, I'm dancing in the dark",
                "vietsub": "Và trong ánh mắt em, em cũng đang nắm giữ trái tim anh.",
                "blanks": [
                    "Baby",
                    "dancing"
                ]
            },
            {
                "index": 12,
                "start": 69.8,
                "end": 73.8,
                "text": "With you between my arms",
                "vietsub": "Với em giữa vòng tay anh",
                "blanks": [
                    "With",
                    "you"
                ]
            },
            {
                "index": 13,
                "start": 73.8,
                "end": 80.5,
                "text": "Barefoot on the grass, Listening to our favourite song",
                "vietsub": "Chân trần trên cỏ, Nghe bài hát yêu thích của chúng tôi",
                "blanks": [
                    "Barefoot",
                    "Listening",
                    "our"
                ]
            },
            {
                "index": 14,
                "start": 80.5,
                "end": 84.2,
                "text": "When you said you looked a mess",
                "vietsub": "Khi bạn nói bạn trông thật bừa bộn",
                "blanks": [
                    "When",
                    "you",
                    "said"
                ]
            },
            {
                "index": 15,
                "start": 84.2,
                "end": 87.8,
                "text": "I whispered underneath my breath",
                "vietsub": "Tôi thì thầm bên dưới hơi thở của mình",
                "blanks": [
                    "whispered"
                ]
            },
            {
                "index": 16,
                "start": 87.8,
                "end": 90.5,
                "text": "But you heard it",
                "vietsub": "Cô đã nghe thấy nó.",
                "blanks": [
                    "But"
                ]
            },
            {
                "index": 17,
                "start": 90.5,
                "end": 101.1,
                "text": "Darling, you look perfect tonight",
                "vietsub": "Em yêu, đêm nay em trông thật hoàn hảo",
                "blanks": [
                    "Darling",
                    "you"
                ]
            },
            {
                "index": 18,
                "start": 101.1,
                "end": 108.8,
                "text": "Well, I found a woman, stronger than anyone I know",
                "vietsub": "Chà, tôi đã tìm thấy một người phụ nữ, mạnh mẽ hơn bất kỳ ai tôi biết",
                "blanks": [
                    "Well",
                    "found",
                    "woman"
                ]
            },
            {
                "index": 19,
                "start": 108.8,
                "end": 116.6,
                "text": "She shares my dreams, I hope that someday I'll share her home",
                "vietsub": "Cô ấy chia sẻ ước mơ của tôi, tôi hy vọng rằng một ngày nào đó tôi sẽ chia sẻ nhà của cô ấy",
                "blanks": [
                    "She",
                    "shares",
                    "dreams"
                ]
            },
            {
                "index": 20,
                "start": 116.6,
                "end": 124.5,
                "text": "I found a lover, to carry more than just my secrets",
                "vietsub": "Tôi đã tìm thấy một người yêu, để mang theo nhiều hơn là chỉ những bí mật của tôi",
                "blanks": [
                    "found",
                    "lover",
                    "carry"
                ]
            },
            {
                "index": 21,
                "start": 124.5,
                "end": 130.6,
                "text": "To carry love, to carry children of our own",
                "vietsub": "Để mang theo tình yêu, để mang theo những đứa con của chính chúng ta",
                "blanks": [
                    "carry",
                    "love",
                    "carry"
                ]
            },
            {
                "index": 22,
                "start": 130.6,
                "end": 135.3,
                "text": "We are still kids, but we're so in love",
                "vietsub": "Chúng tôi vẫn là những đứa trẻ, nhưng chúng tôi rất yêu nhau",
                "blanks": [
                    "are",
                    "still",
                    "kids"
                ]
            },
            {
                "index": 23,
                "start": 135.3,
                "end": 139.3,
                "text": "Fighting against all odds",
                "vietsub": "Chiến đấu chống lại tất cả các tỷ lệ cược",
                "blanks": [
                    "Fighting",
                    "against"
                ]
            },
            {
                "index": 24,
                "start": 139.3,
                "end": 146.8,
                "text": "I know we'll be alright this time",
                "vietsub": "Tôi biết lần này chúng ta sẽ không sao",
                "blanks": [
                    "know",
                    "well"
                ]
            },
            {
                "index": 25,
                "start": 146.8,
                "end": 150.3,
                "text": "Darling, just hold my hand",
                "vietsub": "Em yêu, chỉ cần nắm tay anh",
                "blanks": [
                    "Darling",
                    "just"
                ]
            },
            {
                "index": 26,
                "start": 150.3,
                "end": 154.4,
                "text": "Be my girl, I'll be your man",
                "vietsub": "Hãy là cô gái của anh, anh sẽ là người đàn ông của em",
                "blanks": [
                    "girl",
                    "Ill"
                ]
            },
            {
                "index": 27,
                "start": 154.4,
                "end": 161,
                "text": "I see my future in your eyes",
                "vietsub": "Tôi đang khen anh đó.",
                "blanks": [
                    "see",
                    "future"
                ]
            },
            {
                "index": 28,
                "start": 161,
                "end": 168.3,
                "text": "Baby, I'm dancing in the dark",
                "vietsub": "Em yêu, anh đang khiêu vũ trong bóng tối",
                "blanks": [
                    "Baby",
                    "dancing"
                ]
            },
            {
                "index": 29,
                "start": 168.3,
                "end": 172.3,
                "text": "With you between my arms",
                "vietsub": "Với em giữa vòng tay anh",
                "blanks": [
                    "With",
                    "you"
                ]
            },
            {
                "index": 30,
                "start": 172.3,
                "end": 179.2,
                "text": "Barefoot on the grass, Listening to our favorite song",
                "vietsub": "Chân trần trên cỏ, Nghe bài hát yêu thích của chúng tôi",
                "blanks": [
                    "Barefoot",
                    "Listening",
                    "our"
                ]
            },
            {
                "index": 31,
                "start": 179.2,
                "end": 185.3,
                "text": "When I saw you in that dress, looking so beautiful",
                "vietsub": "Khi tôi nhìn thấy bạn mặc chiếc váy đó, trông thật xinh đẹp",
                "blanks": [
                    "When",
                    "saw",
                    "you"
                ]
            },
            {
                "index": 32,
                "start": 185.3,
                "end": 189.1,
                "text": "I don't deserve this",
                "vietsub": "Anh không đáng bị thế này.",
                "blanks": [
                    "dont"
                ]
            },
            {
                "index": 33,
                "start": 189.1,
                "end": 199.5,
                "text": "Darling, you look perfect tonight",
                "vietsub": "Em yêu, đêm nay em trông thật hoàn hảo",
                "blanks": [
                    "Darling",
                    "you"
                ]
            },
            {
                "index": 34,
                "start": 199.5,
                "end": 206.3,
                "text": "(No, no, no)",
                "vietsub": "Không Không Không",
                "blanks": []
            },
            {
                "index": 35,
                "start": 206.3,
                "end": 213.6,
                "text": "Baby, I'm dancing in the dark",
                "vietsub": "Em yêu, anh đang khiêu vũ trong bóng tối",
                "blanks": [
                    "Baby",
                    "dancing"
                ]
            },
            {
                "index": 36,
                "start": 213.6,
                "end": 217.7,
                "text": "With you between my arms",
                "vietsub": "Với em giữa vòng tay anh",
                "blanks": [
                    "With",
                    "you"
                ]
            },
            {
                "index": 37,
                "start": 217.7,
                "end": 224.7,
                "text": "Barefoot on the grass, Listening to our favorite song",
                "vietsub": "Chân trần trên cỏ, Nghe bài hát yêu thích của chúng tôi",
                "blanks": [
                    "Barefoot",
                    "Listening",
                    "our"
                ]
            },
            {
                "index": 38,
                "start": 224.7,
                "end": 228.5,
                "text": "I have faith in what I see",
                "vietsub": "Tôi có niềm tin vào những gì tôi nhìn thấy",
                "blanks": [
                    "have",
                    "faith"
                ]
            },
            {
                "index": 39,
                "start": 228.5,
                "end": 234.5,
                "text": "Now I know I have met an angel in person",
                "vietsub": "Bây giờ tôi biết tôi đã gặp một thiên thần trực tiếp",
                "blanks": [
                    "Now",
                    "know",
                    "have"
                ]
            },
            {
                "index": 40,
                "start": 234.5,
                "end": 242.4,
                "text": "And she looks perfect, I don't deserve this",
                "vietsub": "Và cô ấy trông thật hoàn hảo, Anh không đáng bị thế này.",
                "blanks": [
                    "And",
                    "she",
                    "dont"
                ]
            },
            {
                "index": 41,
                "start": 242.4,
                "end": 246.9,
                "text": "You look perfect tonight",
                "vietsub": "Tối nay bạn trông thật hoàn hảo",
                "blanks": [
                    "You",
                    "look"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "darling",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "follow",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "beautiful",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "someone",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "waiting",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "knowing",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 95
    },
    {
        "id": "counting-stars-onerepublic",
        "title": "Counting Stars",
        "artist": "OneRepublic",
        "youtubeId": "hT_nvWreIhg",
        "thumbnail": "https://img.youtube.com/vi/hT_nvWreIhg/hqdefault.jpg",
        "level": "B2",
        "genre": "Pop Rock",
        "accent": "Mỹ (US)",
        "description": "Giai điệu dồn dập bắt tai, thử thách phản xạ gõ phím tốc độ cao và nhận diện âm tiết lướt.",
        "lines": [
            {
                "index": 1,
                "start": 0,
                "end": 5,
                "text": "Lately, I been, I been losin' sleep",
                "vietsub": "Giai điệu: \"Lately, I been, I been losin' sleep\"",
                "blanks": [
                    "Lately",
                    "been"
                ]
            },
            {
                "index": 2,
                "start": 5,
                "end": 9.2,
                "text": "Dreamin' about the things that we could be",
                "vietsub": "Giai điệu: \"Dreamin' about the things that we could be\"",
                "blanks": [
                    "Dreamin",
                    "about",
                    "the"
                ]
            },
            {
                "index": 3,
                "start": 9.2,
                "end": 13.9,
                "text": "But, baby, I been, I been prayin' hard",
                "vietsub": "Giai điệu: \"But, baby, I been, I been prayin' hard\"",
                "blanks": [
                    "But",
                    "baby",
                    "been"
                ]
            },
            {
                "index": 4,
                "start": 13.9,
                "end": 19.3,
                "text": "Said, no more countin' dollars, we'll be countin' stars",
                "vietsub": "Giai điệu: \"Said, no more countin' dollars, we'll be countin' stars\"",
                "blanks": [
                    "Said",
                    "more",
                    "countin"
                ]
            },
            {
                "index": 5,
                "start": 19.3,
                "end": 23.9,
                "text": "Yeah, we'll be countin' stars",
                "vietsub": "Giai điệu: \"Yeah, we'll be countin' stars\"",
                "blanks": [
                    "Yeah",
                    "well"
                ]
            },
            {
                "index": 6,
                "start": 37.6,
                "end": 42.6,
                "text": "I see this life like a swingin' vine, Swing my heart across the line",
                "vietsub": "Giai điệu: \"I see this life like a swingin' vine\", Giai điệu: \"Swing my heart across the line\"",
                "blanks": [
                    "see",
                    "this",
                    "life",
                    "Swing"
                ]
            },
            {
                "index": 7,
                "start": 42.6,
                "end": 46.4,
                "text": "In my face is flashin' signs, Seek it out and ye shall find",
                "vietsub": "Giai điệu: \"In my face is flashin' signs\", Giai điệu: \"Seek it out and ye shall find\"",
                "blanks": [
                    "face",
                    "Seek",
                    "out"
                ]
            },
            {
                "index": 8,
                "start": 46.4,
                "end": 50.3,
                "text": "Old, but I'm not that old, Young, but I'm not that bold",
                "vietsub": "Giai điệu: \"Old, but I'm not that old\", Giai điệu: \"Young, but I'm not that bold\"",
                "blanks": [
                    "Old",
                    "but",
                    "Young"
                ]
            },
            {
                "index": 9,
                "start": 50.3,
                "end": 54.5,
                "text": "And I don't think the world is sold, On just doin' what we're told",
                "vietsub": "Giai điệu: \"And I don't think the world is sold\", Giai điệu: \"On just doin' what we're told\"",
                "blanks": [
                    "And",
                    "dont",
                    "think",
                    "just"
                ]
            },
            {
                "index": 10,
                "start": 54.5,
                "end": 62.1,
                "text": "I feel somethin' so right doin' the wrong thing",
                "vietsub": "Giai điệu: \"I feel somethin' so right doin' the wrong thing\"",
                "blanks": [
                    "feel",
                    "somethin",
                    "right"
                ]
            },
            {
                "index": 11,
                "start": 62.1,
                "end": 70.3,
                "text": "And I feel somethin' so wrong doin' the right thing",
                "vietsub": "Giai điệu: \"And I feel somethin' so wrong doin' the right thing\"",
                "blanks": [
                    "And",
                    "feel",
                    "somethin"
                ]
            },
            {
                "index": 12,
                "start": 70.3,
                "end": 74,
                "text": "I couldn't lie, couldn't lie, couldn't lie",
                "vietsub": "Giai điệu: \"I couldn't lie, couldn't lie, couldn't lie\"",
                "blanks": [
                    "couldnt",
                    "lie",
                    "couldnt"
                ]
            },
            {
                "index": 13,
                "start": 74,
                "end": 77.9,
                "text": "Everything that kills me makes me feel alive",
                "vietsub": "Giai điệu: \"Everything that kills me makes me feel alive\"",
                "blanks": [
                    "Everything",
                    "that",
                    "kills"
                ]
            },
            {
                "index": 14,
                "start": 77.9,
                "end": 82,
                "text": "Lately, I been, I been losin' sleep (hey!)",
                "vietsub": "Giai điệu: \"Lately, I been, I been losin' sleep (hey!)\"",
                "blanks": [
                    "Lately",
                    "been",
                    "been"
                ]
            },
            {
                "index": 15,
                "start": 82,
                "end": 85.3,
                "text": "Dreamin' about the things that we could be",
                "vietsub": "Giai điệu: \"Dreamin' about the things that we could be\"",
                "blanks": [
                    "Dreamin",
                    "about",
                    "the"
                ]
            },
            {
                "index": 16,
                "start": 85.3,
                "end": 89.4,
                "text": "But, baby, I been, I been prayin' hard (hey!)",
                "vietsub": "Giai điệu: \"But, baby, I been, I been prayin' hard (hey!)\"",
                "blanks": [
                    "But",
                    "baby",
                    "been"
                ]
            },
            {
                "index": 17,
                "start": 89.4,
                "end": 93.6,
                "text": "Said, no more countin' dollars, we'll be countin' stars",
                "vietsub": "Giai điệu: \"Said, no more countin' dollars, we'll be countin' stars\"",
                "blanks": [
                    "Said",
                    "more",
                    "countin"
                ]
            },
            {
                "index": 18,
                "start": 93.6,
                "end": 97.6,
                "text": "Lately, I been, I been losin' sleep (hey!)",
                "vietsub": "Giai điệu: \"Lately, I been, I been losin' sleep (hey!)\"",
                "blanks": [
                    "Lately",
                    "been",
                    "been"
                ]
            },
            {
                "index": 19,
                "start": 97.6,
                "end": 101.1,
                "text": "Dreamin' about the things that we could be",
                "vietsub": "Giai điệu: \"Dreamin' about the things that we could be\"",
                "blanks": [
                    "Dreamin",
                    "about",
                    "the"
                ]
            },
            {
                "index": 20,
                "start": 101.1,
                "end": 105.6,
                "text": "But, baby, I been, I been prayin' hard",
                "vietsub": "Giai điệu: \"But, baby, I been, I been prayin' hard\"",
                "blanks": [
                    "But",
                    "baby",
                    "been"
                ]
            },
            {
                "index": 21,
                "start": 105.6,
                "end": 111.8,
                "text": "Said, no more countin' dollars, we'll be, we'll be countin' stars, yeah",
                "vietsub": "Giai điệu: \"Said, no more countin' dollars, we'll be, we'll be countin' stars, yeah\"",
                "blanks": [
                    "Said",
                    "more",
                    "countin"
                ]
            },
            {
                "index": 22,
                "start": 116.6,
                "end": 121.2,
                "text": "I feel your love, and I feel it burn, Down this river, every turn",
                "vietsub": "Giai điệu: \"I feel your love, and I feel it burn\", Giai điệu: \"Down this river, every turn\"",
                "blanks": [
                    "feel",
                    "your",
                    "love",
                    "Down"
                ]
            },
            {
                "index": 23,
                "start": 121.2,
                "end": 125.2,
                "text": "\"Hope\" is our four-letter word, Make that money, watch it burn",
                "vietsub": "Giai điệu: \"\"Hope\" is our four-letter word\", Giai điệu: \"Make that money, watch it burn\"",
                "blanks": [
                    "Hope",
                    "our",
                    "Make",
                    "that"
                ]
            },
            {
                "index": 24,
                "start": 125.2,
                "end": 129,
                "text": "Old, but I'm not that old, Young, but I'm not that bold",
                "vietsub": "Giai điệu: \"Old, but I'm not that old\", Giai điệu: \"Young, but I'm not that bold\"",
                "blanks": [
                    "Old",
                    "but",
                    "Young"
                ]
            },
            {
                "index": 25,
                "start": 129,
                "end": 133,
                "text": "And I don't think the world is sold, On just doin' what we're told",
                "vietsub": "Giai điệu: \"And I don't think the world is sold\", Giai điệu: \"On just doin' what we're told\"",
                "blanks": [
                    "And",
                    "dont",
                    "think",
                    "just"
                ]
            },
            {
                "index": 26,
                "start": 133,
                "end": 140.9,
                "text": "And I feel somethin' so wrong doin' the right thing",
                "vietsub": "Giai điệu: \"And I feel somethin' so wrong doin' the right thing\"",
                "blanks": [
                    "And",
                    "feel",
                    "somethin"
                ]
            },
            {
                "index": 27,
                "start": 140.9,
                "end": 144.9,
                "text": "I couldn't lie, couldn't lie, couldn't lie",
                "vietsub": "Giai điệu: \"I couldn't lie, couldn't lie, couldn't lie\"",
                "blanks": [
                    "couldnt",
                    "lie",
                    "couldnt"
                ]
            },
            {
                "index": 28,
                "start": 144.9,
                "end": 148.6,
                "text": "Everything that drowns me makes me wanna fly",
                "vietsub": "Giai điệu: \"Everything that drowns me makes me wanna fly\"",
                "blanks": [
                    "Everything",
                    "that",
                    "drowns"
                ]
            },
            {
                "index": 29,
                "start": 148.6,
                "end": 152.7,
                "text": "Lately, I been, I been losin' sleep (hey!)",
                "vietsub": "Giai điệu: \"Lately, I been, I been losin' sleep (hey!)\"",
                "blanks": [
                    "Lately",
                    "been",
                    "been"
                ]
            },
            {
                "index": 30,
                "start": 152.7,
                "end": 156.1,
                "text": "Dreamin' about the things that we could be",
                "vietsub": "Giai điệu: \"Dreamin' about the things that we could be\"",
                "blanks": [
                    "Dreamin",
                    "about",
                    "the"
                ]
            },
            {
                "index": 31,
                "start": 156.1,
                "end": 160.4,
                "text": "But, baby, I been, I been prayin' hard (hey!)",
                "vietsub": "Giai điệu: \"But, baby, I been, I been prayin' hard (hey!)\"",
                "blanks": [
                    "But",
                    "baby",
                    "been"
                ]
            },
            {
                "index": 32,
                "start": 160.4,
                "end": 164.3,
                "text": "Said, no more countin' dollars, we'll be countin' stars (ooh)",
                "vietsub": "Giai điệu: \"Said, no more countin' dollars, we'll be countin' stars (ooh)\"",
                "blanks": [
                    "Said",
                    "more",
                    "countin"
                ]
            },
            {
                "index": 33,
                "start": 164.3,
                "end": 168.6,
                "text": "Lately, I been, I been losin' sleep (ooh, ooh, hey)",
                "vietsub": "Giai điệu: \"Lately, I been, I been losin' sleep (ooh, ooh, hey)\"",
                "blanks": [
                    "Lately",
                    "been",
                    "been"
                ]
            },
            {
                "index": 34,
                "start": 168.6,
                "end": 171.9,
                "text": "Dreamin' about the things that we could be (ooh, ooh)",
                "vietsub": "Giai điệu: \"Dreamin' about the things that we could be (ooh, ooh)\"",
                "blanks": [
                    "Dreamin",
                    "about",
                    "the"
                ]
            },
            {
                "index": 35,
                "start": 171.9,
                "end": 176.5,
                "text": "But, baby, I been, I been prayin' hard (ooh, ooh)",
                "vietsub": "Giai điệu: \"But, baby, I been, I been prayin' hard (ooh, ooh)\"",
                "blanks": [
                    "But",
                    "baby",
                    "been"
                ]
            },
            {
                "index": 36,
                "start": 176.5,
                "end": 182.9,
                "text": "Said, no more countin' dollars, we'll be, we'll be countin' stars (ooh, ooh)",
                "vietsub": "Giai điệu: \"Said, no more countin' dollars, we'll be, we'll be countin' stars (ooh, ooh)\"",
                "blanks": [
                    "Said",
                    "more",
                    "countin"
                ]
            },
            {
                "index": 37,
                "start": 182.9,
                "end": 186.2,
                "text": "Oh, take that money, watch it burn",
                "vietsub": "Giai điệu: \"Oh, take that money, watch it burn\"",
                "blanks": [
                    "take",
                    "that"
                ]
            },
            {
                "index": 38,
                "start": 186.2,
                "end": 190,
                "text": "Sink in the river the lessons I learned, Take that money, watch it burn",
                "vietsub": "Giai điệu: \"Sink in the river the lessons I learned\", Giai điệu: \"Take that money, watch it burn\"",
                "blanks": [
                    "Sink",
                    "the",
                    "river",
                    "Take"
                ]
            },
            {
                "index": 39,
                "start": 190,
                "end": 193.7,
                "text": "Sink in the river the lessons I learned, Take that money, watch it burn",
                "vietsub": "Giai điệu: \"Sink in the river the lessons I learned\", Giai điệu: \"Take that money, watch it burn\"",
                "blanks": [
                    "Sink",
                    "the",
                    "river",
                    "Take"
                ]
            },
            {
                "index": 40,
                "start": 193.7,
                "end": 197.8,
                "text": "Sink in the river the lessons I learned, Take that money, watch it burn",
                "vietsub": "Giai điệu: \"Sink in the river the lessons I learned\", Giai điệu: \"Take that money, watch it burn\"",
                "blanks": [
                    "Sink",
                    "the",
                    "river",
                    "Take"
                ]
            },
            {
                "index": 41,
                "start": 197.8,
                "end": 200,
                "text": "Sink in the river the lessons I learned",
                "vietsub": "Giai điệu: \"Sink in the river the lessons I learned\"",
                "blanks": [
                    "Sink",
                    "the",
                    "river"
                ]
            },
            {
                "index": 42,
                "start": 200,
                "end": 206.8,
                "text": "Everything that kills me makes me feel alive",
                "vietsub": "Giai điệu: \"Everything that kills me makes me feel alive\"",
                "blanks": [
                    "Everything",
                    "that",
                    "kills"
                ]
            },
            {
                "index": 43,
                "start": 206.8,
                "end": 210.6,
                "text": "Lately, I been, I been losin' sleep (hey!)",
                "vietsub": "Giai điệu: \"Lately, I been, I been losin' sleep (hey!)\"",
                "blanks": [
                    "Lately",
                    "been",
                    "been"
                ]
            },
            {
                "index": 44,
                "start": 210.6,
                "end": 214.4,
                "text": "Dreamin' about the things that we could be",
                "vietsub": "Giai điệu: \"Dreamin' about the things that we could be\"",
                "blanks": [
                    "Dreamin",
                    "about",
                    "the"
                ]
            },
            {
                "index": 45,
                "start": 214.4,
                "end": 218.5,
                "text": "But, baby, I been, I been prayin' hard (hey!)",
                "vietsub": "Giai điệu: \"But, baby, I been, I been prayin' hard (hey!)\"",
                "blanks": [
                    "But",
                    "baby",
                    "been"
                ]
            },
            {
                "index": 46,
                "start": 218.5,
                "end": 222.4,
                "text": "Said, no more countin' dollars, we'll be countin' stars (ooh)",
                "vietsub": "Giai điệu: \"Said, no more countin' dollars, we'll be countin' stars (ooh)\"",
                "blanks": [
                    "Said",
                    "more",
                    "countin"
                ]
            },
            {
                "index": 47,
                "start": 222.4,
                "end": 226.3,
                "text": "Lately, I been, I been losin' sleep (ooh, ooh hey!)",
                "vietsub": "Giai điệu: \"Lately, I been, I been losin' sleep (ooh, ooh hey!)\"",
                "blanks": [
                    "Lately",
                    "been",
                    "been"
                ]
            },
            {
                "index": 48,
                "start": 226.3,
                "end": 230,
                "text": "Dreamin' about the things that we could be (ooh, ooh)",
                "vietsub": "Giai điệu: \"Dreamin' about the things that we could be (ooh, ooh)\"",
                "blanks": [
                    "Dreamin",
                    "about",
                    "the"
                ]
            },
            {
                "index": 49,
                "start": 230,
                "end": 234.6,
                "text": "But, baby, I been, I been prayin' hard (ooh, ooh)",
                "vietsub": "Giai điệu: \"But, baby, I been, I been prayin' hard (ooh, ooh)\"",
                "blanks": [
                    "But",
                    "baby",
                    "been"
                ]
            },
            {
                "index": 50,
                "start": 234.6,
                "end": 238.1,
                "text": "Said, no more countin' dollars, we'll be, we'll be countin' stars (ooh, ooh)",
                "vietsub": "Giai điệu: \"Said, no more countin' dollars, we'll be, we'll be countin' stars (ooh, ooh)\"",
                "blanks": [
                    "Said",
                    "more",
                    "countin"
                ]
            },
            {
                "index": 51,
                "start": 238.1,
                "end": 242.3,
                "text": "Take that money, watch it burn (ooh), Sink in the river, the lessons I learned (ooh)",
                "vietsub": "Giai điệu: \"Take that money, watch it burn (ooh)\", Giai điệu: \"Sink in the river, the lessons I learned (ooh)\"",
                "blanks": [
                    "Take",
                    "that",
                    "money",
                    "Sink"
                ]
            },
            {
                "index": 52,
                "start": 242.3,
                "end": 246,
                "text": "Take that money, watch it burn (ooh), Sink in the river, the lessons I learned (ooh)",
                "vietsub": "Giai điệu: \"Take that money, watch it burn (ooh)\", Giai điệu: \"Sink in the river, the lessons I learned (ooh)\"",
                "blanks": [
                    "Take",
                    "that",
                    "money",
                    "Sink"
                ]
            },
            {
                "index": 53,
                "start": 246,
                "end": 250.2,
                "text": "Take that money, watch it burn (ooh), Sink in the river, the lessons I learned (ooh)",
                "vietsub": "Giai điệu: \"Take that money, watch it burn (ooh)\", Giai điệu: \"Sink in the river, the lessons I learned (ooh)\"",
                "blanks": [
                    "Take",
                    "that",
                    "money",
                    "Sink"
                ]
            },
            {
                "index": 54,
                "start": 250.2,
                "end": 256.3,
                "text": "Take that money, watch it burn (ooh), Sink in the river, the lessons I learned",
                "vietsub": "Giai điệu: \"Take that money, watch it burn (ooh)\", Giai điệu: \"Sink in the river, the lessons I learned\"",
                "blanks": [
                    "Take",
                    "that",
                    "money",
                    "Sink"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "lately",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "dreamin",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "things",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "prayin",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "countin",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "dollars",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 122
    },
    {
        "id": "someone-like-you-adele",
        "title": "Someone Like You",
        "artist": "Adele",
        "youtubeId": "hLQl3WQQoQ0",
        "thumbnail": "https://img.youtube.com/vi/hLQl3WQQoQ0/hqdefault.jpg",
        "level": "B1",
        "genre": "Soul / Piano",
        "accent": "Anh (UK)",
        "description": "Giọng hát nội lực của Adele trên nền piano mộc, rất rõ chữ và giàu cảm xúc.",
        "lines": [
            {
                "index": 1,
                "start": 14.1,
                "end": 21.1,
                "text": "I heard that you're settled down",
                "vietsub": "Giai điệu: \"I heard that you're settled down\"",
                "blanks": [
                    "heard",
                    "that"
                ]
            },
            {
                "index": 2,
                "start": 21.1,
                "end": 29.5,
                "text": "That you found a girl and you're married now",
                "vietsub": "Giai điệu: \"That you found a girl and you're married now\"",
                "blanks": [
                    "That",
                    "you",
                    "found"
                ]
            },
            {
                "index": 3,
                "start": 29.5,
                "end": 35.6,
                "text": "I heard that your dreams came true",
                "vietsub": "Giai điệu: \"I heard that your dreams came true\"",
                "blanks": [
                    "heard",
                    "that",
                    "your"
                ]
            },
            {
                "index": 4,
                "start": 35.6,
                "end": 43.1,
                "text": "Guess she gave you things I didn't give to you",
                "vietsub": "Giai điệu: \"Guess she gave you things I didn't give to you\"",
                "blanks": [
                    "Guess",
                    "she",
                    "gave"
                ]
            },
            {
                "index": 5,
                "start": 43.1,
                "end": 49.5,
                "text": "Old friend, why are you so shy?",
                "vietsub": "Giai điệu: \"Old friend, why are you so shy?\"",
                "blanks": [
                    "Old",
                    "friend",
                    "why"
                ]
            },
            {
                "index": 6,
                "start": 49.5,
                "end": 57.3,
                "text": "Ain't like you to hold back or hide from the light",
                "vietsub": "Giai điệu: \"Ain't like you to hold back or hide from the light\"",
                "blanks": [
                    "Aint",
                    "like",
                    "you"
                ]
            },
            {
                "index": 7,
                "start": 57.3,
                "end": 60.7,
                "text": "I hate to turn up out of the blue, uninvited",
                "vietsub": "Giai điệu: \"I hate to turn up out of the blue, uninvited\"",
                "blanks": [
                    "hate",
                    "turn",
                    "out"
                ]
            },
            {
                "index": 8,
                "start": 60.7,
                "end": 64.3,
                "text": "But I couldn't stay away, I couldn't fight it",
                "vietsub": "Giai điệu: \"But I couldn't stay away, I couldn't fight it\"",
                "blanks": [
                    "But",
                    "couldnt",
                    "stay"
                ]
            },
            {
                "index": 9,
                "start": 64.3,
                "end": 67.8,
                "text": "I had hoped you'd see my face and that you'd be reminded",
                "vietsub": "Giai điệu: \"I had hoped you'd see my face and that you'd be reminded\"",
                "blanks": [
                    "had",
                    "hoped",
                    "youd"
                ]
            },
            {
                "index": 10,
                "start": 67.8,
                "end": 70.6,
                "text": "That, for me, it isn't over",
                "vietsub": "Giai điệu: \"That, for me, it isn't over\"",
                "blanks": [
                    "That",
                    "for"
                ]
            },
            {
                "index": 11,
                "start": 73.8,
                "end": 79.9,
                "text": "Never mind, I'll find someone like you",
                "vietsub": "Giai điệu: \"Never mind, I'll find someone like you\"",
                "blanks": [
                    "Never",
                    "mind",
                    "Ill"
                ]
            },
            {
                "index": 12,
                "start": 79.9,
                "end": 86.9,
                "text": "I wish nothing but the best for you, too",
                "vietsub": "Giai điệu: \"I wish nothing but the best for you, too\"",
                "blanks": [
                    "wish",
                    "nothing",
                    "but"
                ]
            },
            {
                "index": 13,
                "start": 86.9,
                "end": 94,
                "text": "Don't forget me, I beg, I remember you said",
                "vietsub": "Giai điệu: \"Don't forget me, I beg, I remember you said\"",
                "blanks": [
                    "Dont",
                    "forget",
                    "beg"
                ]
            },
            {
                "index": 14,
                "start": 94,
                "end": 101,
                "text": "Sometimes it lasts in love, but sometimes it hurts instead",
                "vietsub": "Giai điệu: \"Sometimes it lasts in love, but sometimes it hurts instead\"",
                "blanks": [
                    "Sometimes",
                    "lasts",
                    "love"
                ]
            },
            {
                "index": 15,
                "start": 101,
                "end": 107.3,
                "text": "Sometimes it lasts in love, but sometimes it hurts instead",
                "vietsub": "Giai điệu: \"Sometimes it lasts in love, but sometimes it hurts instead\"",
                "blanks": [
                    "Sometimes",
                    "lasts",
                    "love"
                ]
            },
            {
                "index": 16,
                "start": 111.7,
                "end": 117.2,
                "text": "You know how the time flies",
                "vietsub": "Giai điệu: \"You know how the time flies\"",
                "blanks": [
                    "You",
                    "know",
                    "how"
                ]
            },
            {
                "index": 17,
                "start": 117.2,
                "end": 124.1,
                "text": "Only yesterday was the time of our lives",
                "vietsub": "Giai điệu: \"Only yesterday was the time of our lives\"",
                "blanks": [
                    "Only",
                    "yesterday",
                    "was"
                ]
            },
            {
                "index": 18,
                "start": 124.1,
                "end": 131.3,
                "text": "We were born and raised in a summer haze",
                "vietsub": "Giai điệu: \"We were born and raised in a summer haze\"",
                "blanks": [
                    "were",
                    "born",
                    "and"
                ]
            },
            {
                "index": 19,
                "start": 131.3,
                "end": 139.1,
                "text": "Bound by the surprise of our glory days",
                "vietsub": "Giai điệu: \"Bound by the surprise of our glory days\"",
                "blanks": [
                    "Bound",
                    "the",
                    "surprise"
                ]
            },
            {
                "index": 20,
                "start": 139.1,
                "end": 142.6,
                "text": "I hate to turn up out of the blue, uninvited",
                "vietsub": "Giai điệu: \"I hate to turn up out of the blue, uninvited\"",
                "blanks": [
                    "hate",
                    "turn",
                    "out"
                ]
            },
            {
                "index": 21,
                "start": 142.6,
                "end": 146.1,
                "text": "But I couldn't stay away, I couldn't fight it",
                "vietsub": "Giai điệu: \"But I couldn't stay away, I couldn't fight it\"",
                "blanks": [
                    "But",
                    "couldnt",
                    "stay"
                ]
            },
            {
                "index": 22,
                "start": 146.1,
                "end": 149.4,
                "text": "I had hoped you'd see my face and that you'd be reminded",
                "vietsub": "Giai điệu: \"I had hoped you'd see my face and that you'd be reminded\"",
                "blanks": [
                    "had",
                    "hoped",
                    "youd"
                ]
            },
            {
                "index": 23,
                "start": 149.4,
                "end": 152.8,
                "text": "That, for me, it isn't over",
                "vietsub": "Giai điệu: \"That, for me, it isn't over\"",
                "blanks": [
                    "That",
                    "for"
                ]
            },
            {
                "index": 24,
                "start": 157.3,
                "end": 163.3,
                "text": "Never mind, I'll find someone like you",
                "vietsub": "Giai điệu: \"Never mind, I'll find someone like you\"",
                "blanks": [
                    "Never",
                    "mind",
                    "Ill"
                ]
            },
            {
                "index": 25,
                "start": 163.3,
                "end": 170.4,
                "text": "I wish nothing but the best for you, too",
                "vietsub": "Giai điệu: \"I wish nothing but the best for you, too\"",
                "blanks": [
                    "wish",
                    "nothing",
                    "but"
                ]
            },
            {
                "index": 26,
                "start": 170.4,
                "end": 177.5,
                "text": "Don't forget me, I beg, I remember you said",
                "vietsub": "Giai điệu: \"Don't forget me, I beg, I remember you said\"",
                "blanks": [
                    "Dont",
                    "forget",
                    "beg"
                ]
            },
            {
                "index": 27,
                "start": 177.5,
                "end": 185.5,
                "text": "Sometimes it lasts in love, but sometimes it hurts instead",
                "vietsub": "Giai điệu: \"Sometimes it lasts in love, but sometimes it hurts instead\"",
                "blanks": [
                    "Sometimes",
                    "lasts",
                    "love"
                ]
            },
            {
                "index": 28,
                "start": 185.5,
                "end": 188.9,
                "text": "Nothing compares, no worries or cares",
                "vietsub": "Giai điệu: \"Nothing compares, no worries or cares\"",
                "blanks": [
                    "Nothing",
                    "compares"
                ]
            },
            {
                "index": 29,
                "start": 188.9,
                "end": 192.7,
                "text": "Regrets and mistakes, they're memories made",
                "vietsub": "Giai điệu: \"Regrets and mistakes, they're memories made\"",
                "blanks": [
                    "Regrets",
                    "and",
                    "mistakes"
                ]
            },
            {
                "index": 30,
                "start": 192.7,
                "end": 204.3,
                "text": "Who would have known how bittersweet this would taste?",
                "vietsub": "Giai điệu: \"Who would have known how bittersweet this would taste?\"",
                "blanks": [
                    "Who",
                    "would",
                    "have"
                ]
            },
            {
                "index": 31,
                "start": 204.3,
                "end": 210.1,
                "text": "Never mind, I'll find someone like you",
                "vietsub": "Giai điệu: \"Never mind, I'll find someone like you\"",
                "blanks": [
                    "Never",
                    "mind",
                    "Ill"
                ]
            },
            {
                "index": 32,
                "start": 210.1,
                "end": 217.2,
                "text": "I wish nothing but the best for you",
                "vietsub": "Giai điệu: \"I wish nothing but the best for you\"",
                "blanks": [
                    "wish",
                    "nothing",
                    "but"
                ]
            },
            {
                "index": 33,
                "start": 217.2,
                "end": 224.4,
                "text": "Don't forget me, I beg, I remember you said",
                "vietsub": "Giai điệu: \"Don't forget me, I beg, I remember you said\"",
                "blanks": [
                    "Dont",
                    "forget",
                    "beg"
                ]
            },
            {
                "index": 34,
                "start": 224.4,
                "end": 232.5,
                "text": "Sometimes it lasts in love, but sometimes it hurts instead",
                "vietsub": "Giai điệu: \"Sometimes it lasts in love, but sometimes it hurts instead\"",
                "blanks": [
                    "Sometimes",
                    "lasts",
                    "love"
                ]
            },
            {
                "index": 35,
                "start": 232.5,
                "end": 238.6,
                "text": "Never mind, I'll find someone like you",
                "vietsub": "Giai điệu: \"Never mind, I'll find someone like you\"",
                "blanks": [
                    "Never",
                    "mind",
                    "Ill"
                ]
            },
            {
                "index": 36,
                "start": 238.6,
                "end": 245.8,
                "text": "I wish nothing but the best for you, too",
                "vietsub": "Giai điệu: \"I wish nothing but the best for you, too\"",
                "blanks": [
                    "wish",
                    "nothing",
                    "but"
                ]
            },
            {
                "index": 37,
                "start": 245.8,
                "end": 252.8,
                "text": "Don't forget me, I beg, I remember you said",
                "vietsub": "Giai điệu: \"Don't forget me, I beg, I remember you said\"",
                "blanks": [
                    "Dont",
                    "forget",
                    "beg"
                ]
            },
            {
                "index": 38,
                "start": 252.8,
                "end": 260,
                "text": "Sometimes it lasts in love, but sometimes it hurts instead",
                "vietsub": "Giai điệu: \"Sometimes it lasts in love, but sometimes it hurts instead\"",
                "blanks": [
                    "Sometimes",
                    "lasts",
                    "love"
                ]
            },
            {
                "index": 39,
                "start": 260,
                "end": 264.5,
                "text": "Sometimes it lasts in love, but sometimes it hurts instead",
                "vietsub": "Giai điệu: \"Sometimes it lasts in love, but sometimes it hurts instead\"",
                "blanks": [
                    "Sometimes",
                    "lasts",
                    "love"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "settled",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "married",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "dreams",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "things",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "friend",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "uninvited",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 68
    },
    {
        "id": "believer-imagine-dragons",
        "title": "Believer",
        "artist": "Imagine Dragons",
        "youtubeId": "7wtfhZwyrcc",
        "thumbnail": "https://img.youtube.com/vi/7wtfhZwyrcc/hqdefault.jpg",
        "level": "B2",
        "genre": "Alternative / Rock",
        "accent": "Mỹ (US)",
        "description": "Năng lượng bùng nổ, nhịp trống dồn dập giúp tăng cường phản xạ nghe bắt từ ngữ mạnh mẽ.",
        "lines": [
            {
                "index": 1,
                "start": 7.8,
                "end": 12.2,
                "text": "First things first, I'ma say all the words inside my head",
                "vietsub": "Giai điệu: \"First things first, I'ma say all the words inside my head\"",
                "blanks": [
                    "First",
                    "things",
                    "first"
                ]
            },
            {
                "index": 2,
                "start": 12.2,
                "end": 18.2,
                "text": "I'm fired up and tired of the way that things have been, oh, ooh",
                "vietsub": "Giai điệu: \"I'm fired up and tired of the way that things have been, oh, ooh\"",
                "blanks": [
                    "fired",
                    "and",
                    "tired"
                ]
            },
            {
                "index": 3,
                "start": 18.2,
                "end": 23.1,
                "text": "The way that things have been, oh, ooh",
                "vietsub": "Giai điệu: \"The way that things have been, oh, ooh\"",
                "blanks": [
                    "The",
                    "way",
                    "that"
                ]
            },
            {
                "index": 4,
                "start": 23.1,
                "end": 27.6,
                "text": "Second things second, don't you tell me what you think that I could be",
                "vietsub": "Giai điệu: \"Second things second, don't you tell me what you think that I could be\"",
                "blanks": [
                    "Second",
                    "things",
                    "second"
                ]
            },
            {
                "index": 5,
                "start": 27.6,
                "end": 33.7,
                "text": "I'm the one at the sail, I'm the master of my sea, oh, ooh",
                "vietsub": "Giai điệu: \"I'm the one at the sail, I'm the master of my sea, oh, ooh\"",
                "blanks": [
                    "the",
                    "one",
                    "the"
                ]
            },
            {
                "index": 6,
                "start": 33.7,
                "end": 38.3,
                "text": "The master of my sea, oh, ooh",
                "vietsub": "Giai điệu: \"The master of my sea, oh, ooh\"",
                "blanks": [
                    "The",
                    "master"
                ]
            },
            {
                "index": 7,
                "start": 38.3,
                "end": 41.9,
                "text": "I was broken from a young age, Taken my sulking to the masses",
                "vietsub": "Giai điệu: \"I was broken from a young age\", Giai điệu: \"Taken my sulking to the masses\"",
                "blanks": [
                    "was",
                    "broken",
                    "Taken",
                    "sulking"
                ]
            },
            {
                "index": 8,
                "start": 41.9,
                "end": 45.7,
                "text": "Writing my poems for the few, That look at me, took to me, shook to me, feelin' me",
                "vietsub": "Giai điệu: \"Writing my poems for the few\", Giai điệu: \"That look at me, took to me, shook to me, feelin' me\"",
                "blanks": [
                    "Writing",
                    "poems",
                    "That",
                    "look"
                ]
            },
            {
                "index": 9,
                "start": 45.7,
                "end": 49.6,
                "text": "Singing from heartache from the pain, Taking my message from the veins",
                "vietsub": "Giai điệu: \"Singing from heartache from the pain\", Giai điệu: \"Taking my message from the veins\"",
                "blanks": [
                    "Singing",
                    "from",
                    "heartache",
                    "Taking"
                ]
            },
            {
                "index": 10,
                "start": 49.6,
                "end": 54.7,
                "text": "Speaking my lesson from the brain, Seeing the beauty through the",
                "vietsub": "Giai điệu: \"Speaking my lesson from the brain\", Giai điệu: \"Seeing the beauty through the\"",
                "blanks": [
                    "Speaking",
                    "lesson",
                    "Seeing",
                    "the"
                ]
            },
            {
                "index": 11,
                "start": 54.7,
                "end": 62.6,
                "text": "Pain, you made me a, you made me a believer, believer",
                "vietsub": "Giai điệu: \"Pain, you made me a, you made me a believer, believer\"",
                "blanks": [
                    "Pain",
                    "you",
                    "made"
                ]
            },
            {
                "index": 12,
                "start": 62.6,
                "end": 69.3,
                "text": "Pain, you break me down and build me up, believer, believer",
                "vietsub": "Giai điệu: \"Pain, you break me down and build me up, believer, believer\"",
                "blanks": [
                    "Pain",
                    "you",
                    "break"
                ]
            },
            {
                "index": 13,
                "start": 69.3,
                "end": 74.9,
                "text": "Pain, oh, let the bullets fly, oh, let them rain",
                "vietsub": "Giai điệu: \"Pain, oh, let the bullets fly, oh, let them rain\"",
                "blanks": [
                    "Pain",
                    "let",
                    "the"
                ]
            },
            {
                "index": 14,
                "start": 74.9,
                "end": 77.8,
                "text": "My life, my love, my drive, it came from",
                "vietsub": "Giai điệu: \"My life, my love, my drive, it came from\"",
                "blanks": [
                    "life",
                    "love"
                ]
            },
            {
                "index": 15,
                "start": 77.8,
                "end": 84.7,
                "text": "Pain, you made me a, you made me a believer, believer",
                "vietsub": "Giai điệu: \"Pain, you made me a, you made me a believer, believer\"",
                "blanks": [
                    "Pain",
                    "you",
                    "made"
                ]
            },
            {
                "index": 16,
                "start": 84.7,
                "end": 88.9,
                "text": "Third things third, send a prayer to the ones up above",
                "vietsub": "Giai điệu: \"Third things third, send a prayer to the ones up above\"",
                "blanks": [
                    "Third",
                    "things",
                    "third"
                ]
            },
            {
                "index": 17,
                "start": 88.9,
                "end": 94.9,
                "text": "All the hate that you've heard has turned your spirit to a dove, oh, ooh",
                "vietsub": "Giai điệu: \"All the hate that you've heard has turned your spirit to a dove, oh, ooh\"",
                "blanks": [
                    "All",
                    "the",
                    "hate"
                ]
            },
            {
                "index": 18,
                "start": 94.9,
                "end": 99.7,
                "text": "Your spirit up above, oh, ooh",
                "vietsub": "Giai điệu: \"Your spirit up above, oh, ooh\"",
                "blanks": [
                    "Your",
                    "spirit"
                ]
            },
            {
                "index": 19,
                "start": 99.7,
                "end": 103.4,
                "text": "I was choking in the crowd, Building my rain up in the cloud",
                "vietsub": "Giai điệu: \"I was choking in the crowd\", Giai điệu: \"Building my rain up in the cloud\"",
                "blanks": [
                    "was",
                    "choking",
                    "Building",
                    "rain"
                ]
            },
            {
                "index": 20,
                "start": 103.4,
                "end": 107.4,
                "text": "Falling like ashes to the ground, Hoping my feelings, they would drown",
                "vietsub": "Giai điệu: \"Falling like ashes to the ground\", Giai điệu: \"Hoping my feelings, they would drown\"",
                "blanks": [
                    "Falling",
                    "like",
                    "Hoping",
                    "feelings"
                ]
            },
            {
                "index": 21,
                "start": 107.4,
                "end": 112.8,
                "text": "But they never did, ever lived, ebbin' and flowin', Inhibited, limited, 'til it broke open and rained down",
                "vietsub": "Giai điệu: \"But they never did, ever lived, ebbin' and flowin'\", Giai điệu: \"Inhibited, limited, 'til it broke open and rained down\"",
                "blanks": [
                    "But",
                    "they",
                    "never",
                    "Inhibited"
                ]
            },
            {
                "index": 22,
                "start": 112.8,
                "end": 116.4,
                "text": "It rained down like",
                "vietsub": "Giai điệu: \"It rained down like\"",
                "blanks": [
                    "rained"
                ]
            },
            {
                "index": 23,
                "start": 116.4,
                "end": 123.9,
                "text": "Pain, you made me a, you made me a believer, believer",
                "vietsub": "Giai điệu: \"Pain, you made me a, you made me a believer, believer\"",
                "blanks": [
                    "Pain",
                    "you",
                    "made"
                ]
            },
            {
                "index": 24,
                "start": 123.9,
                "end": 130.7,
                "text": "Pain, you break me down and build me up, believer, believer",
                "vietsub": "Giai điệu: \"Pain, you break me down and build me up, believer, believer\"",
                "blanks": [
                    "Pain",
                    "you",
                    "break"
                ]
            },
            {
                "index": 25,
                "start": 130.7,
                "end": 136.3,
                "text": "Pain, oh, let the bullets fly, oh, let them rain",
                "vietsub": "Giai điệu: \"Pain, oh, let the bullets fly, oh, let them rain\"",
                "blanks": [
                    "Pain",
                    "let",
                    "the"
                ]
            },
            {
                "index": 26,
                "start": 136.3,
                "end": 139.4,
                "text": "My life, my love, my drive, it came from",
                "vietsub": "Giai điệu: \"My life, my love, my drive, it came from\"",
                "blanks": [
                    "life",
                    "love"
                ]
            },
            {
                "index": 27,
                "start": 139.4,
                "end": 146.2,
                "text": "Pain, you made me a, you made me a believer, believer",
                "vietsub": "Giai điệu: \"Pain, you made me a, you made me a believer, believer\"",
                "blanks": [
                    "Pain",
                    "you",
                    "made"
                ]
            },
            {
                "index": 28,
                "start": 146.2,
                "end": 150.5,
                "text": "Last things last, by the grace of the fire and the flames",
                "vietsub": "Giai điệu: \"Last things last, by the grace of the fire and the flames\"",
                "blanks": [
                    "Last",
                    "things",
                    "last"
                ]
            },
            {
                "index": 29,
                "start": 150.5,
                "end": 156.5,
                "text": "You're the face of the future, the blood in my veins, oh, ooh",
                "vietsub": "Giai điệu: \"You're the face of the future, the blood in my veins, oh, ooh\"",
                "blanks": [
                    "Youre",
                    "the",
                    "face"
                ]
            },
            {
                "index": 30,
                "start": 156.5,
                "end": 161.2,
                "text": "The blood in my veins, oh, ooh",
                "vietsub": "Giai điệu: \"The blood in my veins, oh, ooh\"",
                "blanks": [
                    "The",
                    "blood"
                ]
            },
            {
                "index": 31,
                "start": 161.2,
                "end": 166.6,
                "text": "But they never did, ever lived, ebbin' and flowin', Inhibited, limited, 'til it broke open and rained down",
                "vietsub": "Giai điệu: \"But they never did, ever lived, ebbin' and flowin'\", Giai điệu: \"Inhibited, limited, 'til it broke open and rained down\"",
                "blanks": [
                    "But",
                    "they",
                    "never",
                    "Inhibited"
                ]
            },
            {
                "index": 32,
                "start": 166.6,
                "end": 170,
                "text": "It rained down like",
                "vietsub": "Giai điệu: \"It rained down like\"",
                "blanks": [
                    "rained"
                ]
            },
            {
                "index": 33,
                "start": 170,
                "end": 177.7,
                "text": "Pain, you made me a, you made me a believer, believer",
                "vietsub": "Giai điệu: \"Pain, you made me a, you made me a believer, believer\"",
                "blanks": [
                    "Pain",
                    "you",
                    "made"
                ]
            },
            {
                "index": 34,
                "start": 177.7,
                "end": 184.4,
                "text": "Pain, you break me down and build me up, believer, believer",
                "vietsub": "Giai điệu: \"Pain, you break me down and build me up, believer, believer\"",
                "blanks": [
                    "Pain",
                    "you",
                    "break"
                ]
            },
            {
                "index": 35,
                "start": 184.4,
                "end": 190.1,
                "text": "Pain, oh, let the bullets fly, oh, let them rain",
                "vietsub": "Giai điệu: \"Pain, oh, let the bullets fly, oh, let them rain\"",
                "blanks": [
                    "Pain",
                    "let",
                    "the"
                ]
            },
            {
                "index": 36,
                "start": 190.1,
                "end": 193.4,
                "text": "My life, my love, my drive, it came from",
                "vietsub": "Giai điệu: \"My life, my love, my drive, it came from\"",
                "blanks": [
                    "life",
                    "love"
                ]
            },
            {
                "index": 37,
                "start": 193.4,
                "end": 197.9,
                "text": "Pain, you made me a, you made me a believer, believer",
                "vietsub": "Giai điệu: \"Pain, you made me a, you made me a believer, believer\"",
                "blanks": [
                    "Pain",
                    "you",
                    "made"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "things",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "inside",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "second",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "master",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "broken",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "sulking",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 125
    },
    {
        "id": "shape-of-you-ed-sheeran",
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "youtubeId": "JGwWNGJdvx8",
        "thumbnail": "https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg",
        "level": "B1",
        "genre": "Dance Pop",
        "accent": "Anh (UK)",
        "description": "Bản hit tỷ view thế giới với nhịp marimba bắt tai, luyện nghe nối âm và ngữ pháp đời thường.",
        "lines": [
            {
                "index": 1,
                "start": 9.7,
                "end": 14.8,
                "text": "The club isn't the best place to find a lover, So the bar is where I go",
                "vietsub": "Giai điệu: \"The club isn't the best place to find a lover\", Giai điệu: \"So the bar is where I go\"",
                "blanks": [
                    "The",
                    "club",
                    "isnt",
                    "the"
                ]
            },
            {
                "index": 2,
                "start": 14.8,
                "end": 19.7,
                "text": "Me and my friends at the table doing shots, Drinking fast, and then we talk slow",
                "vietsub": "Giai điệu: \"Me and my friends at the table doing shots\", Giai điệu: \"Drinking fast, and then we talk slow\"",
                "blanks": [
                    "and",
                    "friends",
                    "the",
                    "Drinking"
                ]
            },
            {
                "index": 3,
                "start": 19.7,
                "end": 24.4,
                "text": "You come over and start up a conversation with just me, And trust me, I'll give it a chance now",
                "vietsub": "Giai điệu: \"You come over and start up a conversation with just me\", Giai điệu: \"And trust me, I'll give it a chance now\"",
                "blanks": [
                    "You",
                    "come",
                    "over",
                    "And"
                ]
            },
            {
                "index": 4,
                "start": 24.4,
                "end": 28.9,
                "text": "Take my hand, stop, put \"Van the Man\" on the jukebox, And then we start to dance",
                "vietsub": "Giai điệu: \"Take my hand, stop, put \"Van the Man\" on the jukebox\", Giai điệu: \"And then we start to dance\"",
                "blanks": [
                    "Take",
                    "hand",
                    "stop",
                    "And"
                ]
            },
            {
                "index": 5,
                "start": 28.9,
                "end": 32.2,
                "text": "And now I'm singing like, Girl, you know I want your love",
                "vietsub": "Giai điệu: \"And now I'm singing like\", Giai điệu: \"Girl, you know I want your love\"",
                "blanks": [
                    "And",
                    "now",
                    "Girl",
                    "you"
                ]
            },
            {
                "index": 6,
                "start": 32.2,
                "end": 37.3,
                "text": "Your love was handmade for somebody like me, Come on now, follow my lead",
                "vietsub": "Giai điệu: \"Your love was handmade for somebody like me\", Giai điệu: \"Come on now, follow my lead\"",
                "blanks": [
                    "Your",
                    "love",
                    "was",
                    "Come"
                ]
            },
            {
                "index": 7,
                "start": 37.3,
                "end": 42.3,
                "text": "I may be crazy, don't mind me, Say, \"Boy, let's not talk too much",
                "vietsub": "Giai điệu: \"I may be crazy, don't mind me\", Giai điệu: \"Say, \"Boy, let's not talk too much\"",
                "blanks": [
                    "may",
                    "crazy",
                    "Say",
                    "Boy"
                ]
            },
            {
                "index": 8,
                "start": 42.3,
                "end": 47.3,
                "text": "Grab on my waist and put that body on me\", Come on now, follow my lead",
                "vietsub": "Giai điệu: \"Grab on my waist and put that body on me\"\", Giai điệu: \"Come on now, follow my lead\"",
                "blanks": [
                    "Grab",
                    "waist",
                    "and",
                    "Come"
                ]
            },
            {
                "index": 9,
                "start": 47.3,
                "end": 50.8,
                "text": "Come, come on now, follow my lead",
                "vietsub": "Giai điệu: \"Come, come on now, follow my lead\"",
                "blanks": [
                    "Come",
                    "come"
                ]
            },
            {
                "index": 10,
                "start": 50.8,
                "end": 55.7,
                "text": "I'm in love with the shape of you, We push and pull like a magnet do",
                "vietsub": "Giai điệu: \"I'm in love with the shape of you\", Giai điệu: \"We push and pull like a magnet do\"",
                "blanks": [
                    "love",
                    "with",
                    "push",
                    "and"
                ]
            },
            {
                "index": 11,
                "start": 55.7,
                "end": 60.6,
                "text": "Although my heart is falling too, I'm in love with your body",
                "vietsub": "Giai điệu: \"Although my heart is falling too\", Giai điệu: \"I'm in love with your body\"",
                "blanks": [
                    "Although",
                    "heart",
                    "love",
                    "with"
                ]
            },
            {
                "index": 12,
                "start": 60.6,
                "end": 65.4,
                "text": "Last night you were in my room, And now my bed sheets smell like you",
                "vietsub": "Giai điệu: \"Last night you were in my room\", Giai điệu: \"And now my bed sheets smell like you\"",
                "blanks": [
                    "Last",
                    "night",
                    "And",
                    "now"
                ]
            },
            {
                "index": 13,
                "start": 65.4,
                "end": 70,
                "text": "Every day discovering something brand new, Oh, I'm in love with your body",
                "vietsub": "Giai điệu: \"Every day discovering something brand new\", Giai điệu: \"Oh, I'm in love with your body\"",
                "blanks": [
                    "Every",
                    "day",
                    "discovering",
                    "love"
                ]
            },
            {
                "index": 14,
                "start": 70,
                "end": 74.9,
                "text": "Oh I, oh I, oh I, oh I, Oh, I'm in love with your body",
                "vietsub": "Giai điệu: \"Oh I, oh I, oh I, oh I\", Giai điệu: \"Oh, I'm in love with your body\"",
                "blanks": [
                    "love",
                    "with"
                ]
            },
            {
                "index": 15,
                "start": 74.9,
                "end": 80,
                "text": "Oh I, oh I, oh I, oh I, Oh, I'm in love with your body",
                "vietsub": "Giai điệu: \"Oh I, oh I, oh I, oh I\", Giai điệu: \"Oh, I'm in love with your body\"",
                "blanks": [
                    "love",
                    "with"
                ]
            },
            {
                "index": 16,
                "start": 80,
                "end": 85,
                "text": "Oh I, oh I, oh I, oh I, Oh, I'm in love with your body",
                "vietsub": "Giai điệu: \"Oh I, oh I, oh I, oh I\", Giai điệu: \"Oh, I'm in love with your body\"",
                "blanks": [
                    "love",
                    "with"
                ]
            },
            {
                "index": 17,
                "start": 85,
                "end": 88.4,
                "text": "Every day discovering something brand new",
                "vietsub": "Giai điệu: \"Every day discovering something brand new\"",
                "blanks": [
                    "Every",
                    "day",
                    "discovering"
                ]
            },
            {
                "index": 18,
                "start": 88.4,
                "end": 92,
                "text": "I'm in love with the shape of you, One week in we let the story begin",
                "vietsub": "Giai điệu: \"I'm in love with the shape of you\", Giai điệu: \"One week in we let the story begin\"",
                "blanks": [
                    "love",
                    "with",
                    "One",
                    "week"
                ]
            },
            {
                "index": 19,
                "start": 92,
                "end": 96.9,
                "text": "We're going out on our first date (mm-mm), But you and me are thrifty, so go all-you-can-eat",
                "vietsub": "Giai điệu: \"We're going out on our first date (mm-mm)\", Giai điệu: \"But you and me are thrifty, so go all-you-can-eat\"",
                "blanks": [
                    "Were",
                    "going",
                    "out",
                    "But"
                ]
            },
            {
                "index": 20,
                "start": 96.9,
                "end": 102,
                "text": "Fill up your bag, and I fill up a plate (mm-mm), We talk for hours and hours about the sweet and the sour",
                "vietsub": "Giai điệu: \"Fill up your bag, and I fill up a plate (mm-mm)\", Giai điệu: \"We talk for hours and hours about the sweet and the sour\"",
                "blanks": [
                    "Fill",
                    "your",
                    "bag",
                    "talk"
                ]
            },
            {
                "index": 21,
                "start": 102,
                "end": 107.2,
                "text": "And how your family is doing okay (mm-mm), And leave and get in a taxi, then kiss in the back seat",
                "vietsub": "Giai điệu: \"And how your family is doing okay (mm-mm)\", Giai điệu: \"And leave and get in a taxi, then kiss in the back seat\"",
                "blanks": [
                    "And",
                    "how",
                    "your",
                    "leave"
                ]
            },
            {
                "index": 22,
                "start": 107.2,
                "end": 112.2,
                "text": "Tell the driver make the radio play, And I'm singing like, Girl, you know I want your love",
                "vietsub": "Giai điệu: \"Tell the driver make the radio play\", Giai điệu: \"And I'm singing like\", Giai điệu: \"Girl, you know I want your love\"",
                "blanks": [
                    "Tell",
                    "the",
                    "driver",
                    "And"
                ]
            },
            {
                "index": 23,
                "start": 112.2,
                "end": 115.4,
                "text": "Your love was handmade for somebody like me",
                "vietsub": "Giai điệu: \"Your love was handmade for somebody like me\"",
                "blanks": [
                    "Your",
                    "love",
                    "was"
                ]
            },
            {
                "index": 24,
                "start": 115.4,
                "end": 119.6,
                "text": "Come on now, follow my lead, I may be crazy, don't mind me",
                "vietsub": "Giai điệu: \"Come on now, follow my lead\", Giai điệu: \"I may be crazy, don't mind me\"",
                "blanks": [
                    "Come",
                    "now",
                    "may",
                    "crazy"
                ]
            },
            {
                "index": 25,
                "start": 119.6,
                "end": 125.3,
                "text": "Say, \"Boy, let's not talk too much, Grab on my waist and put that body on me\"",
                "vietsub": "Giai điệu: \"Say, \"Boy, let's not talk too much\", Giai điệu: \"Grab on my waist and put that body on me\"\"",
                "blanks": [
                    "Say",
                    "Boy",
                    "lets",
                    "Grab"
                ]
            },
            {
                "index": 26,
                "start": 125.3,
                "end": 130.6,
                "text": "Come on now, follow my lead, Come, come on now, follow my lead",
                "vietsub": "Giai điệu: \"Come on now, follow my lead\", Giai điệu: \"Come, come on now, follow my lead\"",
                "blanks": [
                    "Come",
                    "now",
                    "come"
                ]
            },
            {
                "index": 27,
                "start": 130.6,
                "end": 135.7,
                "text": "I'm in love with the shape of you, We push and pull like a magnet do",
                "vietsub": "Giai điệu: \"I'm in love with the shape of you\", Giai điệu: \"We push and pull like a magnet do\"",
                "blanks": [
                    "love",
                    "with",
                    "push",
                    "and"
                ]
            },
            {
                "index": 28,
                "start": 135.7,
                "end": 140.6,
                "text": "Although my heart is falling too, I'm in love with your body",
                "vietsub": "Giai điệu: \"Although my heart is falling too\", Giai điệu: \"I'm in love with your body\"",
                "blanks": [
                    "Although",
                    "heart",
                    "love",
                    "with"
                ]
            },
            {
                "index": 29,
                "start": 140.6,
                "end": 145.3,
                "text": "Last night you were in my room, And now my bed sheets smell like you",
                "vietsub": "Giai điệu: \"Last night you were in my room\", Giai điệu: \"And now my bed sheets smell like you\"",
                "blanks": [
                    "Last",
                    "night",
                    "And",
                    "now"
                ]
            },
            {
                "index": 30,
                "start": 145.3,
                "end": 150,
                "text": "Every day discovering something brand new, Oh, I'm in love with your body",
                "vietsub": "Giai điệu: \"Every day discovering something brand new\", Giai điệu: \"Oh, I'm in love with your body\"",
                "blanks": [
                    "Every",
                    "day",
                    "discovering",
                    "love"
                ]
            },
            {
                "index": 31,
                "start": 150,
                "end": 154.9,
                "text": "Oh I, oh I, oh I, oh I, Oh, I'm in love with your body",
                "vietsub": "Giai điệu: \"Oh I, oh I, oh I, oh I\", Giai điệu: \"Oh, I'm in love with your body\"",
                "blanks": [
                    "love",
                    "with"
                ]
            },
            {
                "index": 32,
                "start": 154.9,
                "end": 160,
                "text": "Oh I, oh I, oh I, oh I, Oh, I'm in love with your body",
                "vietsub": "Giai điệu: \"Oh I, oh I, oh I, oh I\", Giai điệu: \"Oh, I'm in love with your body\"",
                "blanks": [
                    "love",
                    "with"
                ]
            },
            {
                "index": 33,
                "start": 160,
                "end": 165,
                "text": "Oh I, oh I, oh I, oh I, Oh, I'm in love with your body",
                "vietsub": "Giai điệu: \"Oh I, oh I, oh I, oh I\", Giai điệu: \"Oh, I'm in love with your body\"",
                "blanks": [
                    "love",
                    "with"
                ]
            },
            {
                "index": 34,
                "start": 165,
                "end": 168.3,
                "text": "Every day discovering something brand new",
                "vietsub": "Giai điệu: \"Every day discovering something brand new\"",
                "blanks": [
                    "Every",
                    "day",
                    "discovering"
                ]
            },
            {
                "index": 35,
                "start": 168.3,
                "end": 172.7,
                "text": "I'm in love with the shape of you, Come on, be my baby, come on",
                "vietsub": "Giai điệu: \"I'm in love with the shape of you\", Giai điệu: \"Come on, be my baby, come on\"",
                "blanks": [
                    "love",
                    "with",
                    "Come"
                ]
            },
            {
                "index": 36,
                "start": 172.7,
                "end": 177.7,
                "text": "Come on, be my baby, come on, Come on, be my baby, come on",
                "vietsub": "Giai điệu: \"Come on, be my baby, come on\"",
                "blanks": [
                    "Come"
                ]
            },
            {
                "index": 37,
                "start": 177.7,
                "end": 182.5,
                "text": "Come on, be my baby, come on, Come on, be my baby, come on",
                "vietsub": "Giai điệu: \"Come on, be my baby, come on\"",
                "blanks": [
                    "Come"
                ]
            },
            {
                "index": 38,
                "start": 182.5,
                "end": 187.5,
                "text": "Come on, be my baby, come on, Come on, be my baby, come on",
                "vietsub": "Giai điệu: \"Come on, be my baby, come on\"",
                "blanks": [
                    "Come"
                ]
            },
            {
                "index": 39,
                "start": 187.5,
                "end": 193.1,
                "text": "Come on, be my baby, come on, I'm in love with the shape of you",
                "vietsub": "Giai điệu: \"Come on, be my baby, come on\", Giai điệu: \"I'm in love with the shape of you\"",
                "blanks": [
                    "Come",
                    "love",
                    "with"
                ]
            },
            {
                "index": 40,
                "start": 193.1,
                "end": 198.1,
                "text": "We push and pull like a magnet do, Although my heart is falling too",
                "vietsub": "Giai điệu: \"We push and pull like a magnet do\", Giai điệu: \"Although my heart is falling too\"",
                "blanks": [
                    "push",
                    "and",
                    "Although",
                    "heart"
                ]
            },
            {
                "index": 41,
                "start": 198.1,
                "end": 203.1,
                "text": "I'm in love with your body, Last night you were in my room",
                "vietsub": "Giai điệu: \"I'm in love with your body\", Giai điệu: \"Last night you were in my room\"",
                "blanks": [
                    "love",
                    "with",
                    "Last",
                    "night"
                ]
            },
            {
                "index": 42,
                "start": 203.1,
                "end": 208.2,
                "text": "And now my bed sheets smell like you, Every day discovering something brand new",
                "vietsub": "Giai điệu: \"And now my bed sheets smell like you\", Giai điệu: \"Every day discovering something brand new\"",
                "blanks": [
                    "And",
                    "now",
                    "bed",
                    "Every"
                ]
            },
            {
                "index": 43,
                "start": 208.2,
                "end": 212.7,
                "text": "Oh, I'm in love with your body, Come on, be my baby, come on",
                "vietsub": "Giai điệu: \"Oh, I'm in love with your body\", Giai điệu: \"Come on, be my baby, come on\"",
                "blanks": [
                    "love",
                    "with",
                    "Come"
                ]
            },
            {
                "index": 44,
                "start": 212.7,
                "end": 217.5,
                "text": "Come on, be my baby, come on (I'm in love with your body), Come on, be my baby, come on",
                "vietsub": "Giai điệu: \"Come on, be my baby, come on (I'm in love with your body)\", Giai điệu: \"Come on, be my baby, come on\"",
                "blanks": [
                    "Come",
                    "baby",
                    "come"
                ]
            },
            {
                "index": 45,
                "start": 217.5,
                "end": 222.7,
                "text": "Come on, be my baby, come on (oh, I'm in love with your body), Come on, be my baby, come on",
                "vietsub": "Giai điệu: \"Come on, be my baby, come on (oh, I'm in love with your body)\", Giai điệu: \"Come on, be my baby, come on\"",
                "blanks": [
                    "Come",
                    "baby",
                    "come"
                ]
            },
            {
                "index": 46,
                "start": 222.7,
                "end": 228.2,
                "text": "Come on, be my baby, come on (I'm in love with your body), Every day discovering something brand new",
                "vietsub": "Giai điệu: \"Come on, be my baby, come on (I'm in love with your body)\", Giai điệu: \"Every day discovering something brand new\"",
                "blanks": [
                    "Come",
                    "baby",
                    "come",
                    "Every"
                ]
            },
            {
                "index": 47,
                "start": 228.2,
                "end": 232.7,
                "text": "I'm in love with the shape of you",
                "vietsub": "Giai điệu: \"I'm in love with the shape of you\"",
                "blanks": [
                    "love",
                    "with"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "friends",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "drinking",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "conversation",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "chance",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "jukebox",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "singing",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 96
    },
    {
        "id": "a-thousand-years-christina-perri",
        "title": "A Thousand Years",
        "artist": "Christina Perri",
        "youtubeId": "rtOvBOTyX00",
        "thumbnail": "https://img.youtube.com/vi/rtOvBOTyX00/hqdefault.jpg",
        "level": "A2",
        "genre": "Cinematic Ballad",
        "accent": "Mỹ (US)",
        "description": "Nhạc phim Twilight bất hủ, lời bài hát trong trẻo chậm rãi, cực kỳ thích hợp cho người mới bắt đầu.",
        "lines": [
            {
                "index": 1,
                "start": 20.7,
                "end": 24.7,
                "text": "Heart beats fast",
                "vietsub": "Giai điệu: \"Heart beats fast\"",
                "blanks": [
                    "Heart"
                ]
            },
            {
                "index": 2,
                "start": 24.7,
                "end": 32.4,
                "text": "Colors and promises, How to be brave?",
                "vietsub": "Giai điệu: \"Colors and promises\", Giai điệu: \"How to be brave?\"",
                "blanks": [
                    "Colors",
                    "How"
                ]
            },
            {
                "index": 3,
                "start": 32.4,
                "end": 39.8,
                "text": "How can I love when I'm afraid to fall?",
                "vietsub": "Giai điệu: \"How can I love when I'm afraid to fall?\"",
                "blanks": [
                    "How",
                    "can",
                    "love"
                ]
            },
            {
                "index": 4,
                "start": 39.8,
                "end": 45.1,
                "text": "But watching you stand alone",
                "vietsub": "Giai điệu: \"But watching you stand alone\"",
                "blanks": [
                    "But",
                    "watching"
                ]
            },
            {
                "index": 5,
                "start": 45.1,
                "end": 54.1,
                "text": "All of my doubt suddenly goes away somehow",
                "vietsub": "Giai điệu: \"All of my doubt suddenly goes away somehow\"",
                "blanks": [
                    "All",
                    "doubt",
                    "suddenly"
                ]
            },
            {
                "index": 6,
                "start": 54.1,
                "end": 62,
                "text": "One step closer",
                "vietsub": "Giai điệu: \"One step closer\"",
                "blanks": [
                    "One"
                ]
            },
            {
                "index": 7,
                "start": 62,
                "end": 67.1,
                "text": "I have died every day waiting for you",
                "vietsub": "Giai điệu: \"I have died every day waiting for you\"",
                "blanks": [
                    "have",
                    "died",
                    "every"
                ]
            },
            {
                "index": 8,
                "start": 67.1,
                "end": 69.8,
                "text": "Darling, don't be afraid",
                "vietsub": "Giai điệu: \"Darling, don't be afraid\"",
                "blanks": [
                    "Darling"
                ]
            },
            {
                "index": 9,
                "start": 69.8,
                "end": 76.2,
                "text": "I have loved you for a thousand years",
                "vietsub": "Giai điệu: \"I have loved you for a thousand years\"",
                "blanks": [
                    "have",
                    "loved",
                    "you"
                ]
            },
            {
                "index": 10,
                "start": 76.2,
                "end": 88,
                "text": "I'll love you for a thousand more",
                "vietsub": "Giai điệu: \"I'll love you for a thousand more\"",
                "blanks": [
                    "Ill",
                    "love",
                    "you"
                ]
            },
            {
                "index": 11,
                "start": 88,
                "end": 91.8,
                "text": "Time stands still",
                "vietsub": "Giai điệu: \"Time stands still\"",
                "blanks": [
                    "Time"
                ]
            },
            {
                "index": 12,
                "start": 91.8,
                "end": 99.5,
                "text": "Beauty in all she is, I will be brave",
                "vietsub": "Giai điệu: \"Beauty in all she is\", Giai điệu: \"I will be brave\"",
                "blanks": [
                    "Beauty",
                    "will"
                ]
            },
            {
                "index": 13,
                "start": 99.5,
                "end": 107.1,
                "text": "I will not let anything take away",
                "vietsub": "Giai điệu: \"I will not let anything take away\"",
                "blanks": [
                    "will",
                    "not",
                    "let"
                ]
            },
            {
                "index": 14,
                "start": 107.1,
                "end": 112.5,
                "text": "What's standing in front of me",
                "vietsub": "Giai điệu: \"What's standing in front of me\"",
                "blanks": [
                    "Whats"
                ]
            },
            {
                "index": 15,
                "start": 112.5,
                "end": 121.4,
                "text": "Every breath, every hour has come to this",
                "vietsub": "Giai điệu: \"Every breath, every hour has come to this\"",
                "blanks": [
                    "Every",
                    "breath",
                    "every"
                ]
            },
            {
                "index": 16,
                "start": 121.4,
                "end": 129,
                "text": "One step closer",
                "vietsub": "Giai điệu: \"One step closer\"",
                "blanks": [
                    "One"
                ]
            },
            {
                "index": 17,
                "start": 129,
                "end": 134.3,
                "text": "I have died every day waiting for you",
                "vietsub": "Giai điệu: \"I have died every day waiting for you\"",
                "blanks": [
                    "have",
                    "died",
                    "every"
                ]
            },
            {
                "index": 18,
                "start": 134.3,
                "end": 136.9,
                "text": "Darling, don't be afraid",
                "vietsub": "Giai điệu: \"Darling, don't be afraid\"",
                "blanks": [
                    "Darling"
                ]
            },
            {
                "index": 19,
                "start": 136.9,
                "end": 143.3,
                "text": "I have loved you for a thousand years",
                "vietsub": "Giai điệu: \"I have loved you for a thousand years\"",
                "blanks": [
                    "have",
                    "loved",
                    "you"
                ]
            },
            {
                "index": 20,
                "start": 143.3,
                "end": 149.8,
                "text": "I'll love you for a thousand more",
                "vietsub": "Giai điệu: \"I'll love you for a thousand more\"",
                "blanks": [
                    "Ill",
                    "love",
                    "you"
                ]
            },
            {
                "index": 21,
                "start": 149.8,
                "end": 155.1,
                "text": "And all along I believed I would find you",
                "vietsub": "Giai điệu: \"And all along I believed I would find you\"",
                "blanks": [
                    "And",
                    "all",
                    "along"
                ]
            },
            {
                "index": 22,
                "start": 155.1,
                "end": 157.8,
                "text": "Time has brought your heart to me",
                "vietsub": "Giai điệu: \"Time has brought your heart to me\"",
                "blanks": [
                    "Time",
                    "has"
                ]
            },
            {
                "index": 23,
                "start": 157.8,
                "end": 164.1,
                "text": "I have loved you for a thousand years",
                "vietsub": "Giai điệu: \"I have loved you for a thousand years\"",
                "blanks": [
                    "have",
                    "loved",
                    "you"
                ]
            },
            {
                "index": 24,
                "start": 164.1,
                "end": 170.1,
                "text": "I'll love you for a thousand more",
                "vietsub": "Giai điệu: \"I'll love you for a thousand more\"",
                "blanks": [
                    "Ill",
                    "love",
                    "you"
                ]
            },
            {
                "index": 25,
                "start": 193.9,
                "end": 204,
                "text": "One step closer",
                "vietsub": "Giai điệu: \"One step closer\"",
                "blanks": [
                    "One"
                ]
            },
            {
                "index": 26,
                "start": 204,
                "end": 211.9,
                "text": "One step closer",
                "vietsub": "Giai điệu: \"One step closer\"",
                "blanks": [
                    "One"
                ]
            },
            {
                "index": 27,
                "start": 211.9,
                "end": 217.2,
                "text": "I have died every day waiting for you",
                "vietsub": "Giai điệu: \"I have died every day waiting for you\"",
                "blanks": [
                    "have",
                    "died",
                    "every"
                ]
            },
            {
                "index": 28,
                "start": 217.2,
                "end": 219.7,
                "text": "Darling, don't be afraid",
                "vietsub": "Giai điệu: \"Darling, don't be afraid\"",
                "blanks": [
                    "Darling"
                ]
            },
            {
                "index": 29,
                "start": 219.7,
                "end": 226.3,
                "text": "I have loved you for a thousand years",
                "vietsub": "Giai điệu: \"I have loved you for a thousand years\"",
                "blanks": [
                    "have",
                    "loved",
                    "you"
                ]
            },
            {
                "index": 30,
                "start": 226.3,
                "end": 232.7,
                "text": "I'll love you for a thousand more",
                "vietsub": "Giai điệu: \"I'll love you for a thousand more\"",
                "blanks": [
                    "Ill",
                    "love",
                    "you"
                ]
            },
            {
                "index": 31,
                "start": 232.7,
                "end": 238.1,
                "text": "And all along I believed I would find you",
                "vietsub": "Giai điệu: \"And all along I believed I would find you\"",
                "blanks": [
                    "And",
                    "all",
                    "along"
                ]
            },
            {
                "index": 32,
                "start": 238.1,
                "end": 240.8,
                "text": "Time has brought your heart to me",
                "vietsub": "Giai điệu: \"Time has brought your heart to me\"",
                "blanks": [
                    "Time",
                    "has"
                ]
            },
            {
                "index": 33,
                "start": 240.8,
                "end": 247.1,
                "text": "I have loved you for a thousand years",
                "vietsub": "Giai điệu: \"I have loved you for a thousand years\"",
                "blanks": [
                    "have",
                    "loved",
                    "you"
                ]
            },
            {
                "index": 34,
                "start": 247.1,
                "end": 251.6,
                "text": "I'll love you for a thousand more",
                "vietsub": "Giai điệu: \"I'll love you for a thousand more\"",
                "blanks": [
                    "Ill",
                    "love",
                    "you"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "colors",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "promises",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "afraid",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "watching",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "suddenly",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "somehow",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 139
    },
    {
        "id": "love-story-taylor-swift",
        "title": "Love Story",
        "artist": "Taylor Swift",
        "youtubeId": "8xg3vE8Ie_E",
        "thumbnail": "https://img.youtube.com/vi/8xg3vE8Ie_E/hqdefault.jpg",
        "level": "A2",
        "genre": "Country Pop",
        "accent": "Mỹ (US)",
        "description": "Bản tình ca Romeo & Juliet bất hủ của Taylor Swift, ca từ trong sáng, dễ nghe dễ nhớ.",
        "lines": [
            {
                "index": 1,
                "start": 17.4,
                "end": 21.4,
                "text": "We were both young when I first saw you",
                "vietsub": "We were both young when I first saw you",
                "blanks": [
                    "were",
                    "both",
                    "young"
                ]
            },
            {
                "index": 2,
                "start": 21.4,
                "end": 24.8,
                "text": "I close my eyes and the flashback starts",
                "vietsub": "I close my eyes and the flashback starts",
                "blanks": [
                    "close",
                    "eyes",
                    "and"
                ]
            },
            {
                "index": 3,
                "start": 24.8,
                "end": 27.9,
                "text": "I'm standing there",
                "vietsub": "I'm standing there",
                "blanks": [
                    "standing"
                ]
            },
            {
                "index": 4,
                "start": 27.9,
                "end": 33.5,
                "text": "On a balcony, in summer air",
                "vietsub": "On a balcony, in summer air",
                "blanks": [
                    "balcony"
                ]
            },
            {
                "index": 5,
                "start": 33.5,
                "end": 37.9,
                "text": "See the lights, see the party, the ball gowns",
                "vietsub": "See the lights, see the party, the ball gowns",
                "blanks": [
                    "See",
                    "the",
                    "lights"
                ]
            },
            {
                "index": 6,
                "start": 37.9,
                "end": 41.4,
                "text": "See you make your way through the crowd",
                "vietsub": "See you make your way through the crowd",
                "blanks": [
                    "See",
                    "you",
                    "make"
                ]
            },
            {
                "index": 7,
                "start": 41.4,
                "end": 44.3,
                "text": "And say, \"Hello\"",
                "vietsub": "And say, \"Hello\"",
                "blanks": [
                    "And"
                ]
            },
            {
                "index": 8,
                "start": 44.3,
                "end": 49.5,
                "text": "Little did I know",
                "vietsub": "Little did I know",
                "blanks": [
                    "Little"
                ]
            },
            {
                "index": 9,
                "start": 49.5,
                "end": 53.8,
                "text": "That you were Romeo, you were throwing pebbles",
                "vietsub": "That you were Romeo, you were throwing pebbles",
                "blanks": [
                    "That",
                    "you",
                    "were"
                ]
            },
            {
                "index": 10,
                "start": 53.8,
                "end": 57.8,
                "text": "And my daddy said, \"Stay away from Juliet\"",
                "vietsub": "And my daddy said, \"Stay away from Juliet\"",
                "blanks": [
                    "And",
                    "daddy",
                    "said"
                ]
            },
            {
                "index": 11,
                "start": 57.8,
                "end": 64.6,
                "text": "And I was crying on the staircase, Begging you, \"Please don't go\"",
                "vietsub": "And I was crying on the staircase, Begging you, \"Please don't go\"",
                "blanks": [
                    "And",
                    "was",
                    "Begging",
                    "you"
                ]
            },
            {
                "index": 12,
                "start": 64.6,
                "end": 70,
                "text": "And I said, \"Romeo take me somewhere we can be alone",
                "vietsub": "And I said, \"Romeo take me somewhere we can be alone",
                "blanks": [
                    "And",
                    "Romeo",
                    "take"
                ]
            },
            {
                "index": 13,
                "start": 70,
                "end": 73.8,
                "text": "I'll be waiting, all there's left to do is run",
                "vietsub": "I'll be waiting, all there's left to do is run",
                "blanks": [
                    "Ill",
                    "waiting",
                    "all"
                ]
            },
            {
                "index": 14,
                "start": 73.8,
                "end": 78.1,
                "text": "You'll be the prince, and I'll be the princess",
                "vietsub": "You'll be the prince, and I'll be the princess",
                "blanks": [
                    "Youll",
                    "the",
                    "prince"
                ]
            },
            {
                "index": 15,
                "start": 78.1,
                "end": 86.1,
                "text": "It's a love story, baby, just say yes\"",
                "vietsub": "It's a love story, baby, just say yes\"",
                "blanks": [
                    "Its",
                    "love",
                    "story"
                ]
            },
            {
                "index": 16,
                "start": 86.1,
                "end": 90,
                "text": "So I sneak out to the garden to see you",
                "vietsub": "So I sneak out to the garden to see you",
                "blanks": [
                    "sneak",
                    "out",
                    "the"
                ]
            },
            {
                "index": 17,
                "start": 90,
                "end": 93.7,
                "text": "We keep quiet 'cause we're dead if they knew",
                "vietsub": "We keep quiet 'cause we're dead if they knew",
                "blanks": [
                    "keep",
                    "quiet",
                    "cause"
                ]
            },
            {
                "index": 18,
                "start": 93.7,
                "end": 101.7,
                "text": "So close your eyes, Escape this town for a little while, oh, oh",
                "vietsub": "So close your eyes, Escape this town for a little while, oh, oh",
                "blanks": [
                    "close",
                    "Escape",
                    "this",
                    "town"
                ]
            },
            {
                "index": 19,
                "start": 101.7,
                "end": 105.7,
                "text": "'Cause you were Romeo, I was a scarlet letter",
                "vietsub": "'Cause you were Romeo, I was a scarlet letter",
                "blanks": [
                    "Cause",
                    "you",
                    "were"
                ]
            },
            {
                "index": 20,
                "start": 105.7,
                "end": 109.5,
                "text": "And my daddy said, \"Stay away from Juliet\"",
                "vietsub": "And my daddy said, \"Stay away from Juliet\"",
                "blanks": [
                    "And",
                    "daddy",
                    "said"
                ]
            },
            {
                "index": 21,
                "start": 109.5,
                "end": 117.1,
                "text": "But you were everything to me, I was begging you, \"Please don't go\"",
                "vietsub": "But you were everything to me, I was begging you, \"Please don't go\"",
                "blanks": [
                    "But",
                    "you",
                    "was",
                    "begging"
                ]
            },
            {
                "index": 22,
                "start": 117.1,
                "end": 122.5,
                "text": "And I said, \"Romeo, take me somewhere we can be alone",
                "vietsub": "And I said, \"Romeo, take me somewhere we can be alone",
                "blanks": [
                    "And",
                    "Romeo",
                    "take"
                ]
            },
            {
                "index": 23,
                "start": 122.5,
                "end": 126.3,
                "text": "I'll be waiting, all there's left to do is run",
                "vietsub": "I'll be waiting, all there's left to do is run",
                "blanks": [
                    "Ill",
                    "waiting",
                    "all"
                ]
            },
            {
                "index": 24,
                "start": 126.3,
                "end": 131.4,
                "text": "You'll be the prince, and I'll be the princess",
                "vietsub": "You'll be the prince, and I'll be the princess",
                "blanks": [
                    "Youll",
                    "the",
                    "prince"
                ]
            },
            {
                "index": 25,
                "start": 131.4,
                "end": 134.7,
                "text": "It's a love story, baby, just say yes\"",
                "vietsub": "It's a love story, baby, just say yes\"",
                "blanks": [
                    "Its",
                    "love",
                    "story"
                ]
            },
            {
                "index": 26,
                "start": 134.7,
                "end": 138.2,
                "text": "Romeo, save me, they're trying to tell me how to feel",
                "vietsub": "Romeo, save me, they're trying to tell me how to feel",
                "blanks": [
                    "Romeo",
                    "save",
                    "theyre"
                ]
            },
            {
                "index": 27,
                "start": 138.2,
                "end": 142.5,
                "text": "This love is difficult, but it's real",
                "vietsub": "This love is difficult, but it's real",
                "blanks": [
                    "This",
                    "love",
                    "difficult"
                ]
            },
            {
                "index": 28,
                "start": 142.5,
                "end": 146.5,
                "text": "Don't be afraid, we'll make it out of this mess",
                "vietsub": "Don't be afraid, we'll make it out of this mess",
                "blanks": [
                    "Dont",
                    "afraid",
                    "well"
                ]
            },
            {
                "index": 29,
                "start": 146.5,
                "end": 154,
                "text": "It's a love story, baby, just say yes",
                "vietsub": "It's a love story, baby, just say yes",
                "blanks": [
                    "Its",
                    "love",
                    "story"
                ]
            },
            {
                "index": 30,
                "start": 154,
                "end": 166,
                "text": "Oh, oh-oh",
                "vietsub": "Oh, oh-oh",
                "blanks": [
                    "ohoh"
                ]
            },
            {
                "index": 31,
                "start": 166,
                "end": 173.5,
                "text": "I got tired of waiting, Wondering if you were ever coming around",
                "vietsub": "I got tired of waiting, Wondering if you were ever coming around",
                "blanks": [
                    "got",
                    "Wondering",
                    "you",
                    "were"
                ]
            },
            {
                "index": 32,
                "start": 173.5,
                "end": 178.2,
                "text": "My faith in you was fading",
                "vietsub": "My faith in you was fading",
                "blanks": [
                    "faith",
                    "you"
                ]
            },
            {
                "index": 33,
                "start": 178.2,
                "end": 181.8,
                "text": "When I met you on the outskirts of town",
                "vietsub": "When I met you on the outskirts of town",
                "blanks": [
                    "When",
                    "met",
                    "you"
                ]
            },
            {
                "index": 34,
                "start": 181.8,
                "end": 187,
                "text": "And I said, \"Romeo, save me, I've been feeling so alone",
                "vietsub": "And I said, \"Romeo, save me, I've been feeling so alone",
                "blanks": [
                    "And",
                    "Romeo",
                    "save",
                    "Ive"
                ]
            },
            {
                "index": 35,
                "start": 187,
                "end": 190.9,
                "text": "I keep waiting for you, but you never come",
                "vietsub": "I keep waiting for you, but you never come",
                "blanks": [
                    "keep",
                    "waiting",
                    "for"
                ]
            },
            {
                "index": 36,
                "start": 190.9,
                "end": 194.9,
                "text": "Is this in my head? I don't know what to think\"",
                "vietsub": "Is this in my head? I don't know what to think\"",
                "blanks": [
                    "this",
                    "head",
                    "dont"
                ]
            },
            {
                "index": 37,
                "start": 194.9,
                "end": 198.4,
                "text": "He knelt to the ground and pulled out a ring",
                "vietsub": "He knelt to the ground and pulled out a ring",
                "blanks": [
                    "knelt",
                    "the",
                    "ground"
                ]
            },
            {
                "index": 38,
                "start": 198.4,
                "end": 203,
                "text": "And said, \"Marry me, Juliet, you'll never have to be alone",
                "vietsub": "And said, \"Marry me, Juliet, you'll never have to be alone",
                "blanks": [
                    "And",
                    "Marry",
                    "Juliet",
                    "youll"
                ]
            },
            {
                "index": 39,
                "start": 203,
                "end": 207.1,
                "text": "I love you, and that's all I really know",
                "vietsub": "I love you, and that's all I really know",
                "blanks": [
                    "love",
                    "you",
                    "and"
                ]
            },
            {
                "index": 40,
                "start": 207.1,
                "end": 211,
                "text": "I talked to your dad, go pick out a white dress",
                "vietsub": "I talked to your dad, go pick out a white dress",
                "blanks": [
                    "talked",
                    "your",
                    "dad"
                ]
            },
            {
                "index": 41,
                "start": 211,
                "end": 218.3,
                "text": "It's a love story, baby, just say yes\"",
                "vietsub": "It's a love story, baby, just say yes\"",
                "blanks": [
                    "Its",
                    "love",
                    "story"
                ]
            },
            {
                "index": 42,
                "start": 218.3,
                "end": 222.3,
                "text": "Oh, oh-oh",
                "vietsub": "Oh, oh-oh",
                "blanks": [
                    "ohoh"
                ]
            },
            {
                "index": 43,
                "start": 222.3,
                "end": 227.2,
                "text": "Oh, oh-oh, oh",
                "vietsub": "Oh, oh-oh, oh",
                "blanks": [
                    "ohoh"
                ]
            },
            {
                "index": 44,
                "start": 227.2,
                "end": 231.7,
                "text": "'Cause we were both young when I first saw you",
                "vietsub": "'Cause we were both young when I first saw you",
                "blanks": [
                    "Cause",
                    "were",
                    "both"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "flashback",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "starts",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "standing",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "balcony",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "summer",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "lights",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 119
    },
    {
        "id": "attention-charlie-puth",
        "title": "Attention",
        "artist": "Charlie Puth",
        "youtubeId": "nfs8NYg7yQM",
        "thumbnail": "https://img.youtube.com/vi/nfs8NYg7yQM/hqdefault.jpg",
        "level": "B1",
        "genre": "Funk Pop",
        "accent": "Mỹ (US)",
        "description": "Giai điệu bassline lôi cuốn, giọng hát rõ từng phụ âm, rất tốt để luyện phản xạ nghe nhanh.",
        "lines": [
            {
                "index": 1,
                "start": 4.2,
                "end": 9.4,
                "text": "Whoa-oh, mm-hmm-mm",
                "vietsub": "Whoa-oh, mm-hmm-mm",
                "blanks": [
                    "Whoaoh"
                ]
            },
            {
                "index": 2,
                "start": 9.4,
                "end": 14.2,
                "text": "You've been runnin' 'round, runnin' 'round, runnin' 'round throwin' that dirt all on my name",
                "vietsub": "You've been runnin' 'round, runnin' 'round, runnin' 'round throwin' that dirt all on my name",
                "blanks": [
                    "Youve",
                    "been",
                    "runnin"
                ]
            },
            {
                "index": 3,
                "start": 14.2,
                "end": 19,
                "text": "'Cause you knew that I'd, knew that I'd, knew that I'd call you up, ah",
                "vietsub": "'Cause you knew that I'd, knew that I'd, knew that I'd call you up, ah",
                "blanks": [
                    "Cause",
                    "you",
                    "knew"
                ]
            },
            {
                "index": 4,
                "start": 19,
                "end": 23.7,
                "text": "You've been goin' 'round, goin' 'round, goin' 'round every party in LA",
                "vietsub": "You've been goin' 'round, goin' 'round, goin' 'round every party in LA",
                "blanks": [
                    "Youve",
                    "been",
                    "goin"
                ]
            },
            {
                "index": 5,
                "start": 23.7,
                "end": 29.2,
                "text": "'Cause you knew that I'd, knew that I'd, knew that I'd be at one, oh (oh)",
                "vietsub": "'Cause you knew that I'd, knew that I'd, knew that I'd be at one, oh (oh)",
                "blanks": [
                    "Cause",
                    "you",
                    "knew"
                ]
            },
            {
                "index": 6,
                "start": 29.2,
                "end": 33.4,
                "text": "I know that dress is karma, perfume regret",
                "vietsub": "I know that dress is karma, perfume regret",
                "blanks": [
                    "know",
                    "that",
                    "dress"
                ]
            },
            {
                "index": 7,
                "start": 33.4,
                "end": 38.8,
                "text": "You got me thinkin' 'bout when you were mine, oh",
                "vietsub": "You got me thinkin' 'bout when you were mine, oh",
                "blanks": [
                    "You",
                    "got",
                    "thinkin"
                ]
            },
            {
                "index": 8,
                "start": 38.8,
                "end": 43,
                "text": "And now I'm all up on ya, what'd you expect?",
                "vietsub": "And now I'm all up on ya, what'd you expect?",
                "blanks": [
                    "And",
                    "now",
                    "all"
                ]
            },
            {
                "index": 9,
                "start": 43,
                "end": 46.9,
                "text": "But you're not comin' home with me tonight",
                "vietsub": "But you're not comin' home with me tonight",
                "blanks": [
                    "But",
                    "youre",
                    "not"
                ]
            },
            {
                "index": 10,
                "start": 46.9,
                "end": 51.7,
                "text": "You just want attention, you don't want my heart",
                "vietsub": "You just want attention, you don't want my heart",
                "blanks": [
                    "You",
                    "just",
                    "want"
                ]
            },
            {
                "index": 11,
                "start": 51.7,
                "end": 56,
                "text": "Maybe you just hate the thought of me with someone new",
                "vietsub": "Maybe you just hate the thought of me with someone new",
                "blanks": [
                    "Maybe",
                    "you",
                    "just"
                ]
            },
            {
                "index": 12,
                "start": 56,
                "end": 61.3,
                "text": "Yeah, you just want attention, I knew from the start",
                "vietsub": "Yeah, you just want attention, I knew from the start",
                "blanks": [
                    "Yeah",
                    "you",
                    "just"
                ]
            },
            {
                "index": 13,
                "start": 61.3,
                "end": 67,
                "text": "You're just makin' sure I'm never gettin' over you, oh",
                "vietsub": "You're just makin' sure I'm never gettin' over you, oh",
                "blanks": [
                    "Youre",
                    "just",
                    "makin"
                ]
            },
            {
                "index": 14,
                "start": 67,
                "end": 71.8,
                "text": "You were runnin' 'round, runnin' 'round, runnin' 'round throwin' that dirt all on my name",
                "vietsub": "You were runnin' 'round, runnin' 'round, runnin' 'round throwin' that dirt all on my name",
                "blanks": [
                    "You",
                    "were",
                    "runnin"
                ]
            },
            {
                "index": 15,
                "start": 71.8,
                "end": 76.5,
                "text": "'Cause you knew that I'd, knew that I'd, knew that I'd call you up",
                "vietsub": "'Cause you knew that I'd, knew that I'd, knew that I'd call you up",
                "blanks": [
                    "Cause",
                    "you",
                    "knew"
                ]
            },
            {
                "index": 16,
                "start": 76.5,
                "end": 81.4,
                "text": "Baby, now that we're, now that we're, now that we're right here, standin' face to face",
                "vietsub": "Baby, now that we're, now that we're, now that we're right here, standin' face to face",
                "blanks": [
                    "Baby",
                    "now",
                    "that"
                ]
            },
            {
                "index": 17,
                "start": 81.4,
                "end": 86.8,
                "text": "You already know, 'ready know, 'ready know that you won, oh",
                "vietsub": "You already know, 'ready know, 'ready know that you won, oh",
                "blanks": [
                    "You",
                    "already",
                    "know"
                ]
            },
            {
                "index": 18,
                "start": 86.8,
                "end": 91.1,
                "text": "I know that dress is karma (dress is karma), perfume regret (yeah)",
                "vietsub": "I know that dress is karma (dress is karma), perfume regret (yeah)",
                "blanks": [
                    "know",
                    "that",
                    "dress"
                ]
            },
            {
                "index": 19,
                "start": 91.1,
                "end": 95.9,
                "text": "You got me thinkin' 'bout when you were mine (you got me thinking 'bout when you were mine)",
                "vietsub": "You got me thinkin' 'bout when you were mine (you got me thinking 'bout when you were mine)",
                "blanks": [
                    "You",
                    "got",
                    "thinkin"
                ]
            },
            {
                "index": 20,
                "start": 95.9,
                "end": 100.5,
                "text": "And now I'm all up on ya (all up on ya), what'd you expect? (Oh, baby)",
                "vietsub": "And now I'm all up on ya (all up on ya), what'd you expect? (Oh, baby)",
                "blanks": [
                    "And",
                    "now",
                    "all"
                ]
            },
            {
                "index": 21,
                "start": 100.5,
                "end": 104.4,
                "text": "But you're not coming home with me tonight (oh, no)",
                "vietsub": "But you're not coming home with me tonight (oh, no)",
                "blanks": [
                    "But",
                    "youre",
                    "not"
                ]
            },
            {
                "index": 22,
                "start": 104.4,
                "end": 109.3,
                "text": "You just want attention, you don't want my heart",
                "vietsub": "You just want attention, you don't want my heart",
                "blanks": [
                    "You",
                    "just",
                    "want"
                ]
            },
            {
                "index": 23,
                "start": 109.3,
                "end": 113.8,
                "text": "Maybe you just hate the thought of me with someone new ('one new)",
                "vietsub": "Maybe you just hate the thought of me with someone new ('one new)",
                "blanks": [
                    "Maybe",
                    "you",
                    "just"
                ]
            },
            {
                "index": 24,
                "start": 113.8,
                "end": 118.8,
                "text": "Yeah, you just want attention (oh), I knew from the start (the start)",
                "vietsub": "Yeah, you just want attention (oh), I knew from the start (the start)",
                "blanks": [
                    "Yeah",
                    "you",
                    "just"
                ]
            },
            {
                "index": 25,
                "start": 118.8,
                "end": 125.3,
                "text": "You're just makin' sure I'm never gettin' over you (oh, you), oh",
                "vietsub": "You're just makin' sure I'm never gettin' over you (oh, you), oh",
                "blanks": [
                    "Youre",
                    "just",
                    "makin"
                ]
            },
            {
                "index": 26,
                "start": 125.3,
                "end": 130.1,
                "text": "What are you doin' to me? What are you doin', love? (What are you doin'?)",
                "vietsub": "What are you doin' to me? What are you doin', love? (What are you doin'?)",
                "blanks": [
                    "What",
                    "are",
                    "you"
                ]
            },
            {
                "index": 27,
                "start": 130.1,
                "end": 134.9,
                "text": "What are you doin' to me? What are you doin', love? (What are you doin'?)",
                "vietsub": "What are you doin' to me? What are you doin', love? (What are you doin'?)",
                "blanks": [
                    "What",
                    "are",
                    "you"
                ]
            },
            {
                "index": 28,
                "start": 134.9,
                "end": 139.6,
                "text": "What are you doin' to me? What are you doin', love? (What are you doin'?)",
                "vietsub": "What are you doin' to me? What are you doin', love? (What are you doin'?)",
                "blanks": [
                    "What",
                    "are",
                    "you"
                ]
            },
            {
                "index": 29,
                "start": 139.6,
                "end": 144.3,
                "text": "What are you doin' to me? What are you doin', love?",
                "vietsub": "What are you doin' to me? What are you doin', love?",
                "blanks": [
                    "What",
                    "are",
                    "you"
                ]
            },
            {
                "index": 30,
                "start": 144.3,
                "end": 148.6,
                "text": "I know that dress is karma, perfume regret",
                "vietsub": "I know that dress is karma, perfume regret",
                "blanks": [
                    "know",
                    "that",
                    "dress"
                ]
            },
            {
                "index": 31,
                "start": 148.6,
                "end": 154,
                "text": "You got me thinkin' 'bout when you were mine",
                "vietsub": "You got me thinkin' 'bout when you were mine",
                "blanks": [
                    "You",
                    "got",
                    "thinkin"
                ]
            },
            {
                "index": 32,
                "start": 154,
                "end": 158.2,
                "text": "And now I'm all up on ya, what'd you expect?",
                "vietsub": "And now I'm all up on ya, what'd you expect?",
                "blanks": [
                    "And",
                    "now",
                    "all"
                ]
            },
            {
                "index": 33,
                "start": 158.2,
                "end": 164.4,
                "text": "But you're not comin' home with me tonight, huh",
                "vietsub": "But you're not comin' home with me tonight, huh",
                "blanks": [
                    "But",
                    "youre",
                    "not"
                ]
            },
            {
                "index": 34,
                "start": 164.4,
                "end": 169.1,
                "text": "You just want attention, you don't want my heart",
                "vietsub": "You just want attention, you don't want my heart",
                "blanks": [
                    "You",
                    "just",
                    "want"
                ]
            },
            {
                "index": 35,
                "start": 169.1,
                "end": 173.6,
                "text": "Maybe you just hate the thought of me with someone new",
                "vietsub": "Maybe you just hate the thought of me with someone new",
                "blanks": [
                    "Maybe",
                    "you",
                    "just"
                ]
            },
            {
                "index": 36,
                "start": 173.6,
                "end": 178.7,
                "text": "Yeah, you just want attention, I knew from the start",
                "vietsub": "Yeah, you just want attention, I knew from the start",
                "blanks": [
                    "Yeah",
                    "you",
                    "just"
                ]
            },
            {
                "index": 37,
                "start": 178.7,
                "end": 185.4,
                "text": "You're just makin' sure I'm never gettin' over you (over you)",
                "vietsub": "You're just makin' sure I'm never gettin' over you (over you)",
                "blanks": [
                    "Youre",
                    "just",
                    "makin"
                ]
            },
            {
                "index": 38,
                "start": 185.4,
                "end": 190.1,
                "text": "What are you doin' to me? (Hey) what are you doin', love? (What are you doin', love?)",
                "vietsub": "What are you doin' to me? (Hey) what are you doin', love? (What are you doin', love?)",
                "blanks": [
                    "What",
                    "are",
                    "you"
                ]
            },
            {
                "index": 39,
                "start": 190.1,
                "end": 193.4,
                "text": "What are you doin' to me? What are you doin', love?",
                "vietsub": "What are you doin' to me? What are you doin', love?",
                "blanks": [
                    "What",
                    "are",
                    "you"
                ]
            },
            {
                "index": 40,
                "start": 193.4,
                "end": 198,
                "text": "Yeah, you just want attention (what are you doin' to me?), I knew from the start (what are you doin', love?)",
                "vietsub": "Yeah, you just want attention (what are you doin' to me?), I knew from the start (what are you doin', love?)",
                "blanks": [
                    "Yeah",
                    "you",
                    "just",
                    "knew"
                ]
            },
            {
                "index": 41,
                "start": 198,
                "end": 202.9,
                "text": "You're just makin' sure I'm never gettin' over you (what are you doin' to me? What are you doin', love?)",
                "vietsub": "You're just makin' sure I'm never gettin' over you (what are you doin' to me? What are you doin', love?)",
                "blanks": [
                    "Youre",
                    "just",
                    "makin"
                ]
            },
            {
                "index": 42,
                "start": 202.9,
                "end": 207.4,
                "text": "Oh, oh-oh-oh-oh",
                "vietsub": "Oh, oh-oh-oh-oh",
                "blanks": [
                    "ohohohoh"
                ]
            }
        ],
        "vocabFocus": [
            {
                "word": "whoaoh",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "mmhmmmm",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "runnin",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "throwin",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "perfume",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            },
            {
                "word": "regret",
                "ipa": "",
                "meaning": "Từ vựng trong bài hát"
            }
        ],
        "bpm": 100
    }
];

if (typeof window !== 'undefined') {
    window.YouTubeDictationData = YOUTUBE_DICTATION_SONGS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = YOUTUBE_DICTATION_SONGS;
}
