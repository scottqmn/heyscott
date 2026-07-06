import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeadingMessage } from './HeadingMessage';
import { Message } from './Message';
import { MessageThread } from './MessageThread';
import { TextMessage } from './TextMessage';

/**
 * Grouped messages. `MessageThread` computes grouping from the sequence:
 * consecutive same-side messages form a run, and every message in a run drops
 * its tail EXCEPT the last (bottom) one. Grouped bubbles also tighten their
 * spacing and ROUND the tail-side corners more where they connect within a run.
 * Nothing is set by hand — the thread derives it from the order.
 */
const meta = {
    title: 'iMessage/Grouping',
    parameters: { layout: 'padded' },
    decorators: [
        (Story) => (
            <div className='mx-auto max-w-xl'>
                <Story />
            </div>
        ),
    ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three outgoing in a row — only the last (bottom) one keeps its tail. */
export const OutgoingRun: Story = {
    render: () => (
        <MessageThread>
            <Message direction='outgoing' revealOnScroll={false}>
                First of three
            </Message>
            <Message direction='outgoing' revealOnScroll={false}>
                Middle — no tail
            </Message>
            <Message direction='outgoing' revealOnScroll={false}>
                Last — this one has the tail
            </Message>
        </MessageThread>
    ),
};

/** A couple of grouped incoming messages — tail only on the bottom. */
export const IncomingRun: Story = {
    render: () => (
        <MessageThread>
            <Message direction='incoming' revealOnScroll={false}>
                First received
            </Message>
            <Message direction='incoming' revealOnScroll={false}>
                Second received — tail here
            </Message>
        </MessageThread>
    ),
};

/**
 * A mixed conversation: the grouping flips each time the sender changes. Runs
 * keep their tail only on the last message; the lone message at the end is a
 * standalone and keeps its tail.
 */
export const MixedConversation: Story = {
    render: () => (
        <MessageThread>
            <HeadingMessage revealOnScroll={false}>Hey Scott</HeadingMessage>
            <HeadingMessage revealOnScroll={false}>
                Two sent in a row — tail on this one
            </HeadingMessage>
            <TextMessage revealOnScroll={false}>One reply</TextMessage>
            <TextMessage revealOnScroll={false}>…and another</TextMessage>
            <TextMessage revealOnScroll={false}>
                Three received — tail on the last
            </TextMessage>
            <HeadingMessage revealOnScroll={false}>
                Back to sent — standalone, keeps its tail
            </HeadingMessage>
        </MessageThread>
    ),
};
