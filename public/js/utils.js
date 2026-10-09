/**
 * utils.js — small framework-free helpers shared by every page.
 */
(function (Zanko) {
  'use strict';

  const YOUTUBE_ID = /(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/;
  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  Zanko.utils = {
    /** Escapes user-supplied text before it goes into an HTML template. */
    escapeHtml: (text) => String(text ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]),

    /** Three-stop gradient derived from a single hue. */
    gradient(hue) {
      return `linear-gradient(135deg,hsl(${hue} 70% 52%),hsl(${(hue + 45) % 360} 72% 46%),` +
        `hsl(${(hue + 330) % 360} 70% 50%))`;
    },

    /** Stable hue (0–359) for a piece of text, e.g. a user's avatar colour. */
    hueFromText(text) {
      return [...String(text)].reduce((sum, char) => sum + char.charCodeAt(0), 0) * 7 % 360;
    },

    /** Converts any YouTube link into its embeddable URL; other URLs pass through. */
    toEmbedUrl(url) {
      const match = url.match(YOUTUBE_ID);
      return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : url;
    },

    isDirectVideo: (url) => /\.mp4/.test(url),

    queryParam: (name) => new URLSearchParams(window.location.search).get(name),

    redirect: (url) => window.location.replace(url),
  };
})(window.Zanko);
