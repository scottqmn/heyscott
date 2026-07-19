import { PrismicPreview } from '@prismicio/next';
import { asText } from '@prismicio/client';
import type { Metadata } from 'next';
import { PostListComposer } from '@/components/PostListComposer';
import { PostSidebar } from '@/components/PostSidebar';
import { PLACEHOLDER_POSTS, type BlogPostLink } from '@/lib/posts';
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
    // Feed the site-wide recirculation sidebar. `getAllPosts` swallows fetch
    // errors and returns [] when Prismic isn't wired, so we fall back to the
    // placeholder posts and the sidebar still lists something everywhere.
    const posts = await getAllPosts();
    const links: BlogPostLink[] = posts.map((post) => ({
        title: asText(post.data.title),
        slug: post.uid,
    }));
    const postLinks = links.length > 0 ? links : PLACEHOLDER_POSTS;

    return (
        <html lang='en'>
            <body className='min-h-screen bg-background font-sans text-xl font-light text-foreground'>
                {children}
                {/* Recirculation post index: a sidebar (persistent desktop /
                    drawer mobile) that floats over every route. */}
                <PostSidebar posts={postLinks} />
                {/* Decorative iMessage compose pill: floats over every route. */}
                <PostListComposer />
                <PrismicPreview repositoryName={repositoryName} />
            </body>
        </html>
    );
}
