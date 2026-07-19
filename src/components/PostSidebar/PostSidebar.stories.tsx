import type { ImageField } from '@prismicio/client';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { PLACEHOLDER_SIDEBAR_POSTS, type SidebarPost } from '@/lib/posts';
import { PostSidebar } from './PostSidebar';

/** A minimal Prismic-image-like object for the avatar stories (seeded photo). */
const mockImage = (seed: string): ImageField =>
    ({
        url: `https://picsum.photos/seed/${seed}/88/88`,
        alt: '',
        dimensions: { width: 88, height: 88 },
        id: seed,
        edit: { x: 0, y: 0, zoom: 1, background: 'transparent' },
        copyright: null,
    }) as unknown as ImageField;

/** Mock feed mixing cover-image avatars and monogram fallbacks. */
const MOCK_POSTS: SidebarPost[] = PLACEHOLDER_SIDEBAR_POSTS.map((post, i) =>
    i % 2 === 0 ? { ...post, image: mockImage(post.slug) } : post
);

/** Frames a story with page content behind the sidebar, and an optional theme. */
const Frame = ({
    children,
    theme,
}: {
    children: ReactNode;
    theme?: 'light' | 'dark';
}) => (
    <div
        data-theme={theme}
        className='min-h-[660px] overflow-hidden'
        style={{ background: 'var(--sidebar-bg)' }}
    >
        {/* Desktop-only filler behind the 334px rail; on mobile the sidebar is
            a full-screen overlay so there's nothing to show behind it. */}
        <div className='hidden space-y-3 p-8 pl-[360px] text-[var(--sidebar-secondary)] md:block'>
            <p>Page content sits behind the sidebar.</p>
            <p>The 334px panel overlays the left edge without reflowing it.</p>
        </div>
        {children}
    </div>
);

/**
 * The Messages-style post sidebar (design direction 1a): a 334px column with a
 * "Posts" header, a live title-search pill, and rich rows — avatar (cover image
 * or monogram) · title · date · 2-line preview · selected-row highlight.
 */
const meta = {
    title: 'Blog/PostSidebar',
    component: PostSidebar,
    parameters: { layout: 'fullscreen' },
    args: { posts: MOCK_POSTS },
    render: (args) => (
        <Frame theme='light'>
            <PostSidebar {...args} />
        </Frame>
    ),
} satisfies Meta<typeof PostSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — the full list with image + monogram avatars, dates, previews. */
export const Default: Story = {};

/** A row selected (highlighted), as on its own `/blog/<slug>` route. */
export const Selected: Story = {
    args: { activeSlug: MOCK_POSTS[1].slug },
};

/** Active title search — only titles containing “blog”. */
export const Filtered: Story = {
    args: { defaultQuery: 'blog' },
};

/** A query that matches nothing — the empty state. */
export const NoMatches: Story = {
    args: { defaultQuery: 'nothing here' },
};

/** Dark theme (design's `prefers-color-scheme: dark` / `[data-theme="dark"]`). */
export const Dark: Story = {
    render: (args) => (
        <Frame theme='dark'>
            <PostSidebar {...args} />
        </Frame>
    ),
};

/**
 * Mobile, opened — a FULL-SCREEN overlay (the iMessage Messages list, design
 * 1b), not a side drawer: the posts list covers the whole viewport; tap a post
 * to open it, or the header X to close. Rendered at a phone viewport.
 */
export const MobileFullScreen: Story = {
    args: { defaultOpen: true },
    parameters: {
        viewport: {
            defaultViewport: 'iphone',
            viewports: {
                iphone: {
                    name: 'iPhone',
                    type: 'mobile',
                    styles: { width: '390px', height: '812px' },
                },
            },
        },
    },
};
