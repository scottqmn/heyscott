import clsx from 'clsx';

import { Message } from './components/Message';
import { MESSAGES } from './constants';

/** Seconds between each bubble's entrance (matches the original splash pacing). */
const STAGGER_SECONDS = 2;

/**
 * The homepage splash — the iMessage conversation that is heyscott's identity.
 *
 * Server-rendered and animated with PURE CSS (see `.splash-message` in
 * globals.css). The bubbles are present and VISIBLE in the HTML with no client
 * JS; the staggered fade/slide-in is progressive enhancement on top. This
 * replaced a framer-motion implementation whose `initial="hidden"` left every
 * bubble at `opacity:0` until JS ran — so the whole splash was a blank page
 * whenever client JS failed to run (e.g. older iOS Safari). No `'use client'`,
 * no animation library, nothing to fail.
 */
export const Messages = () => {
    const messages = MESSAGES[0];

    return (
        <div className='overflow-x-hidden px-5 py-10'>
            {messages.map(({ type, content }, index) => {
                const prevType = messages[index - 1]?.type;
                return (
                    <div
                        key={content}
                        className={clsx(
                            'splash-message',
                            type === 'sent'
                                ? 'splash-message--sent'
                                : 'splash-message--received'
                        )}
                        style={{ animationDelay: `${index * STAGGER_SECONDS}s` }}
                    >
                        <Message
                            type={type}
                            prevType={prevType}
                            content={content}
                        />
                    </div>
                );
            })}
        </div>
    );
};
