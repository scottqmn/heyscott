import type { ReactNode } from 'react';
import { Message, type MessageProps } from './Message';

type TextMessageProps = Omit<MessageProps, 'direction' | 'children'> & {
    children: ReactNode;
};

/**
 * A block of body text rendered as an OUTGOING iMessage bubble (blue,
 * right-aligned) — the conversation's replies being sent.
 */
export const TextMessage = ({ children, ...rest }: TextMessageProps) => {
    return (
        <Message direction='outgoing' {...rest}>
            {children}
        </Message>
    );
};
