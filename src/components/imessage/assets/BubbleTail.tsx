import { useId } from 'react';
import { BubbleMask, type BubbleDirection } from '../bubbleShape';

type BubbleTailProps = {
    direction: BubbleDirection;
    className?: string;
};

const W = 92;
const H = 54;

/**
 * A small standalone bubble showing the tail chrome, drawn from the shared
 * {@link BubbleMask} so it's identical to real bubbles. Fill follows
 * `currentColor`; set a text-color class to tint it.
 */
export const BubbleTail = ({ direction, className }: BubbleTailProps) => {
    const id = useId().replace(/:/g, '');
    return (
        <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            className={className}
            aria-hidden='true'
            focusable='false'
        >
            <defs>
                <BubbleMask id={id} width={W} height={H} direction={direction} />
            </defs>
            <rect width={W} height={H} fill='currentColor' mask={`url(#${id})`} />
        </svg>
    );
};
