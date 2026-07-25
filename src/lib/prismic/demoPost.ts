import type { Content } from '@prismicio/client';
import { PLACEHOLDER_SIDEBAR_POSTS } from '@/lib/posts';

/** A demo paragraph node (renders as one incoming reply bubble). */
const paragraph = (text: string) => ({ type: 'paragraph', text, spans: [] });

/**
 * A minimal DEMO blog post, used ONLY as a fallback for the placeholder slugs
 * when Prismic is unwired — so `/blog/<slug>` is viewable (title + a short
 * iMessage conversation body) instead of a 404. This mirrors the existing
 * graceful-degradation approach ({@link PLACEHOLDER_SIDEBAR_POSTS} drives the
 * sidebar the same way). REAL Prismic content always wins: the detail page only
 * falls back here when `getPost` returns `null`. It builds a plain document
 * shaped for {@link BlogPost}/`richTextToBubbles` (title heading + one
 * `rich_text` body slice) and touches no bubble components.
 */
export const getDemoPost = (uid: string): Content.BlogPostDocument | null => {
    const meta = PLACEHOLDER_SIDEBAR_POSTS.find((post) => post.slug === uid);
    if (!meta) return null;

    const lines = [
        meta.excerpt ?? 'A short note from the placeholder feed.',
        'This is placeholder content, shown while the Prismic repository is unwired. Wire a real repo and this same page renders the real post.',
        'The whole page is one iMessage conversation — the title arrives as a sent bubble, and the body replies back.',
    ];

    const doc = {
        id: `demo-${uid}`,
        uid,
        url: `/blog/${uid}`,
        type: 'blog_post',
        href: '',
        tags: [],
        first_publication_date: meta.date ?? '2026-07-14T00:00:00+0000',
        last_publication_date: meta.date ?? '2026-07-14T00:00:00+0000',
        slugs: [uid],
        linked_documents: [],
        lang: 'en-us',
        alternate_languages: [],
        data: {
            title: [{ type: 'heading1', text: meta.title, spans: [] }],
            image: {},
            body: [
                {
                    id: `demo-${uid}-body`,
                    slice_type: 'rich_text',
                    slice_label: null,
                    variation: 'default',
                    version: 'demo',
                    primary: { content: lines.map(paragraph) },
                    items: [],
                },
            ],
            meta_title: null,
            meta_description: null,
            meta_image: {},
        },
    };

    // Plain demo data cast to the generated document type — a small, clearly
    // labelled fallback, not real content.
    return doc as unknown as Content.BlogPostDocument;
};
