import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { HeadingMessage } from './HeadingMessage';
import { MessageThread } from './MessageThread';
import { RevealQueueProvider } from './revealQueue';
import { TextMessage } from './TextMessage';

/**
 * The path-change-driven **reveal queue**. A post's messages load into an
 * ordered queue keyed by its path/uid; they reveal progressively and in order as
 * you scroll down. Switching "posts" (simulating navigation) CLEARS the queue
 * and REFILLS it with the new post — a half-scrolled previous post never carries
 * over. Reveal timing comes from {@link RevealQueueProvider}; the messages are
 * the ordinary `HeadingMessage` / `TextMessage` bubbles (each given a `queueId`).
 */
const meta = {
    title: 'iMessage/RevealQueue',
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Post-scoped reveal queue: messages reveal in order on scroll and clear+refill on navigation. Respects prefers-reduced-motion.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Post = { key: string; title: string; subtitle: string; body: string[] };

const POSTS: Post[] = [
    {
        key: 'first-post',
        title: 'My first post',
        subtitle: 'On building things slowly',
        body: [
            'Scroll down and each reply fades in as it reaches you. The queue reveals them one at a time, in order, as they enter the viewport — never all at once.',
            'This is the second reply. Because the messages are tall enough to overflow the screen, you have to keep scrolling to bring the next one into view before it reveals.',
            'Third reply. The head of the queue advances only when the current message is on screen, so the reveal always tracks how far you have scrolled down the post.',
            'Fourth reply. If you scroll back up, the messages you already revealed stay revealed — the reveal is one-way, exactly like the existing scroll reveal.',
            'Fifth reply. Keep going; there are a couple more replies waiting further down the conversation.',
            'Sixth reply. Almost at the end of the first post now.',
            'Seventh reply. Just one more after this one.',
            'The last reply of the first post 🎉 Now switch to the second post using the nav above — even mid-scroll — and watch the queue clear and refill.',
        ],
    },
    {
        key: 'second-post',
        title: 'A second post',
        subtitle: 'Now switch mid-scroll',
        body: [
            'Navigating here cleared the first post’s queue. These replies are fresh — refilled from the second post’s data, with no leftover reveals carried over from before.',
            'Second reply of the second post. The head pointer reset to zero on navigation, so these reveal from the top again as you scroll down.',
            'Third reply. The messages you half-revealed in the first post do not bleed into this one — the queue always reflects the post you are currently viewing.',
            'Fourth reply. A different post, a different queue.',
            'Fifth and final reply of post two 🚀 Scroll back up to the first post to see its queue refill all over again.',
        ],
    },
];

const bodyId = (i: number) => `body-${i}`;

const messageIdsFor = (post: Post) => [
    'title',
    'subtitle',
    ...post.body.map((_, i) => bodyId(i)),
];

/**
 * Two posts with a nav bar. Click a post to "navigate": scroll jumps to top and
 * the queue clears + refills. Scroll down to reveal that post's replies in order.
 */
export const Demo: Story = {
    render: function RevealQueueDemo() {
        const [postKey, setPostKey] = useState(POSTS[0].key);
        const post = POSTS.find((p) => p.key === postKey) ?? POSTS[0];

        const navigate = (key: string) => {
            setPostKey(key);
            // Mimic a route change: reset scroll to the top of the new post.
            window.scrollTo({ top: 0, behavior: 'auto' });
        };

        return (
            <div>
                <nav className='sticky top-0 z-10 flex gap-2 border-b border-[--color-border] bg-[--color-background]/90 p-3 backdrop-blur'>
                    {POSTS.map((p) => (
                        <button
                            key={p.key}
                            type='button'
                            onClick={() => navigate(p.key)}
                            aria-pressed={p.key === postKey}
                            className={
                                p.key === postKey
                                    ? 'rounded-full bg-[--color-imessage-sent] px-4 py-1 text-sm text-white'
                                    : 'rounded-full border border-[--color-border] px-4 py-1 text-sm'
                            }
                        >
                            {p.title}
                        </button>
                    ))}
                </nav>
                <RevealQueueProvider
                    postKey={post.key}
                    messageIds={messageIdsFor(post)}
                >
                    <div className='pt-[70vh] pb-[85vh]'>
                        <MessageThread>
                            <HeadingMessage queueId='title'>
                                {post.title}
                            </HeadingMessage>
                            <HeadingMessage queueId='subtitle'>
                                {post.subtitle}
                            </HeadingMessage>
                            {post.body.map((line, i) => (
                                <TextMessage key={bodyId(i)} queueId={bodyId(i)}>
                                    {line}
                                </TextMessage>
                            ))}
                        </MessageThread>
                    </div>
                </RevealQueueProvider>
            </div>
        );
    },
};
