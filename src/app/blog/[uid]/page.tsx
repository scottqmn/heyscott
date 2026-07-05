import type { Metadata } from 'next';
import { PLACEHOLDER_POSTS, getPlaceholderPost } from '@/lib/posts';

type Params = { uid: string };

export function generateStaticParams(): Params[] {
    return PLACEHOLDER_POSTS.map((post) => ({ uid: post.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { uid } = await params;
    const post = getPlaceholderPost(uid);
    return { title: post ? `${post.title} — Hey Scott!` : 'Hey Scott!' };
}

/**
 * The post body is rendered as conversation messages by `ConversationView`
 * (from the placeholder source while Prismic is unwired), so this route renders
 * nothing itself — it just needs to exist so `/blog/<slug>` resolves (no
 * `notFound`, so any slug appends a segment to the conversation).
 */
export default function BlogPostPage() {
    return null;
}
