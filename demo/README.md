# Public read-only demo / 公开只读演示 / 公開デモ / เดโมสาธารณะ

`index.html` in this directory is a **static, read-only preview** of the Manual web handbook. It exists so that anyone can experience the improvements over scattered Google Maps pins — full-text search, category filters, four-language switching, readable place cards and the **Chiang Mai flat map** — **without an account**.

| | |
|---|---|
| Full example site (login required) | <https://cm.caishen.today> |
| This demo on GitHub Pages | <https://zixiang2008.github.io/favoriteManual/demo/> |
| Documentation | [English](../README.md) · [简体中文](../docs/README.zh-CN.md) · [日本語](../docs/README.ja.md) · [ไทย](../docs/README.th.md) |

**中文**：本目录是网页版的静态只读演示，用来直观展示「可搜索、可筛选、四语切换、清迈平面地图」相对于 Google Maps 图钉的改进。完整功能（登录、投稿、距离筛选、MapLibre 交互式平面地图）请访问 <https://cm.caishen.today>。

**日本語**：このディレクトリはウェブ版の静的な読み取り専用デモです。検索・絞り込み・4 言語切替・チェンマイ平面地図を、アカウントなしで体験できます。完全版は <https://cm.caishen.today> です。

**ไทย**：ไดเรกทอรีนี้เป็นเดโมแบบคงที่ อ่านอย่างเดียว เพื่อให้เห็นการค้นหา การกรอง การสลับ 4 ภาษา และแผนที่ระนาบเชียงใหม่โดยไม่ต้องใช้บัญชี เว็บฉบับเต็มอยู่ที่ <https://cm.caishen.today>

## The flat map / 清迈平面地图 / チェンマイ平面地図 / แผนที่ระนาบเชียงใหม่

The map view is a **flat, north-up Chiang Mai map**, not a globe. It uses a multi-colour OpenStreetMap mosaic, a 100 × 100 km square boundary (50 km on each side of the old-town centre at `98.9853°E, 18.7883°N`), N / E / S / W labels with edge coordinates, a compass, a metric scale bar and a dashed 50 km radius circle. All 137 places with coordinates are drawn at their real latitude and longitude. The 3 places more than 50 km from the centre are listed beside the map; the 2 that fall outside the square are marked with `▲` on the north edge, so no information is lost while the 50 km limit stays intact.

中文：地图是正北朝上的**清迈平面地图**，不再是球形地球。多色彩 OSM 底图、以老城中心为原点上下左右各 50 公里的矩形边界、四边经纬度与东南西北、罗盘、公里比例尺、50 km 虚线圆齐全；137 个有坐标的地点按真实经纬度落点。超过 50 公里的 3 个地点列在侧栏，真正落在方框外的 2 个用 `▲` 标在北边界，既不丢信息，也不破坏 50 公里上限。

演示页用 SVG 静态绘制，正式站用 MapLibre GL 渲染，但两者共用同一份 `flat-map-config.js`。

## What is included / 内容

- `index.html` — single-file UI (no build step, no framework, no external CSS/JS)
- `data.js` — generated dataset: 150 places, 26 categories, four-language category labels
- `flat-map-config.js` — generated shared map config (centre, bounds, directions, basemap corners)
- `assets/chiang-mai-basemap.png` — stitched zoom-11 OpenStreetMap mosaic used as the map background
- `../chiang-mai-basemap.json` — tile range, pixel frame and attribution of that mosaic

The demo intentionally **does not** include login, PIN handling, submissions, star ratings, distance filters, the interactive MapLibre flat map, or any runtime state. Place photos are hot-linked from the public Google Maps cache and are hidden automatically if they fail to load.

演示页**不包含**登录、PIN、投稿、星级、距离筛选、MapLibre 交互式平面地图与任何运行时状态。地点照片来自公开 Google Maps 缓存，加载失败会自动隐藏。

## Data source and privacy / 数据来源与隐私

`data.js` is generated from two **publishable** snapshots:

- `data/places.json` — name, area hint, category, sub-category, tags, coordinates
- `data/google-maps-cache.json` — address, phone, opening hours, website, photo, canonical map link

Private long notes (`memoryKeyword`, `description`, `blocks`), `runtime/` state, `.env`, PINs, invitation codes, tokens and operational runbooks are **excluded**. Area hints remain in their original Chinese and are labelled as such in non-Chinese UI languages.

私人长备注、`runtime/`、`.env`、PIN、授权码、令牌与运维文档**均未包含**。区域提示保留原始中文，并在其他语言界面中明确标注。

## Rebuild / 重新生成

From the repository root:

```bash
node scripts/build-demo-data.mjs   # or: npm run demo:build
node scripts/build-flat-map.mjs    # or: npm run map:config
```

`build-flat-map.mjs` writes both `demo/flat-map-config.js` and `public/flat-map-config.js` from the same parameters, so the demo and the production PWA always agree on the centre, the 50 km boundary and the compass labels.

Then open `demo/index.html` directly in a browser (it loads `data.js` with a plain script tag, so `file://` works), or serve the directory with any static server. On GitHub Pages it is published from the `main` branch at `/favoriteManual/demo/`; the root `.nojekyll` file keeps the directory served as-is.

在仓库根目录运行上面的命令即可重建。直接用浏览器打开 `demo/index.html` 也能工作（用普通 script 标签加载数据，无需服务器）。GitHub Pages 从 `main` 分支发布，根目录的 `.nojekyll` 确保目录原样提供。
