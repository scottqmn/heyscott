import { Content } from '@prismicio/client';
import { createClient } from '@/prismicio';

/**
 * Blog queries with graceful degradation. Until the captain wires a live
 * Prismic repository + access token (see AGENTS.md / .env.local.sample),
 * these calls will fail against the placeholder repo. We swallow the error
 * and return empty results so `next build` and `next dev` still succeed and
 * render the blog's empty state, rather than crashing the whole site.
 *
 * Once real credentials exist, the same code returns real content with no
 * changes required here.
 */

export async function getAllPosts(): Promise<Content.BlogPostDocument[]> {
    try {
        const client = createClient();
        return await client.getAllByType('blog_post', {
            orderings: [
                { field: 'my.blog_post.date', direction: 'desc' },
                { field: 'document.first_publication_date', direction: 'desc' },
            ],
        });
    } catch (error) {
        console.warn(
            '[heyscott] Could not fetch blog posts from Prismic — ' +
                'is the repository configured? Falling back to empty list.',
            error instanceof Error ? error.message : error
        );
        return [];
    }
}

export async function getPost(
    uid: string
): Promise<Content.BlogPostDocument | null> {
    try {
        const client = createClient();
        return await client.getByUID('blog_post', uid);
    } catch {
        return null;
    }
}
