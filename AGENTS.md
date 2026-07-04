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
- Pages: `src/app/blog/page.tsx` (index — posts as an iMessage thread),
  `src/app/blog/[uid]/page.tsx` (post, SSG via `generateStaticParams` +
  `SliceZone`). Preview routes under `src/app/api/(exit-)preview`,
  `src/app/slice-simulator` (must be `'use client'` — it passes a render fn).
- Reusable bubble: `src/components/ChatBubble`. The original splash still uses
  `src/components/Messages`.

## iMessage message-bubble component library (`src/components/imessage/`)

A basic reusable library that renders content *as an iMessage conversation*,
built on the unified dynamic-SVG bubble and the `--color-imessage-*` theme
tokens (extends the theme — does not fork it).

- **`bubbleShape.tsx`** — the single source of truth for the bubble silhouette.
  It reproduces heyscott's ORIGINAL human-made tail
  (`Messages/components/Message/Message.module.scss`): a two-pseudo-element
  trick — rounded body + same-color `::before` bulge + background-colored
  `::after` that carves the concave underside. `BubbleMask` rebuilds that exact
  composite as an SVG `<mask>` (white = body ∪ before, black = after), mirrored
  for incoming. Tail metrics are the originals and, like the CSS, the tail is a
  CONSTANT pixel size regardless of bubble size. Constants `BUBBLE_RADIUS` (25,
  from the original), `BUBBLE_TAIL_OUT` (7). NOTE: don't "simplify" this to a
  rounded-rect + separate tail path — that detaches the tail (leaves a notch);
  the mask (with subtraction) is what makes the authentic scoop-and-hook.
- **`DynamicBubble.tsx`** (client) — measures its content and renders the
  `BubbleMask` sized to it. `variant='text'` paints a `<rect fill=color
  mask=url(#id)>` as the bubble (content bg goes transparent once measured, with
  a plain rounded-rect fallback before that so there's no flash); `variant=
  'media'` applies the same mask via CSS `mask-image` so media **fills the
  bubble and is masked to the silhouette, tail included**. Same shape for both.
  - **Min-width hug (text):** an `inline-block` + `max-width` box does NOT
    shrink to the widest wrapped line (CSS shrink-to-fit keeps the full
    `max-width` once text wraps → ragged whitespace). `measureHugWidth` uses
    `Range.getClientRects()` to find the widest rendered line and pins the
    outer width to it (+ tail room), so the bubble hugs its text at every
    length. `text-wrap: pretty` avoids last-line orphans. Re-runs on container
    resize + `document.fonts.ready`. Chosen over `react-wrap-balancer` (extra
    dep, per-instance scripts) and pure CSS (doesn't hug multi-line).
- `ChatBubble` — thin wrapper over `DynamicBubble` (text). `Message` — base
  message: `ChatBubble` + scroll-focus + optional receipt.
- `HeadingMessage` (incoming/grey — body text style, no heading size/weight),
  `TextMessage` (outgoing/blue), `MediaMessage` (outgoing image/embed
  attachment, masked to the bubble via `DynamicBubble variant='media'`).
- `MessageThread` — centered, readable-width conversation column.
- `ConversationText` + `messageSerializers` — Prismic rich-text → conversation:
  **headings = incoming, paragraphs/lists/preformatted = outgoing, images/embeds
  = outgoing attachments**. Wired into the `RichText` slice, so blog post bodies
  render as conversations. `list`/`oList` pass through (bubbles can't nest in a
  `<ul>`).
- SVG chrome in `assets/`: `BubbleTail` (a small standalone bubble rendered
  from the shared `BubbleMask`, mirrored for incoming) and `ReadReceipt` (single
  check = Delivered, double = Read).

**Scroll focus effect:** `useInViewFocus` (IntersectionObserver, focus band via
`FOCUS_ROOT_MARGIN`) dims off-focus messages to `UNFOCUSED_OPACITY` (**`0.6`,
tunable in `constants.ts`**); the in-view message stays full opacity. Defaults
to focused during SSR / before the observer attaches, so there's no dim flash.

Note: text and media bubbles share ONE silhouette (`bubbleShape.tsx`). The
homepage splash (`src/components/Messages`) still uses its own SCSS bubble and
is intentionally left alone. When changing the bubble/tail shape, edit
`bubbleShape.tsx` only — everything else derives from it. To eyeball the
geometry without a browser, rasterize `BubbleSilhouette` to PNG with `sharp`.

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
- Stories co-located with components (`*.stories.tsx`). `mocks.ts` holds
  self-contained mock Prismic data (data-URI image, so stories work offline).
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
