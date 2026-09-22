"use client";

/**
 * Sun through the cabin window, after the window itself has gone.
 *
 * Three soft beams raked across the top of the page, heavily blurred and
 * barely there — on warm paper they read as light falling on it rather than as
 * shapes drawn on top. They drift, slowly enough that you notice the page is
 * lit before you notice anything is moving.
 *
 * Everything is CSS: three blurred gradients on a mask cannot cost a frame,
 * where a canvas of rays would want one every time the page scrolls.
 *
 * Purely decorative, so it is hidden from assistive tech and takes no pointer
 * events. Reduced motion stops the drift in the stylesheet — the light stays,
 * only the travel goes.
 */
export default function LightRays() {
  return (
    <div className="light-rays" aria-hidden>
      <span className="ray ray-a" />
      <span className="ray ray-b" />
      <span className="ray ray-c" />
    </div>
  );
}
