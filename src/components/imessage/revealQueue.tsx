'use client';

import {
    createContext,
    createElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
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

/**
 * A path-change-driven reveal QUEUE for a conversation of messages (e.g. a blog
 * post rendered as an iMessage thread).
 *
 * The queue is the post's ORDERED message sequence (`messageIds`, in the order
 * they appear — outgoing header bubbles then the incoming body replies). A head
 * pointer (`revealedCount`) walks the queue: the message at the head reveals the
 * moment it scrolls into view, which advances the head to the next message, so
 * messages reveal PROGRESSIVELY and IN ORDER as the reader scrolls down — not
 * all at once.
 *
 * On navigation the caller changes `postKey` (the route/uid). The head resets to
 * 0 SYNCHRONOUSLY — so a half-scrolled previous post is CLEARED and the queue
 * REFILLS with the new post's messages; no stale/leftover reveals carry over.
 *
 * `prefers-reduced-motion` is honoured: the whole queue reveals immediately with
 * no animation (matching {@link RevealOnView}).
 *
 * This is the reveal-TIMING layer only. It composes with the existing render:
 * {@link Message} sources its `revealed` flag from this queue when given a
 * `queueId` inside a provider, otherwise falls back to `useScrollReveal`. The
 * standalone {@link QueuedReveal} wrapper drives the same reveal for non-Message
 * children.
 */

type RevealQueueContextValue = {
    /** Identifies the current post; changing it clears + refills the queue. */
    postKey: string;
    /** Position of `queueId` in the ordered queue, or -1 if not queued. */
    indexOf: (queueId: string) => number;
    /** Number of messages revealed so far — the head pointer. */
    revealedCount: number;
    /** Advance the head to at least `count` (monotonic within a post). */
    advanceTo: (count: number) => void;
    /** User prefers reduced motion — reveal instantly, skip the animation. */
    reducedMotion: boolean;
};

const RevealQueueContext = createContext<RevealQueueContextValue | null>(null);

export type RevealQueueProviderProps = {
    /**
     * The current post's identity (route/uid). Changing it CLEARS the queue and
     * REFILLS from `messageIds` — the core navigation behavior.
     */
    postKey: string;
    /** The post's messages, in reveal order. The queue IS this sequence. */
    messageIds: readonly string[];
    children: ReactNode;
};

/**
 * Provides a {@link RevealQueueContext} for the messages beneath it. Keyed by
 * `postKey`: when it changes, the head resets to 0 (derived, so the reset is
 * synchronous with the render — no flash of the old post's revealed state).
 */
export const RevealQueueProvider = ({
    postKey,
    messageIds,
    children,
}: RevealQueueProviderProps) => {
    // `{ key, count }` lets us reset the head synchronously when `postKey`
    // changes: `count` is treated as 0 for any key other than the current one,
    // and `advanceTo` rebases onto the current key. No effect, so no flash.
    const [head, setHead] = useState({ key: postKey, count: 0 });
    const revealedCount = head.key === postKey ? head.count : 0;

    const advanceTo = useCallback(
        (count: number) => {
            setHead((prev) => {
                const base = prev.key === postKey ? prev.count : 0;
                return { key: postKey, count: Math.max(base, count) };
            });
        },
        [postKey]
    );

    const indexMap = useMemo(() => {
        const map = new Map<string, number>();
        messageIds.forEach((id, i) => map.set(id, i));
        return map;
    }, [messageIds]);
    const indexOf = useCallback(
        (queueId: string) => indexMap.get(queueId) ?? -1,
        [indexMap]
    );

    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        if (typeof window.matchMedia !== 'function') return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const apply = () => setReducedMotion(mq.matches);
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);

    const value = useMemo<RevealQueueContextValue>(
        () => ({ postKey, indexOf, revealedCount, advanceTo, reducedMotion }),
        [postKey, indexOf, revealedCount, advanceTo, reducedMotion]
    );

    return (
        <RevealQueueContext.Provider value={value}>
            {children}
        </RevealQueueContext.Provider>
    );
};

/** Access the raw queue store (head pointer + controls), or null if unwrapped. */
export const useRevealQueue = () => useContext(RevealQueueContext);

export type QueuedRevealItem = {
    /** Attach to the element whose entry into view should reveal this message. */
    ref: React.RefObject<HTMLElement | null>;
    /** Whether this message has been revealed (head has passed it). */
    revealed: boolean;
    /** Mirror of the provider's reduced-motion flag. */
    reducedMotion: boolean;
};

/**
 * Per-message hook: drives one message's reveal from the queue. Returns `null`
 * when there is no {@link RevealQueueProvider} above, or no `queueId` — so the
 * caller can fall back to its default reveal (e.g. `useScrollReveal`).
 *
 * A message reveals when it is at the head of the queue AND intersecting the
 * viewport; revealing advances the head so the next message becomes eligible.
 * Already-revealed messages (head passed them) stay revealed. To blunt the iOS
 * Safari IntersectionObserver quirk of dropping the initial callback for an
 * element that is already on screen at mount, a one-off geometry check seeds the
 * intersecting state.
 */
export function useRevealQueueItem(
    queueId: string | undefined,
    options?: { threshold?: number | number[]; rootMargin?: string }
): QueuedRevealItem | null {
    const ctx = useContext(RevealQueueContext);
    const ref = useRef<HTMLElement>(null);
    const [intersecting, setIntersecting] = useState(false);

    const index = ctx && queueId != null ? ctx.indexOf(queueId) : -1;
    const active = ctx != null && index >= 0;
    const reducedMotion = ctx?.reducedMotion ?? false;
    const threshold = options?.threshold ?? 0;
    const rootMargin = options?.rootMargin ?? REVEAL_ROOT_MARGIN;

    // Observe viewport entry (only while active and animating).
    useEffect(() => {
        if (!active) return;
        const el = ref.current;
        if (!el) return;

        const markVisible = () => setIntersecting(true);
        if (reducedMotion) {
            markVisible();
            return;
        }
        if (typeof IntersectionObserver === 'undefined') {
            markVisible();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry) setIntersecting(entry.isIntersecting);
            },
            { threshold, rootMargin }
        );
        observer.observe(el);

        // iOS mitigation: reveal-eligible if already on screen at mount.
        const rect = el.getBoundingClientRect();
        const vh =
            window.innerHeight || document.documentElement.clientHeight || 0;
        const vw =
            window.innerWidth || document.documentElement.clientWidth || 0;
        if (rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw) {
            markVisible();
        }

        return () => observer.disconnect();
    }, [active, reducedMotion, threshold, rootMargin]);

    // Advance the head when this message is the head and eligible.
    const revealedCount = ctx?.revealedCount ?? 0;
    const advanceTo = ctx?.advanceTo;
    useEffect(() => {
        if (!active || !advanceTo) return;
        if (reducedMotion) {
            advanceTo(index + 1);
            return;
        }
        if (revealedCount === index && intersecting) advanceTo(index + 1);
    }, [active, advanceTo, reducedMotion, revealedCount, index, intersecting]);

    if (!active) return null;
    return {
        ref,
        revealed: reducedMotion || revealedCount > index,
        reducedMotion,
    };
}

export type QueuedRevealProps = {
    /** This message's id — its position in the provider's `messageIds` queue. */
    queueId: string;
    children: ReactNode;
    /** IntersectionObserver threshold. Default `0`. */
    threshold?: number | number[];
    /** IntersectionObserver rootMargin. */
    rootMargin?: string;
    /** Delay before the entrance transition starts, in ms. Default `0`. */
    delay?: number;
    /** Element/component to render as the wrapper. Default `'div'`. */
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
};

/**
 * A queue-driven reveal WRAPPER — the {@link RevealOnView} fade + slide/scale
 * entrance, but timed by the {@link RevealQueueProvider} instead of a lone
 * observer. Use it to wrap children that are not {@link Message}s (which consult
 * the queue directly via `queueId`). Without a provider above, it just renders
 * its children revealed.
 */
export const QueuedReveal = ({
    queueId,
    children,
    threshold,
    rootMargin,
    delay = 0,
    as = 'div',
    className,
    style,
}: QueuedRevealProps) => {
    const item = useRevealQueueItem(queueId, { threshold, rootMargin });

    // No provider / not queued: render plainly (fully revealed).
    if (!item) {
        return createElement(as, { className, style }, children);
    }

    const { ref, revealed, reducedMotion } = item;
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
        <Component
            ref={ref}
            className={className}
            style={{ ...revealStyle, ...style }}
        >
            {children}
        </Component>
    );
};
