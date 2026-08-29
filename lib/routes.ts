/**
 * Which routes sit on the photo backdrop.
 *
 * The photo is held dark in both themes, so anything in front of it has to be
 * styled for a dark ground whichever theme is set — a light panel over it is
 * a pale smear you cannot read. The landing brings its own paper, the desktop
 * its own wallpaper, and the blog its own black page.
 */
export const usesPhotoBackdrop = (pathname: string) =>
  pathname !== "/" &&
  !pathname.startsWith("/desktop") &&
  !pathname.startsWith("/blog");
