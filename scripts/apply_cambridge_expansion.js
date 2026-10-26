const fs = require('fs');
const path = require('path');

// 1. Tải danh sách hiện tại
const currentTopics = require('../lib/vocab-ai-service.js').CURATED_VOCAB_TOPICS;

// 2. Danh sách mở rộng chuẩn Cambridge English Dictionary
const additions = {
  technology: {
    A1: [
      { word: "link", meaning: "đường dẫn liên kết", phonetic: "/lɪŋk/", level: "A1" },
      { word: "file", meaning: "tập tin dữ liệu", phonetic: "/faɪl/", level: "A1" }
    ],
    A2: [
      { word: "server", meaning: "máy chủ mạng máy tính", phonetic: "/ˈsɝː.vɚ/", level: "A2" },
      { word: "router", meaning: "bộ định tuyến internet", phonetic: "/ˈruː.t̬ɚ/", level: "A2" },
      { word: "folder", meaning: "thư mục lưu trữ tập tin", phonetic: "/ˈfoʊl.dɚ/", level: "A2" }
    ],
    B1: [
      { word: "firewall", meaning: "tường lửa bảo mật hệ thống", phonetic: "/ˈfaɪr.wɑːl/", level: "B1" },
      { word: "database", meaning: "cơ sở dữ liệu thông tin", phonetic: "/ˈdeɪ.t̬ə.beɪs/", level: "B1" },
      { word: "browser", meaning: "trình duyệt tra cứu mạng", phonetic: "/ˈbraʊ.zɚ/", level: "B1" }
    ],
    B2: [
      { word: "firmware", meaning: "phần mềm nhúng phần cứng", phonetic: "/ˈfɝːm.wer/", level: "B2" },
      { word: "bandwidth", meaning: "băng thông truyền tải mạng", phonetic: "/ˈbænd.wɪtθ/", level: "B2" },
      { word: "bluetooth", meaning: "kết nối không dây tầm ngắn", phonetic: "/ˈbluː.tuːθ/", level: "B2" }
    ],
    C1: [
      { word: "scalability", meaning: "khả năng mở rộng hệ thống", phonetic: "/ˌskeɪ.ləˈbɪl.ə.t̬i/", level: "C1" },
      { word: "quantum", meaning: "điện toán lượng tử tiên tiến", phonetic: "/ˈkwɑːn.t̬əm/", level: "C1" },
      { word: "hyperlink", meaning: "siêu liên kết trực tuyến", phonetic: "/ˈhaɪ.pɚ.lɪŋk/", level: "C1" }
    ],
    C2: [
      { word: "obsolescence", meaning: "sự lỗi thời của thiết bị công nghệ", phonetic: "/ˌɑːb.səˈles.əns/", level: "C2" },
      { word: "interoperability", meaning: "khả năng tương tác đa nền tảng", phonetic: "/ˌɪn.t̬ɚˌɑː.pɚ.əˈbɪl.ə.t̬i/", level: "C2" }
    ]
  },

  travel: {
    A1: [
      { word: "tour", meaning: "chuyến tham quan du lịch", phonetic: "/tʊr/", level: "A1" },
      { word: "taxi", meaning: "xe tắc-xi chở khách", phonetic: "/ˈtæk.si/", level: "A1" },
      { word: "boat", meaning: "thuyền du ngoạn trên sông", phonetic: "/boʊt/", level: "A1" }
    ],
    A2: [
      { word: "guide", meaning: "hướng dẫn viên dẫn đoàn", phonetic: "/ɡaɪd/", level: "A2" },
      { word: "station", meaning: "nhà ga tàu xe trung tâm", phonetic: "/ˈsteɪ.ʃən/", level: "A2" },
      { word: "subway", meaning: "hệ thống tàu điện ngầm", phonetic: "/ˈsʌb.weɪ/", level: "A2" }
    ],
    B1: [
      { word: "boarding", meaning: "thủ tục lên máy bay", phonetic: "/ˈbɔːr.dɪŋ/", level: "B1" },
      { word: "terminal", meaning: "nhà ga sân bay quốc tế", phonetic: "/ˈtɝː.mə.nəl/", level: "B1" },
      { word: "currency", meaning: "tiền tệ quy đổi bản địa", phonetic: "/ˈkɝː.ən.si/", level: "B1" }
    ],
    B2: [
      { word: "excursion", meaning: "chuyến dã ngoại ngắn ngày", phonetic: "/ɪkˈskɝː.ʒən/", level: "B2" },
      { word: "voyage", meaning: "hải trình vượt đại dương xa", phonetic: "/ˈvɔɪ.ɪdʒ/", level: "B2" },
      { word: "stopover", meaning: "điểm dừng chân nối chuyến", phonetic: "/ˈstɑːpˌoʊ.vɚ/", level: "B2" }
    ],
    C1: [
      { word: "expedition", meaning: "cuộc thám hiểm khám phá", phonetic: "/ˌek.spəˈdɪʃ.ən/", level: "C1" },
      { word: "scenic", meaning: "thắng cảnh tươi đẹp hữu tình", phonetic: "/ˈsiː.nɪk/", level: "C1" },
      { word: "panoramic", meaning: "góc nhìn toàn cảnh bao la", phonetic: "/ˌpæn.əˈræm.ɪk/", level: "C1" }
    ],
    C2: [
      { word: "itinerant", meaning: "chu du nay đây mai đó", phonetic: "/aɪˈtɪn.ɚ.ənt/", level: "C2" },
      { word: "peregrination", meaning: "hành trình du ngoạn dài ngày", phonetic: "/ˌper.ə.ɡrəˈneɪ.ʃən/", level: "C2" }
    ]
  },

  business: {
    A1: [
      { word: "bank", meaning: "ngân hàng giao dịch tài chính", phonetic: "/bæŋk/", level: "A1" },
      { word: "card", meaning: "thẻ thanh toán điện tử", phonetic: "/kɑːrd/", level: "A1" },
      { word: "coin", meaning: "tiền kim loại", phonetic: "/kɔɪn/", level: "A1" }
    ],
    A2: [
      { word: "bill", meaning: "hóa đơn thanh toán tiền", phonetic: "/bɪl/", level: "A2" },
      { word: "market", meaning: "thị trường giao thương", phonetic: "/ˈmɑːr.kɪt/", level: "A2" },
      { word: "seller", meaning: "người bán hàng thương gia", phonetic: "/ˈsel.ɚ/", level: "A2" }
    ],
    B1: [
      { word: "revenue", meaning: "tổng doanh thu định kỳ", phonetic: "/ˈrev.ə.nuː/", level: "B1" },
      { word: "dividend", meaning: "cổ tức chi trả cổ đông", phonetic: "/ˈdɪv.ə.dend/", level: "B1" },
      { word: "capital", meaning: "nguồn vốn đầu tư sinh lời", phonetic: "/ˈkæp.ə.t̬əl/", level: "B1" }
    ],
    B2: [
      { word: "portfolio", meaning: "danh mục đầu tư tài chính", phonetic: "/ˌpɔːrtˈfoʊ.li.oʊ/", level: "B2" },
      { word: "franchise", meaning: "nhượng quyền thương hiệu", phonetic: "/ˈfræn.tʃaɪz/", level: "B2" },
      { word: "collateral", meaning: "tài sản bảo đảm thế chấp", phonetic: "/kəˈlæt̬.ɚ.əl/", level: "B2" }
    ],
    C1: [
      { word: "acquisition", meaning: "thương vụ mua lại doanh nghiệp", phonetic: "/ˌæk.wəˈzɪʃ.ən/", level: "C1" },
      { word: "liquidity", meaning: "tính thanh khoản tiền tệ", phonetic: "/lɪˈkwɪd.ə.t̬i/", level: "C1" },
      { word: "conglomerate", meaning: "tập đoàn kinh tế đa ngành", phonetic: "/kəŋˈɡlɑː.mɚ.ət/", level: "C1" }
    ],
    C2: [
      { word: "depreciation", meaning: "sự khấu hao tài sản cố định", phonetic: "/dɪˌpriː.ʃiˈeɪ.ʃən/", level: "C2" },
      { word: "solvency", meaning: "khả năng thanh toán nợ dài hạn", phonetic: "/ˈsɑːl.vən.si/", level: "C2" },
      { word: "fiduciary", meaning: "ủy thác bảo đảm tín thác", phonetic: "/fɪˈduː.ʃi.er.i/", level: "C2" }
    ]
  },

  ghibli: {
    A1: [
      { word: "leaf", meaning: "chiếc lá rừng xanh mướt", phonetic: "/liːf/", level: "A1" },
      { word: "bell", meaning: "tiếng chuông gió ngân nga", phonetic: "/bel/", level: "A1" },
      { word: "path", meaning: "lối mòn quanh co giữa rừng", phonetic: "/pæθ/", level: "A1" }
    ],
    A2: [
      { word: "cloud", meaning: "đám mây trôi lững lờ trời chiều", phonetic: "/klaʊd/", level: "A2" },
      { word: "stone", meaning: "viên đá phép thuật rêu phong", phonetic: "/stoʊn/", level: "A2" },
      { word: "river", meaning: "dòng sông trong vắt hiền hòa", phonetic: "/ˈrɪv.ɚ/", level: "A2" }
    ],
    B1: [
      { word: "mysterious", meaning: "huyền bí ẩn giấu", phonetic: "/mɪˈstɪr.i.əs/", level: "B1" },
      { word: "wonderland", meaning: "xứ sở thần tiên kỳ diệu", phonetic: "/ˈwʌn.dɚ.lænd/", level: "B1" },
      { word: "charming", meaning: "duyên dáng đáng yêu lạ kỳ", phonetic: "/ˈtʃɑːr.mɪŋ/", level: "B1" }
    ],
    B2: [
      { word: "enchanted", meaning: "bị mê hoặc trong thế giới phép màu", phonetic: "/ɪnˈtʃæn.t̬ɪd/", level: "B2" },
      { word: "whimsical", meaning: "kỳ ảo bay bổng thơ mộng", phonetic: "/ˈwɪm.zɪ.kəl/", level: "B2" },
      { word: "solitude", meaning: "sự thanh tịnh an yên giữa thiên nhiên", phonetic: "/ˈsɑː.lə.tuːd/", level: "B2" }
    ],
    C1: [
      { word: "wonderment", meaning: "sự kinh ngạc ngỡ ngàng trước điều kỳ diệu", phonetic: "/ˈwʌn.dɚ.mənt/", level: "C1" },
      { word: "otherworldly", meaning: "thoát tục như đến từ cõi tiên", phonetic: "/ˌʌð.ɚˈwɝːld.li/", level: "C1" },
      { word: "resplendent", meaning: "rực rỡ lung linh tráng lệ", phonetic: "/rɪˈsplen.dənt/", level: "C1" }
    ],
    C2: [
      { word: "quintessence", meaning: "tinh hoa cốt lõi tinh túy nhất", phonetic: "/kwɪnˈtes.əns/", level: "C2" },
      { word: "effervescent", meaning: "sôi nổi lấp lánh tràn đầy nhựa sống", phonetic: "/ˌef.ɚˈves.ənt/", level: "C2" },
      { word: "ineffable", meaning: "tuyệt mỹ không thốt nên lời", phonetic: "/ɪnˈef.ə.bəl/", level: "C2" }
    ]
  },

  interview: {
    A1: [
      { word: "learn", meaning: "học hỏi kiến thức mới", phonetic: "/lɝːn/", level: "A1" },
      { word: "talk", meaning: "nói chuyện diễn đạt tự tin", phonetic: "/tɑːk/", level: "A1" },
      { word: "listen", meaning: "chăm chú lắng nghe", phonetic: "/ˈlɪs.ən/", level: "A1" }
    ],
    A2: [
      { word: "skill", meaning: "kỹ năng làm việc chuyên môn", phonetic: "/skɪl/", level: "A2" },
      { word: "study", meaning: "nghiên cứu học vấn trau dồi", phonetic: "/ˈstʌd.i/", level: "A2" },
      { word: "future", meaning: "định hướng sự nghiệp tương lai", phonetic: "/ˈfjuː.tʃɚ/", level: "A2" }
    ],
    B1: [
      { word: "applicant", meaning: "ứng viên nộp đơn dự tuyển", phonetic: "/ˈæp.lə.kənt/", level: "B1" },
      { word: "candidate", meaning: "ứng cử viên sáng giá", phonetic: "/ˈkæn.dɪ.deɪt/", level: "B1" },
      { word: "credential", meaning: "chứng chỉ năng lực hành nghề", phonetic: "/krəˈden.ʃəl/", level: "B1" }
    ],
    B2: [
      { word: "initiative", meaning: "tinh thần chủ động sáng tạo", phonetic: "/ɪˈnɪʃ.ə.t̬ɪv/", level: "B2" },
      { word: "proficiency", meaning: "sự thành thạo tay nghề cao", phonetic: "/prəˈfɪʃ.ən.si/", level: "B2" },
      { word: "resilience", meaning: "bản lĩnh kiên cường vượt khó", phonetic: "/rɪˈzɪl.jəns/", level: "B2" }
    ],
    C1: [
      { word: "meticulous", meaning: "tỉ mỉ chu đáo từng chi tiết", phonetic: "/məˈtɪk.jə.ləs/", level: "C1" },
      { word: "prerequisite", meaning: "điều kiện tiên quyết bắt buộc", phonetic: "/ˌpriːˈrek.wə.zɪt/", level: "C1" },
      { word: "articulate", meaning: "diễn đạt mạch lạc khúc chiết", phonetic: "/ɑːrˈtɪk.jə.lət/", level: "C1" }
    ],
    C2: [
      { word: "sagacity", meaning: "sự uyên bác sáng suốt nhạy bén", phonetic: "/səˈɡæs.ə.t̬i/", level: "C2" },
      { word: "erudition", meaning: "học thức uyên thâm sâu rộng", phonetic: "/ˌer.jəˈdɪʃ.ən/", level: "C2" },
      { word: "magnanimity", meaning: "tấm lòng độ lượng cao thượng", phonetic: "/ˌmæɡ.nəˈnɪm.ə.t̬i/", level: "C2" }
    ]
  },

  daily: {
    A1: [
      { word: "smile", meaning: "nụ cười tươi rạng rỡ", phonetic: "/smaɪl/", level: "A1" },
      { word: "drink", meaning: "thức uống ngon lành", phonetic: "/drɪŋk/", level: "A1" },
      { word: "bread", meaning: "bánh mì thơm giòn", phonetic: "/bred/", level: "A1" }
    ],
    A2: [
      { word: "clean", meaning: "dọn dẹp nhà cửa sạch sẽ", phonetic: "/kliːn/", level: "A2" },
      { word: "cook", meaning: "nấu nướng bữa ăn ngon", phonetic: "/kʊk/", level: "A2" },
      { word: "share", meaning: "chia sẻ niềm vui cùng bạn bè", phonetic: "/ʃer/", level: "A2" },
      { word: "hobby", meaning: "thú vui giải trí lành mạnh", phonetic: "/ˈhɑː.bi/", level: "A2" }
    ],
    B1: [
      { word: "chores", meaning: "công việc nhà hàng ngày", phonetic: "/tʃɔːrz/", level: "B1" },
      { word: "commute", meaning: "quãng đường đi lại làm việc", phonetic: "/kəˈmjuːt/", level: "B1" },
      { word: "leisure", meaning: "thời gian thảnh thơi nhàn rỗi", phonetic: "/ˈleʒ.ɚ/", level: "B1" },
      { word: "belonging", meaning: "đồ đạc vật dụng gắn bó", phonetic: "/bɪˈlɑːŋ.ɪŋ/", level: "B1" }
    ],
    B2: [
      { word: "hospitality", meaning: "lòng hiếu khách niềm nở", phonetic: "/ˌhɑː.spɪˈtæl.ə.t̬i/", level: "B2" },
      { word: "acquaintance", meaning: "người quen biết xã giao", phonetic: "/əˈkweɪn.təns/", level: "B2" },
      { word: "heartfelt", meaning: "chân thành từ tận đáy lòng", phonetic: "/ˈhɑːrt.felt/", level: "B2" },
      { word: "empathy", meaning: "sự thấu cảm sẻ chia", phonetic: "/ˈem.pə.θi/", level: "B2" }
    ],
    C1: [
      { word: "serendipity", meaning: "sự tình cờ may mắn diệu kỳ", phonetic: "/ˌser.ənˈdɪp.ə.t̬i/", level: "C1" },
      { word: "convivial", meaning: "thân thiện hòa đồng vui vẻ", phonetic: "/kənˈvɪv.i.əl/", level: "C1" },
      { word: "camaraderie", meaning: "tình bạn gắn bó keo sơn", phonetic: "/ˌkæm.əˈrɑː.dɚ.i/", level: "C1" },
      { word: "cordiality", meaning: "sự thân ái nồng hậu", phonetic: "/ˌkɔːr.dʒiˈæl.ə.t̬i/", level: "C1" }
    ],
    C2: [
      { word: "affability", meaning: "sự hòa nhã dễ mến lịch thiệp", phonetic: "/ˌæf.əˈbɪl.ə.t̬i/", level: "C2" },
      { word: "gregariousness", meaning: "tính thích giao lưu chan hòa", phonetic: "/ɡrɪˈɡer.i.əs.nəs/", level: "C2" },
      { word: "amiability", meaning: "tính cách khả ái tốt bụng", phonetic: "/ˌeɪ.mi.əˈbɪl.ə.t̬i/", level: "C2" }
    ]
  },

  food: {
    A1: [
      { word: "meat", meaning: "thịt tươi giàu dinh dưỡng", phonetic: "/miːt/", level: "A1" },
      { word: "soup", meaning: "món súp canh nóng hổi", phonetic: "/suːp/", level: "A1" },
      { word: "cake", meaning: "bánh ngọt tráng miệng thơm", phonetic: "/keɪk/", level: "A1" },
      { word: "fish", meaning: "cá tươi giàu dưỡng chất", phonetic: "/fɪʃ/", level: "A1" },
      { word: "rice", meaning: "cơm gạo dẻo thơm", phonetic: "/raɪs/", level: "A1" }
    ],
    A2: [
      { word: "taste", meaning: "nếm mùi vị món ăn", phonetic: "/teɪst/", level: "A2" },
      { word: "snack", meaning: "đồ ăn nhẹ giữa buổi", phonetic: "/snæk/", level: "A2" },
      { word: "fresh", meaning: "thực phẩm tươi ngon tự nhiên", phonetic: "/freʃ/", level: "A2" },
      { word: "plate", meaning: "chiếc đĩa đựng thức ăn", phonetic: "/pleɪt/", level: "A2" }
    ],
    B1: [
      { word: "flavor", meaning: "hương vị đặc trưng thơm ngon", phonetic: "/ˈfleɪ.vɚ/", level: "B1" },
      { word: "recipe", meaning: "công thức nấu ăn chuẩn xác", phonetic: "/ˈres.ə.pi/", level: "B1" },
      { word: "cuisine", meaning: "nền ẩm thực đặc sắc", phonetic: "/kwɪˈziːn/", level: "B1" },
      { word: "ingredient", meaning: "nguyên liệu chế biến món ăn", phonetic: "/ɪnˈɡriː.di.ənt/", level: "B1" },
      { word: "simmer", meaning: "ninh nhỏ lửa liu riu", phonetic: "/ˈsɪm.ɚ/", level: "B1" },
      { word: "steamed", meaning: "hấp cách thủy thanh đạm", phonetic: "/stiːmd/", level: "B1" }
    ],
    B2: [
      { word: "appetizer", meaning: "món khai vị mở màn bữa tiệc", phonetic: "/ˈæp.ə.taɪ.zɚ/", level: "B2" },
      { word: "nutrition", meaning: "giá trị dinh dưỡng bồi bổ", phonetic: "/nuːˈtrɪʃ.ən/", level: "B2" },
      { word: "beverage", meaning: "đồ uống giải khát hảo hạng", phonetic: "/ˈbev.ɚ.ɪdʒ/", level: "B2" },
      { word: "delicacy", meaning: "món đặc sản sơn hào hải vị", phonetic: "/ˈdel.ə.kə.si/", level: "B2" },
      { word: "seasoning", meaning: "gia vị nêm nếm đậm đà", phonetic: "/ˈsiː.zən.ɪŋ/", level: "B2" },
      { word: "pastry", meaning: "bánh nướng ngọt bùi", phonetic: "/ˈpeɪ.stri/", level: "B2" }
    ],
    C1: [
      { word: "delectable", meaning: "ngon tuyệt cú mèo khoái khẩu", phonetic: "/dɪˈlek.tə.bəl/", level: "C1" },
      { word: "gastronomy", meaning: "nghệ thuật ẩm thực cao cấp", phonetic: "/ɡæsˈtrɑː.nə.mi/", level: "C1" },
      { word: "epicurean", meaning: "hưởng lạc phong vị sành ăn", phonetic: "/ˌep.ə.kjʊˈriː.ən/", level: "C1" },
      { word: "piquant", meaning: "vị cay nồng đậm đà kích thích", phonetic: "/ˈpiː.kənt/", level: "C1" },
      { word: "savor", meaning: "nhấm nháp thưởng thức phong vị", phonetic: "/ˈseɪ.vɚ/", level: "C1" }
    ],
    C2: [
      { word: "palatable", meaning: "vừa miệng ngon thanh tao", phonetic: "/ˈpæl.ə.t̬ə.bəl/", level: "C2" },
      { word: "epicure", meaning: "chuyên gia sành ăn tinh hoa", phonetic: "/ˈep.ə.kjʊr/", level: "C2" },
      { word: "gustatory", meaning: "thuộc về cảm thụ vị giác cao quý", phonetic: "/ˈɡʌs.tə.tɔːr.i/", level: "C2" },
      { word: "epicureanism", meaning: "triết lý ẩm thực tao nhã", phonetic: "/ˌep.ə.kjʊˈriː.ə.nɪ.zəm/", level: "C2" }
    ]
  },

  workplace: {
    A1: [
      { word: "team", meaning: "nhóm đồng đội làm việc", phonetic: "/tiːm/", level: "A1" },
      { word: "file", meaning: "tập hồ sơ tài liệu", phonetic: "/faɪl/", level: "A1" },
      { word: "call", meaning: "cuộc gọi trao đổi", phonetic: "/kɑːl/", level: "A1" }
    ],
    A2: [
      { word: "plan", meaning: "kế hoạch hành động chi tiết", phonetic: "/plæn/", level: "A2" },
      { word: "share", meaning: "chia sẻ thông tin công việc", phonetic: "/ʃer/", level: "A2" },
      { word: "rules", meaning: "nội quy quy định công ty", phonetic: "/ruːlz/", level: "A2" },
      { word: "tool", meaning: "công cụ phần mềm hỗ trợ", phonetic: "/tuːl/", level: "A2" }
    ],
    B1: [
      { word: "workflow", meaning: "quy trình làm việc trơn tru", phonetic: "/ˈwɝːk.floʊ/", level: "B1" },
      { word: "feedback", meaning: "ý kiến đóng góp xây dựng", phonetic: "/ˈfiːd.bæk/", level: "B1" },
      { word: "handbook", meaning: "sổ tay nhân viên cẩm nang", phonetic: "/ˈhænd.bʊk/", level: "B1" },
      { word: "personnel", meaning: "đội ngũ nhân sự công ty", phonetic: "/ˌpɝː.sənˈel/", level: "B1" }
    ],
    B2: [
      { word: "incentive", meaning: "khoản thưởng khích lệ năng suất", phonetic: "/ɪnˈsen.t̬ɪv/", level: "B2" },
      { word: "negotiate", meaning: "đàm phán thỏa thuận điều khoản", phonetic: "/nəˈɡoʊ.ʃi.eɪt/", level: "B2" },
      { word: "delegation", meaning: "sự ủy quyền phân công nhiệm vụ", phonetic: "/ˌdel.əˈɡeɪ.ʃən/", level: "B2" },
      { word: "synergy", meaning: "sức mạnh cộng hưởng tập thể", phonetic: "/ˈsɪn.ɚ.dʒi/", level: "B2" }
    ],
    C1: [
      { word: "streamline", meaning: "tối ưu hóa tinh giản quy trình", phonetic: "/ˈstriːm.laɪn/", level: "C1" },
      { word: "competence", meaning: "năng lực chuyên môn vững vàng", phonetic: "/ˈkɑːm.pə.t̬əns/", level: "C1" },
      { word: "governance", meaning: "năng lực quản trị điều hành", phonetic: "/ˈɡʌv.ɚ.nəns/", level: "C1" },
      { word: "proactive", meaning: "chủ động tiên phong đón đầu việc", phonetic: "/proʊˈæk.tɪv/", level: "C1" }
    ],
    C2: [
      { word: "complacency", meaning: "thói tự mãn ngủ quên trên chiến thắng", phonetic: "/kəmˈpleɪ.sən.si/", level: "C2" },
      { word: "prerogative", meaning: "đặc quyền quyền hạn lãnh đạo", phonetic: "/prɪˈrɑː.ɡə.t̬ɪv/", level: "C2" },
      { word: "superannuation", meaning: "chế độ hưu trí thâm niên", phonetic: "/ˌsuː.pɚˌæn.juˈeɪ.ʃən/", level: "C2" }
    ]
  }
};

// 3. Tiến hành gộp và loại bỏ trùng lặp
const mergedTopics = JSON.parse(JSON.stringify(currentTopics));

for (const [topicKey, topicData] of Object.entries(mergedTopics)) {
  const extraLevels = additions[topicKey] || {};
  const seenWords = new Set();
  
  // Đăng ký các từ đã có
  for (const [lvl, wordList] of Object.entries(topicData.words)) {
    for (const item of wordList) {
      seenWords.add(item.word.toLowerCase());
    }
  }

  // Thêm các từ mới
  for (const [lvl, extraList] of Object.entries(extraLevels)) {
    if (!topicData.words[lvl]) topicData.words[lvl] = [];
    for (const extraItem of extraList) {
      if (!seenWords.has(extraItem.word.toLowerCase())) {
        topicData.words[lvl].push(extraItem);
        seenWords.add(extraItem.word.toLowerCase());
      }
    }
  }
}

// 4. In thống kê
console.log('--- THỐNG KÊ SAU KHI MỞ RỘNG VỐN TỪ CAMBRIDGE ---');
for (const [k, d] of Object.entries(mergedTopics)) {
  const counts = Object.entries(d.words).map(([lvl, arr]) => lvl + ':' + arr.length).join(', ');
  const total = Object.values(d.words).reduce((s, a) => s + a.length, 0);
  console.log(k, 'Total:', total, '(', counts, ')');
}

// 5. Cập nhật lib/vocab-ai-service.js
const servicePath = path.join(__dirname, '..', 'lib', 'vocab-ai-service.js');
let serviceCode = fs.readFileSync(servicePath, 'utf8');

const targetTopicsBlock = 'const CURATED_VOCAB_TOPICS = ' + JSON.stringify(mergedTopics, null, 2) + ';\n';
const startIdx = serviceCode.indexOf('const CURATED_VOCAB_TOPICS = {');
const endIdx = serviceCode.indexOf('function findMatchingCuratedTopic(');

if (startIdx !== -1 && endIdx !== -1) {
  serviceCode = serviceCode.substring(0, startIdx) + targetTopicsBlock + '\n' + serviceCode.substring(endIdx);
  // Sửa min clamp từ 5 thành 1
  serviceCode = serviceCode.replace(
    'const targetCount = Math.min(Math.max(parseInt(count, 10) || 10, 5), 50);',
    'const targetCount = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50);'
  );
  // Tăng max_tokens nếu sinh nhiều từ
  serviceCode = serviceCode.replace(
    'max_tokens: 380',
    'max_tokens: Math.min(Math.max(targetCount * 38, 450), 2200)'
  );
  fs.writeFileSync(servicePath, serviceCode, 'utf8');
  console.log('✅ Đã cập nhật thành công lib/vocab-ai-service.js!');
} else {
  console.error('❌ Không tìm thấy block CURATED_VOCAB_TOPICS trong lib/vocab-ai-service.js');
}

// 6. Cập nhật js/vocab-game-workstation.js
const workstationPath = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let workstationCode = fs.readFileSync(workstationPath, 'utf8');

const wsStartIdx = workstationCode.indexOf('    const CURATED_FRONTEND_TOPIC_BANK = {');
const wsEndIdx = workstationCode.indexOf('    class VocabGameWorkstation {');

if (wsStartIdx !== -1 && wsEndIdx !== -1) {
  const wsTopicsBlock = '    const CURATED_FRONTEND_TOPIC_BANK = ' + JSON.stringify(mergedTopics, null, 2) + ';\n\n';
  workstationCode = workstationCode.substring(0, wsStartIdx) + wsTopicsBlock + workstationCode.substring(wsEndIdx);
  fs.writeFileSync(workstationPath, workstationCode, 'utf8');
  console.log('✅ Đã cập nhật thành công CURATED_FRONTEND_TOPIC_BANK trong js/vocab-game-workstation.js!');
} else {
  console.error('❌ Không tìm thấy block CURATED_FRONTEND_TOPIC_BANK trong js/vocab-game-workstation.js');
}
