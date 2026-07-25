'use client';

import { usePostSidebar } from '@/components/PostSidebar/PostSidebarContext';
import { ChevronLeftGlyph, POSTS_MENU_TITLE } from '@/components/PostSidebar/parts';

/**
 * The blog-post thread-screen top bar: a "‹ Posts" back affordance that REUSES
 * the {@link PostSidebar} menu's title ({@link POSTS_MENU_TITLE}) and chevron
 * ({@link ChevronLeftGlyph}) — the same title lifted from the menu, iMessage
 * "back to the conversation list" style. Tapping it opens the Posts list (the
 * mobile full-screen overlay) via the shared open-state context.
 *
 * MOBILE ONLY (`md:hidden`): on desktop the 334px Posts rail is always visible,
 * so a redundant bar is unwanted. On post pages this supersedes the global
 * floating chevron trigger (which hides itself there), so the two never stack.
 */
export const BlogPostHeader = () => {
    const sidebar = usePostSidebar();

    return (
        <div className='sticky top-0 z-30 flex items-center border-b border-[var(--sidebar-separator)] bg-[var(--sidebar-bg)] px-2 pt-[env(safe-area-inset-top)] md:hidden'>
            <button
                type='button'
                onClick={() => sidebar?.setOpen(true)}
                aria-label='Show posts'
                aria-controls='post-sidebar'
                aria-expanded={sidebar?.open ?? false}
                className='flex items-center gap-0.5 py-2 pr-3 text-[var(--sidebar-accent)]'
            >
                <ChevronLeftGlyph />
                <span className='text-[22px] font-bold tracking-[-0.02em] text-[var(--sidebar-primary)]'>
                    {POSTS_MENU_TITLE}
                </span>
            </button>
        </div>
    );
};
