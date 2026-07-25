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
    // MediaMessage / Message carry an explicit direction (default incoming);
    // TextMessage is always incoming.
    const direction = (el.props as { direction?: MessageDirection } | null)
        ?.direction;
    if (type === MediaMessage) return direction ?? 'incoming';
    if (type === TextMessage) return 'incoming';
    return direction ?? 'incoming';
}

/** Read a boolean grouping-hint prop off a message element. */
function flagOf(el: ReactElement, name: 'startsGroup' | 'standalone'): boolean {
    return Boolean((el.props as Record<string, unknown> | null)?.[name]);
}

/**
 * A conversation column that lays out {@link Message}s (and friends) in a
 * centered, readable-width thread AND computes iMessage-style grouping from the
 * sequence: consecutive same-side messages form a group, and every message in a
 * group drops its tail except the last (bottom) one. Each message is told
 * whether it is the last of its run (`tail`) and whether a same-side message
 * precedes it (`grouped`) — derived here, not set by hand.
 *
 * A group boundary is forced between two adjacent messages when the side flips,
 * when the later one has `startsGroup` (e.g. a blank line split it off), or when
 * either one is `standalone` (media reads as its own message). Everything else
 * groups with its same-side neighbour as before.
 */
export const MessageThread = ({ children, className }: MessageThreadProps) => {
    const items = Children.toArray(children).filter(isValidElement);
    const sides = items.map((el) => sideOf(el));

    // Is there a group boundary immediately BEFORE item i?
    const breaksBefore = (i: number): boolean => {
        if (i === 0) return true;
        if (sides[i] !== sides[i - 1]) return true;
        if (flagOf(items[i], 'standalone') || flagOf(items[i - 1], 'standalone'))
            return true;
        if (flagOf(items[i], 'startsGroup')) return true;
        return false;
    };

    const grouped = items.map((el, i) => {
        const startsRun = breaksBefore(i);
        const endsRun = i === items.length - 1 || breaksBefore(i + 1);
        return cloneElement(el as ReactElement<GroupProps>, {
            tail: endsRun,
            grouped: !startsRun,
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
