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
    measureLineStats,
    measureNaturalWidth,
    prepareWithSegments,
    type PrepareOptions,
} from '@chenglou/pretext';
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

/** Fraction of the surrounding column a bubble may occupy at its widest. */
const MAX_WIDTH_FRACTION = 0.85;

/**
 * Builds the CSS-canvas font shorthand pretext needs (`[style] [weight] [size]
 * [family]`) from an element's computed style. `getComputedStyle(el).font` is
 * unreliable in Chrome (often returns ''), so we assemble it from parts.
 */
function fontStringFor(cs: CSSStyleDeclaration): string {
    const style = cs.fontStyle && cs.fontStyle !== 'normal' ? cs.fontStyle : '';
    const weight =
        cs.fontWeight && cs.fontWeight !== 'normal' ? cs.fontWeight : '';
    return [style, weight, cs.fontSize, cs.fontFamily]
        .filter(Boolean)
        .join(' ')
        .trim();
}

/**
 * pretext-based version of the tightest-content-box measurement.
 *
 * Instead of forcing the real DOM to wrap at each trial width and reading it
 * back (`getClientRects`), pretext measures the wrap in pure JS against the
 * browser's font engine (canvas `measureText` + `Intl.Segmenter`). That lets
 * the whole "smallest width that keeps the minimal line count" search run
 * WITHOUT any DOM reflow — one `prepareWithSegments()` then N cheap
 * `measureLineStats()` calls.
 *
 * Two problems solved (same as the DIY path this replaces):
 *  1. `inline-block` + `max-width` doesn't shrink to the widest wrapped line,
 *     and a percentage max-width on a flex item can be ignored — so we cap the
 *     box width explicitly in JS.
 *  2. Greedy line-breaking leaves a short last line; hugging the widest line
 *     still leaves whitespace. So we search for the SMALLEST width that keeps
 *     the minimal line count, which re-balances the lines tightly.
 *
 * Caveat (the reason this is an experiment): pretext's canvas measurement only
 * *approximates* the browser's real line-breaking, and it measures the plain
 * `textContent` with ONE font — mixed inline fonts (bold/links) aren't modeled.
 * So the returned width can be off by a pixel or two vs. the real wrap. Returns
 * `null` if it can't measure (SSR, empty text, no parent width).
 */
function measureHugWidth(
    outer: HTMLElement,
    content: HTMLElement
): number | null {
    if (typeof window === 'undefined') return null;

    const text = content.textContent ?? '';
    if (!text.trim()) return null;

    const cs = getComputedStyle(content);
    const padX =
        parseFloat(cs.paddingLeft || '0') + parseFloat(cs.paddingRight || '0');

    // The widest the bubble may be: a fraction of the surrounding column,
    // computed explicitly so a flaky percentage max-width can't let it overflow.
    const parentW = outer.parentElement?.offsetWidth ?? 0;
    if (parentW <= 0) return null;
    const maxBoxW = Math.max(
        0,
        Math.floor(parentW * MAX_WIDTH_FRACTION) - BUBBLE_TAIL_OUT
    );
    if (!maxBoxW) return null;

    // Available width for the TEXT itself (box minus horizontal padding).
    const maxTextW = maxBoxW - padX;
    if (maxTextW <= 0) return null;

    const options: PrepareOptions = { whiteSpace: 'normal' };
    const letterSpacing = parseFloat(cs.letterSpacing || '');
    if (Number.isFinite(letterSpacing) && letterSpacing !== 0) {
        options.letterSpacing = letterSpacing;
    }

    let prepared;
    try {
        prepared = prepareWithSegments(text, fontStringFor(cs), options);
    } catch {
        return null;
    }

    // Line count at the cap = the minimum achievable line count.
    const naturalLines = measureLineStats(prepared, maxTextW).lineCount;

    // Tight box = widest actual line (+ padding) for the chosen wrap width.
    const boxFor = (maxLineWidth: number) =>
        Math.min(Math.ceil(maxLineWidth + padX) + 1, maxBoxW);

    if (naturalLines <= 1) {
        const stats = measureLineStats(prepared, maxTextW);
        return stats.maxLineWidth > 0 ? boxFor(stats.maxLineWidth) : null;
    }

    // Floor of the search: the longest unbreakable run (widest forced line).
    const minTextW = Math.min(measureNaturalWidth(prepared), maxTextW);

    // Smallest text width that still keeps `naturalLines` lines — all in JS,
    // no DOM reflow. Track the tight widest-line width at that best width.
    let lo = minTextW;
    let hi = maxTextW;
    let bestWidth = measureLineStats(prepared, maxTextW).maxLineWidth;
    for (let i = 0; i < 24 && hi - lo > 1; i++) {
        const mid = (lo + hi) / 2;
        const stats = measureLineStats(prepared, mid);
        if (stats.lineCount <= naturalLines) {
            bestWidth = stats.maxLineWidth;
            hi = mid;
        } else {
            lo = mid;
        }
    }
    return boxFor(bestWidth);
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
            const hug = measureHugWidth(outer, content);
            // Pin the outer to the hugging width (+ the tail-side room), or
            // release it if we couldn't measure.
            if (hug != null) outer.style.width = `${hug + BUBBLE_TAIL_OUT}px`;
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
                    <defs>
                        <BubbleClip
                            id={clipId}
                            width={size.width}
                            height={size.height}
                            direction={direction}
                        />
                    </defs>
                    <rect
                        width={size.width}
                        height={size.height}
                        fill={BG[direction]}
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
                    backgroundColor: ready ? 'transparent' : BG[direction],
                    borderRadius: ready ? undefined : BUBBLE_RADIUS,
                }}
            >
                {children}
            </div>
        </div>
    );
};
