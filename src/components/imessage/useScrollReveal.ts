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
 * never fades back out. Degrades to immediately revealed where
 * IntersectionObserver is unavailable.
 *
 * Elements that are ALREADY on screen when they mount are revealed
 * synchronously here, NOT via the observer: IntersectionObserver's single
 * initial callback for an already-intersecting element can be dropped across
 * React StrictMode's observe→disconnect→observe churn, which left on-load
 * messages stuck at the start opacity. The observer is only used to catch
 * elements that are still below the fold and scroll in later.
 */
export function useScrollReveal<T extends HTMLElement>(
    rootMargin: string = REVEAL_ROOT_MARGIN
) {
    const ref = useRef<T>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setRevealed(true);
            return;
        }

        // Already visible on mount → reveal now (the CSS opacity transition
        // still animates the fade-in). Don't wait on the observer's initial
        // callback, which can be missed for elements already in view.
        if (isInViewport(el)) {
            setRevealed(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true);
                    observer.disconnect(); // once revealed, stay revealed
                }
            },
            { rootMargin, threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    return { ref, revealed };
}
