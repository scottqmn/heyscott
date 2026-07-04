import { clsx } from 'clsx';
import { tailPath, type BubbleDirection } from '../bubbleShape';

type BubbleTailProps = {
    direction: BubbleDirection;
    className?: string;
};

// Standalone tail chrome, drawn from the shared tailPath geometry (the same
// curve unioned into the full bubble silhouette) at a fixed reference size.
const STANDALONE_TAIL = tailPath(16, 22, 14, 8);

/**
 * The iMessage tail on its own — useful as chrome / documentation. Fill
 * inherits `currentColor`; mirrored horizontally for incoming.
 */
export const BubbleTail = ({ direction, className }: BubbleTailProps) => {
    return (
        <svg
            width='26'
            height='26'
            viewBox='0 0 26 26'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
            className={clsx(className, {
                '-scale-x-100': direction === 'incoming',
            })}
        >
            <path d={STANDALONE_TAIL} />
        </svg>
    );
};
