'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { ChatBubble } from '@/components/ChatBubble';
import { PLACEHOLDER_POSTS, type BlogPostLink } from '@/lib/posts';

type PostListComposerProps = {
    /** Posts to link to. Defaults to the placeholder source (Prismic pending). */
    posts?: BlogPostLink[];
    /** Placeholder text shown in the compose-bar pill. */
    placeholder?: string;
    /** Start with the post list open (used by the Storybook example). */
    defaultOpen?: boolean;
};

/** A single post link as a GREY bubble in the outgoing (right) position. */
const PostLinkBubble = ({
    post,
    tail,
    grouped,
}: {
    post: BlogPostLink;
    tail: boolean;
    grouped: boolean;
}) => (
    <ChatBubble variant='sent' tone='received' tail={tail} grouped={grouped}>
        <Link
            href={`/blog/${post.slug}`}
            className='block font-medium transition-opacity hover:opacity-70'
        >
            {post.title}
        </Link>
    </ChatBubble>
);

/**
 * A bottom-anchored iMessage compose bar (rounded pill "input" + circular send
 * button). Tapping it pops up a list of blog-post links, each rendered as a
 * grey outgoing-positioned message bubble whose heading is the link — an
 * iMessage-flavored blog index. Driven by the placeholder post source until
 * Prismic is wired.
 */
export const PostListComposer = ({
    posts = PLACEHOLDER_POSTS,
    placeholder = 'Read the blog…',
    defaultOpen = false,
}: PostListComposerProps) => {
    const [open, setOpen] = useState(defaultOpen);
    const toggle = () => setOpen((v) => !v);

    return (
        <div className='pointer-events-none fixed inset-x-0 bottom-0 z-40'>
            {/* Tap-away overlay to close the sheet. */}
            {open && (
                <button
                    type='button'
                    aria-label='Close post list'
                    onClick={() => setOpen(false)}
                    className='pointer-events-auto fixed inset-0 -z-10 cursor-default'
                />
            )}

            {/* The post list, rising above the compose bar. */}
            <div
                className={clsx(
                    'pointer-events-auto overflow-hidden transition-[max-height] duration-300 ease-out',
                    open ? 'max-h-[65vh]' : 'max-h-0'
                )}
            >
                <div className='mx-auto max-w-xl px-5 pt-5 pb-2'>
                    <div className='max-h-[58vh] overflow-y-auto pr-0.5'>
                        {posts.map((post, i) => (
                            <PostLinkBubble
                                key={post.slug}
                                post={post}
                                tail={i === posts.length - 1}
                                grouped={i > 0}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* The compose bar. */}
            <div className='pointer-events-auto border-t border-border bg-background/85 backdrop-blur'>
                <div className='mx-auto flex max-w-xl items-center gap-2 px-4 py-2.5'>
                    <button
                        type='button'
                        onClick={toggle}
                        className='flex-1 rounded-full border border-border px-4 py-2 text-left text-base text-muted-foreground transition-colors hover:border-muted-foreground/40'
                    >
                        {placeholder}
                    </button>
                    <button
                        type='button'
                        onClick={toggle}
                        aria-expanded={open}
                        aria-label={open ? 'Hide posts' : 'Show posts'}
                        className='flex size-9 shrink-0 items-center justify-center rounded-full bg-imessage-sent text-imessage-sent-foreground transition-transform active:scale-95'
                    >
                        <svg
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className={clsx(
                                'size-5 transition-transform duration-300',
                                open && 'rotate-180'
                            )}
                            aria-hidden
                        >
                            <path d='M12 19V5' />
                            <path d='M6 11l6-6 6 6' />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
