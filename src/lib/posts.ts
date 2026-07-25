import { asText, isFilled, type Content, type ImageField } from '@prismicio/client';

/**
 * A blog post reduced to what the post-link UI needs: a heading and a slug.
 * Drives `PostLinkList` (the in-thread recirculation link bubbles) while
 * Prismic is unwired.
 */
export type BlogPostLink = {
    title: string;
    slug: string;
};

/**
 * Placeholder posts that drive `PostLinkList` while Prismic is unwired (repo
 * config pending — see AGENTS.md).
 */
export const PLACEHOLDER_POSTS: BlogPostLink[] = [
    { title: 'Shipping the blog', slug: 'shipping-the-blog' },
    { title: 'Rebuilding heyscott on the modern stack', slug: 'modern-stack' },
    { title: 'iMessage bubbles in React', slug: 'imessage-bubbles' },
    { title: 'Masking media to a speech-bubble shape', slug: 'bubble-masking' },
    { title: 'Why the blog is a conversation', slug: 'blog-as-conversation' },
];

/**
 * The richer post shape the {@link PostSidebar} rows need — a Messages
 * conversation-list row: avatar (cover image or monogram), title, date, and a
 * short body preview. Distinct from {@link BlogPostLink} (which is title+slug
 * only) so the sidebar can render the full design without overloading the
 * link model.
 */
export type SidebarPost = {
    title: string;
    slug: string;
    /**
     * ISO date string for the row's date line, or `null` when unknown. The
     * `blog_post` schema has no `date` field, so this comes from the document's
     * first-publication date.
     */
    date: string | null;
    /** Prismic cover image, or `null` → monogram fallback. */
    image: ImageField | null;
    /** First body paragraph, for the 2-line preview clamp. `null` when none. */
    excerpt: string | null;
    /**
     * Row link target. Defaults to `/blog/<slug>`; the pinned home row overrides
     * it to `/` (see {@link homeSidebarPost}).
     */
    href?: string;
};

/**
 * Monogram avatar background — the design (D18) uses ONE flat neutral grey for
 * every avatar, not a per-post color. `seed` is accepted but ignored so the call
 * sites don't churn.
 */
export const MONOGRAM_COLOR = '#a9abb2';
export const monogramColor = (_seed?: string): string => MONOGRAM_COLOR;

/** The uppercase first letter of a title for the monogram (falls back to “#”). */
export const monogramInitial = (title: string): string => {
    const first = title.trim().charAt(0);
    return first ? first.toUpperCase() : '#';
};

/** First non-empty `rich_text` body paragraph, for the row preview. */
const excerptFromBody = (
    body: Content.BlogPostDocument['data']['body']
): string | null => {
    for (const slice of body) {
        if (slice.slice_type === 'rich_text') {
            const text = asText(slice.primary.content).trim();
            if (text) return text;
        }
    }
    return null;
};

/**
 * Map a Prismic `blog_post` document to the sidebar row shape. Title comes from
 * the rich-text heading, the avatar from the cover `image` (or a monogram when
 * absent), the date from the document's first-publication date (the schema has
 * no `date` field), and the preview from the first body paragraph.
 */
export const blogPostToSidebar = (
    doc: Content.BlogPostDocument
): SidebarPost => ({
    title: asText(doc.data.title),
    slug: doc.uid,
    date: doc.first_publication_date ?? null,
    image: isFilled.image(doc.data.image) ? doc.data.image : null,
    excerpt: excerptFromBody(doc.data.body),
});

/**
 * Placeholder sidebar posts (enriched with dates + previews) that drive the
 * {@link PostSidebar} while Prismic is unwired — `image` is `null` so every row
 * renders a monogram. Swapped for {@link blogPostToSidebar} output once the repo
 * exists (see `layout.tsx`).
 */
export const PLACEHOLDER_SIDEBAR_POSTS: SidebarPost[] = [
    {
        title: 'Shipping the blog',
        slug: 'shipping-the-blog',
        date: '2026-07-14T00:00:00Z',
        image: null,
        excerpt:
            'The whole site is one iMessage conversation now — bubbles, tails, and a splash that renders without a line of client JS.',
    },
    {
        title: 'Rebuilding heyscott on the modern stack',
        slug: 'modern-stack',
        date: '2026-06-30T00:00:00Z',
        image: null,
        excerpt:
            'Next 16 on webpack, React 19, Tailwind v4 CSS-first tokens, and Prismic — and why Turbopack stays off until it down-levels for older iOS Safari.',
    },
    {
        title: 'iMessage bubbles in React',
        slug: 'imessage-bubbles',
        date: '2026-06-12T00:00:00Z',
        image: null,
        excerpt:
            'One dynamic SVG silhouette drives every bubble — body, tail, and the concave scoop — measured to hug its own text.',
    },
    {
        title: 'Masking media to a speech-bubble shape',
        slug: 'bubble-masking',
        date: '2026-05-28T00:00:00Z',
        image: null,
        excerpt:
            'Clipping images and even iframes to the bubble silhouette with a single traced clipPath — and why CSS masks fell short.',
    },
    {
        title: 'Why the blog is a conversation',
        slug: 'blog-as-conversation',
        date: '2026-05-09T00:00:00Z',
        image: null,
        excerpt:
            'Titles arrive as gray replies, the body answers in blue. The reading experience is the brand — a text thread, not a page.',
    },
];

/**
 * A stable, non-post slug for the pinned home row so it never collides with a
 * real Prismic uid or a placeholder slug.
 */
export const HOME_SIDEBAR_SLUG = '__home__';

/**
 * The pinned FIRST sidebar row: the homepage rendered as an iMessage
 * conversation with "Scott". Kept out of the Prismic-backed / placeholder post
 * lists — {@link RootLayout} prepends it — so it never collides with real posts.
 * `href` points at `/`, the avatar is an "S" monogram, and the preview mirrors
 * the homepage copy (Scott's own words). `date` is passed in (today's date,
 * stamped by the server layout) so this stays a pure function.
 */
export const homeSidebarPost = (dateIso: string): SidebarPost => ({
    title: 'Scott',
    slug: HOME_SIDEBAR_SLUG,
    href: '/',
    date: dateIso,
    image: null,
    // Mirrors the homepage copy (see `Messages/constants.ts`).
    excerpt: "Hey! I'm a little busy at the moment.",
});
