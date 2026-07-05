'use client';

import { useEffect, useRef, useState } from 'react';
import { REVEAL_ROOT_MARGIN } from './constants';

/**
 * One-way scroll reveal. The element starts hidden (see `HIDDEN_OPACITY`) and
 * becomes `revealed` the first time it scrolls into view — then STAYS revealed
 * (the observer disconnects), so it never fades back out. Degrades to
 * immediately revealed where IntersectionObserver is unavailable.
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
