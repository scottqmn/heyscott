import {
    HeadingMessage,
    MessageThread,
    TextMessage,
} from '@/components/imessage';
import { MESSAGES } from '@/components/Messages/constants';
import { ThreadHeader } from '@/components/ThreadHeader';

/** Strip the inline HTML tags in the splash copy (e.g. the sent `<h1>`). */
const textOf = (content: string) => content.replace(/<[^>]*>/g, '');

/**
 * The homepage as the "Scott" iMessage conversation — the SAME copy as the
 * original splash (`Messages/constants.ts`, Scott's own words), rendered through
 * the shared message thread so it reads exactly like a blog post. The identity
 * ("Scott", the group name) lives in the always-visible {@link ThreadHeader} as
 * the page `<h1>`, so the body carries no title bubble. The sent line is
 * OUTGOING (blue); Scott's replies are INCOMING (grey).
 *
 * Bubbles render at FULL opacity straight from the server HTML (no scroll/JS
 * reveal) — preserving the splash's "readable without client JS" intent. The
 * dynamic bubble still shows its text before JS runs (a rounded-rect stands in
 * for the tail until it's measured).
 */
export const HomeConversation = () => (
    <main className='min-h-screen'>
        <ThreadHeader title='Scott' image={null} seed='scott' />
        <div className='py-16'>
            <MessageThread>
                {MESSAGES[0].map(({ type, content }) => {
                    const text = textOf(content);
                    return type === 'sent' ? (
                        <HeadingMessage key={text}>
                            {text}
                        </HeadingMessage>
                    ) : (
                        <TextMessage key={text}>
                            {text}
                        </TextMessage>
                    );
                })}
            </MessageThread>
        </div>
    </main>
);
