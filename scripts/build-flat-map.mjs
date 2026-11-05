// 生成「清迈平面地图」的共享配置（演示页与正式站各一份，内容完全一致）
// 运行：node scripts/build-flat-map.mjs
// 底图 assets/chiang-mai-basemap.png 由 OSM zoom 11 瓦片拼接，见仓库根目录 chiang-mai-basemap.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CENTER = { lng: 98.9853, lat: 18.7883 }; // 清迈老城中心
const HALF_KM = 50;                             // 上下左右各 50km，用户指定的上限
const Z = 11, TILE = 256, N = 2 ** Z;

const dLat = HALF_KM / 111.32;
const dLng = HALF_KM / (111.32 * Math.cos(CENTER.lat * Math.PI / 180));
const bounds = {
  west: CENTER.lng - dLng, east: CENTER.lng + dLng,
  south: CENTER.lat - dLat, north: CENTER.lat + dLat
};

const lon2x = (lng) => (lng + 180) / 360 * N;
const lat2y = (lat) => (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * N;
const x0 = Math.floor(lon2x(bounds.west)), y0 = Math.floor(lat2y(bounds.north));
const originX = x0 * TILE, originY = y0 * TILE;
const width = (Math.floor(lon2x(bounds.east)) - x0 + 1) * TILE;
const height = (Math.floor(lat2y(bounds.south)) - y0 + 1) * TILE;
const frame = {
  left: lon2x(bounds.west) * TILE - originX,
  right: lon2x(bounds.east) * TILE - originX,
  top: lat2y(bounds.north) * TILE - originY,
  bottom: lat2y(bounds.south) * TILE - originY
};
// 拼接底图 PNG 的四角经纬度，供 MapLibre image source 作为离线兜底底图使用
const mapScale = N * TILE;
const lngOf = (x) => x / mapScale * 360 - 180;
const latOf = (y) => Math.atan(Math.sinh(Math.PI * (1 - 2 * y / mapScale))) * 180 / Math.PI;
const corners = [
  [lngOf(originX), latOf(originY)],                   // 左上
  [lngOf(originX + width), latOf(originY)],           // 右上
  [lngOf(originX + width), latOf(originY + height)],  // 右下
  [lngOf(originX), latOf(originY + height)]           // 左下
];

const config = {
  version: 1,
  center: CENTER,
  halfKm: HALF_KM,
  bounds,
  boundsLabel: { west: 'W 98.5109°', east: 'E 99.4597°', north: 'N 19.2375°', south: 'S 18.3391°' },
  basemap: {
    image: 'chiang-mai-basemap.png',
    zoom: Z, tileSize: TILE, originX, originY, width, height, frame, corners,
    attribution: '© OpenStreetMap contributors (ODbL)'
  },
  directions: {
    zh: { N: '北', E: '东', S: '南', W: '西' },
    en: { N: 'N', E: 'E', S: 'S', W: 'W' },
    ja: { N: '北', E: '東', S: '南', W: '西' },
    th: { N: 'เหนือ', E: 'ตะวันออก', S: 'ใต้', W: 'ตะวันตก' }
  }
};

const js = `/* 由 scripts/build-flat-map.mjs 生成，请勿手改。清迈 50km 平面地图共享配置 */
window.FLAT_MAP_CONFIG = ${JSON.stringify(config, null, 2)};
if (typeof module !== 'undefined') module.exports = window.FLAT_MAP_CONFIG;
`;
const targets = [
  path.join(root, 'demo', 'flat-map-config.js'),
  path.join(root, 'public', 'flat-map-config.js')
];
for (const target of targets) {
  fs.writeFileSync(target, js);
  console.log('写入', path.relative(root, target));
}

// 打印 50km 之外的地点，供文档与界外标注核对
const places = JSON.parse(fs.readFileSync(path.join(root, 'data', 'places.json'), 'utf8'));
const km = (a, b) => {
  const R = 6371, dl = (a.lat - b.lat) * Math.PI / 180, dg = (a.lng - b.lng) * Math.PI / 180;
  const s = Math.sin(dl / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dg / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};
const located = places.items.filter((x) => Number.isFinite(x.location?.lat) && Number.isFinite(x.location?.lng));
const outside = located
  .map((x) => ({ name: x.displayName || x.name, ...x.location, km: +km(x.location, CENTER).toFixed(1) }))
  .filter((x) => x.km > HALF_KM)
  .sort((a, b) => b.km - a.km);
console.log(`\n有坐标 ${located.length} 个；距市中心 >${HALF_KM}km 的界外地点 ${outside.length} 个：`);
outside.forEach((x) => console.log(`  ${x.km}km  ${x.name}  (${x.lat.toFixed(4)}, ${x.lng.toFixed(4)})`));
const outsideFrame = located.filter((x) => x.location.lat > bounds.north || x.location.lat < bounds.south || x.location.lng < bounds.west || x.location.lng > bounds.east);
console.log(`真正落在 50km 矩形边界之外的: ${outsideFrame.length} 个`);
