import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeadingMessage } from './HeadingMessage';

/**
 * Headings render as INCOMING bubbles (grey, left-aligned) — the section
 * titles arriving from the other side of the conversation.
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
    args: { children: 'A heading arrives', level: 1, focusOnScroll: false },
    argTypes: {
        level: { control: { type: 'select' }, options: [1, 2, 3, 4, 5, 6] },
    },
} satisfies Meta<typeof HeadingMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Level1: Story = { args: { level: 1, children: 'A heading arrives' } };
export const Level2: Story = {
    args: { level: 2, children: 'A subsection heading' },
};
export const Level3: Story = {
    args: { level: 3, children: 'A smaller heading' },
};

export const AllLevels: Story = {
    render: () => (
        <div className='mx-auto max-w-xl'>
            {([1, 2, 3, 4, 5, 6] as const).map((level) => (
                <HeadingMessage key={level} level={level} focusOnScroll={false}>
                    {`Heading level ${level}`}
                </HeadingMessage>
            ))}
        </div>
    ),
};
