import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { DynamicBubble } from '@/components/imessage/DynamicBubble';

type ChatBubbleProps = {
    children: ReactNode;
    /** `sent` = blue, right-aligned; `received` = grey, left-aligned. */
    variant?: 'sent' | 'received';
    /** Tighten spacing + flatten the top corner when following a same-side one. */
    grouped?: boolean;
    /** Draw the tail (omitted for grouped messages that aren't the last). */
    tail?: boolean;
    className?: string;
};

/**
 * The iMessage chat bubble. Renders through {@link DynamicBubble}, so the
 * bubble body + tail are one dynamic SVG shape (shared with masked media),
 * colored from the theme's `--color-imessage-*` tokens.
 */
export const ChatBubble = ({
    children,
    variant = 'received',
    grouped = false,
    tail = true,
    className,
}: ChatBubbleProps) => {
    return (
        <div
            className={clsx(
                'flex',
                variant === 'sent' ? 'justify-end' : 'justify-start',
                grouped ? 'mt-1' : 'mt-3'
            )}
        >
            <DynamicBubble
                direction={variant === 'sent' ? 'outgoing' : 'incoming'}
                tail={tail}
                grouped={grouped}
                className={clsx('max-w-[85%]', className)}
            >
                {children}
            </DynamicBubble>
        </div>
    );
};
