import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_POSTS } from '@/lib/posts';
import { PostSidebar } from './PostSidebar';

/**
 * The blog-post index as a left sidebar — the Messages conversation-list column
 * reused as recirculation nav: a title-search field over the post-link bubbles.
 * Persistent on desktop, a collapsible drawer on mobile. Faint filler sits
 * behind it so the translucent blur/overlay reads.
 */
const meta = {
    title: 'Blog/PostSidebar',
    component: PostSidebar,
    parameters: { layout: 'fullscreen' },
    args: { posts: PLACEHOLDER_POSTS },
    decorators: [
        (Story) => (
            <div className='min-h-[560px]'>
                {/* Page content behind the floating sidebar. */}
                <div className='space-y-3 p-8 pl-80 text-muted-foreground'>
                    <p>Page content sits behind the translucent sidebar.</p>
                    <p>The panel overlays the left edge without reflowing it.</p>
                </div>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PostSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No filter — the full post list. */
export const Default: Story = {};

/** With an active search filter — only titles containing “blog”. */
export const Filtered: Story = {
    args: { defaultQuery: 'blog' },
};

/** A query that matches nothing — the empty state. */
export const NoMatches: Story = {
    args: { defaultQuery: 'nothing here' },
};

/** The mobile drawer, opened (narrow the viewport to see the drawer/scrim). */
export const DrawerOpen: Story = {
    args: { defaultOpen: true },
};
