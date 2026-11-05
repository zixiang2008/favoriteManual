# Public read-only demo / 公开只读演示 / 公開デモ / เดโมสาธารณะ

`index.html` in this directory is a **static, read-only preview** of the Manual web handbook. It exists so that anyone can experience the improvements over scattered Google Maps pins — full-text search, category filters, four-language switching and readable place cards — **without an account**.

| | |
|---|---|
| Full example site (login required) | <https://cm.caishen.today> |
| This demo on GitHub Pages | <https://zixiang2008.github.io/favoriteManual/demo/> |
| Documentation | [English](../README.md) · [简体中文](../docs/README.zh-CN.md) · [日本語](../docs/README.ja.md) · [ไทย](../docs/README.th.md) |

**中文**：本目录是网页版的静态只读演示，用来直观展示「可搜索、可筛选、四语切换」相对于 Google Maps 图钉的改进。完整功能（登录、投稿、距离筛选、交互式地球视图）请访问 <https://cm.caishen.today>。

**日本語**：このディレクトリはウェブ版の静的な読み取り専用デモです。検索・絞り込み・4 言語切替を、アカウントなしで体験できます。完全版は <https://cm.caishen.today> です。

**ไทย**：ไดเรกทอรีนี้เป็นเดโมแบบคงที่ อ่านอย่างเดียว เพื่อให้เห็นการค้นหา การกรอง และการสลับ 4 ภาษาโดยไม่ต้องใช้บัญชี เว็บฉบับเต็มอยู่ที่ <https://cm.caishen.today>

## What is included / 内容

- `index.html` — single-file UI (no build step, no framework, no external CSS/JS)
- `data.js` — generated dataset: 150 places, 26 categories, four-language category labels

The demo intentionally **does not** include login, PIN handling, submissions, star ratings, distance filters, the interactive globe view, or any runtime state. Place photos are hot-linked from the public Google Maps cache and are hidden automatically if they fail to load.

演示页**不包含**登录、PIN、投稿、星级、距离筛选、交互式地球视图与任何运行时状态。地点照片来自公开 Google Maps 缓存，加载失败会自动隐藏。

## Data source and privacy / 数据来源与隐私

`data.js` is generated from two **publishable** snapshots:

- `data/places.json` — name, area hint, category, sub-category, tags, coordinates
- `data/google-maps-cache.json` — address, phone, opening hours, website, photo, canonical map link

Private long notes (`memoryKeyword`, `description`, `blocks`), `runtime/` state, `.env`, PINs, invitation codes, tokens and operational runbooks are **excluded**. Area hints remain in their original Chinese and are labelled as such in non-Chinese UI languages.

私人长备注、`runtime/`、`.env`、PIN、授权码、令牌与运维文档**均未包含**。区域提示保留原始中文，并在其他语言界面中明确标注。

## Rebuild / 重新生成

From the repository root:

```bash
node scripts/build-demo-data.mjs
```

Then open `demo/index.html` directly in a browser (it loads `data.js` with a plain script tag, so `file://` works), or serve the directory with any static server. On GitHub Pages it is published from the `main` branch at `/favoriteManual/demo/`; the root `.nojekyll` file keeps the directory served as-is.

在仓库根目录运行上面的命令即可重建。直接用浏览器打开 `demo/index.html` 也能工作（用普通 script 标签加载数据，无需服务器）。GitHub Pages 从 `main` 分支发布，根目录的 `.nojekyll` 确保目录原样提供。
