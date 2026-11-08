/**
 * Casio fx-570ES PLUS — Engineering Component Database & Pinout Inspector
 * Authentic technical metadata grounded in genuine Casio teardown evidence
 * (Reference: ref_1 to ref_9, PWB-CY230-1J / GY315-1 / HA210303A-2 & Casio GPT AI Mod)
 */

export const COMPONENT_DATABASE = {
    'hard_case': {
        id: 'hard_case',
        nameEn: 'Protective Slide-on Hard Case',
        nameVi: 'Nắp trượt bảo vệ chịu lực',
        type: 'Vỏ cơ khí / Phụ kiện ngoại vi',
        material: 'Nhựa đúc ABS chống va đập (Màu xám bạc/trắng đục hoặc Lilac)',
        specs: {
            dimensions: '165 × 80 × 15 mm',
            weight: '~28 g',
            feature: 'Đường ray trượt 2 bên sườn, 2 ô vuông dập nổi mặt trong chịu chấn động'
        },
        pinout: [
            { pin: 'SLIDE_L', label: 'Ray trượt trái', volt: 'N/A', role: 'Ngàm gài định hướng trượt dọc thân máy' },
            { pin: 'SLIDE_R', label: 'Ray trượt phải', volt: 'N/A', role: 'Ngàm gài định hướng trượt dọc thân máy' },
            { pin: 'LOCK_RIB', label: 'Gờ khóa ma sát', volt: 'N/A', role: 'Khóa cơ học giữ máy không bị tuột rơi' }
        ],
        description: 'Vỏ cứng bảo vệ có thể trượt và khóa vào mặt trước khi di chuyển để tránh trầy xước màn hình LCD và bảo vệ bàn phím khỏi va chạm vô tình, hoặc gắn vào mặt sau khi đang sử dụng.',
        workingPrinciple: 'Cơ chế ngàm gài ray trượt ma sát định hướng (Slide-rail friction lock). Các gờ bên trong bám chặt vào rãnh hông của thân máy giúp cố định chắc chắn mà không cần ốc vít.'
    },

    'front_case': {
        id: 'front_case',
        nameEn: 'Front Bezel & Brushed Aluminum Faceplate',
        nameVi: 'Khung vỏ trước & Mặt nhôm phay xước in Decal',
        type: 'Giao diện thẩm mỹ & Khung chịu lực mặt trước',
        material: 'Tấm hợp kim nhôm Anodized phay xước + Khung viền nhựa ABS Lilac Periwinkle (#54587c)',
        specs: {
            plateFinish: 'Brushed Satin Silver (Bạc phay xước chống trầy)',
            printings: 'CASIO fx-570ES PLUS, NATURAL-V.P.A.M. (Xanh ngọc)',
            cutouts: 'Cửa sổ màn hình LCD 56×28mm, ô góc phải pin mặt trời/camera, 50 lỗ phím',
            bezelColor: 'Màu xanh tím Lilac Periwinkle đặc trưng (#54587c)'
        },
        pinout: [
            { pin: 'ESD_GND', label: 'Tiếp địa nhôm', volt: '0V (GND)', role: 'Dẫn điện tích tĩnh ESD từ tay người dùng xuống mass' },
            { pin: 'LCD_BEZEL', label: 'Viền âm màn hình', volt: 'N/A', role: 'Định vị và ép gioăng chống ẩm cho kính LCD' },
            { pin: 'SOLAR_AP', label: 'Ô cửa sổ Solar', volt: 'N/A', role: 'Cửa đón ánh sáng pin mặt trời (hoặc ống kính AI)' }
        ],
        description: 'Bộ mặt nhận diện thương hiệu của Casio fx-570ES PLUS: Khung viền uốn cong mềm mại kết hợp tấm nhôm bạc phay xước sang trọng. In đầy đủ thương hiệu CASIO, mã máy và nhãn chức năng SHIFT (vàng) / ALPHA (đỏ hồng).',
        workingPrinciple: 'Tấm nhôm được dập khuôn định hình lỗ phím chính xác từng 0.1mm, xử lý bề mặt bằng công nghệ Anodize chống tĩnh điện (ESD) và in lụa chịu mài mòn cao, bảo vệ linh kiện bên trong khỏi va đập.'
    },

    'keycaps_group': {
        id: 'keycaps_group',
        nameEn: '50 Sculpted Mechanical Keycaps',
        nameVi: 'Hệ thống 50 Phím bấm cơ học đúc độc lập',
        type: 'Giao diện nhập liệu người dùng (Physical User Input)',
        material: 'Nhựa đúc cứng PBT/ABS 4 màu (Cam rực, Tím Lilac, Trắng ngà, Than chì)',
        specs: {
            navGroup: '5 phím điều hướng: SHIFT (vàng), ALPHA (đỏ), REPLAY đĩa tròn 4 hướng, MODE, ON',
            sciGroup: '20 phím hàm khoa học than chì: CALC, ∫dx, x⁻¹, log_a, sin, cos, tan, hyp...',
            numGroup: '20 phím số & phép tính trắng ngà: 0-9, +, -, ×, ÷, •, x10ⁿ, Ans, =',
            delAcGroup: '2 phím chức năng đặc biệt: DEL & AC màu cam nổi bật (#f97316)'
        },
        pinout: [
            { pin: 'KEY_ACT', label: 'Chân đẩy cơ học', volt: 'N/A', role: 'Hành trình 1.2mm tác dụng lực nhấn xuống vòm cao su' },
            { pin: 'KEY_GUIDE', label: 'Trụ dẫn hướng', volt: 'N/A', role: 'Trượt dọc lòng ống vỏ trước, chống kẹt góc khi gõ nhanh' }
        ],
        description: 'Tập hợp 50 phím bấm riêng lẻ được chia làm 4 phân khu chức năng chuẩn quốc tế. Mặt chữ được in lụa chịu lực bằng mực chống mòn, đảm bảo hàng triệu lần bấm không mờ ký tự.',
        workingPrinciple: 'Mỗi keycap có chân dẫn hướng hình chữ thập trượt dọc trong ống định hình của vỏ trước. Khi nhấn, chân phím truyền trực tiếp lực cơ học (~0.6N) xuống núm cao su silicone bên dưới.'
    },

    'silicone_membrane': {
        id: 'silicone_membrane',
        nameEn: 'Silicone Rubber Domes & 50 Carbon Pills',
        nameVi: 'Màng đệm cao su đàn hồi & 50 Núm than dẫn điện',
        type: 'Cơ cấu đàn hồi cơ - điện 4 tầng (Tactile Switch Layer)',
        material: 'Silicone nguyên sinh đàn hồi trong mờ + 50 núm than carbon dẫn điện',
        specs: {
            domeCount: '50 núm vòm cao su đàn hồi độc lập',
            carbonPill: 'Núm than dẫn điện Conductive Carbon Pill dán dưới đáy mỗi vòm',
            actuationForce: '0.6 N ± 0.05 N (Độ nảy êm, phản hồi xúc giác Tactile Snap)',
            contactResistance: '< 150 Ω khi tiếp xúc hoàn toàn với vạch đồng PCB'
        },
        pinout: [
            { pin: 'DOME_TOP', label: 'Đỉnh vòm cao su', volt: 'N/A', role: 'Tiếp nhận áp lực từ chân phím nhựa' },
            { pin: 'CARBON_PILL', label: 'Đáy núm than', volt: '3.0V / 0V', role: 'Chạm nối đoản mạch cặp răng lược đồng trên bo mạch' }
        ],
        description: 'Mô phỏng cấu trúc cắt lớp 4 tầng: Phím bấm -> Vòm cao su đàn hồi -> Núm than dẫn điện ở đáy -> Đóng mạch xuống đường đồng PCB (xem chi tiết sơ đồ kỹ thuật ref_8).',
        workingPrinciple: 'Khi người dùng nhấn keycap, vòm cao su bị nén lún và sụp xuống (tactile snap). Viên than carbon dẫn điện chạm trực tiếp vào 2 vạch đồng đan xen trên PCB làm thông mạch. Khi nhả tay, tính đàn hồi đẩy phím nảy về vị trí ban đầu.'
    },

    'lcd_assembly': {
        id: 'lcd_assembly',
        nameEn: 'STN LCD Panel & Natural-V.P.A.M. Display',
        nameVi: 'Cụm Màn hình tinh thể lỏng STN Natural Textbook',
        type: 'Cụm hiển thị quang học (Optical Display Panel)',
        material: 'Kính phủ ITO (Indium Tin Oxide), màng phân cực rêu xám, đệm mút đen chống sốc',
        specs: {
            resolution: '96 × 31 điểm ma trận (Dòng trên) + 7-segment 10+2 chữ số (Dòng dưới)',
            viewingArea: '56 × 28 mm • Độ tương phản 15:1',
            formulaShow: 'Biểu thức tích phân: ∫_0^(π/3) sin(X)dx = 1/2 chuẩn sách giáo khoa',
            backing: 'Đệm mút xốp đen EVA chống sốc + tấm lá nhôm phản quang lớn'
        },
        pinout: [
            { pin: 'COM0-COM31', label: 'Common Backplanes', volt: '±2.5V AC', role: 'Quét thời gian phân chia 32 hàng điểm ảnh' },
            { pin: 'SEG0-SEG95', label: 'Segment Columns', volt: '±2.5V AC', role: 'Kích hoạt 96 cột hiển thị ký tự và biểu thức' },
            { pin: 'VLCD', label: 'Điện áp lái tinh thể', volt: '3.0V DC', role: 'Điện thế kích thích phân tử tinh thể lỏng xoay góc' }
        ],
        description: 'Tấm kính LCD hiển thị công thức toán học tự nhiên Natural Textbook Display. Mặt sau có lớp đệm mút đen chống sốc và tấm phản quang, kết nối tín hiệu qua cáp bẹ dẻo Zebra ép nhiệt.',
        workingPrinciple: 'Điện trường do vi điều khiển kích hoạt giữa các điện cực trong suốt ITO làm xoay hướng các phân tử tinh thể lỏng, làm thay đổi góc phân cực ánh sáng tạo nên các chấm đen sắc nét trên nền xanh rêu.'
    },

    'heat_seal_cable': {
        id: 'heat_seal_cable',
        nameEn: 'Heat-Seal 40-Conductor Zebra Ribbon Cable',
        nameVi: 'Cáp bẹt sọc ngựa vằn Heat-Seal (40 đường dẫn)',
        type: 'Cáp truyền dẫn dữ liệu hiển thị mềm dẻo',
        material: 'Màng mỏng Polyimide chịu nhiệt dán keo dẫn điện dị hướng (ACF)',
        specs: {
            conductors: '40 đường dẫn điện song song mạ bạc nano (Pitch 0.75mm)',
            connection: 'Ép nhiệt phẳng (Hot-bar bonding) giữa kính LCD và đỉnh PCB',
            durability: 'Uốn cong 180° không gãy đứt mạch'
        },
        pinout: [
            { pin: 'CABLE_P01-20', label: 'Đường quét COM', volt: '0V - 3.0V', role: 'Dẫn xung quét hàng từ ASIC lên kính LCD' },
            { pin: 'CABLE_P21-40', label: 'Đường dữ liệu SEG', volt: '0V - 3.0V', role: 'Dẫn dữ liệu pixel hiển thị từ ASIC lên kính LCD' }
        ],
        description: 'Dải cáp bẹ dẻo màu xám trắng với các vạch dẫn điện song song sọc ngựa vằn nối từ mép đáy màn hình LCD xuống hàng pad tiếp xúc trên đỉnh bo mạch chính PCB (thấy rõ trong ảnh ref_3, ref_4, ref_5, ref_9).',
        workingPrinciple: 'Sử dụng keo dẫn điện dị hướng (Anisotropic Conductive Film - ACF), các hạt niken mạ vàng li ti chỉ dẫn điện theo phương vuông góc giữa cáp và bo mạch, ngăn chặn triệt để hiện tượng chập ngắn mạch giữa các đường song song.'
    },

    'tinplate_shield': {
        id: 'tinplate_shield',
        nameEn: 'Galvanized Tinplate LCD Backing Shield',
        nameVi: 'Tấm chắn kim loại mạ thiếc bảo vệ LCD',
        type: 'Khung cơ khí / Che chắn điện từ & Chống lọt sáng',
        material: 'Tấm thép mạ thiếc dập nguội (Galvanized Tinplate Sheet Metal)',
        specs: {
            dimensions: '58 × 30 × 0.4 mm',
            finish: 'Mạ thiếc chống rỉ sét màu bạc sáng',
            opticalRole: 'Chắn sáng 100%, ngăn linh kiện bên trong in bóng lên màn hình',
            structuralRole: 'Giá đỡ lưng tạo mặt phẳng chuẩn xác cho tấm kính tinh thể lỏng'
        },
        pinout: [
            { pin: 'SHIELD_GND', label: 'Tiếp địa kim loại', volt: '0V (GND)', role: 'Lồng Faraday chống nhiễu sóng cao tần RF' },
            { pin: 'TABS_L/R', label: 'Tai kẹp định vị', volt: 'N/A', role: 'Khóa cơ học ép chặt cụm LCD vào khung trước' }
        ],
        description: 'Tấm kim loại mạ thiếc nằm ngay phía sau cụm màn hình LCD (thấy rất rõ ở nửa trên trong ảnh ref_5 và ref_6). Có tác dụng tạo bệ đỡ cứng cáp, phân tán áp lực cơ học khi bấm phím và tạo lớp chắn quang học tuyệt đối.',
        workingPrinciple: 'Chắn toàn bộ ánh sáng xuyên thấu từ lưng máy, đồng thời đóng vai trò lồng Faraday tiếp địa bảo vệ màn hình LCD khỏi hiện tượng tĩnh điện (ESD).'
    },

    'main_pcb': {
        id: 'main_pcb',
        nameEn: 'Casio Main PCB (PWB-CY230-1J / GY315-1)',
        nameVi: 'Bo mạch chủ Casio FR-4 GY315-1 mạ vàng',
        type: 'Hạ tầng điện tử kết nối trung tâm',
        material: 'Phíp sợi thủy tinh 2 lớp FR-4 tiêu chuẩn chống cháy UL94V-0 (Màu xanh lục đậm)',
        specs: {
            boardModel: 'GY315-1 / HA210303A-2 (Hoặc PWB-CY230-1J / JC-94V0)',
            thickness: '0.8 mm • Đồng 1 oz mạ vàng hóa học ENIG chống oxy hóa',
            keyMatrix: '50 cặp tiếp điểm đan ngón tay dạng răng lược SW301',
            testPads: 'Mảng điểm đo mạ vàng K01-K34, BRESET, VSS, B+, B-, S+',
            mounting: '8 chốt nhựa tán nhiệt giữ bo + 4 ốc vít kim loại kèm vòng đệm'
        },
        pinout: [
            { pin: 'B+', label: 'Cực dương Pin', volt: '+1.5V DC', role: 'Nhận nguồn từ cực dương khay pin AAA qua dây đỏ' },
            { pin: 'B- / VSS', label: 'Mass hệ thống', volt: '0V (GND)', role: 'Đường mass chung toàn bộ hệ thống mạch' },
            { pin: 'S+ / S-', label: 'Cực nguồn Solar', volt: '+2.0V DC', role: 'Nhận dòng sạc từ tấm pin mặt trời TRONY' },
            { pin: 'BRESET', label: 'Chân Reset cứng', volt: '0V (Active LOW)', role: 'Đoản mạch xuống mass để reset vi điều khiển' },
            { pin: 'K01-K34', label: 'Key Matrix Test', volt: 'Xung quét', role: 'Các điểm kiểm tra tín hiệu quét hàng và cột bàn phím' },
            { pin: 'T716/T718', label: 'Factory Clock Test', volt: '32.768 kHz', role: 'Điểm đo tần số xung nhịp xuất xưởng' }
        ],
        description: 'Bảng mạch trung tâm của máy tính. Chứa ma trận quét 50 phím bấm dạng các vạch đồng đan xen, vi xử lý COB ASIC, tụ điện hóa CapXon 22µF, tụ dán SMD C1-C8 và cổng kết nối cáp bẹ dẻo với màn hình LCD.',
        workingPrinciple: 'Hoạt động theo nguyên lý ma trận quét bàn phím (Matrix Keyboard Scanning: X hàng × Y cột). Khi phím được nhấn làm đoản mạch cặp tiếp điểm than, xung quét đi vào cột tương ứng giúp vi xử lý nhận diện tức thì mã phím.'
    },

    'asic_controller': {
        id: 'asic_controller',
        nameEn: 'Epoxy Blob COB ASIC U101 & Flash ROM U202',
        nameVi: 'Chip xử lý trung tâm COB ASIC U101 & Flash U202',
        type: 'Bộ não tính toán trung tâm (Central Processing Unit)',
        material: 'Silicon đơn tinh thể phủ keo bảo vệ Epoxy đen bóng (COB) + Chip Flash TSOP-48',
        specs: {
            cobAsic: 'U101: Chip-On-Board giọt keo đen bóng, viền trắng bảo vệ, vạch đánh dấu 1PIN',
            bondingPins: '103 sợi dây vàng siêu mịn kết nối từ die silicon ra các pad quanh viền',
            flashRom: 'U202: TSOP-48 MXIC M29LV320ETTI-70G (32Mbit Flash Memory)',
            powerRating: 'Công suất tiêu thụ siêu thấp: 0.0002 W (200 µW)',
            algorithm: 'ROM nhúng chứa 417 hàm toán học + Công nghệ hiển thị Natural-V.P.A.M.'
        },
        pinout: [
            { pin: '1PIN', label: 'Chân số 1', volt: 'VDD (1.5V)', role: 'Vạch chuẩn định vị chân số 1 của vi xử lý ASIC' },
            { pin: 'VDD_CORE', label: 'Nguồn lõi', volt: '1.2V - 1.5V', role: 'Cấp nguồn cho đơn vị số học luận lý ALU 4-bit/8-bit' },
            { pin: 'OSC_IN/OUT', label: 'Chân thạch anh', volt: 'Xung 32.768kHz', role: 'Dao động thạch anh đồng bộ xung nhịp hệ thống' },
            { pin: 'LCD_DRV', label: 'Lái màn hình', volt: 'Phân đoạn LCD', role: 'Điều khiển trực tiếp 96 cột và 32 hàng LCD' },
            { pin: 'A0-A21', label: 'Bus địa chỉ Flash', volt: '3.0V Logic', role: 'Giao tiếp truy xuất bộ nhớ Flash MXIC U202' },
            { pin: 'D0-D15', label: 'Bus dữ liệu Flash', volt: '3.0V Logic', role: 'Truy xuất thư viện toán học và bảng tính' }
        ],
        description: 'Bộ vi xử lý độc quyền của Casio (mã U101 trong ảnh ref_5, ref_9). Được đúc dưới dạng giọt keo Epoxy đen bóng (COB) để giảm tối đa độ dày. Đi kèm chip nhớ Flash 48 chân MXIC U202 chứa thư viện hàm toán học phong phú.',
        workingPrinciple: 'Nhận tín hiệu quét ma trận bàn phím, phân tích cú pháp biểu thức toán học dạng cây phân nhánh (AST Tree), thực hiện thuật toán dấu phẩy động 15 chữ số và gửi tín hiệu điều khiển ra cụm LCD qua cáp bẹ dẻo.'
    },

    'smd_components': {
        id: 'smd_components',
        nameEn: 'SMD Passives, Filter Cap & HS401 Connector',
        nameVi: 'Hệ thống Linh kiện dán SMD, Tụ điện & Điểm đo Test Pads',
        type: 'Mạch lọc nguồn, khử nhiễu & Đầu nối cáp',
        material: 'Tụ hóa CapXon 22µF 6.3V 85°C, tụ gốm SMD C1-C10, điện trở dán 560/330/680',
        specs: {
            electrolyticCap: 'C7 / C302: Tụ nhôm hình trụ đứng nằm ngang CE 85°C 22uF 6.3V hàn nổi 2 chân chì',
            ceramicCaps: 'C1 đến C10: Tụ gốm dán SMD màu nâu/vàng cam lọc nhiễu đường nguồn',
            resistors: 'Điện trở dán đen in số 560 (56Ω), 330 (33Ω), 680 (68Ω), R115',
            connector: 'HS401: Bẹ cáp trắng 20 chân kim loại kết nối mở rộng'
        },
        pinout: [
            { pin: 'C7_POS', label: 'Cực dương tụ C7', volt: '+1.5V DC', role: 'Lưu điện tích duy trì bộ nhớ khi máy bị rung lắc sụt áp' },
            { pin: 'C7_NEG', label: 'Cực âm tụ C7', volt: '0V (GND)', role: 'Nối mass xả điện áp ngược bảo vệ chip' },
            { pin: 'R_PULLUP', label: 'Điện trở kéo cao', volt: '+1.5V DC', role: 'Giữ mức logic HIGH ổn định cho các chân quét phím' },
            { pin: 'HS401_P01-20', label: 'Chân Bus HS401', volt: '0V - 3.0V', role: '20 chân tín hiệu kiểm tra chất lượng tự động xuất xưởng' }
        ],
        description: 'Mạng lưới linh kiện hỗ trợ (thấy rất rõ trong ảnh macro ref_3 và ref_9). Tụ hóa 22µF nằm ngang giúp duy trì dữ liệu khi thay pin, các tụ gốm dán SMD dập tắt xung nhiễu cao tần sinh ra từ đồng hồ dao động.',
        workingPrinciple: 'Tụ hóa 22µF san phẳng các dao động điện áp đường cấp nguồn; các tụ gốm SMD triệt tiêu xung nhiễu cao tần sinh ra trong quá trình chuyển mạch vi xử lý.'
    },

    'solar_module': {
        id: 'solar_module',
        nameEn: 'Solar Cell Module (TRONY SC1535I)',
        nameVi: 'Tấm Pin năng lượng mặt trời TRONY SC1535I',
        type: 'Bộ chuyển đổi quang năng sang điện năng',
        material: 'Tế bào quang điện silicon vô định hình (Amorphous Silicon) trên đế thủy tinh',
        specs: {
            moduleModel: 'TRONY SC1535I 15 01 (Mặt sau màu nâu vàng in mã hiệu)',
            voltageOut: '2.0V - 2.4V DC dưới ánh sáng văn phòng tiêu chuẩn (300 lux)',
            currentOut: '~15 µA (Đủ nuôi máy mà không cần rút năng lượng từ pin chính)',
            wiring: '2 mối hàn chì cực + (dây đỏ) và - (dây đen/vàng) dẫn xuống chân S+ trên PCB'
        },
        pinout: [
            { pin: 'SOLAR_+', label: 'Cực dương (+) đỏ', volt: '+2.0V DC', role: 'Dẫn điện áp quang điện xuống pad S+ trên bo mạch' },
            { pin: 'SOLAR_-', label: 'Cực âm (-) đen/vàng', volt: '0V (GND)', role: 'Dẫn dòng điện tích âm quang điện xuống pad S- trên PCB' }
        ],
        description: 'Tấm pin mặt trời nằm ở hốc trên cùng bên phải máy tính. Khi có ánh sáng, module tự động gánh toàn bộ tải tiêu thụ 0.0002W, kéo dài tuổi thọ của pin chính lên hơn 3 năm.',
        workingPrinciple: 'Hiệu ứng quang điện trong chất bán dẫn: photon ánh sáng kích thích các cặp electron-lỗ trống trong màng silicon vô định hình, tạo ra hiệu điện thế một chiều nuôi trực tiếp khối điều khiển Casio ASIC.'
    },

    'battery_assembly': {
        id: 'battery_assembly',
        nameEn: 'AAA Battery Bay & Power Wiring (B+ / B-)',
        nameVi: 'Cụm Nguồn Pin AAA 1.5V & Dây nguồn hàn thiếc',
        type: 'Hệ thống cung cấp năng lượng chính',
        material: 'Pin kiềm R03/LR03 AAA (1.5V) + Lò xo thép niken & Lá đồng mạ thiếc + Dây câu nguồn',
        specs: {
            position: 'Nằm ngang tại khoang trên đỉnh máy (Y=71.5mm, hoàn toàn nằm ngoài vùng màn hình)',
            voltage: '1.5V DC (Điện áp danh định)',
            capacity: '~1100 mAh (Pin kiềm AAA)',
            powerConsumption: '0.0002 W (200 µW ở chế độ tính toán)',
            wiring: 'Dây đỏ (BT+ / P171) và dây đen/xanh (BT- / VSS) hàn thiếc vào bo mạch'
        },
        pinout: [
            { pin: 'BT+ (P171)', label: 'Cực dương pin', volt: '+1.5V DC', role: 'Dây đỏ nối từ lá đồng cực dương xuống pad BT+ trên bo' },
            { pin: 'BT- (P170/VSS)', label: 'Cực âm lò xo', volt: '0V (GND)', role: 'Dây đen nối từ lò xo âm xuống mass hệ thống' }
        ],
        description: 'Khoang chứa 1 viên pin đũa AAA 1.5V nằm ngang trên đỉnh máy, có lò xo nén cực âm và lá đồng cực dương. Hai dây điện Đỏ (BT+) và Đen (BT-) được chấm chì hàn thủ công vào góc bo mạch (xem ảnh ref_2, ref_5, ref_6).',
        workingPrinciple: 'Cực âm tiếp xúc qua lò xo thép nén có độ đàn hồi cao, cực dương tì vào lá đồng kim loại. Dòng điện 1.5V được dẫn qua 2 dây câu nguồn chuyên dụng xuống bo mạch chính.'
    },

    'casio_gpt_mod': {
        id: 'casio_gpt_mod',
        nameEn: 'Casio GPT AI Hardware Mod (ESP32-CAM & LiPo)',
        nameVi: 'Module Độ AI "Casio GPT" (ESP32-CAM & Li-Po)',
        type: 'Mạch điện tử nhúng AI nâng cấp (Custom Hardware Mod)',
        material: 'Vi điều khiển ESP32-CAM, camera OV2640, mạch sạc TP4056 Type-C, Pin Li-Po 402030, dây đồng tráng men 0.1mm',
        specs: {
            microcontroller: 'ESP32 Dual-Core 240MHz, 4MB PSRAM, Wi-Fi 802.11 b/g/n & BLE',
            camera: 'Cảm biến ảnh OV2640 2 Megapixel góc nghiêng 15° đặt tại ô Solar',
            display: 'Màn hình OLED/ST7567 độ phân giải cao kết nối giao thức I2C',
            powerSystem: 'Pin Li-Po 402030 (3.7V 250mAh) + Mạch sạc TP4056 cổng Type-C đáy máy',
            keypadTap: 'Dây đồng 0.1mm câu trực tiếp vào chân phím CALC (GPIO12) & REPLAY (GPIO15)'
        },
        pinout: [
            { pin: 'VCC / 3V3', label: 'Nguồn nuôi Mod', volt: '+3.3V DC', role: 'Nguồn ổn áp từ pin Li-Po 3.7V qua IC LDO cấp cho ESP32' },
            { pin: 'GND', label: 'Mass chung', volt: '0V (GND)', role: 'Nối mass chung với bo mạch Casio để đồng bộ mức logic' },
            { pin: 'SCL (GPIO14)', label: 'I2C Clock', volt: '3.3V Xung nhịp', role: 'Đường tạo xung nhịp đồng bộ màn hình hiển thị ST7567' },
            { pin: 'SDA (GPIO13)', label: 'I2C Data', volt: '3.3V Dữ liệu', role: 'Truyền dữ liệu lời giải AI và đồ thị lên màn hình' },
            { pin: 'TRIG (GPIO12)', label: 'Phím CALC Tap', volt: '0V / 3.3V', role: 'Nhận diện khi người dùng bấm CALC để kích hoạt chụp ảnh đề bài' },
            { pin: 'NAV (GPIO15)', label: 'Phím Replay Tap', volt: '0V / 3.3V', role: 'Cuộn trang xem các bước giải chi tiết của mô hình AI' },
            { pin: 'CAM_OV2640', label: 'Camera Interface', volt: 'DVP 8-bit', role: 'Thu nhận hình ảnh đề bài toán học từ bên ngoài' },
            { pin: 'TP4056_IN', label: 'Cổng Type-C', volt: '+5.0V USB', role: 'Chân sạc pin Li-Po chống quá áp và ngắt tự động' }
        ],
        description: 'Bản độ phần cứng "Casio GPT" biến máy tính fx-570ES PLUS thành máy giải toán thông minh: Mắt camera OV2640 ẩn tinh tế trong ô pin mặt trời, vi điều khiển ESP32-CAM kết nối Wi-Fi gọi API Gemini giải bài trong 1.5 giây.',
        workingPrinciple: 'Khi người dùng bấm phím CALC, xung kích hoạt chân GPIO12 đánh thức ESP32. Camera chụp ảnh bài toán qua ô solar, gửi lên Google Gemini API phân tích và truyền ngược kết quả từng bước về màn hình qua giao tiếp I2C.'
    },

    'back_case': {
        id: 'back_case',
        nameEn: 'Injection-Molded Back Shell (>PS< RT03-2)',
        nameVi: 'Vỏ lưng sau đúc khuôn có gân gia cường',
        type: 'Khung cơ khí cấu trúc / Che chắn linh kiện',
        material: 'Nhựa Polystyrene/ABS dập gân gia cường (>PS< RT03-2 CY845)',
        specs: {
            moldingCode: '>PS< RT03-2 CY845 (Dấu khuôn ép nguyên bản)',
            factoryStamp: 'Mã lô sản xuất dập nhiệt: 5W 05 12',
            ribStructure: 'Vòng tròn chịu lực trung tâm + vách ngăn ô bàn cờ (Grid Ribs) nửa dưới',
            fastening: '6 trụ ống bắt vít ren kim loại M1.4 + các gờ ngàm dọc hai bên sườn'
        },
        pinout: [
            { pin: 'RESET_HOLE', label: 'Lỗ chọc Reset', volt: 'N/A', role: 'Đường dẫn chọc que tăm vào phím RESET trên bo mạch' },
            { pin: 'SCREW_BOSS_6X', label: '6 Trụ bắt vít', volt: 'N/A', role: 'Trụ định vị và bắt chặt 6 ốc liên kết vỏ trước - vỏ sau' },
            { pin: 'LATCH_RIBS', label: 'Gờ ngàm sườn', volt: 'N/A', role: 'Ngàm khớp khóa kín khe hở chống bụi bẩn lọt vào mạch' }
        ],
        description: 'Mặt trong vỏ sau được dựng đúng kết cấu kỹ thuật nhà máy: Vòng tròn gân chịu lực lớn ở giữa, hệ thống vách ngăn ô bàn cờ chống vặn xoắn ở nửa dưới, các gờ ngàm dọc hai sườn và 6 trụ ống bắt vít.',
        workingPrinciple: 'Định hình bằng khuôn ép nhựa chính xác với các trụ đỡ vít bắt chặt vào vỏ trước, tạo thành khung hộp chịu lực đồng đều giúp bàn phím không bị uốn cong khi người dùng tác dụng lực gõ phím liên tục.'
    }
};
