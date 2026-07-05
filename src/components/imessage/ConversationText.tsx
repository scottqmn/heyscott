'use client';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import {
    PrismicRichText,
    type JSXMapSerializer,
    type PrismicRichTextProps,
} from '@prismicio/react';
import type { ReactElement } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { HeadingMessage } from './HeadingMessage';
import { MediaMessage } from './MediaMessage';
import { MessageThread } from './MessageThread';
import { TextMessage } from './TextMessage';

/**
 * Serializers that render only a block's INLINE content (bold, italics, links)
 * as a fragment — the block wrapper (the bubble) is added separately in
 * {@link fieldToMessages}. This lets us treat each rich-text block as one
 * message element and pass the whole sequence to {@link MessageThread}, which
 * computes the grouping (tails) from the sequence.
 */
const inlineSerializers: JSXMapSerializer = {
    heading1: ({ children }) => <>{children}</>,
    heading2: ({ children }) => <>{children}</>,
    heading3: ({ children }) => <>{children}</>,
    heading4: ({ children }) => <>{children}</>,
    heading5: ({ children }) => <>{children}</>,
    heading6: ({ children }) => <>{children}</>,
    paragraph: ({ children }) => <>{children}</>,
    listItem: ({ children }) => <>{children}</>,
    oListItem: ({ children }) => <>{children}</>,
    hyperlink: ({ node, children, key }) => (
        <PrismicNextLink key={key} field={node.data} className='underline'>
            {children}
        </PrismicNextLink>
    ),
};

type Field = PrismicRichTextProps['field'];

const renderInline = (node: NonNullable<Field>[number]) => (
    <PrismicRichText field={[node]} components={inlineSerializers} />
);

/**
 * Maps each rich-text block to a message element: headings are sent (outgoing),
 * everything else — paragraphs, lists, code, images, embeds — arrives
 * (incoming). Returns a flat list so {@link MessageThread} can group it.
 */
function fieldToMessages(field: Field): ReactElement[] {
    const nodes = Array.isArray(field) ? field : [];
    const messages: ReactElement[] = [];

    nodes.forEach((node, i) => {
        const key = `${node.type}-${i}`;
        switch (node.type) {
            case 'heading1':
            case 'heading2':
            case 'heading3':
            case 'heading4':
            case 'heading5':
            case 'heading6':
                messages.push(
                    <HeadingMessage key={key}>
                        {renderInline(node)}
                    </HeadingMessage>
                );
                break;
            case 'paragraph':
                messages.push(
                    <TextMessage key={key}>{renderInline(node)}</TextMessage>
                );
                break;
            case 'list-item':
                messages.push(
                    <TextMessage key={key}>
                        <span className='mr-1' aria-hidden>
                            •
                        </span>
                        {renderInline(node)}
                    </TextMessage>
                );
                break;
            case 'o-list-item':
                messages.push(
                    <TextMessage key={key}>{renderInline(node)}</TextMessage>
                );
                break;
            case 'preformatted':
                messages.push(
                    <MediaMessage key={key}>
                        <CodeBlock code={node.text} className='rounded-none' />
                    </MediaMessage>
                );
                break;
            case 'image':
                messages.push(
                    <MediaMessage key={key} caption={node.alt || undefined}>
                        <PrismicNextImage field={node} className='h-auto w-full' />
                    </MediaMessage>
                );
                break;
            case 'embed':
                messages.push(
                    <MediaMessage key={key}>
                        <div
                            className='[&_iframe]:block [&_iframe]:aspect-video [&_iframe]:w-full'
                            dangerouslySetInnerHTML={{
                                __html: node.oembed.html ?? '',
                            }}
                        />
                    </MediaMessage>
                );
                break;
        }
    });

    return messages;
}

type ConversationTextProps = {
    field: Field;
    className?: string;
};

/**
 * Renders a Prismic rich-text field as a full iMessage conversation thread —
 * the blog's primary body-content rendering. Headings send (outgoing), body
 * content arrives (incoming), and {@link MessageThread} groups consecutive
 * same-side messages so only the last of each run keeps its tail.
 */
export const ConversationText = ({ field, className }: ConversationTextProps) => {
    return (
        <MessageThread className={className}>
            {fieldToMessages(field)}
        </MessageThread>
    );
};
