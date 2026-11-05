/**
 * 生成「旅游手册式插画导览地图」的共享图层配置。
 * 正式站 (public/) 与 GitHub Pages 只读 demo (demo/) 使用完全相同的文件。
 *
 * 设计参考：mamahuhu.blog 的清迈地图介绍图 —— 米白浅底、柔和半透明色块、
 * 大号地标文字、图标化标注。色块位置落在清迈真实经纬度附近，
 * 因此 MapLibre（正式站）与 SVG（demo）可以共用同一份数据。
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const L = (zh, en, ja, th) => ({ zh, en, ja, th });

/** 用 36 个点近似椭圆，得到 GeoJSON / SVG 都能用的多边形 */
function ellipse(lng, lat, rx, ry) {
  const points = [];
  for (let i = 0; i <= 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    points.push([+(lng + Math.cos(a) * rx).toFixed(6), +(lat + Math.sin(a) * ry).toFixed(6)]);
  }
  return points;
}

function rectangle(west, east, south, north) {
  return [
    [west, north], [east, north], [east, south], [west, south], [west, north]
  ];
}

const zones = [
  {
    id: 'mountain',
    shape: 'ellipse',
    label: L('', '', '', ''),
    polygon: ellipse(98.918, 18.812, 0.055, 0.052),
    fill: '#b9dcae', fillOpacity: 0.30,
    stroke: '#8bbd86', strokeOpacity: 0.35,
    labelAt: null
  },
  {
    id: 'nimman',
    shape: 'ellipse',
    label: L('尼曼路', 'NIMMAN', 'ニマン', 'นิมมาน'),
    polygon: ellipse(98.9685, 18.7995, 0.020, 0.0145),
    fill: '#8ec9e8', fillOpacity: 0.66,
    stroke: '#4d9fc7', strokeOpacity: 0.55,
    labelAt: [98.9665, 18.8015], labelColor: '#c8322b', labelSize: 'large'
  },
  {
    id: 'changphueak',
    shape: 'ellipse',
    label: L('菖蒲路', 'CHANG PHUEAK', 'チャンプアック', 'ช้างเผือก'),
    polygon: ellipse(98.9985, 18.8225, 0.022, 0.0165),
    fill: '#f5df85', fillOpacity: 0.70,
    stroke: '#d7b94f', strokeOpacity: 0.55,
    labelAt: [98.9995, 18.8245], labelColor: '#c8322b', labelSize: 'large'
  },
  {
    id: 'nightbazaar',
    shape: 'ellipse',
    label: L('长康路\n& 夜市区', 'NIGHT\nBAZAAR', 'ナイト\nバザール', 'ไนท์\nบาซาร์'),
    polygon: ellipse(99.0085, 18.7825, 0.016, 0.020),
    fill: '#f7c68e', fillOpacity: 0.68,
    stroke: '#dd9a55', strokeOpacity: 0.55,
    // 标签右移到橙色块右半、略下压，避免与「古城区」大字叠在一起
    labelAt: [99.0115, 18.7765], labelColor: '#c8322b', labelSize: 'large'
  },
  {
    // 古城粉色方块最后绘制，压在蓝/橙色块之上，保持参考图里的主体地位
    id: 'oldcity',
    shape: 'rect',
    label: L('古城区', 'OLD CITY', '旧市街', 'เมืองเก่า'),
    polygon: rectangle(98.9735, 98.9975, 18.7825, 18.7985),
    fill: '#efc2dd', fillOpacity: 0.72,
    stroke: '#d792bb', strokeOpacity: 0.6,
    labelAt: [98.9820, 18.7960], labelColor: '#c8322b', labelSize: 'large'
  }
];

const landmarks = [
  { id: 'doi-suthep', label: L('素帖山', 'DOI SUTHEP', 'ドイステープ', 'ดอยสุเทพ'), at: [98.9455, 18.8275], color: '#c8322b', size: 'large' },
  { id: 'ping-river', label: L('湄平河', 'PING RIVER', 'ピン川', 'แม่น้ำปิง'), at: [99.0275, 18.8155], color: '#20527d', size: 'large' },
  { id: 'airport', label: L('清迈机场', 'CHIANG MAI AIRPORT', 'チェンマイ空港', 'ท่าอากาศยานฯ'), at: [98.9575, 18.7665], color: '#20527d', size: 'medium', vertical: true },
  { id: 'wat-phra-that', label: L('悟孟寺', 'WAT UMONG', 'ウモン寺', 'วัดอุโมงค์'), at: [98.9515, 18.7845], color: '#3c4a42', size: 'small' },
  { id: 'suthep-road', label: L('素帖路', 'SUTHEP RD.', 'ステープ通り', 'ถ.สุเทพ'), at: [98.9665, 18.7805], color: '#3c4a42', size: 'small' }
];

const icons = [
  { id: 'coffee', glyph: '☕', at: [98.9655, 18.7955], tone: '#7b5b3e' },
  { id: 'temple-a', glyph: '🛕', at: [98.9965, 18.8165], tone: '#8a6a3c' },
  { id: 'temple-b', glyph: '🛕', at: [98.9855, 18.7875], tone: '#8a5c38' },
  { id: 'mountain', glyph: '⛰️', at: [98.9505, 18.8045], tone: '#5d7a48' },
  { id: 'plane', glyph: '✈️', at: [98.9625, 18.7735], tone: '#20527d' },
  { id: 'shopping', glyph: '🛍️', at: [99.0205, 18.7905], tone: '#b4467d' },
  { id: 'noodles', glyph: '🍜', at: [99.0125, 18.8205], tone: '#b06a3b' },
  { id: 'ferris', glyph: '🎡', at: [98.9425, 18.8425], tone: '#4c7d9a' }
];

const titles = {
  zh: '清迈地图介绍',
  en: 'CHIANG MAI GUIDE MAP',
  ja: 'チェンマイ案内地図',
  th: 'แผนที่นำเที่ยวเชียงใหม่'
};

/** 自动吸附的基准点与半径（无定位权限时使用市中心） */
const snap = {
  radiusKm: 3,
  overviewZoom: 9.4,
  // 聚焦时推近到城区，四块色块与大号地标才看得清；手机视野窄，再退一档
  focusZoom: 12.2,
  focusZoomMobile: 11.6,
  // 50 km 全图时隐藏插画层，避免城区文字挤成一团
  guideMinZoom: 10.8
};

const config = {
  version: 1,
  source: 'illustrated guide overlay, hand-authored from the Chiang Mai reference map',
  palette: {
    paper: '#f7f5ec',
    ink: '#20322c',
    red: '#c8322b',
    blue: '#20527d',
    frame: '#173f36'
  },
  titles,
  zones,
  landmarks,
  icons,
  snap
};

const features = zones.map((zone) => ({
  type: 'Feature',
  geometry: { type: 'Polygon', coordinates: [zone.polygon] },
  properties: {
    id: zone.id,
    fill: zone.fill,
    opacity: zone.fillOpacity,
    stroke: zone.stroke,
    strokeOpacity: zone.strokeOpacity
  }
}));

const payload = `${JSON.stringify(config, null, 2)}\n`;
const outputs = [
  'public/guide-config.js',
  'demo/guide-config.js'
];

for (const relative of outputs) {
  const target = join(root, relative);
  writeFileSync(target, `/* 由 scripts/build-guide-config.mjs 生成，请勿手改。插画导览地图共享配置 */\nwindow.GUIDE_CONFIG = ${payload}window.GUIDE_ZONES = ${JSON.stringify({ type: 'FeatureCollection', features }, null, 2)};\n`, 'utf8');
  console.log(`wrote ${relative}`);
}

// 确保两份产物一致，避免正式站与演示页出现视觉差异
const a = join(root, outputs[0]);
const b = join(root, outputs[1]);
execFileSync('cmp', [a, b], { stdio: 'inherit' });
console.log(`guide config: ${zones.length} zones, ${landmarks.length} landmarks, ${icons.length} icons, outputs identical`);
