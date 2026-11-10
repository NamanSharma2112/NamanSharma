# Craft kit

The three "design engineering" pieces that were the Craft chapter of the
portfolio, kept here to drop into another site. Nothing in the portfolio
imports them now, so none of this ships with it.

| File | What it is |
| --- | --- |
| `Compare.tsx` | Before/after image compare with a jelly line that bends as you drag; plays by itself with `auto` |
| `LiquidGlass.tsx` | A WebGL glass lens dragged over a picture; falls back to the plain picture without WebGL; `auto` drifts it |
| `AspectRatio.tsx` | Bencho's Aspect ratio block (MIT, bencho.dev/licence) reworked as phone / tablet / desktop, equal area; `auto` cycles |
| `Craft.tsx` | The three together: side by side on a wide screen, taking turns under tabs on a narrow one |
| `CraftLazy.tsx` | Loads `Craft` as its own chunk when its chapter is near, or after the page settles |
| `useLive.ts` | Whether the piece's chapter is on screen, so autoplay only runs while seen |
| `craft.css` | All their styles |
| `assets/` | The pictures they show |

## Using it elsewhere

1. Copy this folder into the other project, and `assets/` into its `public/craft/`
   (the components read `/craft/before.jpg`, `/craft/after.jpg`, `/craft/details.jpg`,
   `/craft/pc.jpg`, `/craft/tablet.jpg`, `/craft/phone.jpg`). Swap in that site's own pictures
   at the same sizes: the two dialogs 800x600, the spec 720x540, and one screenshot per screen.
2. Import `craft.css` and swap its `.front` prefix and tokens for the new site's (the header of
   the file lists them).
3. `useLive` looks for the nearest `.ch` with `.is-in`, which is how the portfolio's chapters
   mark the one on screen. On an ordinary scrolling page, replace it with an IntersectionObserver
   (visible, tab showing, no reduced motion) and the autoplay keeps working.
4. Each piece also works on its own: `<Compare w={400} h={300} auto />`,
   `<LiquidGlass picW={360} picH={270} auto />`, `<AspectRatio side={300} auto />`.

They need React and Next's `dynamic` (only for `CraftLazy`), nothing else.
