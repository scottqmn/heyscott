import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc, asText } from '@prismicio/client';
import { BlogPost } from '@/components/BlogPost';
import { getAllPosts, getPost } from '@/lib/prismic/queries';

type Params = { uid: string };

/**
 * Pre-render a page per post when a live Prismic repo is wired. With the
 * placeholder repo, {@link getAllPosts} swallows the fetch error and returns
 * `[]`, so nothing is statically generated and the route stays dynamic — the
 * build still succeeds. See `src/lib/prismic/queries.ts`.
 */
export async function generateStaticParams(): Promise<Params[]> {
    const posts = await getAllPosts();
    return posts.map((post) => ({ uid: post.uid }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { uid } = await params;
    const post = await getPost(uid);
    if (!post) return {};

    const { data } = post;
    const title = data.meta_title || asText(data.title) || undefined;
    const description = data.meta_description || undefined;
    const image =
        asImageSrc(data.meta_image) || asImageSrc(data.image) || undefined;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: image ? [{ url: image }] : undefined,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { uid } = await params;
    const post = await getPost(uid);
    if (!post) notFound();

    return <BlogPost post={post} />;
}
