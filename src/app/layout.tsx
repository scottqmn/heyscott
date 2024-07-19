import clsx from 'clsx';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
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
            <body className='min-h-screen bg-[var(--background)] font-sans text-xl font-light text-[var(--primary)]'>
                {children}
            </body>
        </html>
    );
}
