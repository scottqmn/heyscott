import type { ReactNode } from 'react';
import { ChatBubble } from '@/components/ChatBubble';
import { ReadReceipt, type ReceiptStatus } from './assets/ReadReceipt';

export type MessageDirection = 'incoming' | 'outgoing';

export type MessageProps = {
    children: ReactNode;
    /** `incoming` = grey, left-aligned; `outgoing` = blue, right-aligned. */
    direction?: MessageDirection;
    /** Tighten spacing + flatten the top corner when following a same-side one. */
    grouped?: boolean;
    /** Draw the tail. Grouped messages omit it except the group's last. */
    tail?: boolean;
    /**
     * Grouping hint read by {@link MessageThread} (not rendered here): force a
     * new group to START at this message even if the previous one is same-side
     * — e.g. a blank line between paragraphs.
     */
    startsGroup?: boolean;
    /**
     * Grouping hint read by {@link MessageThread} (not rendered here): this
     * message is its OWN group, breaking the tail/rounding chain on both sides
     * so neighbours never group with it — used for standalone media.
     */
    standalone?: boolean;
    /** Delivered/read status, shown under outgoing messages only. */
    receipt?: ReceiptStatus | null;
    className?: string;
};

/**
 * A single iMessage-style message: the {@link ChatBubble} primitive (colors +
 * tail from the theme) plus an optional read receipt. The base building block of
 * the message library. Bubbles render at FULL opacity — no scroll/JS reveal — so
 * the conversation is readable without client JS. Grouping (`tail`/`grouped`) is
 * normally computed by {@link MessageThread} from the message sequence rather
 * than set by hand.
 */
export const Message = ({
    children,
    direction = 'incoming',
    grouped = false,
    tail = true,
    receipt = null,
    className,
}: MessageProps) => {
    return (
        <div>
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
