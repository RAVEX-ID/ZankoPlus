/**
 * icons.js — inline SVG icon set (24×24, stroke based).
 * Subject icons are keyed by subject id; the rest are UI icons.
 */
(function (Zanko) {
  'use strict';

  const PATHS = {
    // Subjects
    ku: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    ar: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    en: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
    ma: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>',
    ph: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    ch: '<path d="M9 2h6"/><path d="M10 2v6L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8V2"/><path d="M7.5 15h9"/>',
    bi: '<path d="M4 3c0 7 16 11 16 18"/><path d="M20 3c0 7-16 11-16 18"/><path d="M7.5 7.5h9M5.5 12h13M7.5 16.5h9"/>',
    is: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/><path d="m17 3 .8 1.7L19.5 5l-1.7.8L17 7.5l-.8-1.7L14.5 5l1.7-.3z"/>',
    ic: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',

    // UI
    flame: '<path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    play: '<path d="m7 4 13 8-13 8z" fill="currentColor"/>',
    playCircle: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z" fill="currentColor"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    next: '<path d="m15 18-6-6 6-6"/>',
    prev: '<path d="m9 18 6-6-6-6"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    redo: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  };

  /** Returns the SVG markup for icon `name`. */
  Zanko.icon = function icon(name, size = 20, strokeWidth = 2) {
    return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
      `stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">` +
      `${PATHS[name]}</svg>`;
  };
})(window.Zanko);
