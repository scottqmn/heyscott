'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { richTextToMessages } from '@/components/imessage/ConversationText';
import { Message } from '@/components/imessage/Message';
import { MessageThread } from '@/components/imessage/MessageThread';
import { TextMessage } from '@/components/imessage/TextMessage';
import { PostLinkList } from '@/components/PostListComposer/PostLinkList';
import {
    PLACEHOLDER_POSTS,
    getPlaceholderPost,
    type BlogPostLink,
} from '@/lib/posts';
import {
    ABOUT_LINES,
    BLOG_LINES,
    HOME_LINES,
    NOT_FOUND_LINES,
    RECIRC_LEAD,
} from './content';
import { useConversation, type ConversationSegment as Segment } from './store';

/** Incoming (received) message bubbles from a list of copy lines. */
function incoming(lines: string[]): ReactNode {
    return lines.map((line, i) => <TextMessage key={i}>{line}</TextMessage>);
}

/** In-thread recirculation: a lead-in + grouped post-link bubbles. */
function RecircLinks({ posts }: { posts: BlogPostLink[] }) {
    return (
        <div className='mt-3'>
            <MessageThread>
                <TextMessage>{RECIRC_LEAD}</TextMessage>
            </MessageThread>
            <div className='mx-auto max-w-xl px-5'>
                <PostLinkList posts={posts} />
            </div>
        </div>
    );
}

/** One page-visit segment: outgoing "hey Scott" + the page's incoming content. */
function ConversationSegment({ pathname }: { pathname: string }) {
    let content: ReactNode;
    let recirc: ReactNode = null;

    if (pathname.startsWith('/blog/')) {
        const post = getPlaceholderPost(pathname.slice('/blog/'.length));
        if (post) {
            content = richTextToMessages(post.body);
            recirc = (
                <RecircLinks
                    posts={PLACEHOLDER_POSTS.filter((p) => p.slug !== post.slug)}
                />
            );
        } else {
            content = incoming(NOT_FOUND_LINES);
        }
    } else if (pathname === '/blog') {
        content = incoming(BLOG_LINES);
        recirc = <RecircLinks posts={PLACEHOLDER_POSTS} />;
    } else if (pathname === '/about') {
        content = incoming(ABOUT_LINES);
    } else {
        content = incoming(HOME_LINES); // '/' and any fallback
    }

    return (
        <section className='pt-8'>
            <MessageThread>
                <Message direction='outgoing'>hey Scott</Message>
                {content}
            </MessageThread>
            {recirc}
        </section>
    );
}

/**
 * Presentational conversation thread — renders a segment list in order, and
 * scrolls the newest into view when the list grows (they then fade in via the
 * existing scroll reveal). Separated from the store so Storybook can drive it
 * with a controlled segment list.
 */
export function ConversationThread({ segments }: { segments: Segment[] }) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // On growth, bring the newest messages into view. Skip the first render
    // (nothing to catch up to) so we don't yank the page on load.
    const count = useRef(segments.length);
    useEffect(() => {
        if (segments.length > count.current) {
            bottomRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
        count.current = segments.length;
    }, [segments.length]);

    return (
        <main className='min-h-screen pb-32'>
            {segments.map((segment) => (
                <ConversationSegment
                    key={segment.id}
                    pathname={segment.pathname}
                />
            ))}
            <div ref={bottomRef} aria-hidden />
        </main>
    );
}

/**
 * The persistent conversation thread wired to the global store. Reads every
 * visited page's segment and renders its messages; new segments append below
 * as you navigate. Lives in the root layout so it survives navigation.
 */
export function ConversationView() {
    const { segments } = useConversation();
    return <ConversationThread segments={segments} />;
}
