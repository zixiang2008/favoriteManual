/* 由 scripts/build-flat-map.mjs 生成，请勿手改。清迈 50km 平面地图共享配置 */
window.FLAT_MAP_CONFIG = {
  "version": 1,
  "center": {
    "lng": 98.9853,
    "lat": 18.7883
  },
  "halfKm": 50,
  "bounds": {
    "west": 98.51086411946277,
    "east": 99.45973588053722,
    "south": 18.339144412504492,
    "north": 19.237455587495507
  },
  "boundsLabel": {
    "west": "W 98.5109°",
    "east": "E 99.4597°",
    "north": "N 19.2375°",
    "south": "S 18.3391°"
  },
  "basemap": {
    "image": "chiang-mai-basemap.png",
    "zoom": 11,
    "tileSize": 256,
    "originX": 405504,
    "originY": 233472,
    "width": 1536,
    "height": 1536,
    "frame": {
      "left": 106.84424295806093,
      "right": 1488.7389037085813,
      "top": 113.6879070502182,
      "bottom": 1495.5999981401837
    },
    "corners": [
      [
        98.4375,
        19.31114335506464
      ],
      [
        99.4921875,
        19.31114335506464
      ],
      [
        99.4921875,
        18.312810846425442
      ],
      [
        98.4375,
        18.312810846425442
      ]
    ],
    "attribution": "© OpenStreetMap contributors (ODbL)"
  },
  "directions": {
    "zh": {
      "N": "北",
      "E": "东",
      "S": "南",
      "W": "西"
    },
    "en": {
      "N": "N",
      "E": "E",
      "S": "S",
      "W": "W"
    },
    "ja": {
      "N": "北",
      "E": "東",
      "S": "南",
      "W": "西"
    },
    "th": {
      "N": "เหนือ",
      "E": "ตะวันออก",
      "S": "ใต้",
      "W": "ตะวันตก"
    }
  }
};
if (typeof module !== 'undefined') module.exports = window.FLAT_MAP_CONFIG;
