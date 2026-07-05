import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostListComposer } from './PostListComposer';

/**
 * A bottom-anchored iMessage compose bar (rounded pill "input" + circular send
 * button). Tapping it pops up the blog-post list — each post's heading rendered
 * as a grey outgoing-positioned bubble that links to the post. Driven by the
 * placeholder post source while Prismic is unwired.
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

/** The resting state — just the compose bar pinned to the bottom. */
export const ComposeBar: Story = {};

/** Tapped open — the post-link bubbles rise above the compose bar. */
export const PostList: Story = {
    args: { defaultOpen: true },
};
