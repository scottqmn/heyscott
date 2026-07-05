import { PrismicPreview } from '@prismicio/next';
import type { Metadata } from 'next';
import {
    ConversationProvider,
    ConversationView,
} from '@/components/conversation';
import { PostListComposer } from '@/components/PostListComposer';
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className='min-h-screen bg-background font-sans text-xl font-light text-foreground'>
                {/*
                 * The whole site is one persistent iMessage conversation. The
                 * provider + thread live here (above the route) so they survive
                 * client navigation; each page appends its segment. Pages
                 * themselves render nothing — their content is derived from the
                 * URL in `ConversationView`.
                 */}
                <ConversationProvider>
                    <ConversationView />
                    {children}
                    <PostListComposer />
                </ConversationProvider>
                <PrismicPreview repositoryName={repositoryName} />
            </body>
        </html>
    );
}
