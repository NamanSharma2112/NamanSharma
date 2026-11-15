/* ══ The ring's first light ═════════════════════════════════════════════
   For every shot, a picture of it 24 pixels wide, blurred, as a data URL:
   drawn behind the thumbnail from the first frame, so the ring is thirty
   small colours the moment it appears and sharpens as the thumbnails
   arrive, rather than thirty dark boxes until they do. A few hundred
   bytes each. Made from the thumbnails with ffmpeg (scale to 24x15, a
   touch of blur, WebP at quality 45); make it again when they change. */
export const BLUR: Record<string, string> = {
  "ease-compare": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAAAwAwCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAidoGTTwAAP7xqd5E8KsoW7ACkcD2iWvceQ4AAA==",
  "ease-dialog": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAifQAAP7xqRfLtiXwbSpzNulxuUsxQAAA",
  "ease-toast": "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAAAwAwCdASoYAA8APt1apkyopSOiMAgBEBuJaWZAADc1mgtAAP7xqRe/GJK+ZgMiVyetE3LDyAA=",
  "ease-tune": "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAAAwAwCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAW+seKPgAAP72i4EcHy0c0+JxF8q1olqKAAA=",
  "iso-bench": "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAijeAAP7wIsA8CXjP0XsjHAAA",
  "iso-cam": "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAijeAAP7wIjsNhI8FdR5gegAA",
  "iso-churn": "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAijeAAP7wIjsNSa9099kY4AAA",
  "iso-desk": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAijeAAP7wBPUatFEEwJecT15N+6nZGOAA",
  "iso-gpu": "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAijeAAP7wIjwQ8LhlwFcKeyMcAAA=",
  "iso-home": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAABQAwCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAW8wIq9DUAAD+8MyRHWyBxleTfYpTXxZEBsdebsjHAAA=",
  "iso-kit": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAijeAAP7wIjdqMyp+yMcAAA==",
  "iso-scale": "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAijeAAP7wIjsNhI8FdR5gegAA",
  "iso-shuttle": "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAijeAAP7wIjsNhI8FdR5gegAA",
  "iso-sorter": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAijeAAP7wItTosNuyMcAAAA==",
  "iso-watch": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAijeAAP7wItTosNuyMcAAAA==",
  "mk-ascii": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABQAwCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAibJ6rXpzQAD+8NzMB0fFibnJNZlzP54iMdEsYajbHi79aFPmzygAAA==",
  "mk-background": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAACwAgCdASoYAA8AAwBSJYwDE2D0MlN158vvN6g5iAAA/vkiLYlLtHJbzavbDeZjLDCVIFxtVkiOqgAyP/XZgvs/FqAuqiBmZk4jm0Yh1eJ9Hr2Cc9crhKCMAAA=",
  "mk-components": "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAABQAwCdASoYAA8APt1ep00opSOiMAgBEBuJaQAAidoGc1VzoAD+8KKvIzqMqHV2m7tOauoB4KficaA//jgAAA==",
  "mk-css": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAwBACdASoYAA8APt1apkyopSOiMAgBEBuJZQDMHCICgfQs+2cbZ4dWQWgA/vKiINSEhaPmRXGQyhGgnP2we39tS4Xfee1Tjf5emJP9bAUkgEAA",
  "mk-home": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACQAwCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAW+yojmKYLrBAAP7yq6Vve/y60OEkJnav9d47/H0chK4Nb4BPdu1NxFwvHYAAAA==",
  "mk-isometric": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAwBACdASoYAA8APt1apkyopSOiMAgBEBuJQBdgBDva6k86rXcQWp+fvAAA/vKjx5AqwmC1W5TXUCLWDG0TvWqoxWYXnpRr8P2b27izvk4BIvjsjtVVg3sNXgG9bxjL0AA=",
  "mk-shaders": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABwAwCdASoYAA8APt0+s1SooiWjmAEQG4lsAJ0AaIG0doQ4cXAA/vywwCK3fZ9mv7RpHo1Jh7ZjfJZdvs3HBWiNSoUaJPxP0tVw1+MAiXcV7LvPZ5HBzk+4xx7quiV/tX8QOXNNWkvFkzIwpHAAAA==",
  "mk-shadow": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAwCdASoYAA8APt1cp0yopSOiMAgBEBuJaQABJNRBa4c/WzWZjQYAAP7+GSp77/O0xZ583V/9NRCFVDZzrY/cgSjQ99dvFXW/qca4FvWsH40SCsyy52nK81odCddgCAA=",
  "mk-svg": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABQAwCdASoYAA8APt1cp00opSOiMAgBEBuJaQAAibJ6aUBMMAD+8I0rq7U4P2//ivUYG2Ux8BeNOSyuQOD4URgbf75tBQAA",
  "mk-templates": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAXE7THwoP54OYAAD+8qPKT3ZuAVla3Mt1PremtE2u8MBw81WI8jAeAAAA",
  "site-contact": "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAifQAAP7w+8jyPkXkOAA=",
  "site-intro": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACwAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAeyAA/vD8T/p3rRMR1JDAAA==",
  "write-index": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAifQAAP7xDJMkwX/aigAAAA==",
  "write-rls": "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAACwAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAeyAA/vDdgUYfDBMqWJSWHPEhgAA=",
  "write-taste": "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAifQAAP7w7leIPCfo7c2ooAAA",
};
