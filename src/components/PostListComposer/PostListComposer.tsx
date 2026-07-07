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
 * A bottom-anchored iMessage compose bar: a single full-width rounded pill
 * "input" that FLOATS over the page (its own blur + faint translucent fill, no
 * panel/bar behind it). Tapping it pops up a list of blog-post links, each a
 * darker translucent grey outgoing-positioned bubble (the typing-indicator
 * tone) whose heading is the link — an iMessage-flavored blog index. While the
 * list is open the page behind is dimmed, and choosing a link closes the list.
 * Driven by the placeholder post source until Prismic is wired.
 */
export const PostListComposer = ({
    posts = PLACEHOLDER_POSTS,
    placeholder = 'Read the blog…',
    defaultOpen = false,
}: PostListComposerProps) => {
    const [open, setOpen] = useState(defaultOpen);
    const toggle = () => setOpen((v) => !v);
    const close = () => setOpen(false);

    return (
        // NOTE: no `pointer-events-none` on this wrapper. iOS Safari does not
        // reliably re-enable *touch* events on a `pointer-events:auto` child of
        // a `pointer-events:none` ancestor, so that pattern made the bar
        // untappable on iPhone (it worked everywhere else). When the sheet is
        // closed the wrapper only spans the bar itself (the list collapses to
        // `max-h-0`), so it doesn't need to let taps pass through.
        <div className='fixed inset-x-0 bottom-0 z-50'>
            {/* Tap-away scrim that also DIMS the page behind the open list.
                ALWAYS mounted (with pointer-events off + opacity 0 when closed)
                so it FADES in/out; sits above the page content but below the
                list + floating pill (negative z within this z-50 context). */}
            <button
                type='button'
                aria-label='Close post list'
                onClick={close}
                tabIndex={open ? 0 : -1}
                aria-hidden={!open}
                className={clsx(
                    'fixed inset-0 -z-10 cursor-default bg-black/65 transition-opacity duration-300 ease-out',
                    open ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
            />

            {/* The post list, fading in/out above the compose bar. */}
            <div
                className={clsx(
                    'transition-opacity duration-300 ease-out',
                    open ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
            >
                <div className='mx-auto max-w-xl px-5 pt-5 pb-2'>
                    <div className='max-h-[58vh] overflow-y-auto pr-0.5'>
                        <PostLinkList posts={posts} onLinkClick={close} />
                    </div>
                </div>
            </div>

            {/* The compose bar has NO panel/frame — the full-width pill itself
                floats over the page (its own blur + faint fill keep it legible),
                reading as a hovering control, not a docked bar. Pad the bottom
                past the iOS home indicator / bottom toolbar (safe-area inset) so
                it isn't tucked under system UI where taps get swallowed. */}
            <div className='pb-[env(safe-area-inset-bottom)]'>
                <div className='mx-auto max-w-xl px-4 py-2.5'>
                    <button
                        type='button'
                        onClick={toggle}
                        aria-expanded={open}
                        aria-label={open ? 'Hide posts' : 'Show posts'}
                        className='w-full touch-manipulation rounded-full border border-border bg-background/60 px-4 py-2 text-left text-base text-muted-foreground backdrop-blur transition-colors hover:border-muted-foreground/40'
                    >
                        {placeholder}
                    </button>
                </div>
            </div>
        </div>
    );
};
