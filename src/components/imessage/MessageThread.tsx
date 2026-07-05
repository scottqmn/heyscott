import {
    Children,
    cloneElement,
    isValidElement,
    type ReactElement,
    type ReactNode,
} from 'react';
import { clsx } from 'clsx';
import { HeadingMessage } from './HeadingMessage';
import type { MessageDirection } from './Message';
import { MediaMessage } from './MediaMessage';
import { TextMessage } from './TextMessage';

type MessageThreadProps = {
    children: ReactNode;
    className?: string;
};

type GroupProps = { tail?: boolean; grouped?: boolean };

/** Which side of the conversation a message element sits on. */
function sideOf(el: ReactElement): MessageDirection {
    const type = el.type;
    if (type === HeadingMessage) return 'outgoing';
    if (type === TextMessage || type === MediaMessage) return 'incoming';
    const direction = (el.props as { direction?: MessageDirection } | null)
        ?.direction;
    return direction ?? 'incoming';
}

/**
 * A conversation column that lays out {@link Message}s (and friends) in a
 * centered, readable-width thread AND computes iMessage-style grouping from the
 * sequence: consecutive same-side messages form a group, and every message in a
 * group drops its tail except the last (bottom) one. Each message is told
 * whether it is the last of its run (`tail`) and whether a same-side message
 * precedes it (`grouped`) — derived here, not set by hand.
 */
export const MessageThread = ({ children, className }: MessageThreadProps) => {
    const items = Children.toArray(children).filter(isValidElement);
    const sides = items.map((el) => sideOf(el));

    const grouped = items.map((el, i) => {
        const isLastOfRun = i === items.length - 1 || sides[i] !== sides[i + 1];
        const followsSameSide = i > 0 && sides[i] === sides[i - 1];
        return cloneElement(el as ReactElement<GroupProps>, {
            tail: isLastOfRun,
            grouped: followsSameSide,
        });
    });

    return (
        <div
            className={clsx('mx-auto w-full max-w-xl px-5', className)}
            role='list'
        >
            {grouped}
        </div>
    );
};
