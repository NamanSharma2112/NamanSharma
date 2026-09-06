/**
 * Which routes sit on the photo backdrop.
 *
 * None, now: the site was two worlds — a warm-paper home and a dark rainy-city
 * photo under every other page — and the brief was one consistent, premium
 * look. Everything sits on the same paper (light) / charcoal (dark) ground the
 * body paints, so this is retired to `false`. Kept as a single switch rather
 * than deleted, in case the photo is ever wanted back on a route.
 */
export const usesPhotoBackdrop = (_pathname: string) => false;
