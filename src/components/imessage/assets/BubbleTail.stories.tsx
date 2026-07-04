import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BubbleTail } from './BubbleTail';

/**
 * A small bubble showing the tail chrome — the same silhouette as real
 * bubbles. Authored for the outgoing (right) side and mirrored for incoming;
 * fill follows `currentColor`, so a text-color class tints it. Scaled up here.
 */
const meta = {
    title: 'iMessage/Chrome/BubbleTail',
    component: BubbleTail,
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className='[&_svg]:h-auto [&_svg]:w-48'>
                <Story />
            </div>
        ),
    ],
    args: { direction: 'outgoing' },
    argTypes: {
        direction: {
            control: { type: 'radio' },
            options: ['outgoing', 'incoming'],
        },
    },
} satisfies Meta<typeof BubbleTail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outgoing: Story = {
    args: { direction: 'outgoing', className: 'text-imessage-sent' },
};

export const Incoming: Story = {
    args: { direction: 'incoming', className: 'text-imessage-received' },
};
