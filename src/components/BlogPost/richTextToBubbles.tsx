import { clsx } from 'clsx';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText, type JSXMapSerializer } from '@prismicio/react';
import type { RichTextField } from '@prismicio/client';
import type { ReactElement } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { HeadingMessage, MediaMessage, TextMessage } from '@/components/imessage';

/**
 * Inline-only serializers: render a block's INNER content (bold, italics,
 * links) as a fragment, with NO block wrapper — the bubble is the wrapper,
 * added per-block in {@link richTextToBubbles}. Lets each top-level rich-text
 * block become its own sibling message element.
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

type Node = NonNullable<RichTextField>[number];

const renderInline = (node: Node) => (
    <PrismicRichText field={[node]} components={inlineSerializers} />
);

const isListItem = (node: Node) =>
    node.type === 'list-item' || node.type === 'o-list-item';

/**
 * Splits a rich-text field into a flat list of message bubbles — the blog-POST
 * body rendering (scoped to {@link BlogPost}). The run's iMessage grouping
 * mirrors how the author wrote it:
 * - headings (`heading1`–`heading6`) → a `HeadingMessage` (OUTGOING/sent),
 *   wrapping the correct semantic `<h1>`–`<h6>` element; the side flip from the
 *   incoming paragraphs breaks grouping on its own;
 * - paragraphs → one incoming `TextMessage` each, grouped with adjacent ones;
 * - a **blank line** (empty paragraph) is not rendered but SPLITS the group —
 *   the bubbles after it start a fresh run (`startsGroup`). Consecutive blank
 *   lines collapse to one break;
 * - a contiguous run of same-type list items collapses into ONE incoming
 *   `TextMessage` holding a native `<ul>`/`<ol>` (default inline markers);
 * - image / embed / code nodes → a `MediaMessage`; images and embeds are
 *   `standalone`, breaking the group chain on both sides.
 *
 * Returned as siblings (not nested) so {@link MessageThread} groups them.
 * `keyPrefix` keeps React keys unique across multiple slices.
 */
export function richTextToBubbles(
    field: RichTextField,
    keyPrefix: string
): ReactElement[] {
    const nodes = Array.isArray(field) ? field : [];
    const messages: ReactElement[] = [];

    // A pending blank line: the next bubble emitted starts a new group.
    let pendingBreak = false;
    const takeBreak = () => {
        const starts = pendingBreak;
        pendingBreak = false;
        return starts;
    };

    let i = 0;
    while (i < nodes.length) {
        const node = nodes[i];
        const key = `${keyPrefix}-${node.type}-${i}`;

        // Collapse a contiguous run of same-type list items into one bubble.
        if (isListItem(node)) {
            const listType = node.type;
            const itemNodes: Node[] = [];
            while (i < nodes.length) {
                const cur = nodes[i];
                if (cur.type !== 'list-item' && cur.type !== 'o-list-item') break;
                if (cur.type !== listType) break;
                if (cur.text.trim()) itemNodes.push(cur);
                i++;
            }
            if (itemNodes.length) {
                const ordered = listType === 'o-list-item';
                const ListTag = ordered ? 'ol' : 'ul';
                messages.push(
                    <TextMessage key={key} startsGroup={takeBreak()}>
                        <ListTag
                            className={clsx(
                                'pl-5',
                                ordered ? 'list-decimal' : 'list-disc'
                            )}
                        >
                            {itemNodes.map((item, k) => (
                                <li key={k}>{renderInline(item)}</li>
                            ))}
                        </ListTag>
                    </TextMessage>
                );
            }
            continue;
        }

        switch (node.type) {
            case 'heading1':
            case 'heading2':
            case 'heading3':
            case 'heading4':
            case 'heading5':
            case 'heading6': {
                if (!node.text.trim()) break;
                // Headings are SENT (outgoing) — the side flip from the
                // incoming paragraphs naturally breaks grouping. Preserve the
                // semantic <h1>–<h6> element for accessibility (Tailwind's reset
                // keeps it visually the body text style).
                const Heading = node.type.replace('heading', 'h') as
                    | 'h1'
                    | 'h2'
                    | 'h3'
                    | 'h4'
                    | 'h5'
                    | 'h6';
                messages.push(
                    <HeadingMessage key={key} startsGroup={takeBreak()}>
                        <Heading>{renderInline(node)}</Heading>
                    </HeadingMessage>
                );
                break;
            }
            case 'paragraph':
                // Blank line: don't render, but split the group that follows.
                if (!node.text.trim()) {
                    pendingBreak = true;
                    break;
                }
                messages.push(
                    <TextMessage key={key} startsGroup={takeBreak()}>
                        {renderInline(node)}
                    </TextMessage>
                );
                break;
            case 'preformatted':
                if (!node.text.trim()) break;
                messages.push(
                    <MediaMessage key={key} startsGroup={takeBreak()}>
                        <CodeBlock code={node.text} className='rounded-none' />
                    </MediaMessage>
                );
                break;
            case 'image':
                messages.push(
                    <MediaMessage
                        key={key}
                        standalone
                        startsGroup={takeBreak()}
                        caption={node.alt || undefined}
                    >
                        <PrismicNextImage
                            field={node}
                            className='h-auto w-full'
                        />
                    </MediaMessage>
                );
                break;
            case 'embed':
                // Embeds (e.g. YouTube) render at a larger, video-appropriate
                // width; image bubbles keep the default size.
                messages.push(
                    <MediaMessage
                        key={key}
                        standalone
                        wide
                        startsGroup={takeBreak()}
                    >
                        <div
                            // Lock 16:9 on the CONTAINER and stretch the iframe
                            // to fill it (w/h-full override the oEmbed html's
                            // width/height attributes), so the embed keeps its
                            // ratio at any width — no distortion or letterboxing.
                            className='aspect-video w-full [&_iframe]:block [&_iframe]:h-full [&_iframe]:w-full'
                            dangerouslySetInnerHTML={{
                                __html: node.oembed.html ?? '',
                            }}
                        />
                    </MediaMessage>
                );
                break;
        }
        i++;
    }

    return messages;
}
