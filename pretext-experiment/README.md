# Experiment: `@chenglou/pretext` vs. the DIY DOM min-width hug

**Branch:** `fm/heyscott-pretext-t7` (based on `fm/heyscott-blog-m5`) — **local-only,
not for merge.** The captain asked to actually TRY pretext in the message-bubble
text rendering and compare it against the current approach.

## What changed

`src/components/imessage/DynamicBubble.tsx` — the text bubble's "hug the minimum
width of the wrapped text" measurement was swapped from the DIY approach (force
the real DOM to wrap at each trial width via `getClientRects`, binary-search the
smallest width that keeps the minimal line count) to **pretext's pure-JS canvas
measurement** (`prepareWithSegments` + `measureLineStats` / `measureNaturalWidth`).
Same algorithm — smallest width that keeps the minimal line count — but computed
against a canvas font engine with **no DOM reflow**. `@chenglou/pretext@0.0.8`
added as a dependency. Everything else (SVG bubble+tail clip, media path,
fallback, ResizeObserver + `fonts.ready` re-measure) is unchanged.

## How it was measured

Storybook (`iMessage/TextMessage → HugsAcrossLengths`, `iMessage/Conversation`)
screenshotted with headless Chrome at desktop (1200px) and mobile (390px), for
both the pretext build and the DIY build (same commit, `DynamicBubble.tsx`
temporarily swapped). Plus a numeric harness that runs BOTH algorithms on the
same strings and verifies pretext's chosen width against the **real browser wrap**
(ground truth). Harness lives in the session scratchpad; results below.

## Side-by-side Storybook story

`iMessage/PretextComparison` (`src/components/imessage/PretextComparison.stories.tsx`)
renders the same content (short / medium / long / url / cjk, both directions)
with **both** engines in adjacent columns — DIY (`measure="dom"`) left, pretext
(`measure="pretext"`) right — so wrap tightness is directly comparable. Both
implementations are kept in `DynamicBubble.tsx` behind the `measure` prop
(default `pretext` on this branch). See `comparison-story-sidebyside.png` /
`comparison-story-wide.png`.

**What the live story shows** (Helvetica Neue *Light*, the real bubble font):
Latin and URL rows render **pixel-identical** between the two engines; the **CJK
row is the visible divergence** — pretext hugs to a clearly wider box. So in the
actual product font, pretext matches the DOM for Latin and only loses on CJK /
tight widths.

> Note: the numeric table below was measured with Helvetica Neue *Regular* (a
> heavier face than the component's *Light*), so its Latin Δw values overstate
> what the live component shows. The **direction** (pretext ≥ DIY, worst on CJK)
> holds; the CJK gap is the robust, visible one.

## Results

### Correctness — pretext never overflowed

5 texts × 4 max-widths = 20 cases. In **every** case pretext produced the **same
line count** as the DIY/browser wrap, and the browser kept that line count at
pretext's chosen width (no overflow, no extra line). pretext errs *conservative*
(picks an equal-or-wider box), which is the safe direction.

### Tightness — pretext hugs LOOSER (this is the whole point of the feature)

`Δw` = pretext box width − DIY box width (px). Positive = pretext leaves more slack.

| text   | maxW | DIY w | PTX w | Δw    |
|--------|-----:|------:|------:|------:|
| short  | any  |    71 |    71 |  +0   |
| medium |  480 |   447 |   463 | +16   |
| medium |  320 |   237 |   294 | **+57** |
| medium |  180 |   169 |   179 | +10   |
| long   |  480 |   444 |   469 | +25   |
| long   |  320 |   292 |   319 | +27   |
| long   |  260 |   254 |   256 |  +2   |
| url    |  480 |   422 |   451 | +29   |
| cjk    |  480 |   337 |   480 | **+143** |
| cjk    |  320 |   224 |   306 | **+82** |

DIY is **strictly tighter** because it measures the real DOM wrap; pretext
approximates the browser's line-breaking and, to guarantee the same line count,
settles on a wider box. Latin text: 0–57px of extra slack. **CJK: up to ~140px** —
substantially looser. On the eyeballed screenshots the two look near-identical at
near-max widths (desktop) and diverge on narrower/CJK content.

### Performance — pretext ~4.6× faster per measure

400 measures of the medium string at 320px, headless Chrome:

| approach                 | total   | per measure |
|--------------------------|--------:|------------:|
| DIY (DOM reflow loop)    | 59.5 ms | 0.149 ms    |
| pretext (pure JS)        | 13.0 ms | 0.033 ms    |

pretext avoids the ~24 forced synchronous reflows per measure. Real advantage at
scale (long threads, resize storms); negligible for the handful of bubbles a
heyscott view actually shows.

### Bundle size

pretext, tree-shaken to the three functions we use, minified: **~47 KB
(~15.7 KB gzip)** of added client JS. DIY adds **0 bytes** (pure DOM API).

### DX / stability

- pretext needs the font as a **canvas font string**, rebuilt from
  `getComputedStyle` (Chrome's `.font` shorthand is unreliable).
- It measures `textContent` with **one font** — mixed inline fonts (bold, links,
  `code`) in Prismic rich text are **not modeled** without the heavier
  `rich-inline` API. DIY measures whatever the DOM actually renders (bold, emoji,
  links) exactly, with zero font bookkeeping.
- pretext is **`0.0.8`** — pre-1.0, unstable API.

## Verdict — do NOT adopt for heyscott

pretext works, is safe (no overflow), and is faster. But it loses on the exact
axis this feature exists for: **it hugs looser than the DIY DOM measurement**
(up to ~57px for Latin, ~140px for CJK), it can't see inline font changes in rich
text, it adds ~16 KB gzip, and it's `0.0.x`. Its perf/no-reflow win doesn't matter
at heyscott's scale (a few bubbles per view). The DIY approach measures ground
truth, so it's both tighter and correct. **Keep the DIY approach.**

pretext would earn its keep in a *different* setting — hundreds/thousands of
text blocks measured off the main thread, or SSR/canvas layout where there is no
DOM to measure. That isn't heyscott.

## Screenshots (this folder)

- `pretext-hugs-desktop.png` / `diy-hugs-desktop.png` — near-identical.
- `pretext-hugs-mobile.png` / `diy-hugs-mobile.png` — near-identical hug; the
  outgoing-bubble right-edge clipping is a **Storybook decorator artifact**
  (`max-w-xl` wider than a 390px frame) present in BOTH, not a pretext regression.
- `pretext-conv-desktop.png` / `diy-conv-desktop.png` — full conversation.
