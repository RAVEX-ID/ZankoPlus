/**
 * config.js — global constants. Loaded first; creates the shared `Zanko` namespace.
 */
window.Zanko = window.Zanko || {};

Zanko.config = {
  storageKey: 'zp2',
  xpPerLesson: 20,
  xpPerLevel: 100,

  /** `hue` drives the colour of each grade card. */
  grades: {
    10: { name: 'پۆلی دەیەم',      hue: 200 },
    11: { name: 'پۆلی یازدەیەم',   hue: 265 },
    12: { name: 'پۆلی دوازدەیەم',  hue: 18 },
  },

  levelTitles: [
    'نوێخواز', 'فێرخواز', 'کۆشاو', 'زیرەک',
    'ئەستێرە', 'شارەزا', 'پیشەگەر', 'مامۆستای داهاتوو',
  ],
};
