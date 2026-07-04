import { asText } from '@prismicio/client';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChatBubble } from '@/components/ChatBubble';
import { getAllPosts } from '@/lib/prismic/queries';
import { formatPostDate } from '@/lib/date';

export const metadata: Metadata = {
    title: 'Blog — Hey Scott!',
    description: 'Notes and posts from Scott.',
};

export default async function BlogIndex() {
    const posts = await getAllPosts();

    return (
        <main className='mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10'>
            <header className='mb-6 text-center'>
                <Link
                    href='/'
                    className='text-sm text-muted-foreground hover:text-foreground'
                >
                    ‹ hey scott
                </Link>
                <h1 className='mt-2 text-3xl font-medium'>Blog</h1>
                <p className='text-base text-muted-foreground'>
                    {posts.length > 0
                        ? `${posts.length} message${posts.length === 1 ? '' : 's'}`
                        : 'the conversation starts here'}
                </p>
            </header>

            <div className='flex flex-1 flex-col justify-end'>
                {posts.length === 0 ? (
                    <ChatBubble variant='received'>
                        No posts yet — check back soon. 👋
                    </ChatBubble>
                ) : (
                    posts.map((post, index) => {
                        const prev = posts[index - 1];
                        const grouped = Boolean(prev);
                        return (
                            <ChatBubble
                                key={post.uid}
                                variant='received'
                                grouped={grouped}
                            >
                                <Link
                                    href={`/blog/${post.uid}`}
                                    className='block'
                                >
                                    <span className='block font-medium'>
                                        {asText(post.data.title) || 'Untitled'}
                                    </span>
                                    {asText(post.data.excerpt) && (
                                        <span className='mt-1 block text-[0.9em] opacity-80'>
                                            {asText(post.data.excerpt)}
                                        </span>
                                    )}
                                    {post.data.date && (
                                        <span className='mt-1 block text-[0.75em] opacity-60'>
                                            {formatPostDate(post.data.date)}
                                        </span>
                                    )}
                                </Link>
                            </ChatBubble>
                        );
                    })
                )}
            </div>
        </main>
    );
}
