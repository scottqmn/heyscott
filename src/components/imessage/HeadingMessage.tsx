import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Message, type MessageProps } from './Message';

type HeadingMessageProps = Omit<MessageProps, 'direction' | 'children'> & {
    children: ReactNode;
    /** Heading level, for semantics and relative sizing (1 = largest). */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
};

const SIZE: Record<NonNullable<HeadingMessageProps['level']>, string> = {
    1: 'text-2xl md:text-3xl font-semibold',
    2: 'text-xl md:text-2xl font-semibold',
    3: 'text-lg md:text-xl font-medium',
    4: 'text-base md:text-lg font-medium',
    5: 'text-base font-medium',
    6: 'text-sm font-medium uppercase tracking-wide',
};

/**
 * A heading rendered as an INCOMING iMessage bubble (grey, left-aligned) —
 * the conversation's prompts/section titles arriving from the other side.
 */
export const HeadingMessage = ({
    children,
    level = 2,
    className,
    ...rest
}: HeadingMessageProps) => {
    return (
        <Message
            direction='incoming'
            className={clsx(SIZE[level], className)}
            {...rest}
        >
            {children}
        </Message>
    );
};
