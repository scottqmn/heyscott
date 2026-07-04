import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BubbleTail } from './BubbleTail';

/**
 * The SVG bubble tail. Authored for the outgoing (right) side and mirrored for
 * incoming; fill follows `currentColor`, so a text-color class tints it to the
 * bubble color. Scaled up here for visibility.
 */
const meta = {
    title: 'iMessage/Chrome/BubbleTail',
    component: BubbleTail,
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className='[&_svg]:h-16 [&_svg]:w-16'>
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
