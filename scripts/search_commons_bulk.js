const https = require('https');

const queries = [
    { id: 'p1_sample_07_barista', query: 'barista wiping counter OR barista coffee machine' },
    { id: 'p1_sample_09_podium', query: 'speaker podium microphone lecture conference' },
    { id: 'p1_sample_10_warehouse_cart', query: 'warehouse worker hand truck cart' },
    { id: 'p1_sample_11_chef', query: 'chef cooking stove restaurant kitchen pan' },
    { id: 'p1_sample_12_mechanic', query: 'mechanic engine car hood repair' },
    { id: 'p1_sample_13_receptionist', query: 'hotel receptionist desk computer counter' },
    
    { id: 'p1_sample_14_desk', query: 'computer monitors office desk workplace' },
    { id: 'p1_sample_15_bicycle', query: 'bicycle leaning wall street' },
    { id: 'p1_sample_16_cabinets', query: 'filing cabinet office open drawer' },
    { id: 'p1_sample_17_clothing_rack', query: 'clothing store clothes rack hangers' },
    { id: 'p1_sample_18_luggage', query: 'suitcases luggage pavement airport' },
    { id: 'p1_sample_19_buffet', query: 'buffet table serving dishes chafing' },
    { id: 'p1_sample_20_copier', query: 'office photocopier printer tray paper' },
    { id: 'p1_sample_21_patio', query: 'outdoor cafe patio tables umbrellas' },
    { id: 'p1_sample_22_pallets', query: 'wooden pallets warehouse storage stacked' },

    { id: 'p1_sample_23_terminal', query: 'airport terminal flight information display screen' },
    { id: 'p1_sample_24_crosswalk', query: 'pedestrian crosswalk zebra stripes city street' },
    { id: 'p1_sample_25_auditorium', query: 'empty lecture hall university classroom auditorium' },
    { id: 'p1_sample_26_pier', query: 'boats docked pier harbor marina' },
    { id: 'p1_sample_27_lounge', query: 'hotel lobby lounge sofa armchairs potted plants' },
    { id: 'p1_sample_28_platform', query: 'train station platform railway tracks empty' },
    { id: 'p1_sample_29_cubicles', query: 'office cubicles partitions workstation empty' },
    { id: 'p1_sample_30_overpass', query: 'highway overpass bridge road multi lane' },
    { id: 'p1_sample_31_supermarket', query: 'supermarket aisle shelves grocery products' },

    { id: 'p1_sample_32_flight_attendant', query: 'flight attendant serving passenger airplane cabin' },
    { id: 'p1_sample_33_handshake', query: 'business handshake meeting agreement table' },
    { id: 'p1_sample_34_loading_paper', query: 'loading paper printer copier office' },
    { id: 'p1_sample_35_checkin', query: 'hotel check in reception guest desk' },
    { id: 'p1_sample_36_courier', query: 'courier delivery package handing person' },
    { id: 'p1_sample_37_optician', query: 'optician eyewear glasses mirror trying' },
    { id: 'p1_sample_38_lab', query: 'laboratory scientists researchers flask beaker' },
    { id: 'p1_sample_39_watch_display', query: 'watch shop counter display jewelry salesperson' },
    { id: 'p1_sample_40_car_rental', query: 'handing car keys counter customer rental' }
];

function searchWikimedia(item) {
    return new Promise((resolve) => {
        const encQuery = encodeURIComponent(item.query + ' filetype:bitmap');
        const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=${encQuery}&gsrlimit=3&prop=imageinfo&iiprop=url|mime|size`;
        
        const req = https.get(url, { headers: { 'User-Agent': 'ToeicPrepApp/1.0 (contact: student@toeic.vn)' } }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = Object.values(json.query?.pages || {});
                    const valid = pages.filter(p => p.imageinfo && p.imageinfo[0] && (p.imageinfo[0].mime === 'image/jpeg' || p.imageinfo[0].mime === 'image/png'));
                    if (valid.length > 0) {
                        resolve({ id: item.id, url: valid[0].imageinfo[0].url, title: valid[0].title });
                    } else {
                        resolve({ id: item.id, url: null });
                    }
                } catch(e) {
                    resolve({ id: item.id, url: null, error: e.message });
                }
            });
        });
        req.on('error', e => resolve({ id: item.id, url: null, error: e.message }));
    });
}

async function main() {
    console.log(`Starting search for ${queries.length} items...`);
    const results = [];
    for (let i = 0; i < queries.length; i++) {
        const r = await searchWikimedia(queries[i]);
        console.log(`[${i+1}/${queries.length}] ${r.id}: ${r.url ? '✓ Found: ' + r.title : '✗ Not found'}`);
        results.push(r);
        // Small delay to be polite to Wikipedia API
        await new Promise(res => setTimeout(res, 200));
    }
    const foundCount = results.filter(r => r.url).length;
    console.log(`\nFound ${foundCount}/${queries.length} images directly from Wikimedia Commons!`);
}

main().catch(console.error);
