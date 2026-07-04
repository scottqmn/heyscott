'use client';

import { clsx } from 'clsx';
import {
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import {
    BubbleSilhouette,
    BUBBLE_RADIUS,
    BUBBLE_TAIL_OUT,
    type BubbleDirection,
} from './bubbleShape';

// useLayoutEffect on the client (measure before paint → no flash), useEffect
// on the server (avoids the SSR warning).
const useIsoLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type DynamicBubbleProps = {
    children: ReactNode;
    direction: BubbleDirection;
    /**
     * `text` paints the bubble as an SVG background behind padded content.
     * `media` clips the (edge-to-edge) content to the bubble silhouette,
     * tail included.
     */
    variant?: 'text' | 'media';
    className?: string;
};

const BG: Record<BubbleDirection, string> = {
    outgoing: 'var(--color-imessage-sent)',
    incoming: 'var(--color-imessage-received)',
};
const FG: Record<BubbleDirection, string> = {
    outgoing: 'var(--color-imessage-sent-foreground)',
    incoming: 'var(--color-imessage-received-foreground)',
};

/**
 * The unified iMessage bubble: one dynamic SVG shape (body + tail, from
 * {@link BubbleSilhouette}) that adapts to its content's size and to
 * incoming/outgoing. A ResizeObserver measures the content so the SVG matches
 * exactly as the bubble grows.
 */
export const DynamicBubble = ({
    children,
    direction,
    variant = 'text',
    className,
}: DynamicBubbleProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const clipId = useId().replace(/:/g, '');

    useIsoLayoutEffect(() => {
        const el = ref.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const measure = () =>
            setSize({ width: el.offsetWidth, height: el.offsetHeight });
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const ready = size.width > 0 && size.height > 0;

    if (variant === 'media') {
        return (
            <div className={clsx('relative block w-full', className)}>
                {ready && (
                    <svg
                        className='pointer-events-none absolute h-0 w-0'
                        aria-hidden
                    >
                        <defs>
                            <clipPath
                                id={clipId}
                                clipPathUnits='userSpaceOnUse'
                            >
                                <BubbleSilhouette
                                    width={size.width}
                                    height={size.height}
                                    direction={direction}
                                />
                            </clipPath>
                        </defs>
                    </svg>
                )}
                <div
                    ref={ref}
                    className='block w-full overflow-hidden [&_img]:block [&_img]:w-full'
                    style={{
                        clipPath: ready ? `url(#${clipId})` : undefined,
                        borderRadius: ready ? undefined : BUBBLE_RADIUS,
                    }}
                >
                    {children}
                </div>
            </div>
        );
    }

    // Reserve transparent space on the tail side for the tail to flick into,
    // and inset the fallback background so it never covers the tail.
    const tailPad =
        direction === 'outgoing'
            ? { paddingRight: BUBBLE_TAIL_OUT }
            : { paddingLeft: BUBBLE_TAIL_OUT };

    return (
        <div
            ref={ref}
            className={clsx('relative inline-block max-w-full', className)}
            style={{ color: FG[direction], ...tailPad }}
        >
            {ready && (
                <svg
                    className='pointer-events-none absolute inset-0'
                    width={size.width}
                    height={size.height}
                    viewBox={`0 0 ${size.width} ${size.height}`}
                    aria-hidden
                >
                    <g fill={BG[direction]}>
                        <BubbleSilhouette
                            width={size.width}
                            height={size.height}
                            direction={direction}
                        />
                    </g>
                </svg>
            )}
            <div
                className='relative px-5 py-3 break-words'
                style={{
                    backgroundColor: BG[direction],
                    borderRadius: BUBBLE_RADIUS,
                }}
            >
                {children}
            </div>
        </div>
    );
};
