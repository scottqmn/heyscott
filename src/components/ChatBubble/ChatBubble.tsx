import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import styles from './ChatBubble.module.scss';

type ChatBubbleProps = {
    children: ReactNode;
    /** `sent` = blue, right-aligned; `received` = grey, left-aligned. */
    variant?: 'sent' | 'received';
    /** Tighten spacing when this bubble follows one of the same variant. */
    grouped?: boolean;
    className?: string;
};

/**
 * The iMessage chat bubble, reusable across the site. Renders the same
 * blue/grey rounded bubbles with tails as the homepage splash, so the blog
 * feels native to heyscott's iMessage identity.
 */
export const ChatBubble = ({
    children,
    variant = 'received',
    grouped = false,
    className,
}: ChatBubbleProps) => {
    return (
        <div
            className={clsx(
                'flex',
                variant === 'sent' ? 'justify-end' : 'justify-start',
                grouped ? 'mt-1' : 'mt-3'
            )}
        >
            <div className={clsx(styles.bubble, styles[variant], className)}>
                {children}
            </div>
        </div>
    );
};
