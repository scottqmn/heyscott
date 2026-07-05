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
    /** A same-side bubble sits below — rounds the tail-side bottom corner in. */
    groupedBelow?: boolean;
    /**
     * Override the bubble COLOR independently of `variant` (position). `typing`
     * is the darker translucent gray (iMessage typing-indicator tone).
     */
    tone?: 'sent' | 'received' | 'typing';
    className?: string;
};

/**
 * The iMessage chat bubble. Renders through {@link DynamicBubble}, so the
 * bubble body + tail are one dynamic SVG shape (shared with masked media),
 * colored from the theme's `--color-imessage-*` tokens. `tone` can decouple the
 * color from `variant` — e.g. a grey bubble in the sent (right) position.
 */
export const ChatBubble = ({
    children,
    variant = 'received',
    grouped = false,
    tail = true,
    groupedBelow,
    tone,
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
                tone={
                    tone === 'sent'
                        ? 'outgoing'
                        : tone === 'received'
                          ? 'incoming'
                          : tone // 'typing' | undefined
                }
                tail={tail}
                grouped={grouped}
                groupedBelow={groupedBelow}
                className={clsx('max-w-[85%]', className)}
            >
                {children}
            </DynamicBubble>
        </div>
    );
};
