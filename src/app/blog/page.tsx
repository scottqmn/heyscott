import { asText } from '@prismicio/client';
import { PostListComposer } from '@/components/PostListComposer';
import { PLACEHOLDER_POSTS, type BlogPostLink } from '@/lib/posts';
import { getAllPosts } from '@/lib/prismic/queries';

/**
 * The blog index, rendered as an iMessage compose bar: tapping it pops up the
 * list of posts as tail-less link bubbles ({@link PostListComposer}). Wired to
 * Prismic via {@link getAllPosts}; with the placeholder repo that returns `[]`
 * (the query swallows the error), so we fall back to `PLACEHOLDER_POSTS` and
 * the page still renders a populated list.
 */
export default async function BlogIndexPage() {
    const posts = await getAllPosts();
    const links: BlogPostLink[] = posts.map((post) => ({
        title: asText(post.data.title),
        slug: post.uid,
    }));
    const postLinks = links.length > 0 ? links : PLACEHOLDER_POSTS;

    return (
        <main className='min-h-screen'>
            <PostListComposer posts={postLinks} defaultOpen />
        </main>
    );
}
