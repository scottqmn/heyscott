'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { ChatBubble } from '@/components/ChatBubble';
import { ReadReceipt, type ReceiptStatus } from './assets/ReadReceipt';
import { HIDDEN_OPACITY, REVEALED_OPACITY } from './constants';
import { useRevealQueueItem } from './revealQueue';
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
    /**
     * Opt this message into a {@link RevealQueueProvider}: its id in that post's
     * ordered `messageIds` queue. When set AND a provider is above, the reveal
     * timing comes from the queue (progressive, in order, cleared/refilled on
     * navigation) instead of the standalone `useScrollReveal`. Ignored when no
     * provider is present, so it's safe to pass unconditionally.
     */
    queueId?: string;
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
    queueId,
    className,
}: MessageProps) => {
    // Reveal timing: prefer a RevealQueue (when this message has a `queueId` and
    // a provider is above), else the standalone one-way scroll reveal. Both
    // hooks run (rules of hooks); only the active one's ref is attached, so the
    // idle one stays inert.
    const queued = useRevealQueueItem(queueId);
    const scroll = useScrollReveal<HTMLDivElement>();
    const ref = queued ? queued.ref : scroll.ref;
    const revealed = queued ? queued.revealed : scroll.revealed;
    const shown = revealed || !revealOnScroll;

    return (
        <div
            ref={ref as React.Ref<HTMLDivElement>}
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
