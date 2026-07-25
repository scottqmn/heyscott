'use client';

import type { ImageField } from '@prismicio/client';
import { usePostSidebar } from '@/components/PostSidebar/PostSidebarContext';
import {
    ChevronLeftGlyph,
    ChevronRightGlyph,
    PostAvatar,
} from '@/components/PostSidebar/parts';

/**
 * The iMessage thread-screen header (design 1a/1b main pane): a 56px blurred
 * `--panel-bg` bar with a **vertical stack** — avatar on top, the conversation
 * name BELOW it (the page `<h1>`, small/regular like the design's label), and
 * the info "i" in a bordered circle pinned right. On mobile a `›` disclosure
 * follows the title, and the back-chevron (left) opens the Posts overlay. The
 * title is the "group name" so the body needs no title bubble.
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
    /** Stable seed (post uid / a slug) — retained for the avatar API. */
    seed: string;
}) => {
    const sidebar = usePostSidebar();

    return (
        <div className='sticky top-0 z-30 flex min-h-[56px] flex-col items-center justify-center gap-[3px] border-b border-[var(--sidebar-separator)] bg-[var(--panel-bg)] px-12 pt-[env(safe-area-inset-top)] pb-1.5 backdrop-blur-[20px] [-webkit-backdrop-filter:blur(20px)]'>
            {/* Back to the Posts list (mobile only — desktop has the rail). */}
            <button
                type='button'
                onClick={() => sidebar?.setOpen(true)}
                aria-label='Show posts'
                aria-controls='post-sidebar'
                aria-expanded={sidebar?.open ?? false}
                className='absolute top-1/2 left-1 -translate-y-1/2 p-1 text-[var(--sidebar-accent)] md:hidden'
            >
                <ChevronLeftGlyph />
            </button>

            {/* Identity stack: avatar over the name. */}
            <PostAvatar
                image={image}
                title={title}
                seed={seed}
                className='h-11 w-11 text-[15px] md:h-[34px] md:w-[34px] md:text-[13px]'
            />
            <div className='flex max-w-full items-center gap-0.5'>
                <h1 className='truncate text-[13px] font-normal text-[var(--sidebar-primary)]'>
                    {title}
                </h1>
                <ChevronRightGlyph className='shrink-0 text-[var(--sidebar-tertiary)] md:hidden' />
            </div>

            {/* Info "i" — a bordered 28px circle pinned right (decorative). */}
            <span
                aria-hidden='true'
                className='absolute top-1/2 right-[18px] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] border-[var(--sidebar-separator)] text-[15px] font-semibold italic text-[var(--sidebar-accent)]'
                style={{ fontFamily: 'Georgia, serif' }}
            >
                i
            </span>
        </div>
    );
};
