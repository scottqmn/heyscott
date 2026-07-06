import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_POSTS } from '@/lib/posts';
import { PostLinkList } from './PostLinkList';

/**
 * Post-link bubbles (the darker translucent-grey typing tone, outgoing side).
 * They GROUP — tight spacing and rounded connecting corners — but are ALWAYS
 * tail-less, including the bottom item, so they read as a list/menu of links
 * rather than sent messages. Outer corners stay round; only the corners where
 * bubbles connect are rounded in.
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

/** A grouped stack — no tail on any bubble, not even the last. */
export const Grouped: Story = {
    args: { posts: PLACEHOLDER_POSTS },
};

/** A single link — tail-less, fully rounded (nothing to group with). */
export const Single: Story = {
    args: { posts: PLACEHOLDER_POSTS.slice(0, 1) },
};
