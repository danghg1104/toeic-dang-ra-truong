const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');

const FFMPEG_PATH = 'C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';
const TARGET_DIR = path.join(__dirname, '..', 'assets', 'listening', 'part1');
const TEMP_DIR = path.join(__dirname, 'temp_photos');

if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Catalog of 33 distinct, hand-curated, high-resolution photography URLs matching each TOEIC question
const PHOTO_CATALOG = [
    // --- TOPIC 1: TRANH TẢ NGƯỜI ---
    {
        id: 'p1_q04',
        filename: 'p1_sample_07_barista.webp',
        topic: 'Tranh tả người',
        subtopic: 'Quán cà phê & Dọn dẹp',
        unsplashId: 'photo-1556742393-d75f468bfcb0', // Barista wiping counter / coffee bar
        description: 'A barista behind a wooden coffee shop counter wiping down the counter'
    },
    {
        id: 'p1_q06',
        filename: 'p1_sample_09_podium.webp',
        topic: 'Tranh tả người',
        subtopic: 'Thuyết trình hội nghị',
        unsplashId: 'photo-1475721027785-f74eccf877e2', // Speaker addressing audience from podium
        description: 'A professional speaker speaking into a microphone behind a wooden podium'
    },
    {
        id: 'p1_q07',
        filename: 'p1_sample_10_warehouse_cart.webp',
        topic: 'Tranh tả người',
        subtopic: 'Kho hàng & Vận chuyển',
        unsplashId: 'photo-1586528116311-ad8dd3c8310d', // Warehouse worker with cart in storage aisle
        description: 'A warehouse worker pushing a handcart through storage aisles'
    },
    {
        id: 'p1_q08',
        filename: 'p1_sample_11_chef.webp',
        topic: 'Tranh tả người',
        subtopic: 'Đầu bếp nhà hàng',
        unsplashId: 'photo-1577219491135-ce391730fb2c', // Chef cooking over commercial gas stove
        description: 'A restaurant chef in white uniform cooking food over a kitchen stove'
    },
    {
        id: 'p1_q09',
        filename: 'p1_sample_12_mechanic.webp',
        topic: 'Tranh tả người',
        subtopic: 'Kỹ thuật viên sửa xe',
        unsplashId: 'photo-1619642751034-765dfdf7c58e', // Mechanic inspecting engine under raised car hood
        description: 'An automotive technician inspecting a vehicle engine in a workshop'
    },
    {
        id: 'p1_q10',
        filename: 'p1_sample_13_receptionist.webp',
        topic: 'Tranh tả người',
        subtopic: 'Lễ tân khách sạn',
        unsplashId: 'photo-1566073771259-6a8506099945', // Front-desk staff typing on computer counter
        description: 'A hotel receptionist working at a front-desk counter with computer'
    },

    // --- TOPIC 2: TRANH TẢ VẬT ---
    {
        id: 'p1_q12',
        filename: 'p1_sample_14_desk.webp',
        topic: 'Tranh tả vật',
        subtopic: 'Bàn làm việc máy tính',
        unsplashId: 'photo-1518455027359-f3f8164ba6bd', // Computer monitors on desk surface
        description: 'Computer monitors positioned on a clean wooden office desk surface'
    },
    {
        id: 'p1_q13',
        filename: 'p1_sample_15_bicycle.webp',
        topic: 'Tranh tả vật',
        subtopic: 'Xe đạp tựa tường',
        unsplashId: 'photo-1485965120184-e220f721d03e', // Bicycle leaning against exterior wall
        description: 'A bicycle leaning against an exterior building brick wall'
    },
    {
        id: 'p1_q14',
        filename: 'p1_sample_16_cabinets.webp',
        topic: 'Tranh tả vật',
        subtopic: 'Tủ hồ sơ văn phòng',
        unsplashId: 'photo-1595515106969-1ce29566ff1c', // Office filing cabinets drawers
        description: 'Metal filing cabinets in an office with one drawer open'
    },
    {
        id: 'p1_q15',
        filename: 'p1_sample_17_clothing_rack.webp',
        topic: 'Tranh tả vật',
        subtopic: 'Giá treo quần áo',
        unsplashId: 'photo-1567401893414-76b7b1e5a7a5', // Garments hanging neatly on display rack
        description: 'Garments hanging neatly on display racks in a retail boutique'
    },
    {
        id: 'p1_q16',
        filename: 'p1_sample_18_luggage.webp',
        topic: 'Tranh tả vật',
        subtopic: 'Hành lý sân bay',
        unsplashId: 'photo-1565538810643-b5bdb714032a', // Several pieces of luggage on ground
        description: 'Suitcases and travel luggage resting on a paved sidewalk'
    },
    {
        id: 'p1_q17',
        filename: 'p1_sample_19_buffet.webp',
        topic: 'Tranh tả vật',
        subtopic: 'Bàn tiệc buffet',
        unsplashId: 'photo-1555244162-803834f70033', // Buffet table with serving dishes
        description: 'Serving dishes and trays arranged along a banquet buffet table'
    },
    {
        id: 'p1_q18',
        filename: 'p1_sample_20_copier.webp',
        topic: 'Tranh tả vật',
        subtopic: 'Máy in văn phòng',
        unsplashId: 'photo-1612815154858-60aa4c59eaa6', // Office printer copier with paper tray
        description: 'A large multifunction copier machine in an office corner'
    },
    {
        id: 'p1_q19',
        filename: 'p1_sample_21_patio.webp',
        topic: 'Tranh tả vật',
        subtopic: 'Dù che hiên quán cà phê',
        unsplashId: 'photo-1517248135467-4c7edcad34c4', // Folded sun umbrellas over patio tables
        description: 'Sun umbrellas folded over outdoor dining tables on a patio'
    },
    {
        id: 'p1_q20',
        filename: 'p1_sample_22_pallets.webp',
        topic: 'Tranh tả vật',
        subtopic: 'Pallet gỗ kho hàng',
        unsplashId: 'photo-1587293852726-70cdb56c2866', // Stacked wooden pallets inside storage
        description: 'Wooden pallets neatly stacked inside an industrial warehouse'
    },

    // --- TOPIC 3: CẢNH & BỐI CẢNH ---
    {
        id: 'p1_q22',
        filename: 'p1_sample_23_terminal.webp',
        topic: 'Cảnh & bối cảnh',
        subtopic: 'Sảnh sân bay',
        unsplashId: 'photo-1530521954074-e64f6810b32d', // Airport terminal flight information screens
        description: 'Flight information departure screens hanging in an airport terminal'
    },
    {
        id: 'p1_q23',
        filename: 'p1_sample_24_crosswalk.webp',
        topic: 'Cảnh & bối cảnh',
        subtopic: 'Ngã tư đường phố',
        unsplashId: 'photo-1506744038136-46273834b3fb', // White pedestrian stripes on city street
        description: 'White zebra pedestrian crossing stripes painted on an urban roadway'
    },
    {
        id: 'p1_q24',
        filename: 'p1_sample_25_auditorium.webp',
        topic: 'Cảnh & bối cảnh',
        subtopic: 'Giảng đường đại học trống',
        unsplashId: 'photo-1524178232363-1fb2b075b655', // Empty university auditorium lecture hall
        description: 'Rows of wooden desks descending toward a podium in an empty lecture hall'
    },
    {
        id: 'p1_q25',
        filename: 'p1_sample_26_pier.webp',
        topic: 'Cảnh & bối cảnh',
        subtopic: 'Bến cảng ven sông',
        unsplashId: 'photo-1507525428034-b723cf961d3e', // Boats docked along pier
        description: 'Boats moored and docked along the edge of a harbor pier'
    },
    {
        id: 'p1_q26',
        filename: 'p1_sample_27_lounge.webp',
        topic: 'Cảnh & bối cảnh',
        subtopic: 'Sảnh chờ khách sạn',
        unsplashId: 'photo-1582719478250-c89cae4dc85b', // Hotel lounge upholstered seating & plants
        description: 'Potted plants positioned beside plush upholstered seating in a hotel lounge'
    },
    {
        id: 'p1_q27',
        filename: 'p1_sample_28_platform.webp',
        topic: 'Cảnh & bối cảnh',
        subtopic: 'Sân ga đường sắt',
        unsplashId: 'photo-1515165562839-978bbcf18277', // Railway station platform and empty tracks
        description: 'A railway passenger platform bordering a pair of empty train tracks'
    },
    {
        id: 'p1_q28',
        filename: 'p1_sample_29_cubicles.webp',
        topic: 'Cảnh & bối cảnh',
        subtopic: 'Văn phòng mở không người',
        unsplashId: 'photo-1497366216548-37526070297c', // Modern office cubicle partitions
        description: 'Partitions dividing an empty open-plan office into work cubicles'
    },
    {
        id: 'p1_q29',
        filename: 'p1_sample_30_overpass.webp',
        topic: 'Cảnh & bối cảnh',
        subtopic: 'Cầu vượt xa lộ',
        unsplashId: 'photo-1502877338535-766e1452684a', // Concrete overpass bridge spanning highway
        description: 'A concrete highway overpass spanning across a multi-lane roadway'
    },
    {
        id: 'p1_q30',
        filename: 'p1_sample_31_supermarket.webp',
        topic: 'Cảnh & bối cảnh',
        subtopic: 'Lối đi siêu thị',
        unsplashId: 'photo-1578916171728-46686eac8d58', // Shelves stocked with goods in grocery aisle
        description: 'Shelves fully stocked with packaged goods along a supermarket aisle'
    },

    // --- TOPIC 4: NGƯỜI & VẬT TƯƠNG TÁC ---
    {
        id: 'p1_q32',
        filename: 'p1_sample_32_flight_attendant.webp',
        topic: 'Người & vật',
        subtopic: 'Tiếp viên hàng không',
        unsplashId: 'photo-1540555700478-4be289fbecef', // Flight attendant serving drink
        description: 'A flight attendant serving a drink to a seated airplane passenger'
    },
    {
        id: 'p1_q33',
        filename: 'p1_sample_33_handshake.webp',
        topic: 'Người & vật',
        subtopic: 'Bắt tay hợp tác',
        unsplashId: 'photo-1521791136064-7986c2920216', // Business handshake across conference table
        description: 'Two professionals shaking hands firmly over a meeting room table'
    },
    {
        id: 'p1_q34',
        filename: 'p1_sample_34_loading_paper.webp',
        topic: 'Người & vật',
        subtopic: 'Nạp giấy máy in',
        unsplashId: 'photo-1568667256549-094345857637', // Employee loading paper into machine tray
        description: 'An office worker loading white printer paper into a copying machine'
    },
    {
        id: 'p1_q35',
        filename: 'p1_sample_35_checkin.webp',
        topic: 'Người & vật',
        subtopic: 'Làm thủ tục nhận phòng',
        unsplashId: 'photo-1551836022-d5d88e9218df', // Hotel guest handing card at reception desk
        description: 'A hotel guest handing a credit card to the receptionist at the front desk'
    },
    {
        id: 'p1_q36',
        filename: 'p1_sample_36_courier.webp',
        topic: 'Người & vật',
        subtopic: 'Giao nhận bưu kiện',
        unsplashId: 'photo-1616401784845-180882ba9ba8', // Delivery courier handing parcel box
        description: 'A courier delivering a cardboard package to an office employee'
    },
    {
        id: 'p1_q37',
        filename: 'p1_sample_37_optician.webp',
        topic: 'Người & vật',
        subtopic: 'Thử kính mắt',
        unsplashId: 'photo-1591076482161-42ce6da69f67', // Customer trying on glasses in front of mirror
        description: 'A customer trying on stylish eyewear frames in front of a mirror'
    },
    {
        id: 'p1_q38',
        filename: 'p1_sample_38_lab.webp',
        topic: 'Người & vật',
        subtopic: 'Phòng thí nghiệm',
        unsplashId: 'photo-1532187863486-abf9dbad1b69', // Scientists inspecting flask in lab
        description: 'Researchers inspecting a liquid flask container in a laboratory'
    },
    {
        id: 'p1_q39',
        filename: 'p1_sample_39_watch_display.webp',
        topic: 'Người & vật',
        subtopic: 'Tư vấn mua đồng hồ',
        unsplashId: 'photo-1523275335684-37898b6baf30', // Salesperson presenting watch on display tray
        description: 'A luxury wristwatch presented neatly on a velvet jeweler display tray'
    },
    {
        id: 'p1_q40',
        filename: 'p1_sample_40_car_rental.webp',
        topic: 'Người & vật',
        subtopic: 'Bàn giao chìa khóa thuê xe',
        unsplashId: 'photo-1560179707-f14e90ef3623', // Handing car keys over desk
        description: 'An agent handing car keys to a customer over a rental counter'
    }
];

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const req = https.get(url, (res) => {
            if (res.statusCode !== 200) {
                file.close();
                fs.existsSync(dest) && fs.unlinkSync(dest);
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(dest);
            });
        });
        req.on('error', err => {
            file.close();
            fs.existsSync(dest) && fs.unlinkSync(dest);
            reject(err);
        });
        req.setTimeout(15000, () => {
            req.abort();
            file.close();
            fs.existsSync(dest) && fs.unlinkSync(dest);
            reject(new Error('Download timeout'));
        });
    });
}

async function processPhotos() {
    console.log(`🚀 Starting high-speed processing for ${PHOTO_CATALOG.length} Part 1 photos...`);
    let successCount = 0;

    for (let i = 0; i < PHOTO_CATALOG.length; i++) {
        const item = PHOTO_CATALOG[i];
        const outWebpPath = path.join(TARGET_DIR, item.filename);

        console.log(`[${i+1}/${PHOTO_CATALOG.length}] Processing ${item.id} (${item.topic} - ${item.subtopic})...`);

        const tempJpg = path.join(TEMP_DIR, `temp_${item.id}.jpg`);
        const downloadUrl = `https://images.unsplash.com/${item.unsplashId}?auto=format&fit=crop&w=1280&h=853&q=80`;

        try {
            await downloadFile(downloadUrl, tempJpg);
            const rawSize = fs.statSync(tempJpg).size;
            console.log(`  ✓ Downloaded raw photo (${Math.round(rawSize / 1024)} KB)`);

            // Convert and crop to exact 1280x853 WebP
            const ffRes = spawnSync(FFMPEG_PATH, [
                '-y',
                '-i', tempJpg,
                '-vf', 'scale=1280:853:force_original_aspect_ratio=increase,crop=1280:853',
                '-c:v', 'libwebp',
                '-lossless', '0',
                '-q:v', '85',
                outWebpPath
            ]);

            if (ffRes.status === 0 && fs.existsSync(outWebpPath)) {
                const webpSize = fs.statSync(outWebpPath).size;
                console.log(`  ✓ Created WebP: ${item.filename} (${Math.round(webpSize / 1024)} KB)`);
                successCount++;
            } else {
                console.error(`  ✗ ffmpeg conversion failed for ${item.filename}`);
            }

            // Cleanup temp file
            if (fs.existsSync(tempJpg)) fs.unlinkSync(tempJpg);
        } catch (err) {
            console.error(`  ✗ Failed ${item.filename}:`, err.message);
        }
    }

    // Cleanup temp dir
    try {
        if (fs.existsSync(TEMP_DIR)) {
            fs.readdirSync(TEMP_DIR).forEach(f => fs.unlinkSync(path.join(TEMP_DIR, f)));
            fs.rmdirSync(TEMP_DIR);
        }
    } catch(e) {}

    console.log(`\n🎉 Processed ${successCount}/${PHOTO_CATALOG.length} photos successfully!`);
}

processPhotos().catch(console.error);
