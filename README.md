# namansharma.com

The personal site of Naman Sharma, design engineer. Live at [namansharma.com](https://www.namansharma.com).

A minimal, dark, one-screen-at-a-time front page and a blog, all in one design language: a near-black ground, Geist at 16/24, grey text with an off-white name, and one narrow left-aligned column on every page.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The front page, in four chapters: intro, work, craft, contact |
| `/blog` | Notes and essays |
| `/blog/[slug]` | A post, with a table of contents and read-aloud |
| any other path | A 404, with the ghost asleep |

## The front page

- **One gesture, one chapter.** A scroll, a swipe, a key (arrows, Page Up/Down, Space, Home, End) or a dot moves exactly one chapter. A trackpad's momentum tail is held so it never skips a chapter, and a swipe back the other way is taken at once, even while the last one is still coasting.
- **Lines arrive out of a blur.** The leaving chapter's lines blur out quickly; the next chapter's come in one after another, in the direction you are moving. Interruptible at any point, and a plain fade under `prefers-reduced-motion`.
- **Each chapter has an address**: `/#2` opens Work, `/#3` Craft, `/#4` Contact.
- **Work is a deck of cards** ([Card stack](https://bencho.dev), MIT), one 3:4 screenshot per project. Reach it and it fans out; press a card and it comes out of the deck and turns over to be looked at. The words under the deck follow the card you are on.
- **Craft shows the work on the work**: the same dialog before and after under a bending compare line, the finished dialog's measurements under a WebGL glass lens, and one design on a phone, a tablet and a desktop ([Aspect ratio](https://bencho.dev), MIT). On a desktop the three stand side by side and play by themselves until touched; narrower, they take turns.
- **The ghost** above the name is a blue [`bot-avatars`](https://libraries.dev) avatar. It blinks, hops when you hover it and jumps when you click it.
- **Connect on LinkedIn** carries a [`border-beam`](https://libraries.dev) pulse.
- **The socials** in the corner are a [`liquid-gooey`](https://libraries.dev) menu: the buttons pour out of the + as liquid, settle as separate drops, and are pulled back in when it closes.
- **Without JavaScript** the chapters stack into one readable page.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Geist. Deployed on Vercel.

## Run it

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
```

## Where things are

```
app/
  page.tsx                 the front page and its copy
  layout.tsx               fonts, metadata, theme
  blog/                    the blog index and posts
  not-found.tsx            the 404
  minimal.css              the shared design language: tokens, links, selection, the column
components/
  chapters/
    Chapters.tsx           chapter navigation: wheel, touch, keys, dots, addresses
    Pieces.tsx             the ghost, the LinkedIn button, the gooey socials
    CardStack.tsx          Bencho's card stack, the deck itself
    WorkDeck.tsx           the work: the deck and the words that follow it
    chapters.css           the front page's styles, scoped under .front
  craft/                   the craft chapter: Compare, LiquidGlass, AspectRatio
public/
  work/, craft/            the screenshots and pictures those two chapters show
  TableOfContents.tsx …    the blog's reading tools: contents, read-aloud, share
lib/
  blog-data.ts             the posts
```

To edit the front page copy, change the chapters in `app/page.tsx`; to add a project, add it to `WORK` there with a 3:4 screenshot (a phone-sized 390x520 view) in `public/work`. To add a post, add it to `lib/blog-data.ts`.
