/**
 * Small presentational pieces shared between the {@link PostSidebar} and the
 * blog-post page header (so the post page reuses the menu's title + icon).
 */

/** A left-pointing chevron “‹” — the iMessage back-to-list affordance. */
export const ChevronLeftGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={28}
        height={28}
        fill='none'
        stroke='currentColor'
        strokeWidth={2.25}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M15 5l-7 7 7 7' />
    </svg>
);

/** The Posts menu title, reused by the sidebar header and the post-page header. */
export const POSTS_MENU_TITLE = 'Posts';
