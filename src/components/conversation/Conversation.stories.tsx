import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { PLACEHOLDER_POSTS } from '@/lib/posts';
import { ConversationThread } from './ConversationView';
import type { ConversationSegment } from './store';

/**
 * The whole site is ONE persistent iMessage conversation. Landing on a page
 * opens with an outgoing "hey Scott"; the page's content answers back as
 * incoming messages; a blog post adds recirculation links. Navigating APPENDS
 * the next page's messages to the same thread instead of resetting it.
 *
 * In the real app the segment list is global state in the root layout, appended
 * on `usePathname()` change. Here it's a controlled list with an "append" button
 * so the growing-thread behavior is visible in isolation.
 */
const meta = {
    title: 'Conversation/GlobalThread',
    parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Landing on the homepage: "hey Scott" → Scott's reply. */
export const Home: Story = {
    render: () => (
        <ConversationThread segments={[{ id: 'a', pathname: '/' }]} />
    ),
};

/** A blog post: "hey Scott" → the post body → recirculation links. */
export const BlogPost: Story = {
    render: () => (
        <ConversationThread
            segments={[{ id: 'a', pathname: '/blog/shipping-the-blog' }]}
        />
    ),
};

/**
 * The append flow: start at home, then "navigate" — each click appends the next
 * page's messages below, growing the one thread (home → post → another post).
 */
export const AppendsOnNavigate: Story = {
    render: function AppendDemo() {
        const path = ['/', '/blog/shipping-the-blog', '/blog/imessage-bubbles'];
        const [n, setN] = useState(1);
        const segments: ConversationSegment[] = path
            .slice(0, n)
            .map((pathname, i) => ({ id: `${i}`, pathname }));

        return (
            <div>
                <ConversationThread segments={segments} />
                {n < path.length && (
                    <div className='pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-6'>
                        <button
                            type='button'
                            onClick={() => setN((v) => v + 1)}
                            className='pointer-events-auto rounded-full bg-imessage-sent px-5 py-2 text-base text-imessage-sent-foreground shadow-lg'
                        >
                            Navigate to {PLACEHOLDER_POSTS.find(
                                (p) => `/blog/${p.slug}` === path[n]
                            )?.title ?? path[n]}{' '}
                            →
                        </button>
                    </div>
                )}
            </div>
        );
    },
};
