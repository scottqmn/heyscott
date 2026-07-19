'use client';

import { PrismicNextImage } from '@prismicio/next';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
    monogramColor,
    monogramInitial,
    PLACEHOLDER_SIDEBAR_POSTS,
    type SidebarPost,
} from '@/lib/posts';

type PostSidebarProps = {
    /** Rich posts to list. Defaults to the placeholder source (Prismic pending). */
    posts?: SidebarPost[];
    /** Start with the mobile drawer open (used by the Storybook example). */
    defaultOpen?: boolean;
    /** Seed the search query (used by the Storybook filter example). */
    defaultQuery?: string;
    /**
     * Force the selected (highlighted) row by slug. When omitted it's derived
     * from the current route (`/blog/<slug>`).
     */
    activeSlug?: string;
};

/** Compact date for a row (e.g. “Jul 14”), formatted in UTC for stable SSR. */
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
});
const formatSidebarDate = (iso: string): string => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '' : DATE_FORMATTER.format(date);
};

/** A 14px magnifier for the search pill (inline, no icon dep). */
const SearchGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={14}
        height={14}
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='shrink-0'
    >
        <circle cx='11' cy='11' r='7' />
        <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
);

/** A decorative compose/edit pencil in the header (matches the design; inert). */
const PencilGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={20}
        height={20}
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M12 20h9' />
        <path d='M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' />
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

/** 44px (50px on mobile) circular avatar: cover image, else title monogram. */
const RowAvatar = ({ post }: { post: SidebarPost }) =>
    post.image ? (
        <PrismicNextImage
            field={post.image}
            className='h-[50px] w-[50px] shrink-0 rounded-full object-cover md:h-11 md:w-11'
        />
    ) : (
        <span
            aria-hidden='true'
            className='flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full text-[17px] font-semibold tracking-[0.02em] text-white md:h-11 md:w-11 md:text-[15px]'
            style={{ backgroundColor: monogramColor(post.slug) }}
        >
            {monogramInitial(post.title)}
        </span>
    );

/**
 * One conversation-list row: avatar · title + date · 2-line preview, with a
 * rounded selected/hover highlight layer behind the content. The whole row is
 * the link (keyboard-focusable); the highlight tracks focus + hover + selection.
 */
const PostRow = ({
    post,
    selected,
    onNavigate,
}: {
    post: SidebarPost;
    selected: boolean;
    onNavigate?: () => void;
}) => (
    <Link
        href={`/blog/${post.slug}`}
        onClick={onNavigate}
        aria-current={selected ? 'page' : undefined}
        className='group relative flex min-h-[70px] items-start gap-[11px] py-[9px] pr-[14px] pl-[26px] focus:outline-none'
    >
        {/* Selected/hover highlight, inset 3px vertical / 8px horizontal. */}
        <span
            aria-hidden='true'
            className={clsx(
                'pointer-events-none absolute top-[3px] bottom-[3px] left-2 right-2 rounded-[11px] transition-colors',
                selected
                    ? 'bg-[var(--sidebar-row-sel)]'
                    : 'group-hover:bg-[var(--sidebar-row-sel)] group-focus-visible:bg-[var(--sidebar-row-sel)]'
            )}
        />
        <span className='relative'>
            <RowAvatar post={post} />
        </span>
        <span className='relative flex min-w-0 flex-1 flex-col pt-0.5'>
            <span className='flex items-baseline gap-2'>
                <span className='min-w-0 flex-1 truncate text-[17px] font-semibold tracking-[-0.01em] text-[var(--sidebar-primary)] md:text-[15px]'>
                    {post.title}
                </span>
                {post.date && (
                    <span className='shrink-0 text-[13px] text-[var(--sidebar-secondary)] md:text-[12.5px]'>
                        {formatSidebarDate(post.date)}
                    </span>
                )}
            </span>
            {post.excerpt && (
                <span className='mt-1 line-clamp-2 text-[15px] leading-[1.34] text-[var(--sidebar-secondary)] md:text-[13.5px]'>
                    {post.excerpt}
                </span>
            )}
        </span>
    </Link>
);

/**
 * The blog-post index as a left SIDEBAR — the macOS Messages conversation-list
 * column (design direction 1a). A 334px `<aside>` on `--sidebar-bg` with a
 * "Posts" header, a live title-search pill, and a scrolling list of rich rows
 * (circular avatar/monogram · title · date · 2-line preview · selected-row
 * highlight). Search filters by title (case-insensitive substring); an empty
 * query shows every post, no match shows a tasteful empty state.
 *
 * It's a fixed panel that overlays the left edge without reflowing `{children}`.
 * **Persistent on desktop** (`md+`); on mobile it collapses to a **drawer**
 * (direction 1b: larger type, 50px avatars) toggled from a top-left button, with
 * a tap-away scrim; choosing a row closes it. Colors come from the
 * `--sidebar-*` design tokens (themed light/dark in `globals.css`).
 */
export const PostSidebar = ({
    posts = PLACEHOLDER_SIDEBAR_POSTS,
    defaultOpen = false,
    defaultQuery = '',
    activeSlug,
}: PostSidebarProps) => {
    const [open, setOpen] = useState(defaultOpen);
    const [query, setQuery] = useState(defaultQuery);
    const close = () => setOpen(false);

    const pathname = usePathname();
    const routeSlug = pathname?.startsWith('/blog/')
        ? pathname.slice('/blog/'.length).split('/')[0]
        : undefined;
    const selectedSlug = activeSlug ?? routeSlug;

    const trimmed = query.trim();
    const filtered = useMemo(() => {
        const q = trimmed.toLowerCase();
        if (!q) return posts;
        return posts.filter((post) => post.title.toLowerCase().includes(q));
    }, [posts, trimmed]);

    return (
        <>
            {/* Mobile-only open button. Hidden on desktop (persistent sidebar)
                and while the drawer is open (the scrim + row tap close it), so it
                never overlaps the "Posts" header. Floats top-left, legible over
                page content via its own blur. */}
            <button
                type='button'
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls='post-sidebar'
                aria-label='Show posts'
                className={clsx(
                    'fixed top-[max(0.75rem,env(safe-area-inset-top))] left-3 z-50 touch-manipulation rounded-full border border-border bg-background/70 p-2 text-foreground backdrop-blur transition-colors hover:border-muted-foreground/40 md:hidden',
                    open && 'hidden'
                )}
            >
                <ListGlyph />
            </button>

            {/* Tap-away scrim behind the open drawer (mobile only). Always
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

            <aside
                id='post-sidebar'
                aria-label='Blog posts'
                className={clsx(
                    'fixed inset-y-0 left-0 z-40 flex w-[334px] max-w-[85%] flex-col border-r border-[var(--sidebar-separator)] bg-[var(--sidebar-bg)] transition-transform duration-300 ease-out md:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Header — "Posts" + a decorative compose pencil. */}
                <div className='flex min-h-[54px] shrink-0 items-center justify-between pr-3 pl-[18px] pt-[env(safe-area-inset-top)]'>
                    <h2 className='text-[30px] font-bold tracking-[-0.03em] text-[var(--sidebar-primary)] md:text-[22px] md:tracking-[-0.02em]'>
                        Posts
                    </h2>
                    <span
                        aria-hidden='true'
                        className='flex h-[30px] w-[30px] items-center justify-center text-[var(--sidebar-accent)]'
                    >
                        <PencilGlyph />
                    </span>
                </div>

                {/* Live search — a real input styled as the design's search pill.
                    16px on mobile (avoids iOS focus-zoom), 14px on desktop. */}
                <div className='px-3 pt-0.5 pb-2'>
                    <div className='flex items-center gap-1.5 rounded-[11px] bg-[var(--sidebar-search-bg)] px-[11px] py-2 text-[var(--sidebar-secondary)] md:rounded-[9px] md:px-2.5 md:py-1.5'>
                        <SearchGlyph />
                        <input
                            type='search'
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder='Search'
                            aria-label='Search posts by title'
                            className='w-full min-w-0 bg-transparent text-[16px] text-[var(--sidebar-primary)] placeholder:text-[var(--sidebar-secondary)] focus:outline-none md:text-[14px]'
                        />
                    </div>
                </div>

                {/* Scrolling post list. Extra bottom padding clears the fixed
                    compose pill on narrow screens. */}
                <nav
                    aria-label='Posts'
                    className='min-h-0 flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-4'
                >
                    {filtered.length > 0 ? (
                        filtered.map((post) => (
                            <PostRow
                                key={post.slug}
                                post={post}
                                selected={post.slug === selectedSlug}
                                onNavigate={close}
                            />
                        ))
                    ) : (
                        <p className='px-[26px] pt-6 text-center text-[13.5px] text-[var(--sidebar-secondary)]'>
                            No posts match “{trimmed}”.
                        </p>
                    )}
                </nav>
            </aside>
        </>
    );
};
