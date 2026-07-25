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
    args: { children: 'Body content, received.' },
} satisfies Meta<typeof TextMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Grouped: Story = {
    render: () => (
        <div className='mx-auto max-w-xl'>
            <TextMessage>First line</TextMessage>
            <TextMessage grouped>
                Second line, grouped tight
            </TextMessage>
            <TextMessage grouped>
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
            <HeadingMessage>{SHORT_TEXT}</HeadingMessage>
            <TextMessage>{SHORT_TEXT}</TextMessage>
            <HeadingMessage>{MEDIUM_TEXT}</HeadingMessage>
            <TextMessage>{MEDIUM_TEXT}</TextMessage>
            <TextMessage>{LOREM}</TextMessage>
        </div>
    ),
};
