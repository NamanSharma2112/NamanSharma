# namansharma.com 

A personal portfolio site built with **Next.js**, **Tailwind CSS**, and **Framer Motion** — featuring interactive UI components, technical blog posts, and a showcase of design engineering work.

---

## What's Inside

**Portfolio** — Selected projects with live demos and case studies, covering frontend-heavy work, full-stack apps, and hardware prototypes.

**Blog** — Technical writing on design engineering, component architecture, animation, and frontend craft.

**Components** — A living library of reusable UI components built from scratch, each with source code and interactive previews.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Content | MDX (blog + component docs) |
| Deployment | Vercel |

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Home / hero
│   ├── blog/
│   │   ├── page.tsx          # Blog index
│   │   └── [slug]/page.tsx   # Individual post
│   ├── components/
│   │   ├── page.tsx          # Component gallery
│   │   └── [slug]/page.tsx   # Component detail + preview
│   └── projects/
│       └── page.tsx          # Project showcase
├── content/
│   ├── blog/                 # MDX blog posts
│   └── components/           # MDX component docs
├── components/
│   ├── ui/                   # Reusable UI primitives
│   └── sections/             # Page-level sections
└── public/
    └── assets/
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/NamanSharma2112/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it locally.

---

## Writing a Blog Post

Create a new `.mdx` file inside `content/blog/`:

```mdx
---
title: "Your Post Title"
date: "2025-01-15"
summary: "A one-line summary shown on the blog index."
tags: ["animation", "react", "css"]
---

Your content here...
```

The post will be automatically picked up and rendered at `/blog/your-post-title`.

---

## Adding a Component

Create a new `.mdx` file inside `content/components/`:

```mdx
---
title: "Animated Counter"
description: "A smooth count-up animation tied to scroll visibility."
tags: ["animation", "framer-motion"]
---

## Usage

<ComponentPreview name="AnimatedCounter" />

## Code

<ComponentSource name="AnimatedCounter" />
```

Then add the actual component file to `components/ui/AnimatedCounter.tsx`.

---

## Deployment

The site is deployed on **Vercel** with automatic deploys on push to `main`.

```bash
# Production build check (run locally before pushing)
npm run build
```

---

## Featured Projects

| Project | Description | Stack |
|---|---|---|
| **CrudeIQ** | Crude oil intelligence dashboard with LSTM predictions | Next.js, FastAPI, PostgreSQL |
| **TruePass** | Smart student ID & tracking system (patented) | IoT, Hardware |
| **Cognitive Trainer** | Brain-training app for elderly patients with MCI | Node.js, Express, PostgreSQL |

---

## Connect

- **GitHub** — [NamanSharma2112](https://github.com/NamanSharma2112)
- **X (Twitter)** — [@NamanSharma](https://x.com)
- **Peerlist** — [naman](https://peerlist.io)

---

*Designed and built by Naman Sharma.*
