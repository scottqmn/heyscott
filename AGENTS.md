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
built on top of the `ChatBubble` primitive and the `--color-imessage-*` theme
tokens (extends the theme — does not fork it).

- `Message` — base message: `ChatBubble` + scroll-focus + optional receipt.
  Props: `direction` (`incoming`|`outgoing`), `grouped`, `receipt`,
  `focusOnScroll`.
- `HeadingMessage` (incoming/grey, sized by `level` 1–6), `TextMessage`
  (outgoing/blue), `MediaMessage` (outgoing image/embed attachment — uses the
  SVG `BubbleTail` because `overflow-hidden` clips the CSS pseudo tail).
- `MessageThread` — centered, readable-width conversation column.
- `ConversationText` + `messageSerializers` — Prismic rich-text → conversation:
  **headings = incoming, paragraphs/lists/preformatted = outgoing, images/embeds
  = outgoing attachments**. Wired into the `RichText` slice, so blog post bodies
  render as conversations. `list`/`oList` pass through (bubbles can't nest in a
  `<ul>`).
- SVG chrome in `assets/`: `BubbleTail` (mirrored via `-scale-x-100` for
  incoming) and `ReadReceipt` (single check = Delivered, double = Read).

**Scroll focus effect:** `useInViewFocus` (IntersectionObserver, focus band via
`FOCUS_ROOT_MARGIN`) dims off-focus messages to `UNFOCUSED_OPACITY` (**`0.6`,
tunable in `constants.ts`**); the in-view message stays full opacity. Defaults
to focused during SSR / before the observer attaches, so there's no dim flash.

Note: text bubbles keep `ChatBubble`'s proven CSS pseudo-element tail (matches
the homepage splash); SVG is used where it's genuinely cleaner or where CSS
tails get clipped (media) — receipts, media tails.

### Resilient fetch (important)

`src/lib/prismic/queries.ts` **swallows Prismic errors and returns empty**, so
`build`/`dev` succeed even without a live repo (renders the blog empty state).
Once a real repo + token are configured this same code returns real content —
do not "fix" the try/catch away.

**`heyscott` in `slicemachine.config.json` is a PLACEHOLDER repo name.** A real
Prismic repository + `.env.local` (see `.env.local.sample`) is required before
the blog shows content. This is a captain/account decision.
