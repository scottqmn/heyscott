import { asImageSrc, asText, isFilled } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText, SliceZone } from '@prismicio/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { richTextComponents } from '@/lib/prismic/components';
import { getAllPosts, getPost } from '@/lib/prismic/queries';
import { formatPostDate } from '@/lib/date';
import { components } from '@/slices';

type Params = { uid: string };

export async function generateStaticParams(): Promise<Params[]> {
    const posts = await getAllPosts();
    return posts
        .filter((post) => Boolean(post.uid))
        .map((post) => ({ uid: post.uid! }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { uid } = await params;
    const post = await getPost(uid);
    if (!post) return {};

    return {
        title: post.data.meta_title || `${asText(post.data.title)} — Hey Scott!`,
        description:
            post.data.meta_description || asText(post.data.excerpt) || undefined,
        openGraph: {
            title:
                post.data.meta_title || asText(post.data.title) || 'Hey Scott!',
            images: isFilled.image(post.data.meta_image)
                ? [{ url: asImageSrc(post.data.meta_image)! }]
                : isFilled.image(post.data.image)
                  ? [{ url: asImageSrc(post.data.image)! }]
                  : undefined,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { uid } = await params;
    const post = await getPost(uid);

    if (!post) notFound();

    const { title, excerpt, date, image, body } = post.data;

    return (
        <main className='py-10'>
            <article>
                <header className='mx-auto max-w-2xl px-5'>
                    <Link
                        href='/blog'
                        className='text-sm text-muted-foreground hover:text-foreground'
                    >
                        ‹ blog
                    </Link>

                    <div className='mt-4 text-3xl font-medium md:text-4xl'>
                        <PrismicRichText field={title} />
                    </div>

                    {isFilled.richText(excerpt) && (
                        <div className='mt-2 text-lg text-muted-foreground'>
                            <PrismicRichText field={excerpt} />
                        </div>
                    )}

                    {date && (
                        <p className='mt-2 text-sm text-muted-foreground'>
                            {formatPostDate(date)}
                        </p>
                    )}

                    {isFilled.image(image) && (
                        <div className='mt-6 overflow-hidden rounded-[18px]'>
                            <PrismicNextImage field={image} />
                        </div>
                    )}
                </header>

                <div className='mt-6 space-y-2'>
                    <SliceZone slices={body} components={components} />
                </div>
            </article>
        </main>
    );
}
