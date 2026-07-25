import { PrismicPreview } from '@prismicio/next';
import type { Metadata } from 'next';
import { PostListComposer } from '@/components/PostListComposer';
import { PostSidebar, PostSidebarProvider } from '@/components/PostSidebar';
import {
    blogPostToSidebar,
    homeSidebarPost,
    PLACEHOLDER_SIDEBAR_POSTS,
} from '@/lib/posts';
import { getAllPosts } from '@/lib/prismic/queries';
import { repositoryName } from '@/prismicio';
import './globals.css';

export const metadata: Metadata = {
    metadataBase: new URL('https://www.heyscott.com'),
    title: 'Hey Scott!',
    description: 'a developer based in Los Angeles, CA',
    openGraph: {
        type: 'website',
        url: 'https://www.heyscott.com',
        title: 'Hey Scott!',
        description: 'a developer based in Los Angeles, CA',
        siteName: 'Hey Scott',
        images: [
            {
                url: 'https://example.com/og.png',
            },
        ],
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Feed the site-wide recirculation sidebar with rich rows (title, cover
    // image, date, body preview). `getAllPosts` swallows fetch errors and
    // returns [] when Prismic isn't wired, so we fall back to the placeholder
    // posts and the sidebar still lists something everywhere.
    const posts = await getAllPosts();
    const sidebarPosts = posts.map(blogPostToSidebar);
    const blogRows =
        sidebarPosts.length > 0 ? sidebarPosts : PLACEHOLDER_SIDEBAR_POSTS;
    // Pin the homepage ("Scott" conversation) as the FIRST row, above the blog
    // posts. Stamp today's date here (server) so it's a stable prop for the
    // client sidebar (no hydration mismatch) — kept separate from the
    // Prismic/placeholder rows so it never collides with a real post.
    const postsForSidebar = [
        homeSidebarPost(new Date().toISOString()),
        ...blogRows,
    ];

    return (
        <html lang='en'>
            <body className='min-h-screen bg-background font-sans text-xl font-light text-foreground'>
                {/* Shares the mobile Posts-overlay open-state so the blog-post
                    "‹ Posts" header (in `{children}`) can open the sidebar. */}
                <PostSidebarProvider>
                    {/* Offset the main panel by the 334px rail on md+ so it
                        fills the space BESIDE the fixed sidebar (responsive) —
                        not centered in the full viewport where its left hides
                        behind the rail. Full-width on mobile (rail is off-canvas). */}
                    <div className='md:pl-[334px]'>{children}</div>
                    {/* Recirculation post index: a sidebar (persistent desktop /
                        full-screen overlay mobile) that floats over every route. */}
                    <PostSidebar posts={postsForSidebar} />
                    {/* Decorative iMessage compose pill: floats over every route. */}
                    <PostListComposer />
                </PostSidebarProvider>
                <PrismicPreview repositoryName={repositoryName} />
            </body>
        </html>
    );
}
