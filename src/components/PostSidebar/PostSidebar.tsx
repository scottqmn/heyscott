'use client';

import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { PostLinkList } from '@/components/PostListComposer/PostLinkList';
import { PLACEHOLDER_POSTS, type BlogPostLink } from '@/lib/posts';

type PostSidebarProps = {
    /** Posts to link to. Defaults to the placeholder source (Prismic pending). */
    posts?: BlogPostLink[];
    /** Start with the mobile drawer open (used by the Storybook example). */
    defaultOpen?: boolean;
    /** Seed the search query (used by the Storybook filter example). */
    defaultQuery?: string;
};

/** A small magnifier glyph for the search field (inline, no icon dep). */
const SearchGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={16}
        height={16}
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'
    >
        <circle cx='11' cy='11' r='7' />
        <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
);

/** A three-bar list glyph for the mobile open button. */
const ListGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={20}
        height={20}
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
    >
        <line x1='4' y1='7' x2='20' y2='7' />
        <line x1='4' y1='12' x2='20' y2='12' />
        <line x1='4' y1='17' x2='20' y2='17' />
    </svg>
);

/**
 * The blog-post index as a left SIDEBAR — the conversation-list column of
 * macOS Messages, reused here as an iMessage-flavored recirculation nav. It
 * holds a title-search field and the post-link bubbles (the darker translucent
 * `typing`-tone outgoing bubbles, shared with the in-thread links). Typing in
 * the search filters the list by title (case-insensitive substring); an empty
 * query shows every post, no match shows a tasteful empty state.
 *
 * Placement follows the floating iMessage aesthetic: a fixed, translucent
 * blurred panel that overlays the left edge WITHOUT reflowing `{children}`
 * (like the composer floats over the bottom). It is **persistent on desktop**
 * (`md+`) and a **collapsible drawer on mobile** — a top-left button toggles it,
 * a tap-away scrim dims the page behind, and choosing a link closes the drawer.
 * Driven by the placeholder post source until Prismic is wired.
 */
export const PostSidebar = ({
    posts = PLACEHOLDER_POSTS,
    defaultOpen = false,
    defaultQuery = '',
}: PostSidebarProps) => {
    const [open, setOpen] = useState(defaultOpen);
    const [query, setQuery] = useState(defaultQuery);
    const close = () => setOpen(false);

    const trimmed = query.trim();
    const filtered = useMemo(() => {
        const q = trimmed.toLowerCase();
        if (!q) return posts;
        return posts.filter((post) => post.title.toLowerCase().includes(q));
    }, [posts, trimmed]);

    return (
        <>
            {/* Mobile-only open button. Hidden on desktop, where the sidebar is
                persistent. Floats top-left with the same blur/translucent look
                as the composer pill. */}
            <button
                type='button'
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls='post-sidebar'
                aria-label={open ? 'Hide posts' : 'Show posts'}
                className='fixed top-[max(1rem,env(safe-area-inset-top))] left-4 z-50 touch-manipulation rounded-full border border-border bg-background/60 p-2 text-foreground backdrop-blur transition-colors hover:border-muted-foreground/40 md:hidden'
            >
                <ListGlyph />
            </button>

            {/* Tap-away scrim that also dims the page behind the open drawer.
                Mobile only (the desktop sidebar is persistent, no scrim). Always
                mounted so it FADES; pointer-events off + opacity 0 when closed. */}
            <button
                type='button'
                aria-label='Close posts'
                onClick={close}
                tabIndex={open ? 0 : -1}
                aria-hidden={!open}
                className={clsx(
                    'fixed inset-0 z-40 cursor-default bg-black/65 transition-opacity duration-300 ease-out md:hidden',
                    open ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
            />

            <nav
                id='post-sidebar'
                aria-label='Blog posts'
                className={clsx(
                    'fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85%] flex-col border-r border-border bg-background/70 backdrop-blur transition-transform duration-300 ease-out md:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className='flex flex-col gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))]'>
                    <p className='px-1 text-sm font-medium text-muted-foreground'>
                        Posts
                    </p>
                    {/* type='search' + text-base (≥16px) so iOS Safari doesn't
                        zoom the viewport on focus. Filters as the user types. */}
                    <div className='relative'>
                        <SearchGlyph />
                        <input
                            type='search'
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder='Search posts'
                            aria-label='Search posts by title'
                            className='w-full rounded-full border border-border bg-muted py-2 pr-3 pl-9 text-base text-foreground placeholder:text-muted-foreground focus:border-muted-foreground/40 focus:outline-none'
                        />
                    </div>
                </div>

                <div className='min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
                    {filtered.length > 0 ? (
                        <PostLinkList posts={filtered} onLinkClick={close} />
                    ) : (
                        <p className='mt-6 px-1 text-center text-sm text-muted-foreground'>
                            No posts match “{trimmed}”.
                        </p>
                    )}
                </div>
            </nav>
        </>
    );
};
