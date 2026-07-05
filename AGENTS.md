# Project agent memory

heyscott — Scott's personal site. The identity is an **iMessage splash**:
Helvetica Neue Light, black-on-white (white-on-black in dark mode), and chat
bubbles in iMessage blue (`--color-imessage-sent` `#075b97`) / grey
(`--color-imessage-received`). Preserve that aesthetic in anything new.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**.
- **Tailwind CSS v4**, CSS-first `@theme` tokens in `src/app/globals.css`
  (no `tailwind.config.*`). Semantic tokens (`--color-background`,
  `--color-foreground`, `--color-muted*`, `--color-accent`, `--color-border`)
  are themed light/dark via `prefers-color-scheme`. The iMessage bubble
  palette is a **brand constant** — identical in both themes.
- **Prismic** CMS: `@prismicio/client` v7 / `@prismicio/next` v2 /
  `@prismicio/react` v3, Slice Machine (`@slicemachine/adapter-next`).
- **pnpm** (lockfile v9 → needs pnpm ≥9). Global pnpm may be old; use
  `corepack pnpm@10.33.0 <cmd>`. Node `v22.20.0` (`.nvmrc`).
- SCSS modules still used for the bubble tails (`sass` dep). Tailwind v4 and
  SCSS modules coexist fine.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint` → `eslint .` (flat config `eslint.config.mjs`).
  NOTE: `next lint` was removed in Next 16 — do not reintroduce it.
- `pnpm storybook` → Storybook dev server on **port 6006**
  (`storybook dev -p 6006`). `pnpm build-storybook` → static build.
- `pnpm prismic:types` → regenerate `prismicio-types.d.ts` from local models
  (offline; reads `customtypes/**` + `src/slices/**/model.json`). Run after
  changing any custom type or slice model. The generated file is committed.
- `pnpm slicemachine` → Slice Machine UI (needs a live repo to sync).

## Blog / Prismic layout

- Client + routes: `src/prismicio.ts`. Repo name resolves from
  `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` first, else `slicemachine.config.json`.
- Custom type `blog_post` in `customtypes/blog_post/` (standard Slice Machine
  location, unlike needless which keeps them under `lib/prismic/customtypes`).
- Slices in `src/slices/*` (RichText, Heading, Quote, CodeBlock, Images,
  Divider), registered in `src/slices/index.ts`. Quote renders as an incoming
  iMessage bubble.
- Preview routes under `src/app/api/(exit-)preview`, `src/app/slice-simulator`
  (must be `'use client'` — it passes a render fn).
- Reusable bubble: `src/components/ChatBubble`. The original splash
  (`src/components/Messages`) renders at `/`, and the Prismic
  `SliceZone`/`getPost` machinery renders `/blog/[uid]` (see the site shell
  below).

## Site shell — JUST the splash (matches heyscott.com)

The live site is a single splash screen and NOTHING else. `/`
(`src/app/page.tsx`) renders ONLY `src/components/Messages` (its own SCSS
bubble + framer-motion stagger animation): a "Hey Scott" **sent** bubble, then
"Hey! I'm a little busy at the moment." / "Talk soon?" **received** bubbles — no
links, no nav. This is a pixel match to production heyscott.com; the copy +
animation live in `Messages/constants.ts` + `Messages/Messages.tsx`. Don't add
links or other content to `/` unless the live site does.

**Not wired into the live site right now:** the blog pages and the whole
Tailwind-v4 iMessage component library. The `/blog` index + `/blog/[uid]` post
routes were REMOVED (only Prismic preview API + `/slice-simulator` tooling
routes remain besides `/`). `src/prismicio.ts` keeps an inert `blog_post` route
mapping for when the blog returns.

**Kept in the codebase (just unmounted):** the entire iMessage component library
+ all Storybook stories — see below. A prior "whole site is one persistent
conversation" takeover (`src/components/conversation/`, pages rendering `null`)
was also built and then fully reverted. `src/lib/posts.ts`
(`PLACEHOLDER_POSTS` / `BlogPostLink`) is now just `{title, slug}`, driving the
`PostListComposer` post list in Storybook.

- **`PostListComposer`** (`src/components/PostListComposer`) — a bottom-fixed
  iMessage compose bar (pill + send button) that pops up the blog-post list.
  `PostLinkList`/`PostLinkBubble` render each post heading as a link bubble:
  darker translucent grey (`tone='typing'`) in the OUTGOING (right) position,
  and **ALWAYS tail-less** (`tail={false}`, including the bottom item) so they
  read as a list/menu, not sent messages — still grouped (tight spacing,
  rounded connecting corners). Reused for the in-thread recirculation links.
  Driven by **`src/lib/posts.ts`** (`PLACEHOLDER_POSTS` / `BlogPostLink`), the
  placeholder source while Prismic is unwired.
- Bubble color/corner knobs on `ChatBubble`/`DynamicBubble`: `tone` decouples
  COLOR from `variant`/`direction` (`tone='typing'` = `--color-imessage-typing`,
  darker translucent gray, text via `--foreground`, legible in both themes);
  `groupedBelow` rounds the tail-side BOTTOM corner into the group independently
  of the tail (defaults to `!tail`; set explicitly for always-tail-less stacks
  so the last item's bottom stays full-round).

## iMessage message-bubble component library (`src/components/imessage/`)

A basic reusable library that renders content *as an iMessage conversation*,
built on the unified dynamic-SVG bubble and the `--color-imessage-*` theme
tokens (extends the theme — does not fork it).

- **`bubbleShape.tsx`** — the single source of truth for the bubble silhouette.
  It reproduces heyscott's ORIGINAL human-made tail
  (`Messages/components/Message/Message.module.scss`): a rounded body + a
  same-color `::before` bulge + a background-colored `::after` that carves the
  concave underside — the authentic "scoop-and-hook". `BubbleClip` rebuilds that
  exact composite as ONE `<clipPath>` = rounded-rect body ∪ a single traced
  tail-hook path (the visible `::before − ::after` region). Constants
  `BUBBLE_RADIUS` (25), `BUBBLE_TAIL_OUT` (7); tail is a CONSTANT pixel size.
  NOTES: (1) a single-path clipPath maps reliably onto both an SVG `<rect>`
  (text) and an HTML element via `clip-path` (media) — CSS `mask-image` of an
  SVG `<mask>` renders inconsistently on media (thin-spike tail). (2) `clip-path`
  DOES clip `<iframe>`s (verified), so embeds get the shape too. (3) mirror for
  incoming by computing `width - x` in JS, NOT an SVG `<g transform>` — a
  transform inside `<clipPath>` does not clip reliably (clips to nothing).
- **`DynamicBubble.tsx`** (client) — measures its content and renders the
  `BubbleClip` sized to it. `variant='text'` clips a `<rect fill=color>` to the
  silhouette (content bg transparent once measured, rounded-rect fallback
  before, so no flash); `variant='media'` applies the same clip via
  `clip-path: url(#id)` so media **fills the bubble and is clipped to the
  silhouette, tail included**. Same shape for both. Content font is responsive:
  `text-base` (≈16px mobile) → `md:text-xl`.
  - **Min-width hug (text):** measures a tight width so bubbles hug their text.
    For multi-line it binary-searches the SMALLEST width that keeps the minimal
    line count (balances the lines, kills ragged whitespace). The max width is
    computed explicitly from the parent (`85%`) because a *percentage*
    max-width on a flex item resolves against an indefinite basis and can be
    ignored (caused mobile overflow). Re-runs on container resize +
    `document.fonts.ready`. Chose DIY over `@chenglou/pretext` (see below).
- `ChatBubble` — thin wrapper over `DynamicBubble` (text). `Message` — base
  message: `ChatBubble` + scroll reveal + optional receipt.
- `HeadingMessage` (OUTGOING/blue — body text style, no heading size/weight),
  `TextMessage` (INCOMING/grey), `MediaMessage` (INCOMING image/embed
  attachment, clipped to the bubble via `DynamicBubble variant='media'`).
  **Direction mapping is inverted from the obvious**: headings are the outgoing
  (sent/right) side, body content is incoming (received/left).
- `MessageThread` — centered conversation column that ALSO computes
  **grouping** from the child sequence: consecutive same-side messages form a
  run, and it passes each child `tail` (true only on the run's LAST message)
  and `grouped` (a same-side message precedes it) via `cloneElement`. Grouped
  bubbles drop the tail (except the last), tighten spacing, and round the
  tail-side connecting corners to `GROUPED_RADIUS` — partway between the body
  radius and a squared corner (`BubbleClip` `flattenTop`/`flattenBottom`,
  clamped to the bubble geometry; note a single-line bubble's body radius is
  already ~height/2, so values at/above that render the same). It reads each
  child's side from the component type
  (`HeadingMessage`=outgoing, `TextMessage`/`MediaMessage`=incoming) or a
  `Message`'s `direction`. **Don't hand-set `tail`/`grouped`** — the thread
  derives them; messages must be DIRECT children of `MessageThread` for this to
  work (see next point).
- `ConversationText` — Prismic rich-text → conversation: **headings = outgoing,
  paragraphs/lists/preformatted/images/embeds = incoming**. It builds the
  message elements itself (one per block, inline formatting via a per-block
  `PrismicRichText` with inline-only serializers) and passes them as DIRECT
  children of `MessageThread` — that's what lets the thread compute grouping for
  the blog. (It no longer uses a single flat `PrismicRichText`, whose opaque
  output the thread couldn't introspect.) Wired into the `RichText` slice.
- **Scroll reveal** (`useScrollReveal`): ONE-WAY. A message starts at
  `HIDDEN_OPACITY` (0.25, tunable in `constants.ts`) and fades to full opacity
  the first time it enters view, then STAYS revealed (observer disconnects — it
  never fades back out).
- **`@chenglou/pretext` assessment (not used):** a legit canvas-based text
  measurement/balancing lib by chenglou, but `0.0.x` (brand-new, unstable API)
  and its canvas measurement only approximates the browser's real line-breaking
  (risking off-by-a-bit widths → overflow/re-wrap). We already measure the REAL
  DOM wrap (`getClientRects`), which is exact, so a 0.0.x dep wasn't worth it.
- SVG chrome in `assets/`: `BubbleTail` (a small standalone bubble rendered
  from the shared `BubbleClip`, mirrored for incoming) and `ReadReceipt` (single
  check = Delivered, double = Read).

Note: text and media bubbles share ONE silhouette (`bubbleShape.tsx`). The
homepage splash (`src/components/Messages`) still uses its own SCSS bubble and
is intentionally left alone. When changing the bubble/tail shape, edit
`bubbleShape.tsx` only — everything else derives from it. To eyeball the
geometry without a browser, rasterize `BubbleClip` (or drive the running
Storybook with headless Google Chrome `--screenshot`) to PNG.

## Storybook (`.storybook/`)

- `@storybook/nextjs-vite` v10 (mirrors needless). `main.ts` globs
  `../src/**/*.stories.*`; `preview.ts` imports `../src/app/globals.css` so
  stories render with the real theme tokens.
- **No `public/` dir** in heyscott (assets live in `src/app`), so `main.ts`
  has NO `staticDirs` — adding one that points at `../public` breaks the build.
- `@prismicio/next` re-exports server-only CJS preview utils the Vite bundler
  can't parse. `main.ts` `viteFinal` aliases `@prismicio/next` →
  `.storybook/mocks/prismicio-next.tsx` (a browser stub rendering plain
  `<img>`/`<a>`) for Storybook only. If a new component imports `@prismicio/next`
  and its story white-screens, add the missing export to that stub.
- Stories co-located with components (`*.stories.tsx`). `mocks.ts` holds mock
  Prismic data; media stories use seeded `picsum.photos` images + a real YouTube
  embed (needs network to render — build-storybook doesn't render, so it's fine).
- Story files ARE type-checked by `pnpm build` (tsconfig globs `**/*.tsx`) —
  keep them green, not just `build-storybook` (which uses esbuild, no typecheck).

### Resilient fetch (important)

`src/lib/prismic/queries.ts` **swallows Prismic errors and returns empty**, so
`build`/`dev` succeed even without a live repo (renders the blog empty state).
Once a real repo + token are configured this same code returns real content —
do not "fix" the try/catch away.

**`heyscott` in `slicemachine.config.json` is a PLACEHOLDER repo name.** A real
Prismic repository + `.env.local` (see `.env.local.sample`) is required before
the blog shows content. This is a captain/account decision.
