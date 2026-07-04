'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { ChatBubble } from '@/components/ChatBubble';
import { ReadReceipt, type ReceiptStatus } from './assets/ReadReceipt';
import { FOCUSED_OPACITY, UNFOCUSED_OPACITY } from './constants';
import { useInViewFocus } from './useInViewFocus';

export type MessageDirection = 'incoming' | 'outgoing';

export type MessageProps = {
    children: ReactNode;
    /** `incoming` = grey, left-aligned; `outgoing` = blue, right-aligned. */
    direction?: MessageDirection;
    /** Tighten spacing when this message follows one from the same sender. */
    grouped?: boolean;
    /** Delivered/read status, shown under outgoing messages only. */
    receipt?: ReceiptStatus | null;
    /** Dim to {@link UNFOCUSED_OPACITY} when scrolled out of the focus band. */
    focusOnScroll?: boolean;
    className?: string;
};

/**
 * A single iMessage-style message: the {@link ChatBubble} primitive (colors +
 * tail from the theme) wrapped with the scroll focus/unfocus effect and an
 * optional read receipt. The base building block of the message library.
 */
export const Message = ({
    children,
    direction = 'incoming',
    grouped = false,
    receipt = null,
    focusOnScroll = true,
    className,
}: MessageProps) => {
    const { ref, inView } = useInViewFocus<HTMLDivElement>();
    const dimmed = focusOnScroll && !inView;

    return (
        <div
            ref={ref}
            className={clsx('transition-opacity duration-500 ease-out')}
            style={{ opacity: dimmed ? UNFOCUSED_OPACITY : FOCUSED_OPACITY }}
        >
            <ChatBubble
                variant={direction === 'outgoing' ? 'sent' : 'received'}
                grouped={grouped}
                className={className}
            >
                {children}
            </ChatBubble>
            {receipt && direction === 'outgoing' && (
                <ReadReceipt status={receipt} />
            )}
        </div>
    );
};
