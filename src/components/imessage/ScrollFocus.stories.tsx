import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HIDDEN_OPACITY } from './constants';
import { HeadingMessage } from './HeadingMessage';
import { MessageThread } from './MessageThread';
import { TextMessage } from './TextMessage';

/**
 * The one-way scroll reveal. Messages start faded (`HIDDEN_OPACITY` ≈ 0.25) and
 * fade IN as they scroll into view — then STAY at full opacity (they don't fade
 * back out when scrolled past). Scroll the preview down to reveal them; scroll
 * back up and they remain revealed.
 */
const meta = {
    title: 'iMessage/ScrollReveal',
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: `Messages start at ${HIDDEN_OPACITY} opacity and fade to full opacity the first time they enter view, then stay revealed.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const LINES = [
    'Scroll down slowly…',
    'Each message starts faded',
    'and fades in as it enters view',
    'This one just revealed',
    'Powered by IntersectionObserver',
    'Opacity eases 0.25 → 1',
    'Keep going…',
    'Almost there',
    'Once revealed, it stays revealed',
    'Scroll back up to check',
    'They never fade back out',
    'You reached the end 🎉',
];

export const Demo: Story = {
    render: () => (
        <div className='py-[60vh]'>
            <MessageThread>
                <HeadingMessage>Scroll reveal demo</HeadingMessage>
                {LINES.map((line, i) => (
                    <TextMessage key={line} grouped={i > 0}>
                        {line}
                    </TextMessage>
                ))}
            </MessageThread>
        </div>
    ),
};
