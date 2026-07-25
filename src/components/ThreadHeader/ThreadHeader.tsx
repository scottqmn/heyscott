'use client';

import type { ImageField } from '@prismicio/client';
import { usePostSidebar } from '@/components/PostSidebar/PostSidebarContext';
import { ChevronLeftGlyph, PostAvatar } from '@/components/PostSidebar/parts';

/**
 * The iMessage thread-screen header (design 1a/1b main pane): a 56px blurred
 * `--panel-bg` bar with a **vertical stack** — avatar on top, the conversation
 * name BELOW it (the page `<h1>`, small/regular like the design's label), and
 * the info "i" in a bordered circle pinned right. The design's `8px 18px 9px`
 * padding gives the stack breathing room. On mobile the back-chevron (left)
 * opens the Posts overlay. The title is the "group name" so the body needs no
 * title bubble.
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
        <div className='sticky top-0 z-30 flex min-h-[56px] flex-col items-center gap-[3px] border-b border-[var(--sidebar-separator)] bg-[var(--panel-bg)] px-12 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[9px] backdrop-blur-[20px] [-webkit-backdrop-filter:blur(20px)]'>
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
            <h1 className='max-w-full truncate text-[13px] font-normal text-[var(--sidebar-primary)]'>
                {title}
            </h1>

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
