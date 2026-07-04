'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { DynamicBubble } from './DynamicBubble';
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
 * An image or embed rendered as an OUTGOING attachment. The media fills the
 * bubble edge-to-edge and is masked to the speech-bubble silhouette — tail
 * included — via {@link DynamicBubble}'s `media` variant, so the attachment
 * takes the exact bubble shape rather than a rectangle floating inside one.
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
                <figure className={clsx('max-w-[85%] sm:max-w-[75%]', className)}>
                    <DynamicBubble direction='outgoing' variant='media'>
                        {children}
                    </DynamicBubble>
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
