import { PrismicNextImage } from '@prismicio/next';
import type { ImageField } from '@prismicio/client';
import { clsx } from 'clsx';
import { monogramColor, monogramInitial } from '@/lib/posts';

/**
 * Small presentational pieces shared between the {@link PostSidebar} and the
 * blog-post page header (so the post page reuses the menu's icon + the same
 * avatar logic).
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

/** The sidebar header title — the site name (lowercase). */
export const POSTS_MENU_TITLE = 'heyscott';

/**
 * A post's circular avatar: the cover `image` when present (via
 * `PrismicNextImage`), else a deterministic monogram from the title initial on
 * a slug-seeded color. Shared by the sidebar rows (44/50px) and the blog-post
 * thread header (small, ~32px) — pass the size + text-size via `className`.
 */
export const PostAvatar = ({
    image,
    title,
    seed,
    className,
}: {
    image: ImageField | null;
    /** Title — supplies the monogram initial. */
    title: string;
    /** Stable seed for the monogram color (the post slug/uid). */
    seed: string;
    /** Size + text-size utilities (e.g. `h-11 w-11 text-[15px]`). */
    className?: string;
}) =>
    image ? (
        <PrismicNextImage
            field={image}
            className={clsx('shrink-0 rounded-full object-cover', className)}
        />
    ) : (
        <span
            aria-hidden='true'
            className={clsx(
                'flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[0.02em] text-white',
                className
            )}
            style={{ backgroundColor: monogramColor(seed) }}
        >
            {monogramInitial(title)}
        </span>
    );
