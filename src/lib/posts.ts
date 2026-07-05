/**
 * A blog post reduced to what a link needs: its heading and its slug.
 */
export type BlogPostLink = {
    title: string;
    slug: string;
};

/**
 * Placeholder posts that drive the blog UI while Prismic is unwired (the repo
 * config is pending — see AGENTS.md). Swap this out for real Prismic posts by
 * mapping `getAllPosts()` documents to `{ title, slug }` once the repo exists.
 */
export const PLACEHOLDER_POSTS: BlogPostLink[] = [
    { title: 'Shipping the blog', slug: 'shipping-the-blog' },
    {
        title: 'Rebuilding heyscott on the modern stack',
        slug: 'modern-stack',
    },
    { title: 'iMessage bubbles in React', slug: 'imessage-bubbles' },
    { title: 'Masking media to a speech-bubble shape', slug: 'bubble-masking' },
    { title: 'Why the blog is a conversation', slug: 'blog-as-conversation' },
];
