import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeadingMessage } from './HeadingMessage';
import { TextMessage } from './TextMessage';

/**
 * Headings render as INCOMING bubbles (grey, left-aligned) — the section
 * titles arriving from the other side of the conversation. They use the same
 * body text style as {@link TextMessage}; only the incoming treatment differs.
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
    args: { children: 'A heading arrives', focusOnScroll: false },
} satisfies Meta<typeof HeadingMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Heading (incoming) and body (outgoing) share one text style. */
export const NextToBody: Story = {
    render: () => (
        <div className='mx-auto max-w-xl'>
            <HeadingMessage focusOnScroll={false}>
                A heading arrives
            </HeadingMessage>
            <TextMessage focusOnScroll={false}>
                And the body reply — same font size and weight.
            </TextMessage>
        </div>
    ),
};
