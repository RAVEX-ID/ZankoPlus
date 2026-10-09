/**
 * config.js — global constants. Loaded first; creates the shared `Zanko` namespace.
 * Also read by the Node server (server/shared.js), so XP rules and cities live in one place.
 */
window.Zanko = window.Zanko || {};

Zanko.config = {
  xpPerLesson: 20,
  xpPerLevel: 100,

  /** `hue` drives the colour of each grade card. */
  grades: {
    10: { name: 'پۆلی دەیەم',      hue: 200 },
    11: { name: 'پۆلی یازدەیەم',   hue: 265 },
    12: { name: 'پۆلی دوازدەیەم',  hue: 18 },
  },

  /** Cities / provinces offered in the profile form. Also validated by the API. */
  cities: ['هەولێر', 'سلێمانی', 'دهۆک', 'هەڵەبجە', 'کەرکووک', 'گەرمیان', 'ڕاپەڕین', 'شوێنێکی تر'],

  levelTitles: [
    'نوێخواز', 'فێرخواز', 'کۆشاو', 'زیرەک',
    'ئەستێرە', 'شارەزا', 'پیشەگەر', 'مامۆستای داهاتوو',
  ],
};
