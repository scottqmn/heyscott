'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PLACEHOLDER_SIDEBAR_POSTS, type SidebarPost } from '@/lib/posts';
import { EditMenu } from './EditMenu';
import { usePostSidebar } from './PostSidebarContext';
import { ChevronLeftGlyph, POSTS_MENU_TITLE, PostAvatar } from './parts';

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

/** 44px (50px on mobile) circular avatar: cover image, else title monogram. */
const RowAvatar = ({ post }: { post: SidebarPost }) => (
    <PostAvatar
        image={post.image}
        title={post.title}
        seed={post.slug}
        className='h-[50px] w-[50px] text-[17px] md:h-11 md:w-11 md:text-[15px]'
    />
);

/**
 * One conversation-list row: avatar · title + date · 2-line preview, with a
 * rounded selected/hover highlight layer behind the content. The whole row is
 * the link (keyboard-focusable); the highlight tracks focus + hover + selection.
 */
const PostRow = ({
    post,
    href,
    selected,
    onNavigate,
}: {
    post: SidebarPost;
    href: string;
    selected: boolean;
    onNavigate?: () => void;
}) => (
    <Link
        href={href}
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
        {/* Mobile-only list hairline (design 1b): from x=52 to the right edge. */}
        <span
            aria-hidden='true'
            className='pointer-events-none absolute bottom-0 left-[52px] right-0 h-px bg-[var(--sidebar-separator)] md:hidden'
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
 * **Persistent on desktop** (`md+`, the 334px rail). On **mobile** the open
 * sidebar is a **full-viewport overlay** — the iMessage Messages list screen
 * (direction 1b: full-screen list, larger type, 50px avatars): a top-left button
 * opens it, the header X (or tapping a post) closes it. Colors come from the
 * `--sidebar-*` design tokens (themed light/dark in `globals.css`).
 */
export const PostSidebar = ({
    posts = PLACEHOLDER_SIDEBAR_POSTS,
    defaultOpen = false,
    defaultQuery = '',
    activeSlug,
}: PostSidebarProps) => {
    // Open-state is shared via context when a provider is mounted (the app, so
    // the blog-post "‹ Posts" header can open this overlay); otherwise it falls
    // back to local state (e.g. Storybook, where `defaultOpen` seeds it).
    const shared = usePostSidebar();
    const [localOpen, setLocalOpen] = useState(defaultOpen);
    const open = shared ? shared.open : localOpen;
    const setOpen = shared ? shared.setOpen : setLocalOpen;
    const close = () => setOpen(false);

    const [query, setQuery] = useState(defaultQuery);

    const pathname = usePathname();
    // The highlighted row is the one whose href matches the route (the pinned
    // home row on `/`, a post on `/blog/<slug>`). A Storybook `activeSlug`
    // override maps to the corresponding blog path.
    const activeHref = activeSlug ? `/blog/${activeSlug}` : pathname;
    const hrefOf = (post: SidebarPost) => post.href ?? `/blog/${post.slug}`;
    // Pages that render their own header (the homepage/blog conversation, a
    // post, and /contact's compose header) already carry a back affordance, so
    // the floating trigger hides there — no two stacked chevrons.
    const hasOwnHeader =
        pathname === '/' ||
        pathname === '/blog' ||
        pathname === '/contact' ||
        (!!pathname && /^\/blog\/[^/]+$/.test(pathname));

    const trimmed = query.trim();
    const filtered = useMemo(() => {
        const q = trimmed.toLowerCase();
        if (!q) return posts;
        return posts.filter((post) => post.title.toLowerCase().includes(q));
    }, [posts, trimmed]);

    return (
        <>
            {/* Mobile-only open trigger — a BARE left-chevron icon (no outline,
                background, or blur), the iMessage "back to the list" affordance.
                Padding gives a comfortable hit area; only the visible box is
                gone. Hidden on desktop (persistent rail), while the overlay is
                open, and on pages with their own ThreadHeader (homepage + posts,
                whose header carries the back-chevron). */}
            <button
                type='button'
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls='post-sidebar'
                aria-label='Show posts'
                className={clsx(
                    'fixed top-[max(0.5rem,env(safe-area-inset-top))] left-2 z-50 touch-manipulation p-1 text-foreground md:hidden',
                    (open || hasOwnHeader) && 'hidden'
                )}
            >
                <ChevronLeftGlyph />
            </button>

            {/* On MOBILE the open sidebar is a FULL-VIEWPORT overlay — the
                iMessage Messages list screen (design 1b), not a side drawer: it
                covers the whole screen (`w-full`, no scrim needed since nothing
                shows behind it). Dismissed by NAVIGATION — tapping a post or the
                compose control (→ /contact) closes it; there's no close chevron.
                On DESKTOP it's the persistent 334px rail (`md:w-[334px]`, always
                visible via `md:translate-x-0`). */}
            <aside
                id='post-sidebar'
                aria-label='Blog posts'
                className={clsx(
                    'fixed inset-y-0 left-0 z-40 flex w-full flex-col bg-[var(--sidebar-bg)] transition-transform duration-300 ease-out md:w-[334px] md:translate-x-0 md:border-r md:border-[var(--sidebar-separator)]',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Two-row header (design 1a/1b): a control row — "Edit" (left)
                    + compose pencil (right) — then the "heyscott" title on its
                    own line below. */}
                <div className='shrink-0 pt-[max(0.5rem,env(safe-area-inset-top))] pr-3 pb-0.5 pl-[18px]'>
                    <div className='flex h-[26px] items-center justify-between'>
                        {/* Edit → the settings popover (theme toggle). */}
                        <EditMenu />
                        {/* New-message compose pencil → /contact. Also closes the
                            mobile overlay (dismiss-by-navigation — no chevron). */}
                        <Link
                            href='/contact'
                            onClick={close}
                            aria-label='New message'
                            className='flex h-[30px] w-[30px] shrink-0 items-center justify-center text-[var(--sidebar-accent)]'
                        >
                            <PencilGlyph />
                        </Link>
                    </div>
                    <h2 className='mt-px truncate text-[30px] font-bold tracking-[-0.03em] text-[var(--sidebar-primary)] md:text-[22px] md:tracking-[-0.02em]'>
                        {POSTS_MENU_TITLE}
                    </h2>
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
                    className='min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(env(safe-area-inset-bottom)+5rem)] md:pb-4'
                >
                    {filtered.length > 0 ? (
                        filtered.map((post) => {
                            const href = hrefOf(post);
                            return (
                                <PostRow
                                    key={post.slug}
                                    post={post}
                                    href={href}
                                    selected={href === activeHref}
                                    onNavigate={close}
                                />
                            );
                        })
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
