import { clsx } from 'clsx';

type BubbleTailProps = {
    direction: 'incoming' | 'outgoing';
    className?: string;
};

/**
 * The little iMessage bubble "tail" that hooks off the bottom corner of a
 * bubble, drawn as an SVG so it scales crisply and can sit outside an
 * `overflow-hidden` media container (where the CSS pseudo-element tail on
 * {@link ChatBubble} would be clipped). Fill inherits `currentColor`, so the
 * caller sets the color to match the bubble via a text-color token.
 */
export const BubbleTail = ({ direction, className }: BubbleTailProps) => {
    const outgoing = direction === 'outgoing';
    return (
        <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
            className={clsx(className, { '-scale-x-100': !outgoing })}
        >
            {/* Curves out from the bubble edge to a point, then back — the
                classic iMessage tail, authored for the outgoing (right) side
                and mirrored horizontally for incoming. */}
            <path d='M2 0 C2 8 4 14 16 16 C9 14 8 8 8 0 Z' />
        </svg>
    );
};
