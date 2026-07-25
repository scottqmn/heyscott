import {
    HeadingMessage,
    MessageThread,
    TextMessage,
} from '@/components/imessage';
import { MESSAGES } from '@/components/Messages/constants';

/** Strip the inline HTML tags in the splash copy (e.g. the sent `<h1>`). */
const textOf = (content: string) => content.replace(/<[^>]*>/g, '');

/**
 * The homepage as the "Scott" iMessage conversation — the SAME copy as the
 * original splash (`Messages/constants.ts`, Scott's own words), rendered through
 * the shared message thread so it reads exactly like a blog post. The sent line
 * is OUTGOING (blue — the visitor's "Hey Scott", kept as the page `<h1>`);
 * Scott's replies are INCOMING (grey).
 *
 * `revealOnScroll={false}` renders every bubble at FULL opacity straight from
 * the server HTML — preserving the splash's "readable without client JS" intent
 * (no washed-out scroll reveal). The dynamic bubble still shows its text before
 * JS runs (a rounded-rect stands in for the tail until it's measured).
 */
export const HomeConversation = () => (
    <main className='min-h-screen py-16'>
        <MessageThread>
            {MESSAGES[0].map(({ type, content }) => {
                const text = textOf(content);
                return type === 'sent' ? (
                    <HeadingMessage key={text} revealOnScroll={false}>
                        <h1>{text}</h1>
                    </HeadingMessage>
                ) : (
                    <TextMessage key={text} revealOnScroll={false}>
                        {text}
                    </TextMessage>
                );
            })}
        </MessageThread>
    </main>
);
