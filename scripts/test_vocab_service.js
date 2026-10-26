const https = require('https');
const fs = require('fs');

// Curated topic vocabulary bank for fallback and instant play
const CURATED_VOCAB_BANK = {
  'du-lich': {
    name: 'Du lịch (Travel)',
    A1: [
      { word: "hotel", meaning: "khách sạn", phonetic: "/hoʊˈtel/", level: "A1" },
      { word: "trip", meaning: "chuyến đi", phonetic: "/trɪp/", level: "A1" },
      { word: "ticket", meaning: "vé (tàu, xe, máy bay)", phonetic: "/ˈtɪk.ɪt/", level: "A1" },
      { word: "beach", meaning: "bãi biển", phonetic: "/biːtʃ/", level: "A1" },
      { word: "train", meaning: "tàu hỏa", phonetic: "/treɪn/", level: "A1" },
      { word: "visit", meaning: "thăm quan, ghé thăm", phonetic: "/ˈvɪz.ɪt/", level: "A1" },
      { word: "map", meaning: "bản đồ", phonetic: "/mæp/", level: "A1" },
      { word: "city", meaning: "thành phố", phonetic: "/ˈsɪt.i/", level: "A1" },
      { word: "tour", meaning: "chuyến du lịch", phonetic: "/tʊər/", level: "A1" },
      { word: "plane", meaning: "máy bay", phonetic: "/pleɪn/", level: "A1" }
    ],
    A2: [
      { word: "flight", meaning: "chuyến bay", phonetic: "/flaɪt/", level: "A2" },
      { word: "luggage", meaning: "hành lý", phonetic: "/ˈlʌɡ.ɪdʒ/", level: "A2" },
      { word: "airport", meaning: "sân bay", phonetic: "/ˈer.pɔːrt/", level: "A2" },
      { word: "passport", meaning: "hộ chiếu", phonetic: "/ˈpæs.pɔːrt/", level: "A2" },
      { word: "tourist", meaning: "khách du lịch", phonetic: "/ˈtʊr.ɪst/", level: "A2" },
      { word: "suitcase", meaning: "va li", phonetic: "/ˈsuːt.keɪs/", level: "A2" },
      { word: "station", meaning: "nhà ga", phonetic: "/ˈsteɪ.ʃən/", level: "A2" },
      { word: "departure", meaning: "khởi hành, xuất phát", phonetic: "/dɪˈpɑːr.tʃər/", level: "A2" },
      { word: "arrival", meaning: "đến nơi, hạ cánh", phonetic: "/əˈraɪ.vəl/", level: "A2" },
      { word: "reservation", meaning: "đặt chỗ trước", phonetic: "/ˌrez.ɚˈveɪ.ʃən/", level: "A2" }
    ],
    B1: [
      { word: "itinerary", meaning: "lịch trình chuyến đi", phonetic: "/aɪˈtɪn.ə.rer.i/", level: "B1" },
      { word: "accommodation", meaning: "nơi ăn chốn ở", phonetic: "/əˌkɑː.məˈdeɪ.ʃən/", level: "B1" },
      { word: "sightseeing", meaning: "ngắm cảnh, tham quan", phonetic: "/ˈsaɪtˌsiː.ɪŋ/", level: "B1" },
      { word: "souvenir", meaning: "quà lưu niệm", phonetic: "/ˌsuː.vəˈnɪr/", level: "B1" },
      { word: "destination", meaning: "điểm đến", phonetic: "/ˌdes.təˈneɪ.ʃən/", level: "B1" },
      { word: "customs", meaning: "hải quan", phonetic: "/ˈkʌs.təmz/", level: "B1" },
      { word: "excursion", meaning: "chuyến du ngoạn ngắn", phonetic: "/ɪkˈskɝː.ʒən/", level: "B1" },
      { word: "delayed", meaning: "bị hoãn lại", phonetic: "/dɪˈleɪd/", level: "B1" },
      { word: "explore", meaning: "khám phá vùng đất mới", phonetic: "/ɪkˈsplɔːr/", level: "B1" },
      { word: "scenery", meaning: "phong cảnh thiên nhiên", phonetic: "/ˈsiː.nər.i/", level: "B1" }
    ],
    B2: [
      { word: "picturesque", meaning: "đẹp như tranh vẽ", phonetic: "/ˌpɪk.tʃərˈesk/", level: "B2" },
      { word: "hospitality", meaning: "lòng hiếu khách", phonetic: "/ˌhɑː.spɪˈtæl.ə.t̬i/", level: "B2" },
      { word: "breathtaking", meaning: "ngoạn mục, nghẹt thở", phonetic: "/ˈbreθˌteɪ.kɪŋ/", level: "B2" },
      { word: "boarding pass", meaning: "thẻ lên máy bay", phonetic: "/ˈbɔːr.dɪŋ ˌpæs/", level: "B2" },
      { word: "backpacking", meaning: "du lịch bụi", phonetic: "/ˈbækˌpæk.ɪŋ/", level: "B2" },
      { word: "overseas", meaning: "nước ngoài, hải ngoại", phonetic: "/ˌoʊ.vɚˈsiːz/", level: "B2" },
      { word: "cancellation", meaning: "sự hủy bỏ chuyến đi", phonetic: "/ˌsæn.səlˈeɪ.ʃən/", level: "B2" },
      { word: "currency", meaning: "tiền tệ nước sở tại", phonetic: "/ˈkɝː.ən.si/", level: "B2" },
      { word: "expedition", meaning: "chuyến thám hiểm", phonetic: "/ˌek.spəˈdɪʃ.ən/", level: "B2" },
      { word: "remote", meaning: "hẻo lánh, xa xôi", phonetic: "/rɪˈmoʊt/", level: "B2" }
    ],
    C1: [
      { word: "wanderlust", meaning: "niềm đam mê xê dịch", phonetic: "/ˈwɑːn.dɚ.lʌst/", level: "C1" },
      { word: "tranquil", meaning: "thanh bình, yên ả", phonetic: "/ˈtræŋ.kwɪl/", level: "C1" },
      { word: "cosmopolitan", meaning: "quốc tế, đa văn hóa", phonetic: "/ˌkɑːz.məˈpɑː.lɪ.tən/", level: "C1" },
      { word: "panoramic", meaning: "toàn cảnh bao la", phonetic: "/ˌpæn.əˈræm.ɪk/", level: "C1" },
      { word: "pilgrimage", meaning: "chuyến hành hương", phonetic: "/ˈpɪl.ɡrə.mɪdʒ/", level: "C1" },
      { word: "sojourn", meaning: "thời gian lưu trú tạm thời", phonetic: "/ˈsoʊ.dʒɝːn/", level: "C1" },
      { word: "exhilarating", meaning: "phấn khởi hào hứng", phonetic: "/ɪɡˈzɪl.ə.reɪ.t̬ɪŋ/", level: "C1" },
      { word: "secluded", meaning: "tách biệt, tĩnh mịch", phonetic: "/səˈkluː.dɪd/", level: "C1" },
      { word: "voyage", meaning: "chuyến hải trình dài", phonetic: "/ˈvɔɪ.ɪdʒ/", level: "C1" },
      { word: "magnificence", meaning: "vẻ tráng lệ, nguy nga", phonetic: "/mæɡˈnɪf.ə.səns/", level: "C1" }
    ],
    C2: [
      { word: "peripatetic", meaning: "chu du, lưu động khắp nơi", phonetic: "/ˌper.ə.pəˈtet̬.ɪk/", level: "C2" },
      { word: "archipelago", meaning: "quần đảo mênh mông", phonetic: "/ˌɑːr.kəˈpel.ə.ɡoʊ/", level: "C2" },
      { word: "uncharted", meaning: "chưa từng được khai phá", phonetic: "/ʌnˈtʃɑːr.t̬ɪd/", level: "C2" },
      { word: "globetrotter", meaning: "người đi chu du năm châu", phonetic: "/ˈɡloʊbˌtrɑː.t̬ɚ/", level: "C2" },
      { word: "itinerant", meaning: "nay đây mai đó", phonetic: "/aɪˈtɪn.ɚ.ənt/", level: "C2" },
      { word: "transcontinental", meaning: "xuyên lục địa", phonetic: "/ˌtrænz.kɑːn.təˈnen.t̬əl/", level: "C2" },
      { word: "hinterland", meaning: "vùng nội địa xa xôi", phonetic: "/ˈhɪn.t̬ɚ.lænd/", level: "C2" },
      { word: "nautical", meaning: "thuộc về hàng hải", phonetic: "/ˈnɑː.t̬ɪ.kəl/", level: "C2" },
      { word: "maritime", meaning: "vùng duyên hải biển cả", phonetic: "/ˈmer.ə.taɪm/", level: "C2" },
      { word: "bohemian", meaning: "phong cách tự do phóng khoáng", phonetic: "/boʊˈhiː.mi.ən/", level: "C2" }
    ]
  }
};

console.log('Sample curated vocab words:', CURATED_VOCAB_BANK['du-lich'].B1.length);
