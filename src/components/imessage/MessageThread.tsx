import type { ReactNode } from 'react';
import { clsx } from 'clsx';

type MessageThreadProps = {
    children: ReactNode;
    className?: string;
};

/**
 * A conversation column that lays out {@link Message}s (and friends) in a
 * centered, readable-width thread. Purely presentational — each message owns
 * its own scroll-focus behavior — so the thread can wrap any mix of message
 * components.
 */
export const MessageThread = ({ children, className }: MessageThreadProps) => {
    return (
        <div
            className={clsx('mx-auto w-full max-w-xl px-5', className)}
            role='list'
        >
            {children}
        </div>
    );
};
