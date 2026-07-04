'use client';

import { useEffect, useRef, useState } from 'react';
import { FOCUS_ROOT_MARGIN } from './constants';

/**
 * Tracks whether the referenced element sits within the viewport's focus band
 * (see {@link FOCUS_ROOT_MARGIN}). Defaults to `true` so messages render at
 * full opacity during SSR and before the observer attaches — no flash of
 * dimmed content. Degrades to always-focused where IntersectionObserver is
 * unavailable.
 */
export function useInViewFocus<T extends HTMLElement>(
    rootMargin: string = FOCUS_ROOT_MARGIN
) {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(true);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { rootMargin, threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    return { ref, inView };
}
