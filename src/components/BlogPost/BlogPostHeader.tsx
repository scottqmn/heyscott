'use client';

import { asText, isFilled, type Content } from '@prismicio/client';
import { usePostSidebar } from '@/components/PostSidebar/PostSidebarContext';
import { ChevronLeftGlyph, PostAvatar } from '@/components/PostSidebar/parts';

/**
 * The iMessage thread-screen header (design direction 1a main pane): a ~56px
 * blurred `--panel-bg` bar that IDENTIFIES the post you're reading — the post's
 * own avatar + title, centered — with an italic Georgia "i" info button on the
 * right (decorative). On the LEFT, a back chevron opens the Posts list (the
 * mobile full-screen overlay) via the shared open-state context — the iMessage
 * "‹ back to the list" control.
 *
 * MOBILE ONLY (`md:hidden`): on desktop the persistent 334px rail already is the
 * list, so the header is unwanted there. On post pages this supersedes the
 * global floating chevron trigger (which hides itself), so the two never stack.
 */
export const BlogPostHeader = ({
    post,
}: {
    post: Content.BlogPostDocument;
}) => {
    const sidebar = usePostSidebar();
    const title = asText(post.data.title);
    const image = isFilled.image(post.data.image) ? post.data.image : null;

    return (
        <div className='sticky top-0 z-30 flex min-h-[56px] items-center gap-2 border-b border-[var(--sidebar-separator)] bg-[var(--panel-bg)] px-2 pt-[env(safe-area-inset-top)] backdrop-blur-[20px] [-webkit-backdrop-filter:blur(20px)] md:hidden'>
            {/* Back to the Posts list (iMessage "‹"). */}
            <button
                type='button'
                onClick={() => sidebar?.setOpen(true)}
                aria-label='Show posts'
                aria-controls='post-sidebar'
                aria-expanded={sidebar?.open ?? false}
                className='shrink-0 p-1 text-[var(--sidebar-accent)]'
            >
                <ChevronLeftGlyph />
            </button>

            {/* The post's identity: avatar + title, centered like an iMessage
                conversation header. */}
            <div className='flex min-w-0 flex-1 items-center justify-center gap-2'>
                <PostAvatar
                    image={image}
                    title={title}
                    seed={post.uid}
                    className='h-8 w-8 text-[13px]'
                />
                <span className='truncate text-[16px] font-semibold tracking-[-0.01em] text-[var(--sidebar-primary)]'>
                    {title}
                </span>
            </div>

            {/* Decorative italic Georgia "i" info button (design). */}
            <span
                aria-hidden='true'
                className='flex h-7 w-7 shrink-0 items-center justify-center text-[17px] italic text-[var(--sidebar-accent)]'
                style={{ fontFamily: 'Georgia, serif' }}
            >
                i
            </span>
        </div>
    );
};
