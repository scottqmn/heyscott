import Link from 'next/link';
import { ChatBubble } from '@/components/ChatBubble';
import type { BlogPostLink } from '@/lib/posts';

/**
 * A single post link as a darker, translucent grey bubble (the iMessage
 * typing-indicator tone) in the outgoing (right) position — distinct from an
 * incoming message. Post-link bubbles are ALWAYS tail-less (they read as a
 * list/menu, not sent messages) and each keeps its OWN full rounded corners —
 * no grouped/connecting-corner treatment between stacked links. Only the visible
 * BUBBLE is the click target: the `Link` is `pointer-events-none` and the bubble
 * `pointer-events-auto`, so pointer events land only on the bubble (the empty row
 * area is click-through and does nothing) while keyboard focus still works. It
 * uses the darkened `typing` tone so it reads as a distinct, darker menu item. Choosing it also closes the sheet via
 * `onLinkClick`.
 */
export const PostLinkBubble = ({
    post,
    onLinkClick,
}: {
    post: BlogPostLink;
    /** Called when the link is chosen (used to close the composer sheet). */
    onLinkClick?: () => void;
}) => (
    <Link
        href={`/blog/${post.slug}`}
        onClick={onLinkClick}
        className='pointer-events-none block font-medium'
    >
        <ChatBubble
            variant='sent'
            tone='typing'
            tail={false}
            className='pointer-events-auto'
        >
            {post.title}
        </ChatBubble>
    </Link>
);

/**
 * An ALWAYS tail-less stack of post-link bubbles reading as a menu of links
 * rather than sent messages — each its own rounded bubble (no connecting
 * corners). Shared by the compose-bar sheet and the in-thread recirculation
 * links. Passing `onLinkClick` lets a caller (the composer) close on navigate.
 */
export const PostLinkList = ({
    posts,
    onLinkClick,
}: {
    posts: BlogPostLink[];
    onLinkClick?: () => void;
}) => (
    <>
        {posts.map((post) => (
            <PostLinkBubble
                key={post.slug}
                post={post}
                onLinkClick={onLinkClick}
            />
        ))}
    </>
);
