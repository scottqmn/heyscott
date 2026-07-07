'use client';

import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ElementType,
    type ReactNode,
} from 'react';
import {
    REVEAL_DURATION_MS,
    REVEAL_EASING,
    REVEAL_HIDDEN_TRANSFORM,
    REVEAL_REVEALED_TRANSFORM,
    REVEAL_ROOT_MARGIN,
} from './constants';

export type RevealOnViewProps = {
    children: ReactNode;
    /**
     * IntersectionObserver `threshold`: fraction(s) of the element that must be
     * visible to count as intersecting. Default `0` (reveal as any part enters).
     */
    threshold?: number | number[];
    /** IntersectionObserver `rootMargin` — grows/shrinks the trigger box. */
    rootMargin?: string;
    /**
     * Reveal only the FIRST time it enters view, then stay revealed (observer
     * disconnects). Set `false` to re-hide + re-reveal each time it leaves and
     * re-enters. Default `true`.
     */
    once?: boolean;
    /** Delay before the entrance transition starts, in ms. Default `0`. */
    delay?: number;
    /** Element/component to render as the wrapper. Default `'div'`. */
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
};

/**
 * An IntersectionObserver-based reveal wrapper: wraps a message bubble (or any
 * children) and fades + slides/scales it into view the first time it enters the
 * viewport, matching the splash's `splashIn` entrance feel.
 *
 * By default it reveals ONCE and stays revealed (`once`); the observer then
 * disconnects. It respects `prefers-reduced-motion` (shown immediately, no
 * motion) and mitigates the known iOS-Safari IntersectionObserver quirk of
 * dropping the initial callback for elements that are ALREADY intersecting on
 * mount by doing a one-off geometry check up front.
 *
 * NOTE: {@link useScrollReveal} exists alongside this and is intentionally NOT
 * IntersectionObserver-driven — it fell back to a scroll-geometry check because
 * IO callbacks proved unreliable on iOS Safari during momentum scroll. Prefer
 * that hook for the production reveal; this wrapper is the clean IO-based
 * primitive for cases that want observer semantics (thresholds, re-reveal).
 */
export const RevealOnView = ({
    children,
    threshold = 0,
    rootMargin = REVEAL_ROOT_MARGIN,
    once = true,
    delay = 0,
    as = 'div',
    className,
    style,
}: RevealOnViewProps) => {
    const ref = useRef<HTMLElement>(null);
    const [revealed, setRevealed] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reveal = () => setRevealed(true);
        const hide = () => setRevealed(false);
        const disableMotion = () => setReducedMotion(true);

        // Respect reduced-motion: show immediately, skip the animation entirely.
        const mq =
            typeof window.matchMedia === 'function'
                ? window.matchMedia('(prefers-reduced-motion: reduce)')
                : null;
        if (mq?.matches) {
            disableMotion();
            reveal();
            return;
        }

        // No IntersectionObserver (a very old engine): reveal so content is
        // never left stuck hidden.
        if (typeof IntersectionObserver === 'undefined') {
            reveal();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;
                if (entry.isIntersecting) {
                    reveal();
                    if (once) observer.disconnect();
                } else if (!once) {
                    hide();
                }
            },
            { threshold, rootMargin }
        );
        observer.observe(el);

        // iOS-Safari mitigation: the observer can drop the initial callback for
        // an element that is already intersecting at mount, leaving it stuck
        // hidden. A one-off geometry check reveals already-visible elements.
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight || 0;
        const vw = window.innerWidth || document.documentElement.clientWidth || 0;
        const alreadyVisible =
            rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
        if (alreadyVisible) {
            reveal();
            if (once) observer.disconnect();
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    const revealStyle: CSSProperties = reducedMotion
        ? {}
        : {
              opacity: revealed ? 1 : 0,
              transform: revealed
                  ? REVEAL_REVEALED_TRANSFORM
                  : REVEAL_HIDDEN_TRANSFORM,
              transition: `opacity ${REVEAL_DURATION_MS}ms ${REVEAL_EASING} ${delay}ms, transform ${REVEAL_DURATION_MS}ms ${REVEAL_EASING} ${delay}ms`,
              willChange: revealed ? undefined : 'opacity, transform',
          };

    const Component = as;
    return (
        <Component ref={ref} className={className} style={{ ...revealStyle, ...style }}>
            {children}
        </Component>
    );
};
