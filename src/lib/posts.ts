/**
 * A blog post reduced to what the post-link UI needs: a heading and a slug.
 * Drives {@link PostListComposer}/`PostLinkList` while Prismic is unwired.
 */
export type BlogPostLink = {
    title: string;
    slug: string;
};

/**
 * Placeholder posts that drive the compose-bar post list while Prismic is
 * unwired (repo config pending — see AGENTS.md). Swap for real Prismic posts by
 * mapping `getAllPosts()` documents to this shape once the repo exists.
 */
export const PLACEHOLDER_POSTS: BlogPostLink[] = [
    { title: 'Shipping the blog', slug: 'shipping-the-blog' },
    { title: 'Rebuilding heyscott on the modern stack', slug: 'modern-stack' },
    { title: 'iMessage bubbles in React', slug: 'imessage-bubbles' },
    { title: 'Masking media to a speech-bubble shape', slug: 'bubble-masking' },
    { title: 'Why the blog is a conversation', slug: 'blog-as-conversation' },
];
