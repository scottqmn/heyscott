import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostListComposer } from './PostListComposer';

/**
 * A bottom-anchored iMessage compose bar: a single full-width rounded pill text
 * input that floats over the page. It is **decorative** — focusable and
 * typeable, but submitting does nothing (post links live in the PostSidebar
 * now). Kept for the iMessage flavor; behavior comes later.
 */
const meta = {
    title: 'Blog/PostListComposer',
    component: PostListComposer,
    parameters: { layout: 'fullscreen' },
    decorators: [
        (Story) => (
            <div className='min-h-[560px]'>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PostListComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The resting state — the floating decorative compose pill pinned to the bottom. */
export const ComposeBar: Story = {};
