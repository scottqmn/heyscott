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
 * Measures the widest line the content actually wraps to and returns the
 * minimal content-box width that hugs it. An `inline-block` + `max-width` box
 * doesn't shrink to the widest wrapped line (CSS shrink-to-fit keeps the full
 * `max-width` once text wraps, leaving trailing whitespace); measuring the
 * rendered line rects and pinning the width to the widest one removes that
 * slack so the bubble hugs its text. Returns `null` if it can't measure.
 */
function measureHugWidth(content: HTMLElement): number | null {
    if (typeof document === 'undefined' || !document.createRange) return null;
    const range = document.createRange();
    range.selectNodeContents(content);
    const rects = range.getClientRects();
    let widest = 0;
    for (let i = 0; i < rects.length; i++) {
        widest = Math.max(widest, rects[i].width);
    }
    if (typeof range.detach === 'function') range.detach();
    if (widest <= 0) return null;
    const cs = getComputedStyle(content);
    const padX =
        parseFloat(cs.paddingLeft || '0') + parseFloat(cs.paddingRight || '0');
    // +1px slack absorbs sub-pixel rounding so the widest line never re-wraps.
    return Math.ceil(widest + padX) + 1;
}

/**
 * The unified iMessage bubble: one dynamic SVG shape (body + tail, from
 * {@link BubbleSilhouette}) that adapts to its content and to
 * incoming/outgoing. For text it hugs the minimum width needed for the wrapped
 * content (see {@link measureHugWidth}); a ResizeObserver keeps it in sync as
 * the container resizes.
 */
export const DynamicBubble = ({
    children,
    direction,
    variant = 'text',
    className,
}: DynamicBubbleProps) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const clipId = useId().replace(/:/g, '');

    const applySize = (width: number, height: number) =>
        setSize((prev) =>
            prev.width === width && prev.height === height
                ? prev
                : { width, height }
        );

    // --- media: measure the content box, clip it to the silhouette ---------
    useIsoLayoutEffect(() => {
        if (variant !== 'media') return;
        const el = contentRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const measure = () => applySize(el.offsetWidth, el.offsetHeight);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [variant]);

    // --- text: hug the widest wrapped line, then size the SVG to the box ----
    useIsoLayoutEffect(() => {
        if (variant !== 'text') return;
        const outer = outerRef.current;
        const content = contentRef.current;
        if (!outer || !content) return;

        const measure = () => {
            // Release any pinned width so the content re-wraps at its max-width…
            outer.style.width = '';
            const hug = measureHugWidth(content);
            // …then pin the outer to the hugging width (+ the tail-side room).
            if (hug != null) outer.style.width = `${hug + BUBBLE_TAIL_OUT}px`;
            applySize(outer.offsetWidth, outer.offsetHeight);
        };

        measure();

        let cancelled = false;
        const remeasure = () => {
            if (!cancelled) measure();
        };

        // Re-hug when the surrounding column resizes (changes the max-width),
        // and once web fonts finish loading (which can change text metrics).
        const parent = outer.parentElement;
        const observer =
            typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(remeasure)
                : null;
        if (observer && parent) observer.observe(parent);
        document.fonts?.ready?.then(remeasure);

        return () => {
            cancelled = true;
            observer?.disconnect();
        };
    }, [variant, direction, children]);

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
                    ref={contentRef}
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
            ref={outerRef}
            className={clsx('relative inline-block max-w-full', className)}
            style={{ color: FG[direction], boxSizing: 'border-box', ...tailPad }}
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
                ref={contentRef}
                className='relative px-5 py-3 break-words'
                style={{
                    backgroundColor: BG[direction],
                    borderRadius: BUBBLE_RADIUS,
                    textWrap: 'pretty',
                }}
            >
                {children}
            </div>
        </div>
    );
};
