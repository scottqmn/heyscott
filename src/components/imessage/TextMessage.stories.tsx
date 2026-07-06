import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeadingMessage } from './HeadingMessage';
import { LOREM, MEDIUM_TEXT, SHORT_TEXT } from './mocks';
import { TextMessage } from './TextMessage';

/**
 * Body text renders as INCOMING bubbles (grey, left-aligned) — the
 * conversation's body content arriving.
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
    args: { children: 'Body content, received.', revealOnScroll: false },
} satisfies Meta<typeof TextMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Grouped: Story = {
    render: () => (
        <div className='mx-auto max-w-xl'>
            <TextMessage revealOnScroll={false}>First line</TextMessage>
            <TextMessage revealOnScroll={false} grouped>
                Second line, grouped tight
            </TextMessage>
            <TextMessage revealOnScroll={false} grouped>
                Third line, still grouped
            </TextMessage>
        </div>
    ),
};

/**
 * A wall of Lorem ipsum — shows the bubble growing and the text wrapping as the
 * bubble gets tall.
 */
export const LongLorem: Story = {
    args: { children: LOREM },
};

/**
 * Min-width hug across content lengths: each bubble shrinks to the smallest
 * width that fits its wrapped text — short bubbles are tiny, medium wraps to a
 * couple of tight lines, long fills up to the max and still hugs. Headings
 * (outgoing) shown next to body (incoming) so both sides are visible.
 */
export const HugsAcrossLengths: Story = {
    render: () => (
        <div className='mx-auto max-w-xl'>
            <HeadingMessage revealOnScroll={false}>{SHORT_TEXT}</HeadingMessage>
            <TextMessage revealOnScroll={false}>{SHORT_TEXT}</TextMessage>
            <HeadingMessage revealOnScroll={false}>{MEDIUM_TEXT}</HeadingMessage>
            <TextMessage revealOnScroll={false}>{MEDIUM_TEXT}</TextMessage>
            <TextMessage revealOnScroll={false}>{LOREM}</TextMessage>
        </div>
    ),
};
