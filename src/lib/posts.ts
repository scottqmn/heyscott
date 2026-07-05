import type { RichTextField } from '@prismicio/client';

/**
 * A blog post reduced to what the UI needs: heading, slug, and a body rendered
 * as an iMessage conversation.
 */
export type BlogPostLink = {
    title: string;
    slug: string;
    /** Post body as a Prismic rich-text field (rendered via ConversationText). */
    body: RichTextField;
};

/** Build a small placeholder body from lines of `['h', text]` / `['p', text]`. */
function body(lines: Array<['h' | 'p', string]>): RichTextField {
    const nodes = lines.map(([kind, text]): RichTextField[number] =>
        kind === 'h'
            ? { type: 'heading2', text, spans: [] }
            : { type: 'paragraph', text, spans: [] }
    );
    // Bodies are always non-empty; RichTextField is a non-empty tuple.
    return nodes as RichTextField;
}

/**
 * Placeholder posts that drive the blog UI while Prismic is unwired (repo
 * config pending — see AGENTS.md). The `body` copy is PLACEHOLDER. Swap for
 * real Prismic posts by mapping `getAllPosts()` documents to this shape once the
 * repo exists.
 */
export const PLACEHOLDER_POSTS: BlogPostLink[] = [
    {
        title: 'Shipping the blog',
        slug: 'shipping-the-blog',
        body: body([
            ['p', 'Rewrote the whole site on the modern stack this week.'],
            ['h', 'What changed'],
            [
                'p',
                'Next 16 and React 19, Tailwind v4 with a semantic token system, and a Prismic-backed blog — all rendered as an iMessage conversation.',
            ],
            [
                'p',
                'The bubbles, tails, grouping and scroll reveal are their own little component library.',
            ],
        ]),
    },
    {
        title: 'Rebuilding heyscott on the modern stack',
        slug: 'modern-stack',
        body: body([
            [
                'p',
                'The old site was Next 14, React 18, Tailwind 3 and a pile of SCSS.',
            ],
            [
                'p',
                'Now it is App Router, CSS-first Tailwind v4 tokens, and a Storybook catalog for the message components.',
            ],
            ['h', 'Why bother'],
            [
                'p',
                'Mostly so the fun stuff — the iMessage bubbles — could be built on something that will still be around next year.',
            ],
        ]),
    },
    {
        title: 'iMessage bubbles in React',
        slug: 'imessage-bubbles',
        body: body([
            [
                'p',
                'Each bubble is a dynamic SVG that reproduces the original human-made iMessage tail.',
            ],
            [
                'p',
                'The bubble hugs the minimum width for its wrapped text, groups with its neighbors, and drops its tail unless it is the last of a run.',
            ],
        ]),
    },
    {
        title: 'Masking media to a speech-bubble shape',
        slug: 'bubble-masking',
        body: body([
            [
                'p',
                'Images and embeds fill the bubble and get clipped to the exact speech-bubble silhouette — tail included.',
            ],
            [
                'p',
                'It took a couple of tries: a CSS mask left a broken tail on media, so the shape became one traced clip-path that works on both text and iframes.',
            ],
        ]),
    },
    {
        title: 'Why the blog is a conversation',
        slug: 'blog-as-conversation',
        body: body([
            [
                'p',
                'Landing on the site feels like texting Scott: you say hey, and the page answers back.',
            ],
            [
                'p',
                'Browsing to another post does not reset anything — the thread just keeps going.',
            ],
        ]),
    },
];

/** Look up a placeholder post by slug. */
export function getPlaceholderPost(slug: string): BlogPostLink | undefined {
    return PLACEHOLDER_POSTS.find((post) => post.slug === slug);
}
