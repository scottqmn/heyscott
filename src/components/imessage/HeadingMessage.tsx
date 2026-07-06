import type { ReactNode } from 'react';
import { Message, type MessageProps } from './Message';

type HeadingMessageProps = Omit<MessageProps, 'direction' | 'children'> & {
    children: ReactNode;
};

/**
 * A heading rendered as an OUTGOING iMessage bubble (blue, right-aligned) —
 * the conversation's section titles being sent. Uses the same body text style
 * as {@link TextMessage}; only the outgoing bubble treatment sets it apart.
 */
export const HeadingMessage = ({
    children,
    ...rest
}: HeadingMessageProps) => {
    return (
        <Message direction='outgoing' {...rest}>
            {children}
        </Message>
    );
};
