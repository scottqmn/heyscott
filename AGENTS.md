# Project agent memory

heyscott — Scott's personal site. The identity is an **iMessage splash**:
Helvetica Neue Light, black-on-white (white-on-black in dark mode), and chat
bubbles in iMessage blue (`--color-imessage-sent` `#075b97`) / grey
(`--color-imessage-received`). Preserve that aesthetic in anything new.

## Stack

- **Next.js 16** (App Router) + **React 19**. Build/dev run on **webpack**
  (`next dev/build --webpack`), NOT Turbopack — Turbopack emits class static
  blocks (Safari 16.4+ syntax) in its runtime and ignores `browserslist`, so its
  bundle fails to parse on older iOS Safari (blank site). Webpack down-levels to
  the `browserslist` floor (iOS/Safari ≥ 15.4 in package.json). Keep `--webpack`
  unless Turbopack gains browser-target down-leveling.
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
  Fields: `title` (StructuredText heading1), `image` (Image), a `body` slice
  zone, and the standard SEO & Metadata tab (`meta_title`/`meta_description`/
  `meta_image`). The `body` slice zone offers `rich_text` and `heading`. **The
  schema is owned by `develop` (Prismic Slice Machine) — do NOT edit
  `customtypes/**`, `src/slices/**/model.json`, `slicemachine.config.json`, or
  `prismicio-types.d.ts` in feature branches; those land via the customtype
  sync PRs.** Regenerate types with `pnpm prismic:types` only when the schema
  itself intentionally changes.
- Slices in `src/slices/*` (RichText, Heading, Quote, CodeBlock, Images,
  Divider) are all registered in `src/slices/index.ts` as a library; the
  `blog_post` body slice zone references `rich_text` + `heading`. `RichText`'s
  model is a single rich text field (`content`). Quote renders as an incoming
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
bubble): a "Hey Scott" **sent** bubble, then "Hey! I'm a little busy at the
moment." / "Talk soon?" **received** bubbles — no links, no nav. This is a pixel
match to production heyscott.com; the copy lives in `Messages/constants.ts`.
Don't add links or other content to `/` unless the live site does.

**The splash is deliberately JS-free.** `Messages` is a server component and the
staggered entrance is a PURE CSS animation (`.splash-message` in globals.css,
`animation-fill-mode: both` + per-bubble inline `animation-delay`). The bubbles
are present and VISIBLE in the SSR HTML with zero client JS — the animation is
progressive enhancement. This replaced a framer-motion version that left every
bubble at `opacity:0` until JS ran (blank page whenever client JS failed to run,
e.g. older iOS Safari). framer-motion is removed. Keep the splash JS-free.

**Not linked from the live site, but the blog pages exist:** the `/` splash is
still the only thing the live site links to, but both blog routes are mounted:
- The **recirculation post index** (`PostSidebar`) + the decorative compose
  pill (`PostListComposer`) both render on the GLOBAL layout
  (`src/app/layout.tsx`), so they float over EVERY route (siblings of
  `{children}`, like `PrismicPreview`). The layout is an async server component
  that calls `getAllPosts()`, maps to `BlogPostLink` (`src/lib/posts.ts`), and
  falls back to `PLACEHOLDER_POSTS` when Prismic is unwired — that list feeds the
  SIDEBAR (the composer takes no posts now). They are NOT rendered per-page
  (would double up). Sidebar: persistent desktop / drawer mobile (closed by
  default on mobile).
- `/blog` (`src/app/blog/page.tsx`) — the INDEX, now just an empty `<main>`
  shell (the composer is global; don't re-add it here).
- `/blog/[uid]` (`src/app/blog/[uid]/page.tsx`) — a single post, rendered as an
  iMessage conversation via `src/components/BlogPost`.

`getPost`/`getAllPosts` (`src/lib/prismic/queries.ts`) swallow fetch errors, so
with the placeholder repo the post page just `notFound()`s and the index falls
back to placeholders — the build stays green. Once a real repo is wired the
same code serves content. `src/prismicio.ts` keeps the `blog_post` route mapping.
- **`BlogPost` render mapping** (`src/components/BlogPost`) — matches develop's
  schema (`title` + `image`, **no subtitle**): `title` → outgoing
  (`HeadingMessage`) wrapping an **`<h1>`** (the page's a11y h1), `image` →
  outgoing media bubble (`MediaMessage direction='outgoing'`). The body is split
  PER top-level block by the component-local `richTextToBubbles` (NOT the shared
  `ConversationText`): rich-text **headings → OUTGOING** (`HeadingMessage`),
  each wrapping its correct semantic **`<h1>`–`<h6>`** element (a11y; the side
  flip breaks grouping on its own); paragraphs → incoming `TextMessage` (inline
  formatting kept); a blank line (empty paragraph) is dropped but forces a group
  split; a contiguous run of same-type list items collapses into ONE bubble with
  a native `<ul>`/`<ol>` (`list-disc/list-decimal pl-5`); images/embeds →
  standalone `MediaMessage` (embeds `wide` + 16:9-locked container). Other slice
  types (the `heading` slice) stay one incoming bubble. Verified via
  `BlogPost.stories.tsx`.
- **`MediaMessage` takes `direction`** (default `incoming`); `outgoing`
  right-aligns it and gives it the blue-side tail.
- **Grouping hints** — `Message`/`MediaMessage` accept `startsGroup` and
  `standalone` (not rendered; read by `MessageThread`). `MessageThread` forces a
  group boundary between adjacent messages when the side flips, the later one has
  `startsGroup` (blank-line split), or either is `standalone` (media reads as its
  own message). Everything else groups with its same-side neighbour. `sideOf`
  still derives the side (incoming/outgoing) from component type + `direction`.

**Kept in the codebase (just unmounted):** the entire iMessage component library
+ all Storybook stories — see below. A prior "whole site is one persistent
conversation" takeover (`src/components/conversation/`, pages rendering `null`)
was also built and then fully reverted. `src/lib/posts.ts`
(`PLACEHOLDER_POSTS` / `BlogPostLink`) is now just `{title, slug}`, driving the
`PostListComposer` post list in Storybook.

- **`PostSidebar`** (`src/components/PostSidebar`) — the blog-post index as the
  macOS **Messages conversation-list column** (matches the captain's design,
  direction 1a — see `design-reference.md`). A fixed **334px** `<aside>` on the
  `--sidebar-*` design tokens (opaque `--sidebar-bg`, right border
  `--separator`) that OVERLAYS the left edge WITHOUT reflowing `{children}`.
  Contents: a "Posts" header (22px/700) + decorative compose pencil; a **live
  title-search** pill (a real `type='search'` `<input>` styled as the design's
  `--search-bg` pill — filters by title, case-insensitive substring `useMemo`;
  empty query shows all, no match → tasteful empty state); and a scrolling list
  of **rich rows** — 44px circular **avatar** (Prismic cover `image` via
  `PrismicNextImage`, else a deterministic-color **monogram** from the title
  initial) · title (15px, ellipsis) · compact date · 2-line preview clamp · a
  selected-row highlight (`--row-sel`, from the active `/blog/<slug>` route via
  `usePathname`, overridable with the `activeSlug` prop). **Persistent on
  desktop** (`md:translate-x-0`); on mobile a **drawer** (direction 1b: larger
  type, 50px avatars) toggled from a top-left button with a tap-away scrim;
  choosing a row closes it. Rows are driven by the richer **`SidebarPost`** type
  (`src/lib/posts.ts`: `blogPostToSidebar(doc)` maps a `BlogPostDocument` —
  title, cover `image`, `first_publication_date` since the schema has **no
  `date` field**, and the first body paragraph as excerpt; falls back to
  `PLACEHOLDER_SIDEBAR_POSTS` when Prismic is unwired). The `--sidebar-*` tokens
  live in `globals.css`, themed light/dark via `prefers-color-scheme` with a
  `[data-theme]` override (used by the Storybook dark story). `BlogPostLink`/
  `PLACEHOLDER_POSTS` stay for `PostLinkList`.
- **`PostListComposer`** (`src/components/PostListComposer`) — the bottom-fixed
  iMessage compose pill, now **DECORATIVE**: a real, focusable `<input>` the
  visitor can type into, but submitting does NOTHING (no send, no navigation) —
  the payoff comes later. Post links moved to `PostSidebar`. It is a **single
  full-width pill** (NO send button) that itself FLOATS — no panel/bar behind
  it; the blur lives ON the pill (`bg-background/60 backdrop-blur`) so it stays
  legible over content. A plain `<input>` is focusable/typeable with zero client
  JS, so this is a **server component** (name kept for import stability though it
  no longer composes a list).
- **`PostLinkList`** (`src/components/PostListComposer/PostLinkList`) — the
  post-link bubbles shared by `PostSidebar` and the in-thread recirculation
  links. `PostLinkList`/`PostLinkBubble` render each post heading as a link
  bubble: the darker translucent grey `typing` tone in the OUTGOING (right)
  position, **ALWAYS tail-less**, each its OWN fully rounded bubble — **no
  grouped connecting corners**. Only the **visible BUBBLE is the click target**
  — the `Link` is `pointer-events-none` and the `ChatBubble` is
  `pointer-events-auto`, so pointer events land only on the bubble (the empty row
  area is click-through) while the bubble keeps its correct DynamicBubble sizing
  and keyboard focus still works. Translucency comes ENTIRELY from the theme
  token `--color-imessage-typing` (`rgba(118,118,128,0.9)` — deliberately
  darkened) — there are NO `opacity-*` classes on the bubble.
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
  `text-base` (≈16px mobile) → `md:text-xl` — the SAME size for incoming and
  outgoing bubbles.
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
  bubbles drop the tail (except the last) and tighten spacing, but keep the
  FULL corner radius — `GROUPED_RADIUS = BUBBLE_RADIUS`, so `flattenTop`/
  `flattenBottom` no longer reduce the connecting corners; every bubble's corners
  are consistent (grouped runs read as separate fully-rounded bubbles with tight
  spacing). It reads each
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
- **No message reveal.** Bubbles render at **FULL opacity by default** — there is
  NO scroll/opacity reveal on messages (`Message`/`MediaMessage` just render the
  bubble). This is deliberate: the conversation must be readable **without client
  JS** (review §7c), and a JS fade-in violated that. The old opacity-reveal
  machinery — `useScrollReveal`, `RevealOnView`, the `revealQueue`
  (`RevealQueueProvider`/`QueuedReveal`) and their `constants.ts`
  (`HIDDEN_OPACITY` etc.) — has been **removed** (it was flagged unused). Tails
  are still measured client-side by `DynamicBubble` (a rounded-rect stands in
  without JS), but nothing depends on JS to become *visible*.
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
