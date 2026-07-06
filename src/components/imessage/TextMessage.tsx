import type { ReactNode } from 'react';
import { Message, type MessageProps } from './Message';

type TextMessageProps = Omit<MessageProps, 'direction' | 'children'> & {
    children: ReactNode;
};

/**
 * A block of body text rendered as an INCOMING iMessage bubble (grey,
 * left-aligned) — the conversation's body content arriving.
 */
export const TextMessage = ({ children, ...rest }: TextMessageProps) => {
    return (
        <Message direction='incoming' {...rest}>
            {children}
        </Message>
    );
};
