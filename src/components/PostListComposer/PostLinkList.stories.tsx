import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_POSTS } from '@/lib/posts';
import { PostLinkList } from './PostLinkList';

/**
 * Post-link bubbles (the darkened translucent-grey typing tone, outgoing side).
 * Each is its OWN fully rounded, tail-less bubble — no connecting corners
 * between stacked links — and the whole bubble is the click target, so they read
 * as a distinct menu of links floating over the page rather than sent messages.
 */
const meta = {
    title: 'Blog/PostLinkList',
    component: PostLinkList,
    parameters: { layout: 'padded' },
    decorators: [
        (Story) => (
            <div className='mx-auto max-w-xl'>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PostLinkList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A stack of links — each its own fully rounded, tail-less bubble. */
export const Stack: Story = {
    args: { posts: PLACEHOLDER_POSTS },
};

/** A single link — tail-less, fully rounded. */
export const Single: Story = {
    args: { posts: PLACEHOLDER_POSTS.slice(0, 1) },
};
