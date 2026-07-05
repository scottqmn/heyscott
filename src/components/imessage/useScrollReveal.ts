'use client';

import { useEffect, useRef, useState } from 'react';
import { REVEAL_ROOT_MARGIN } from './constants';

/** Is the element currently within the viewport (any part of it)? */
function isInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const vw = window.innerWidth || document.documentElement.clientWidth || 0;
    return rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
}

/**
 * One-way scroll reveal. The element starts hidden (see `HIDDEN_OPACITY`) and
 * becomes `revealed` the first time it enters view — then STAYS revealed, so it
 * never fades back out.
 *
 * The reveal is driven by a plain geometry check (`isInViewport`) re-run on
 * every scroll/resize, NOT by IntersectionObserver alone. On iOS Safari the
 * observer's callbacks are unreliable — they can be dropped for elements that
 * are already intersecting on mount, and can fail to fire during momentum
 * scrolling — which left messages stuck at the start opacity and never
 * revealing as you scrolled them into view. A capture-phase `scroll` listener
 * catches scrolling from ANY container (window or a nested scroller) and
 * doesn't depend on the observer at all; IntersectionObserver is kept only as
 * an additional, best-effort trigger where it behaves.
 */
export function useScrollReveal<T extends HTMLElement>(
    rootMargin: string = REVEAL_ROOT_MARGIN
) {
    const ref = useRef<T>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) {
            setRevealed(true);
            return;
        }

        let done = false;
        const check = () => {
            if (done || !isInViewport(el)) return;
            done = true;
            setRevealed(true);
            teardown();
        };

        // Reveal as it scrolls into view. Capture phase so scrolls from any
        // scroll container (window or a nested one) are seen. Also re-check
        // just after mount (rAF + a short timeout) to catch late layout on
        // iOS, where geometry can settle a frame or two after the effect runs.
        window.addEventListener('scroll', check, { passive: true, capture: true });
        window.addEventListener('resize', check, { passive: true });
        const raf = requestAnimationFrame(check);
        const timer = setTimeout(check, 300);

        let observer: IntersectionObserver | undefined;
        if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
                (entries) => entries.some((e) => e.isIntersecting) && check(),
                { rootMargin, threshold: 0 }
            );
            observer.observe(el);
        }

        function teardown() {
            window.removeEventListener('scroll', check, { capture: true });
            window.removeEventListener('resize', check);
            cancelAnimationFrame(raf);
            clearTimeout(timer);
            observer?.disconnect();
        }

        // Reveal immediately if already on screen at mount.
        check();

        return teardown;
    }, [rootMargin]);

    return { ref, revealed };
}
