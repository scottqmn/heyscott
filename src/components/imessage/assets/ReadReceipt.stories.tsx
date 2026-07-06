import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ReadReceipt } from './ReadReceipt';

/**
 * The status line under the last outgoing message: a single SVG check for
 * "Delivered", a double check (bolded label) for "Read".
 */
const meta = {
    title: 'iMessage/Chrome/ReadReceipt',
    component: ReadReceipt,
    parameters: { layout: 'centered' },
    args: { status: 'delivered' },
    argTypes: {
        status: { control: { type: 'radio' }, options: ['delivered', 'read'] },
    },
} satisfies Meta<typeof ReadReceipt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Delivered: Story = { args: { status: 'delivered' } };
export const Read: Story = { args: { status: 'read' } };
