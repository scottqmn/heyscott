'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { PLACEHOLDER_POSTS, type BlogPostLink } from '@/lib/posts';
import { PostLinkList } from './PostLinkList';

type PostListComposerProps = {
    /** Posts to link to. Defaults to the placeholder source (Prismic pending). */
    posts?: BlogPostLink[];
    /** Placeholder text shown in the compose-bar pill. */
    placeholder?: string;
    /** Start with the post list open (used by the Storybook example). */
    defaultOpen?: boolean;
};

/**
 * A bottom-anchored iMessage compose bar (rounded pill "input" + circular send
 * button). Tapping it pops up a list of blog-post links, each rendered as a
 * darker translucent grey outgoing-positioned bubble (the typing-indicator
 * tone) whose heading is the link — an iMessage-flavored blog index. Driven by
 * the placeholder post source until Prismic is wired.
 */
export const PostListComposer = ({
    posts = PLACEHOLDER_POSTS,
    placeholder = 'Read the blog…',
    defaultOpen = false,
}: PostListComposerProps) => {
    const [open, setOpen] = useState(defaultOpen);
    const toggle = () => setOpen((v) => !v);

    return (
        // NOTE: no `pointer-events-none` on this wrapper. iOS Safari does not
        // reliably re-enable *touch* events on a `pointer-events:auto` child of
        // a `pointer-events:none` ancestor, so that pattern made the bar
        // untappable on iPhone (it worked everywhere else). When the sheet is
        // closed the wrapper only spans the bar itself (the list collapses to
        // `max-h-0`), so it doesn't need to let taps pass through.
        <div className='fixed inset-x-0 bottom-0 z-50'>
            {/* Tap-away overlay to close the sheet. */}
            {open && (
                <button
                    type='button'
                    aria-label='Close post list'
                    onClick={() => setOpen(false)}
                    className='fixed inset-0 -z-10 cursor-default'
                />
            )}

            {/* The post list, rising above the compose bar. */}
            <div
                className={clsx(
                    'overflow-hidden transition-[max-height] duration-300 ease-out',
                    open ? 'max-h-[65vh]' : 'max-h-0'
                )}
            >
                <div className='mx-auto max-w-xl px-5 pt-5 pb-2'>
                    <div className='max-h-[58vh] overflow-y-auto pr-0.5'>
                        <PostLinkList posts={posts} />
                    </div>
                </div>
            </div>

            {/* The compose bar. Pad the bottom past the iOS home indicator /
                bottom toolbar (safe-area inset) so the controls aren't tucked
                under system UI where taps get swallowed. */}
            <div className='border-t border-border bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur'>
                <div className='mx-auto flex max-w-xl items-center gap-2 px-4 py-2.5'>
                    <button
                        type='button'
                        onClick={toggle}
                        className='flex-1 touch-manipulation rounded-full border border-border px-4 py-2 text-left text-base text-muted-foreground transition-colors hover:border-muted-foreground/40'
                    >
                        {placeholder}
                    </button>
                    <button
                        type='button'
                        onClick={toggle}
                        aria-expanded={open}
                        aria-label={open ? 'Hide posts' : 'Show posts'}
                        className='flex size-9 shrink-0 touch-manipulation items-center justify-center rounded-full bg-imessage-sent text-imessage-sent-foreground transition-transform active:scale-95'
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
