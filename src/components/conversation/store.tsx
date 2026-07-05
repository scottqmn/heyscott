'use client';

import { usePathname } from 'next/navigation';
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';

/** One visit to a page — its URL is enough to derive its messages. */
export type ConversationSegment = { id: string; pathname: string };

type ConversationContextValue = { segments: ConversationSegment[] };

const ConversationContext = createContext<ConversationContextValue | null>(null);

/**
 * Holds the ONE continuous conversation as global state. Because this lives in
 * the root layout (which App Router keeps mounted across client navigation),
 * the conversation survives page changes: each new `usePathname()` APPENDS a
 * segment; it never resets. Same-path revisits append too, so the thread grows
 * as you browse.
 */
export function ConversationProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [segments, setSegments] = useState<ConversationSegment[]>(() => [
        { id: `0:${pathname}`, pathname },
    ]);
    const prevPathname = useRef(pathname);
    const seq = useRef(0);

    useEffect(() => {
        if (pathname === prevPathname.current) return;
        prevPathname.current = pathname;
        seq.current += 1;
        setSegments((prev) => [
            ...prev,
            { id: `${seq.current}:${pathname}`, pathname },
        ]);
    }, [pathname]);

    return (
        <ConversationContext.Provider value={{ segments }}>
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversation() {
    const ctx = useContext(ConversationContext);
    if (!ctx) {
        throw new Error(
            'useConversation must be used within a ConversationProvider'
        );
    }
    return ctx;
}
