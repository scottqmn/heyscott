'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { DynamicBubble } from './DynamicBubble';
import type { MessageDirection } from './Message';

type MediaMessageProps = {
    /** The image / embed / iframe to receive as an attachment. */
    children: ReactNode;
    /**
     * `incoming` = grey, tail bottom-left (an attachment arriving);
     * `outgoing` = blue side, tail bottom-right (an attachment being sent).
     */
    direction?: MessageDirection;
    /** Optional caption shown beneath the attachment. */
    caption?: ReactNode;
    grouped?: boolean;
    /** Draw the tail. Grouped messages omit it except the group's last. */
    tail?: boolean;
    /**
     * Grouping hint read by {@link MessageThread}: force a new group to START
     * at this message (see {@link MessageProps.startsGroup}).
     */
    startsGroup?: boolean;
    /**
     * Grouping hint read by {@link MessageThread}: this message is its OWN
     * group, breaking the chain on both sides (see
     * {@link MessageProps.standalone}). Images/embeds set this so they read as
     * standalone attachments.
     */
    standalone?: boolean;
    /**
     * Render the attachment at a larger, video-appropriate width (fills the
     * conversation column instead of the default ~75% cap). Used for oEmbed
     * video embeds so they read comfortably; stays responsive
     * (`max-width: 100%`) and the child preserves its own aspect ratio.
     */
    wide?: boolean;
    className?: string;
};

/**
 * An image or embed rendered as an attachment, masked to the speech-bubble
 * silhouette — tail included — via {@link DynamicBubble}'s `media` variant, so
 * the attachment takes the exact bubble shape rather than a rectangle floating
 * inside one. Defaults to an INCOMING attachment (grey, left); pass
 * `direction='outgoing'` to send it (right-aligned).
 */
export const MediaMessage = ({
    children,
    direction = 'incoming',
    caption,
    grouped = false,
    tail = true,
    wide = false,
    className,
}: MediaMessageProps) => {
    const outgoing = direction === 'outgoing';

    return (
        <div className={clsx(grouped ? 'mt-1' : 'mt-3')}>
            <div className={clsx('flex', outgoing ? 'justify-end' : 'justify-start')}>
                <figure
                    className={clsx(
                        wide ? 'w-full max-w-full' : 'max-w-[85%] sm:max-w-[75%]',
                        className
                    )}
                >
                    <DynamicBubble
                        direction={direction}
                        variant='media'
                        tail={tail}
                        grouped={grouped}
                    >
                        {children}
                    </DynamicBubble>
                    {caption && (
                        <figcaption
                            className={clsx(
                                'mt-1 text-sm text-muted-foreground',
                                outgoing ? 'pr-2 text-right' : 'pl-2 text-left'
                            )}
                        >
                            {caption}
                        </figcaption>
                    )}
                </figure>
            </div>
        </div>
    );
};
