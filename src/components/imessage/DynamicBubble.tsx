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
    BubbleClip,
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
    /** Draw the tail. Grouped messages omit it except the group's last. */
    tail?: boolean;
    /** A same-side message sits above (part of a group) — tightens the top. */
    grouped?: boolean;
    /**
     * Override the bubble color independently of `direction` (position/tail),
     * e.g. the `typing` tone (darker translucent gray) for post-link bubbles in
     * the outgoing position. Defaults to `direction`.
     */
    tone?: BubbleTone;
    className?: string;
};

/** Color families a bubble can use. `typing` = the darker translucent gray. */
export type BubbleTone = BubbleDirection | 'typing';

const BG: Record<BubbleTone, string> = {
    outgoing: 'var(--color-imessage-sent)',
    incoming: 'var(--color-imessage-received)',
    typing: 'var(--color-imessage-typing)',
};
const FG: Record<BubbleTone, string> = {
    outgoing: 'var(--color-imessage-sent-foreground)',
    incoming: 'var(--color-imessage-received-foreground)',
    typing: 'var(--color-imessage-typing-foreground)',
};

// Per-line rects of an element's text content (one rect per visual line).
function lineRects(content: HTMLElement): DOMRect[] {
    const range = document.createRange();
    range.selectNodeContents(content);
    const rects = Array.from(range.getClientRects());
    if (typeof range.detach === 'function') range.detach();
    return rects;
}

function lineCount(content: HTMLElement): number {
    const tops = new Set<number>();
    for (const r of lineRects(content)) tops.add(Math.round(r.top));
    return tops.size || 1;
}

function widestLine(content: HTMLElement): number {
    let widest = 0;
    for (const r of lineRects(content)) widest = Math.max(widest, r.width);
    return widest;
}

/** Fraction of the surrounding column a bubble may occupy at its widest. */
const MAX_WIDTH_FRACTION = 0.85;

/**
 * Computes the tightest content-box width for a text bubble and returns it, or
 * `null` if it can't measure. Two problems to solve:
 *
 *  1. An `inline-block` + `max-width` box doesn't shrink to the widest wrapped
 *     line (CSS shrink-to-fit keeps the full `max-width` once text wraps). And
 *     a *percentage* max-width on a flex item can resolve against an indefinite
 *     basis and be ignored — so we cap the width explicitly here in JS.
 *  2. Greedy line-breaking fills early lines and leaves a short last line, so
 *     hugging the widest line still leaves a wide box with lots of whitespace.
 *
 * So for multi-line text we binary-search the SMALLEST width that still wraps
 * to the same (minimal) number of lines — this balances the lines and shrinks
 * the box as far as it can go without adding a line. `setWidth(w)` sets the
 * content-box width via the outer element (which carries the tail padding).
 */
function measureHugWidth(
    outer: HTMLElement,
    content: HTMLElement,
    setWidth: (contentWidth: number) => void
): number | null {
    if (typeof document === 'undefined' || !document.createRange) return null;

    const cs = getComputedStyle(content);
    const padX =
        parseFloat(cs.paddingLeft || '0') + parseFloat(cs.paddingRight || '0');

    // The widest the bubble may be: a fraction of the surrounding column,
    // computed explicitly so a flaky percentage max-width can't let it overflow.
    const parentW = outer.parentElement?.offsetWidth ?? 0;
    const maxBoxW =
        parentW > 0
            ? Math.max(
                  0,
                  Math.floor(parentW * MAX_WIDTH_FRACTION) - BUBBLE_TAIL_OUT
              )
            : null;
    if (!maxBoxW) return null;

    // Wrap at the cap, then read the line count there (the minimum).
    setWidth(maxBoxW);
    const naturalLines = lineCount(content);

    if (naturalLines <= 1) {
        const w = widestLine(content);
        return w > 0 ? Math.min(Math.ceil(w + padX) + 1, maxBoxW) : null;
    }

    // Longest unbreakable run — the floor for the search.
    outer.style.width = 'min-content';
    const minBoxW = Math.min(content.offsetWidth, maxBoxW);

    // Smallest content-box width that keeps `naturalLines` lines.
    let lo = minBoxW;
    let hi = maxBoxW;
    let best = maxBoxW;
    for (let i = 0; i < 24 && hi - lo > 1; i++) {
        const mid = Math.floor((lo + hi) / 2);
        setWidth(mid);
        if (lineCount(content) <= naturalLines) {
            best = mid;
            hi = mid;
        } else {
            lo = mid;
        }
    }
    return best;
}

/**
 * The unified iMessage bubble: the original tail silhouette (from
 * {@link BubbleClip}) that adapts to its content and to incoming/outgoing. For
 * text it hugs the minimum width needed for the wrapped content (see
 * {@link measureHugWidth}); a ResizeObserver keeps it in sync as the container
 * resizes.
 */
export const DynamicBubble = ({
    children,
    direction,
    variant = 'text',
    tail = true,
    grouped = false,
    tone,
    className,
}: DynamicBubbleProps) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const clipId = useId().replace(/:/g, '');
    // Position/tail come from `direction`; color from `tone` (default direction).
    const colorSide = tone ?? direction;

    // Grouped corners: flatten the tail-side top when a same-side message sits
    // above (grouped), and the tail-side bottom when one sits below (no tail).
    const clipProps = { tail, flattenTop: grouped, flattenBottom: !tail };

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

        const setWidth = (contentWidth: number) => {
            outer.style.width = `${contentWidth + BUBBLE_TAIL_OUT}px`;
        };

        const measure = () => {
            const hug = measureHugWidth(outer, content, setWidth);
            // Pin the outer to the hugging width (+ the tail-side room), or
            // release it if we couldn't measure.
            if (hug != null) setWidth(hug);
            else outer.style.width = '';
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
        const clipUrl = ready ? `url(#${clipId})` : undefined;
        return (
            <div className={clsx('relative block w-full', className)}>
                {ready && (
                    <svg
                        className='pointer-events-none absolute h-0 w-0'
                        aria-hidden
                    >
                        <defs>
                            <BubbleClip
                                id={clipId}
                                width={size.width}
                                height={size.height}
                                direction={direction}
                                {...clipProps}
                            />
                        </defs>
                    </svg>
                )}
                <div
                    ref={contentRef}
                    className='block w-full overflow-hidden [&_img]:block [&_img]:w-full'
                    style={{
                        clipPath: clipUrl,
                        WebkitClipPath: clipUrl,
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
            style={{ color: FG[colorSide], boxSizing: 'border-box', ...tailPad }}
        >
            {ready && (
                <svg
                    className='pointer-events-none absolute inset-0'
                    width={size.width}
                    height={size.height}
                    viewBox={`0 0 ${size.width} ${size.height}`}
                    aria-hidden
                >
                    <defs>
                        <BubbleClip
                            id={clipId}
                            width={size.width}
                            height={size.height}
                            direction={direction}
                                {...clipProps}
                        />
                    </defs>
                    <rect
                        width={size.width}
                        height={size.height}
                        fill={BG[colorSide]}
                        clipPath={`url(#${clipId})`}
                    />
                </svg>
            )}
            <div
                ref={contentRef}
                className='relative px-5 py-3 text-base break-words md:text-xl'
                style={{
                    // The clipped SVG rect is the bubble once measured; before
                    // that a plain rounded rect stands in so there's no flash.
                    backgroundColor: ready ? 'transparent' : BG[colorSide],
                    borderRadius: ready ? undefined : BUBBLE_RADIUS,
                }}
            >
                {children}
            </div>
        </div>
    );
};
