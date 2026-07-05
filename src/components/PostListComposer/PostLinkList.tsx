import Link from 'next/link';
import { ChatBubble } from '@/components/ChatBubble';
import type { BlogPostLink } from '@/lib/posts';

/**
 * A single post link as a darker, translucent grey bubble (the iMessage
 * typing-indicator tone) in the outgoing (right) position — distinct from an
 * incoming message. Post-link bubbles are ALWAYS tail-less (they read as a
 * list/menu, not sent messages); grouping only tightens spacing and rounds the
 * connecting corners.
 */
export const PostLinkBubble = ({
    post,
    grouped = false,
    groupedBelow = false,
}: {
    post: BlogPostLink;
    /** A link sits above (tightens the top, rounds the top connecting corner). */
    grouped?: boolean;
    /** A link sits below (rounds the bottom connecting corner). */
    groupedBelow?: boolean;
}) => (
    <ChatBubble
        variant='sent'
        tone='typing'
        tail={false}
        grouped={grouped}
        groupedBelow={groupedBelow}
    >
        <Link
            href={`/blog/${post.slug}`}
            className='block font-medium transition-opacity hover:opacity-70'
        >
            {post.title}
        </Link>
    </ChatBubble>
);

/**
 * A grouped, ALWAYS tail-less stack of post-link bubbles — tight spacing and
 * flattened connecting corners (round on the outer edges), reading as a menu
 * of links rather than sent messages. Shared by the compose-bar sheet and the
 * in-thread recirculation links.
 */
export const PostLinkList = ({ posts }: { posts: BlogPostLink[] }) => (
    <>
        {posts.map((post, i) => (
            <PostLinkBubble
                key={post.slug}
                post={post}
                grouped={i > 0}
                groupedBelow={i < posts.length - 1}
            />
        ))}
    </>
);
