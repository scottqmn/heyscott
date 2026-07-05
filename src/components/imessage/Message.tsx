'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { ChatBubble } from '@/components/ChatBubble';
import { ReadReceipt, type ReceiptStatus } from './assets/ReadReceipt';
import { HIDDEN_OPACITY, REVEALED_OPACITY } from './constants';
import { useScrollReveal } from './useScrollReveal';

export type MessageDirection = 'incoming' | 'outgoing';

export type MessageProps = {
    children: ReactNode;
    /** `incoming` = grey, left-aligned; `outgoing` = blue, right-aligned. */
    direction?: MessageDirection;
    /** Tighten spacing + flatten the top corner when following a same-side one. */
    grouped?: boolean;
    /** Draw the tail. Grouped messages omit it except the group's last. */
    tail?: boolean;
    /** Delivered/read status, shown under outgoing messages only. */
    receipt?: ReceiptStatus | null;
    /** Fade in from {@link HIDDEN_OPACITY} the first time it scrolls into view. */
    revealOnScroll?: boolean;
    className?: string;
};

/**
 * A single iMessage-style message: the {@link ChatBubble} primitive (colors +
 * tail from the theme) wrapped with the one-way scroll reveal and an optional
 * read receipt. The base building block of the message library. Grouping
 * (`tail`/`grouped`) is normally computed by {@link MessageThread} from the
 * message sequence rather than set by hand.
 */
export const Message = ({
    children,
    direction = 'incoming',
    grouped = false,
    tail = true,
    receipt = null,
    revealOnScroll = true,
    className,
}: MessageProps) => {
    const { ref, revealed } = useScrollReveal<HTMLDivElement>();
    const shown = revealed || !revealOnScroll;

    return (
        <div
            ref={ref}
            className={clsx('transition-opacity duration-700 ease-out')}
            style={{ opacity: shown ? REVEALED_OPACITY : HIDDEN_OPACITY }}
        >
            <ChatBubble
                variant={direction === 'outgoing' ? 'sent' : 'received'}
                grouped={grouped}
                tail={tail}
                className={className}
            >
                {children}
            </ChatBubble>
            {/* Receipt only on the group's last outgoing message (the one with the tail). */}
            {receipt && tail && direction === 'outgoing' && (
                <ReadReceipt status={receipt} />
            )}
        </div>
    );
};
