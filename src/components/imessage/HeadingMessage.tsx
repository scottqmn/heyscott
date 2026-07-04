import type { ReactNode } from 'react';
import { Message, type MessageProps } from './Message';

type HeadingMessageProps = Omit<MessageProps, 'direction' | 'children'> & {
    children: ReactNode;
};

/**
 * A heading rendered as an INCOMING iMessage bubble (grey, left-aligned) —
 * the conversation's prompts/section titles arriving from the other side.
 * Uses the same body text style as {@link TextMessage}; only the incoming
 * bubble treatment sets it apart.
 */
export const HeadingMessage = ({
    children,
    ...rest
}: HeadingMessageProps) => {
    return (
        <Message direction='incoming' {...rest}>
            {children}
        </Message>
    );
};
