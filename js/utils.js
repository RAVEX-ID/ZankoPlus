/**
 * utils.js — small framework-free helpers shared by every page.
 */
(function (Zanko) {
  'use strict';

  const YOUTUBE_ID = /(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/;

  Zanko.utils = {
    /** Three-stop gradient derived from a single hue. */
    gradient(hue) {
      return `linear-gradient(135deg,hsl(${hue} 70% 52%),hsl(${(hue + 45) % 360} 72% 46%),` +
        `hsl(${(hue + 330) % 360} 70% 50%))`;
    },

    /** Converts any YouTube link into its embeddable URL; other URLs pass through. */
    toEmbedUrl(url) {
      const match = url.match(YOUTUBE_ID);
      return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : url;
    },

    isDirectVideo: (url) => /\.mp4/.test(url),

    queryParam: (name) => new URLSearchParams(window.location.search).get(name),

    redirect: (url) => window.location.replace(url),

    /** Pages other than index.html need a chosen grade; returns false after redirecting. */
    requireGrade() {
      if (Zanko.store.grade) return true;
      Zanko.utils.redirect('index.html');
      return false;
    },
  };
})(window.Zanko);
