import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LOREM } from './mocks';
import { TextMessage } from './TextMessage';

/**
 * Body text renders as OUTGOING bubbles (blue, right-aligned) — the replies
 * being sent, optionally with a delivered/read receipt.
 */
const meta = {
    title: 'iMessage/TextMessage',
    component: TextMessage,
    parameters: { layout: 'padded' },
    decorators: [
        (Story) => (
            <div className='mx-auto max-w-xl'>
                <Story />
            </div>
        ),
    ],
    args: { children: 'A reply, sent.', focusOnScroll: false },
} satisfies Meta<typeof TextMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Delivered: Story = {
    args: { children: 'You around later?', receipt: 'delivered' },
};

export const Read: Story = {
    args: { children: 'Saw your message 👀', receipt: 'read' },
};

export const Grouped: Story = {
    render: () => (
        <div className='mx-auto max-w-xl'>
            <TextMessage focusOnScroll={false}>First line</TextMessage>
            <TextMessage focusOnScroll={false} grouped>
                Second line, grouped tight
            </TextMessage>
            <TextMessage focusOnScroll={false} grouped receipt='read'>
                Third line, with a read receipt
            </TextMessage>
        </div>
    ),
};

/**
 * A wall of Lorem ipsum — shows the bubble body + tail SVG growing and the
 * text wrapping as the bubble gets tall.
 */
export const LongLorem: Story = {
    args: { children: LOREM, receipt: 'read' },
};
