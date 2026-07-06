import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChatBubble } from '@/components/ChatBubble';
import { RevealOnView } from './RevealOnView';

/**
 * `RevealOnView` is an IntersectionObserver-based reveal wrapper: it fades +
 * slides/scales its children into view the first time they enter the viewport
 * (matching the splash's `splashIn` feel), then stays revealed. Scroll the
 * preview down to reveal each bubble; scroll back up and they remain revealed.
 * It respects `prefers-reduced-motion` (shown immediately, no motion).
 */
const meta = {
    title: 'iMessage/RevealOnView',
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'IntersectionObserver reveal wrapper — fades + slides bubbles in as they scroll into view. Reveals once and stays revealed; respects reduced-motion.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const LINES: { text: string; variant: 'sent' | 'received' }[] = [
    { text: 'Scroll down slowly…', variant: 'received' },
    { text: 'Each bubble starts faded + nudged down', variant: 'received' },
    { text: 'Then eases into place as it enters view', variant: 'sent' },
    { text: 'This one just revealed', variant: 'received' },
    { text: 'Powered by IntersectionObserver', variant: 'sent' },
    { text: 'Fade + slight slide/scale up', variant: 'received' },
    { text: 'Keep going…', variant: 'received' },
    { text: 'Almost there', variant: 'sent' },
    { text: 'Once revealed, it stays revealed', variant: 'received' },
    { text: 'Scroll back up to check', variant: 'received' },
    { text: 'They never fade back out', variant: 'sent' },
    { text: 'You reached the end 🎉', variant: 'received' },
];

/**
 * A scrollable column of bubbles, each wrapped in `RevealOnView`. They start
 * hidden and animate in on scroll, revealing once (the default).
 */
export const Demo: Story = {
    render: () => (
        <div className='mx-auto max-w-xl px-4 py-[60vh]'>
            {LINES.map(({ text, variant }) => (
                <RevealOnView key={text}>
                    <ChatBubble variant={variant}>{text}</ChatBubble>
                </RevealOnView>
            ))}
        </div>
    ),
};

/**
 * With `once={false}` each bubble re-hides when it leaves the viewport and
 * re-reveals when it re-enters — scroll a bubble out and back to see it replay.
 */
export const Repeating: Story = {
    render: () => (
        <div className='mx-auto max-w-xl px-4 py-[60vh]'>
            {LINES.map(({ text, variant }) => (
                <RevealOnView key={text} once={false}>
                    <ChatBubble variant={variant}>{text}</ChatBubble>
                </RevealOnView>
            ))}
        </div>
    ),
};
