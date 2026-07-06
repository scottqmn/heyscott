import { clsx } from 'clsx';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText, type JSXMapSerializer } from '@prismicio/react';
import type { RichTextField } from '@prismicio/client';
import type { ReactElement } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { MediaMessage, TextMessage } from '@/components/imessage';

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
 * Splits a rich-text field into a flat list of INCOMING message bubbles — the
 * blog-POST body rendering (scoped to {@link BlogPost}, distinct from the
 * shared `ConversationText`, which sends headings outgoing). Every block
 * arrives as a reply, and the run's iMessage grouping mirrors how the author
 * wrote it:
 * - text blocks (paragraphs, headings) → one `TextMessage` each, grouped with
 *   adjacent blocks;
 * - a **blank line** (empty paragraph) is not rendered but SPLITS the group —
 *   the bubbles after it start a fresh run (`startsGroup`). Consecutive blank
 *   lines collapse to one break;
 * - a contiguous run of same-type list items collapses into ONE `TextMessage`
 *   holding a native `<ul>`/`<ol>` (default inline markers);
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
            case 'heading6':
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
                messages.push(
                    <MediaMessage key={key} standalone startsGroup={takeBreak()}>
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
        i++;
    }

    return messages;
}
