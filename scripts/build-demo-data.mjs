// Build a publishable, read-only demo dataset from the public snapshots.
// Usage: node scripts/build-demo-data.mjs
// Only public place fields are copied. Private notes (memoryKeyword, description,
// blocks, images) and all runtime/credential data are intentionally excluded.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const places = JSON.parse(readFileSync(join(root, 'data/places.json'), 'utf8'));
const maps = JSON.parse(readFileSync(join(root, 'data/google-maps-cache.json'), 'utf8'));

// Category labels for the four UI languages. Keys match the cleaned category
// names from places.json. Anything not listed falls back to the original text.
const LABELS = {
  '一，咖啡馆系列': ['咖啡馆', 'Cafés', 'カフェ', 'คาเฟ่'],
  '宁曼附近': ['宁曼附近', 'Around Nimman', 'ニマン周辺', 'แถวนิมมาน'],
  '大自然系列': ['大自然', 'Nature', '自然', 'ธรรมชาติ'],
  '落日系列': ['落日', 'Sunsets', '夕日', 'พระอาทิตย์ตก'],
  '宝藏好喝': ['宝藏好喝', 'Hidden gems', '掘り出し物', 'ของอร่อยซ่อนอยู่'],
  '二，Party': ['派对', 'Parties', 'パーティー', 'ปาร์ตี้'],
  '三，市集系列@最美餐厅': ['市集与景观餐厅', 'Markets & view restaurants', 'マーケットと絶景レストラン', 'ตลาดและร้านอาหารวิวสวย'],
  '四，自助餐，จิ้มจุ่ม(小火锅)': ['自助餐与泰式小火锅', 'Buffets & Thai hot pots', 'バイキングとタイ鍋', 'บุฟเฟ่ต์และจิ้มจุ่ม'],
  '五，酒吧': ['酒吧', 'Bars', 'バー', 'บาร์'],
  '六，温泉 spa': ['温泉与 SPA', 'Hot springs & spas', '温泉とスパ', 'บ่อน้ำร้อนและสปา'],
  '六，碳水&泰餐‖location': ['碳水与泰餐', 'Carbs & Thai food', '炭水化物とタイ料理', 'แป้งและอาหารไทย'],
  'Brunch&减脂餐': ['早午餐与轻食', 'Brunch & light meals', 'ブランチとヘルシー料理', 'บรันช์และอาหารคลีน'],
  '七，肉｜蛋白质｜中餐饮食': ['肉类与中餐', 'Meat & Chinese food', '肉・たんぱく質・中華', 'เนื้อและอาหารจีน'],
  '巷子里': ['巷子里', 'Down the alley', '路地裏', 'ในซอย'],
  '八，GYM Fitness‖按摩‖Playing': ['健身与按摩', 'Gym & massage', 'ジム・フィットネス・マッサージ', 'ฟิตเนสและนวด'],
  '九，有趣的活动‖Yuga': ['活动与瑜伽', 'Activities & yoga', 'アクティビティとヨガ', 'กิจกรรมและโยคะ'],
  '九，一小时系列‖湄林地区': ['一小时圈与湄林', 'One-hour trips & Mae Rim', '1 時間圏とメーリム', 'ทริปหนึ่งชั่วโมงและแม่ริม'],
  '十，Hostels': ['青旅', 'Hostels', 'ホステル', 'โฮสเทล'],
  '十一，租车': ['租车', 'Car & bike rental', 'レンタル', 'เช่ารถ'],
  '十二，周边好玩的': ['周边游玩', 'Day trips nearby', '近郊のお出かけ', 'ที่เที่ยวรอบ ๆ'],
  '十三，DJ秀': ['DJ 演出', 'DJ sets', 'DJ イベント', 'โชว์ดีเจ'],
  '十四，生活换汇': ['生活与换汇', 'Errands & exchange', '生活と両替', 'ธุระประจำวันและแลกเงิน'],
  '十五，财绅在哪里': ['常去的地方', 'Regular spots', 'よく行く場所', 'จุดประจำ'],
  '十六，摩托维修': ['摩托维修', 'Motorcycle repair', 'バイク修理', 'ซ่อมรถจักรยานยนต์'],
  '十七，紧急': ['紧急', 'Emergency', '緊急', 'ฉุกเฉิน'],
  '手册': ['手册备注', 'Handbook notes', 'ハンドブックメモ', 'บันทึกคู่มือ'],
};

// Sub-category labels. These are short taxonomy values, so they can be fully
// translated. Long personal area hints stay in their original language and are
// labelled as such in the demo UI.
const SUB_LABELS = {
  '宁曼咖啡': ['宁曼咖啡', 'Nimman cafés', 'ニマンカフェ', 'คาเฟ่นิมมาน'],
  '肉食': ['肉食', 'Meat dishes', '肉料理', 'เนื้อ'],
  '自然咖啡': ['自然咖啡', 'Nature cafés', '自然派カフェ', 'คาเฟ่ธรรมชาติ'],
  '泰餐': ['泰餐', 'Thai food', 'タイ料理', 'อาหารไทย'],
  '古城咖啡': ['古城咖啡', 'Old Town cafés', '旧市街カフェ', 'คาเฟ่ในเมืองเก่า'],
  '酒吧': ['酒吧', 'Bars', 'バー', 'บาร์'],
  '活动': ['活动', 'Activities', 'アクティビティ', 'กิจกรรม'],
  '健身': ['健身', 'Fitness', 'フィットネス', 'ฟิตเนส'],
  '康养': ['康养', 'Wellness', 'ウェルネス', 'สุขภาพ'],
  '中餐': ['中餐', 'Chinese food', '中華料理', 'อาหารจีน'],
  '周边': ['周边', 'Outskirts', '近郊', 'รอบนอก'],
  '攻略': ['攻略', 'Tips', '攻略', 'คำแนะนำ'],
  '市集': ['市集', 'Markets', 'マーケット', 'ตลาด'],
  '火锅': ['火锅', 'Hot pot', '鍋料理', 'หม้อไฟ'],
  '住宿': ['住宿', 'Stays', '宿泊', 'ที่พัก'],
  '租车': ['租车', 'Rentals', 'レンタル', 'เช่ารถ'],
  '换汇': ['换汇', 'Currency exchange', '両替', 'แลกเงิน'],
  '应急': ['应急', 'Emergency', '緊急', 'ฉุกเฉิน'],
  '轻食': ['轻食', 'Light meals', '軽食', 'อาหารเบา'],
  '美食': ['美食', 'Food', 'グルメ', 'อาหาร'],
  '实用': ['实用', 'Practical', '実用', 'ใช้งานได้จริง'],
  '维修': ['维修', 'Repairs', '修理', 'ซ่อม'],
};
const subLabel = (sub, lang) => {
  const i = { zh: 0, en: 1, ja: 2, th: 3 }[lang];
  return SUB_LABELS[sub] ? SUB_LABELS[sub][i] : sub;
};

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/gu;
const clean = (value) => String(value ?? '').replace(EMOJI, '').replace(/\s+/g, ' ').trim();

const label = (cat, lang) => {
  const entry = LABELS[cat];
  if (!entry) return { zh: cat, en: cat, ja: cat, th: cat }[lang] || cat;
  return { zh: 0, en: 1, ja: 2, th: 3 }[lang] !== undefined
    ? entry[{ zh: 0, en: 1, ja: 2, th: 3 }[lang]]
    : cat;
};

const cacheItems = maps.items || {};
const out = [];
const categories = new Set();

for (const item of places.items || []) {
  const cat = clean(item.category || '其他');
  categories.add(cat);
  const extra = cacheItems[item.id] || {};
  const loc = item.location || {};
  const mapUrl = extra.googleMapsUrl || (item.maps || [])[0] || '';

  out.push({
    id: item.id,
    name: clean(item.displayName || item.name || item.title || ''),
    hint: clean(item.hint || item.memoryLabel || ''),
    cat,
    sub: clean(item.detailCategory || ''),
    tags: (item.tags || []).map(clean).filter(Boolean).slice(0, 4),
    lat: typeof loc.lat === 'number' ? loc.lat : null,
    lng: typeof loc.lng === 'number' ? loc.lng : null,
    address: clean(extra.address || ''),
    phone: clean(extra.phone || ''),
    website: clean(extra.website || ''),
    hours: (extra.openingHours || []).map(clean).filter(Boolean).slice(0, 3),
    mapsUrl: clean(mapUrl),
    photo: (extra.photos || [])[0] || '',
    labels: Object.fromEntries(['zh', 'en', 'ja', 'th'].map((l) => [l, label(cat, l)])),
    subLabels: Object.fromEntries(['zh', 'en', 'ja', 'th'].map((l) => [l, subLabel(clean(item.detailCategory || ''), l)])),
  });
}

// De-duplicate map URLs that are clearly unusable and trim long query strings.
for (const p of out) {
  if (p.mapsUrl && p.mapsUrl.length > 500) p.mapsUrl = p.mapsUrl.slice(0, 500);
}

const payload = {
  generatedAt: new Date().toISOString(),
  total: out.length,
  categoryCount: categories.size,
  categories: [...categories],
  places: out,
};

mkdirSync(join(root, 'demo'), { recursive: true });
writeFileSync(
  join(root, 'demo/data.js'),
  '// Generated by scripts/build-demo-data.mjs - public snapshot only, do not edit by hand.\n'
  + 'window.DEMO_DATA = ' + JSON.stringify(payload) + ';\n',
  'utf8',
);

console.log(`Wrote demo/data.js: ${out.length} places, ${categories.size} categories.`);
