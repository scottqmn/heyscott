import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LOREM } from '@/components/imessage/mocks';
import { ChatBubble } from './ChatBubble';

/**
 * The base bubble primitive the whole iMessage library is built on: rounded
 * bubble + CSS pseudo-element tail, colored from the `--color-imessage-*`
 * theme tokens. `sent` = blue/right, `received` = grey/left.
 */
const meta = {
    title: 'Primitives/ChatBubble',
    component: ChatBubble,
    parameters: { layout: 'padded' },
    decorators: [
        (Story) => (
            <div className='mx-auto max-w-xl'>
                <Story />
            </div>
        ),
    ],
    args: { children: 'Hey Scott!', variant: 'received' },
    argTypes: {
        variant: { control: { type: 'radio' }, options: ['received', 'sent'] },
    },
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Received: Story = {
    args: { variant: 'received', children: "Hey! I'm a little busy right now." },
};

export const Sent: Story = {
    args: { variant: 'sent', children: 'No worries — talk soon?' },
};

export const Conversation: Story = {
    render: () => (
        <div className='mx-auto max-w-xl'>
            <ChatBubble variant='sent'>Hey Scott</ChatBubble>
            <ChatBubble variant='received'>
                Hey! I&apos;m a little busy at the moment.
            </ChatBubble>
            <ChatBubble variant='received' grouped>
                Talk soon?
            </ChatBubble>
        </div>
    ),
};

/**
 * Long content on both sides — shows the dynamic SVG bubble body + tail
 * growing and wrapping as each bubble gets tall.
 */
export const LongContent: Story = {
    render: () => (
        <div className='mx-auto max-w-xl'>
            <ChatBubble variant='received'>{LOREM}</ChatBubble>
            <ChatBubble variant='sent'>{LOREM}</ChatBubble>
        </div>
    ),
};
