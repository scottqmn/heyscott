'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { DynamicBubble } from './DynamicBubble';
import { HIDDEN_OPACITY, REVEALED_OPACITY } from './constants';
import { useScrollReveal } from './useScrollReveal';

type MediaMessageProps = {
    /** The image / embed / iframe to receive as an attachment. */
    children: ReactNode;
    /** Optional caption shown beneath the attachment. */
    caption?: ReactNode;
    grouped?: boolean;
    revealOnScroll?: boolean;
    className?: string;
};

/**
 * An image or embed rendered as an INCOMING attachment (grey side, tail
 * bottom-left). The media fills the bubble edge-to-edge and is masked to the
 * speech-bubble silhouette — tail included — via {@link DynamicBubble}'s
 * `media` variant, so the attachment takes the exact bubble shape rather than
 * a rectangle floating inside one.
 */
export const MediaMessage = ({
    children,
    caption,
    grouped = false,
    revealOnScroll = true,
    className,
}: MediaMessageProps) => {
    const { ref, revealed } = useScrollReveal<HTMLDivElement>();
    const shown = revealed || !revealOnScroll;

    return (
        <div
            ref={ref}
            className={clsx(
                'transition-opacity duration-700 ease-out',
                grouped ? 'mt-1' : 'mt-3'
            )}
            style={{ opacity: shown ? REVEALED_OPACITY : HIDDEN_OPACITY }}
        >
            <div className='flex justify-start'>
                <figure className={clsx('max-w-[85%] sm:max-w-[75%]', className)}>
                    <DynamicBubble direction='incoming' variant='media'>
                        {children}
                    </DynamicBubble>
                    {caption && (
                        <figcaption className='mt-1 pl-2 text-left text-sm text-muted-foreground'>
                            {caption}
                        </figcaption>
                    )}
                </figure>
            </div>
        </div>
    );
};
