import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeadingMessage } from './HeadingMessage';
import { TextMessage } from './TextMessage';

/**
 * Headings render as OUTGOING bubbles (blue, right-aligned) — the section
 * titles being sent. They use the same body text style as {@link TextMessage};
 * only the outgoing treatment differs.
 */
const meta = {
    title: 'iMessage/HeadingMessage',
    component: HeadingMessage,
    parameters: { layout: 'padded' },
    decorators: [
        (Story) => (
            <div className='mx-auto max-w-xl'>
                <Story />
            </div>
        ),
    ],
    args: { children: 'A heading is sent', revealOnScroll: false },
} satisfies Meta<typeof HeadingMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Outgoing headings can carry a delivered/read receipt. */
export const WithReceipt: Story = {
    args: { children: 'A heading is sent', receipt: 'read' },
};

/** Heading (outgoing) and body (incoming) share one text style. */
export const NextToBody: Story = {
    render: () => (
        <div className='mx-auto max-w-xl'>
            <HeadingMessage revealOnScroll={false}>
                A heading is sent
            </HeadingMessage>
            <TextMessage revealOnScroll={false}>
                And the body reply — same font size and weight.
            </TextMessage>
        </div>
    ),
};
