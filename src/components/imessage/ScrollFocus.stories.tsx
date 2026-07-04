import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UNFOCUSED_OPACITY } from './constants';
import { HeadingMessage } from './HeadingMessage';
import { MessageThread } from './MessageThread';
import { TextMessage } from './TextMessage';

/**
 * The scroll focus/unfocus effect. As you scroll the thread, messages inside
 * the viewport's center focus band stay at full opacity; those outside dim to
 * `UNFOCUSED_OPACITY` (0.6). Scroll the preview to see it — the message near
 * the vertical center is the focused one.
 */
const meta = {
    title: 'iMessage/ScrollFocus',
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: `Unfocused messages dim to ${UNFOCUSED_OPACITY}; the in-view message stays at full opacity. Scroll to see the effect.`,
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const LINES = [
    'Scroll down slowly…',
    'Watch the messages off-center fade',
    'The one near the middle stays sharp',
    'This is the focus band at work',
    'Powered by IntersectionObserver',
    'Opacity eases between 1 and 0.6',
    'Keep going…',
    'Almost there',
    'The effect is per-message',
    'Each observes its own position',
    'No scroll listeners, no jank',
    'You reached the end 🎉',
];

export const Demo: Story = {
    render: () => (
        <div className='py-[45vh]'>
            <MessageThread>
                <HeadingMessage>Scroll focus demo</HeadingMessage>
                {LINES.map((line, i) => (
                    <TextMessage key={line} grouped={i > 0}>
                        {line}
                    </TextMessage>
                ))}
            </MessageThread>
        </div>
    ),
};
