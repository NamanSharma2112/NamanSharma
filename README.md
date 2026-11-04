# namansharma.com

The personal site of Naman Sharma, design engineer. Live at [namansharma.com](https://www.namansharma.com).

A minimal, dark, one-screen-at-a-time front page and a blog.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The front page, in three chapters: intro, work, contact |
| `/blog` | Notes and essays |
| `/blog/[slug]` | A post, with a table of contents and read-aloud |
| any other path | A 404 with a ball pit you can push around |

## The front page

- **One gesture, one chapter.** A scroll, a swipe, a key (arrows, Page Up/Down, Space, Home, End) or a dot moves exactly one chapter. A trackpad's momentum tail is held so it never skips a chapter, and a swipe back the other way is taken at once, even while the last one is still coasting.
- **Lines arrive out of a blur.** The leaving chapter's lines blur out quickly; the next chapter's come in one after another, in the direction you are moving. Interruptible at any point, and a plain fade under `prefers-reduced-motion`.
- **Each chapter has an address**: `/#2` opens Work, `/#3` Contact.
- **The marshmallow** above the name is a [`bot-avatars`](https://libraries.dev) avatar with a custom outline. It blinks, hops when you hover it and jumps when you click it.
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
components/
  chapters/
    Chapters.tsx           chapter navigation: wheel, touch, keys, dots, addresses
    Pieces.tsx             the marshmallow, the LinkedIn button, the gooey socials
    chapters.css           the front page's styles, scoped under .front
  home/ ui/ …              the blog's header, nav, footer and pieces
lib/
  blog-data.ts             the posts
```

To edit the front page copy, change the three chapters in `app/page.tsx`. To add a post, add it to `lib/blog-data.ts`.
