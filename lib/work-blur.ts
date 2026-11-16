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
  "ease-tune": "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAAAwAwCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAW+seKPgAAP72i4EcHy0c0+JxF8q1olqKAAA=",
  "iso-cam": "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAijeAAP7wIjsNhI8FdR5gegAA",
  "iso-churn": "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAijeAAP7wIjsNSa9099kY4AAA",
  "iso-desk": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAijeAAP7wBPUatFEEwJecT15N+6nZGOAA",
  "iso-gpu": "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAijeAAP7wIjwQ8LhlwFcKeyMcAAA=",
  "iso-home": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAABQAwCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAW8wIq9DUAAD+8MyRHWyBxleTfYpTXxZEBsdebsjHAAA=",
  "iso-watch": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAijeAAP7wItTosNuyMcAAAA==",
  "mk-ascii": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABQAwCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAibJ6rXpzQAD+8NzMB0fFibnJNZlzP54iMdEsYajbHi79aFPmzygAAA==",
  "mk-components": "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAABQAwCdASoYAA8APt1ep00opSOiMAgBEBuJaQAAidoGc1VzoAD+8KKvIzqMqHV2m7tOauoB4KficaA//jgAAA==",
  "mk-home": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACQAwCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAW+yojmKYLrBAAP7yq6Vve/y60OEkJnav9d47/H0chK4Nb4BPdu1NxFwvHYAAAA==",
  "mk-shaders": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABwAwCdASoYAA8APt0+s1SooiWjmAEQG4lsAJ0AaIG0doQ4cXAA/vywwCK3fZ9mv7RpHo1Jh7ZjfJZdvs3HBWiNSoUaJPxP0tVw1+MAiXcV7LvPZ5HBzk+4xx7quiV/tX8QOXNNWkvFkzIwpHAAAA==",
  "mk-svg": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABQAwCdASoYAA8APt1cp00opSOiMAgBEBuJaQAAibJ6aUBMMAD+8I0rq7U4P2//ivUYG2Ux8BeNOSyuQOD4URgbf75tBQAA",
  "site-contact": "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAifQAAP7w+8jyPkXkOAA=",
  "site-intro": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACwAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAeyAA/vD8T/p3rRMR1JDAAA==",
  "write-index": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAifQAAP7xDJMkwX/aigAAAA==",
  "write-rls": "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAACwAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAeyAA/vDdgUYfDBMqWJSWHPEhgAA=",
  "write-taste": "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAifQAAP7w7leIPCfo7c2ooAAA",
  "acc-card": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAwCdASoYAA8APt1gp00opaOiMAgBEBuJaQDKACPw3ai4FqlslQAA/vCkXWMOk19T4MNfSxODzupRMdJ1//ZUC+nnMq3TQJU/59rZ1zeJ8VsZAAA=",
  "acc-panel": "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAABwAwCdASoYAA8APt1ep00opSOiMAgBEBuJaVnyAD3k8jpPKQAA/vAmmJnvPZ4iU/ySWWKZz+yqk38ae0AAAA==",
  "acc-activity": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAwCdASoYAA8APt1apkyopSOiMAgBEBuJaWJJWUETmgAA/vBAbBVHbcCw7WQquSY56+tpTAflWjL52i0EAAAA",
  "churn-hero": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABQAwCdASoYAA8APt1apkyopSOiMAgBEBuJZwAAW+sYNyrDAAD+821l93eAOZmY7S4SUDu1wu/ypk++YmQNjvEThQAAAA==",
  "churn-steps": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAidoGgAD+8Pbf+ZKV/HtEO0WtWzItQ+er5IOJvY6UOAA=",
  "churn-features": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAgCdASoYAA8APt1cpkyopSOiMAgBEBuJaWeeADe2AAD+8QTNGQ1EKG93sfJ0RVzr8JSDwOJ0wir3IPZNSXgAAAA=",
  "churn-signin": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAwAwCdASoYAA8APt1cpkyopSOiMAgBEBuJZwAAW+pBkWwAAP7zejlkK4sdUqNnnhacU4uKWNmFo+FJArj0m71vIjt7HvAAAAA=",
  "oil-overview": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAAAwAwCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAetvySkcAAP7w5WKkCs86v/1FXb/o/3kbhLwAAA==",
  "oil-forecast": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAgCdASoYAA8APt1apkyopSOiMAgBEBuJaQAAifQAAP7w5QoOr9UuqKRMKZbmCw9KhndSqRgQAA==",
  "oil-production": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoYAA8APt1apkyopSOiMAgBEBuJZwC7ACHe8jCnKE8jFAD+8dY5/FjX1CUAwiCO0hWwjAys/Utlbiw0HSC2rSyn/Z8AAA==",
  "oil-supply": "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAwAwCdASoYAA8APt1cpkyopSOiMAgBEBuJaQAAetCxUcrAAP7wvFYpnI3SKXVW/RvJytTQbyKpKAAA",
};
