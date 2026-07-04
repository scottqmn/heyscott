'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { BubbleTail } from './assets/BubbleTail';
import { ReadReceipt, type ReceiptStatus } from './assets/ReadReceipt';
import { FOCUSED_OPACITY, UNFOCUSED_OPACITY } from './constants';
import { useInViewFocus } from './useInViewFocus';

type MediaMessageProps = {
    /** The image / embed / iframe to send as an attachment. */
    children: ReactNode;
    /** Optional caption shown beneath the attachment. */
    caption?: ReactNode;
    grouped?: boolean;
    receipt?: ReceiptStatus | null;
    focusOnScroll?: boolean;
    className?: string;
};

/**
 * An image or embed rendered as an OUTGOING attachment (right-aligned, blue
 * tail) so media flows in the conversation like a sent photo. Uses the SVG
 * {@link BubbleTail} rather than the CSS pseudo-element tail, since the media
 * is clipped by `overflow-hidden` which would swallow a CSS tail.
 */
export const MediaMessage = ({
    children,
    caption,
    grouped = false,
    receipt = null,
    focusOnScroll = true,
    className,
}: MediaMessageProps) => {
    const { ref, inView } = useInViewFocus<HTMLDivElement>();
    const dimmed = focusOnScroll && !inView;

    return (
        <div
            ref={ref}
            className={clsx(
                'transition-opacity duration-500 ease-out',
                grouped ? 'mt-1' : 'mt-3'
            )}
            style={{ opacity: dimmed ? UNFOCUSED_OPACITY : FOCUSED_OPACITY }}
        >
            <div className='flex justify-end'>
                <figure
                    className={clsx('relative max-w-[85%] sm:max-w-[75%]', className)}
                >
                    <div className='overflow-hidden rounded-[var(--radius-bubble)]'>
                        {children}
                    </div>
                    <BubbleTail
                        direction='outgoing'
                        className='absolute right-[-3px] bottom-0 text-imessage-sent'
                    />
                    {caption && (
                        <figcaption className='mt-1 pr-2 text-right text-sm text-muted-foreground'>
                            {caption}
                        </figcaption>
                    )}
                </figure>
            </div>
            {receipt && <ReadReceipt status={receipt} />}
        </div>
    );
};
