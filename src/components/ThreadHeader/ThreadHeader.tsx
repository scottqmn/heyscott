'use client';

import type { ImageField } from '@prismicio/client';
import { usePostSidebar } from '@/components/PostSidebar/PostSidebarContext';
import { ChevronLeftGlyph, PostAvatar } from '@/components/PostSidebar/parts';

/**
 * The iMessage thread-screen header (design direction 1a main pane): a 56px
 * blurred `--panel-bg` bar that IDENTIFIES the conversation — its avatar +
 * title (the "group name") + an italic Georgia "i" info button. The title is
 * the page's single `<h1>` (a11y), so the conversation body no longer needs a
 * title bubble.
 *
 * ALWAYS visible (desktop main pane + mobile) — this is what carries the
 * identity now. Only the back-chevron is mobile-only: it opens the mobile Posts
 * overlay via the shared context; on desktop the persistent 334px rail is the
 * list, so no back affordance is needed there.
 *
 * Shared by the blog post pages and the homepage "Scott" conversation.
 */
export const ThreadHeader = ({
    title,
    image,
    seed,
}: {
    /** The conversation/group name — rendered as the page `<h1>`. */
    title: string;
    /** Avatar cover image, or `null` → monogram from the title. */
    image: ImageField | null;
    /** Stable seed for the monogram color (post uid / a slug). */
    seed: string;
}) => {
    const sidebar = usePostSidebar();

    return (
        <div className='sticky top-0 z-30 flex min-h-[56px] items-center gap-2 border-b border-[var(--sidebar-separator)] bg-[var(--panel-bg)] px-2 pt-[env(safe-area-inset-top)] backdrop-blur-[20px] [-webkit-backdrop-filter:blur(20px)]'>
            {/* Back to the Posts list (mobile only — desktop has the rail). */}
            <button
                type='button'
                onClick={() => sidebar?.setOpen(true)}
                aria-label='Show posts'
                aria-controls='post-sidebar'
                aria-expanded={sidebar?.open ?? false}
                className='shrink-0 p-1 text-[var(--sidebar-accent)] md:hidden'
            >
                <ChevronLeftGlyph />
            </button>

            {/* Conversation identity: avatar + title (the page h1), centered. */}
            <div className='flex min-w-0 flex-1 items-center justify-center gap-2'>
                <PostAvatar
                    image={image}
                    title={title}
                    seed={seed}
                    className='h-8 w-8 text-[13px]'
                />
                <h1 className='truncate text-[16px] font-semibold tracking-[-0.01em] text-[var(--sidebar-primary)]'>
                    {title}
                </h1>
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
