'use client';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import {
    PrismicRichText,
    type JSXMapSerializer,
    type PrismicRichTextProps,
} from '@prismicio/react';
import { CodeBlock } from '@/components/CodeBlock';
import { HeadingMessage } from './HeadingMessage';
import { MediaMessage } from './MediaMessage';
import { MessageThread } from './MessageThread';
import { TextMessage } from './TextMessage';

/**
 * Rich-text serializers that turn a Prismic document into an iMessage
 * conversation: headings arrive as INCOMING bubbles, body text/lists are sent
 * as OUTGOING bubbles, and images/embeds send as OUTGOING attachments.
 *
 * Exported on its own so callers can drop these into a bare `PrismicRichText`;
 * {@link ConversationText} wraps them in a {@link MessageThread} for the common
 * case.
 */
export const messageSerializers: JSXMapSerializer = {
    heading1: ({ children, key }) => (
        <HeadingMessage key={key} level={1}>
            {children}
        </HeadingMessage>
    ),
    heading2: ({ children, key }) => (
        <HeadingMessage key={key} level={2}>
            {children}
        </HeadingMessage>
    ),
    heading3: ({ children, key }) => (
        <HeadingMessage key={key} level={3}>
            {children}
        </HeadingMessage>
    ),
    heading4: ({ children, key }) => (
        <HeadingMessage key={key} level={4}>
            {children}
        </HeadingMessage>
    ),
    heading5: ({ children, key }) => (
        <HeadingMessage key={key} level={5}>
            {children}
        </HeadingMessage>
    ),
    heading6: ({ children, key }) => (
        <HeadingMessage key={key} level={6}>
            {children}
        </HeadingMessage>
    ),
    paragraph: ({ children, key }) => (
        <TextMessage key={key}>{children}</TextMessage>
    ),
    // Each list item is its own bubble, so the list wrappers just pass
    // through — a <ul>/<ol> around bubble <div>s would be invalid markup.
    list: ({ children, key }) => <div key={key}>{children}</div>,
    oList: ({ children, key }) => <div key={key}>{children}</div>,
    listItem: ({ children, key }) => (
        <TextMessage key={key}>
            <span className='mr-1' aria-hidden>
                •
            </span>
            {children}
        </TextMessage>
    ),
    oListItem: ({ children, key }) => (
        <TextMessage key={key}>{children}</TextMessage>
    ),
    preformatted: ({ node, key }) => (
        <MediaMessage key={key}>
            <CodeBlock code={node.text} className='rounded-none' />
        </MediaMessage>
    ),
    image: ({ node, key }) => (
        <MediaMessage key={key} caption={node.alt || undefined}>
            <PrismicNextImage field={node} className='h-auto w-full' />
        </MediaMessage>
    ),
    embed: ({ node, key }) => (
        <MediaMessage key={key}>
            <div
                className='[&_iframe]:block [&_iframe]:aspect-video [&_iframe]:w-full'
                dangerouslySetInnerHTML={{ __html: node.oembed.html ?? '' }}
            />
        </MediaMessage>
    ),
    hyperlink: ({ node, children, key }) => (
        <PrismicNextLink key={key} field={node.data} className='underline'>
            {children}
        </PrismicNextLink>
    ),
};

type ConversationTextProps = {
    field: PrismicRichTextProps['field'];
    className?: string;
};

/**
 * Renders a Prismic rich-text field as a full iMessage conversation thread.
 * The blog's primary body-content rendering.
 */
export const ConversationText = ({ field, className }: ConversationTextProps) => {
    return (
        <MessageThread className={className}>
            <PrismicRichText field={field} components={messageSerializers} />
        </MessageThread>
    );
};
