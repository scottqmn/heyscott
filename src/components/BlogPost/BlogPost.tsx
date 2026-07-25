import { asText, isFilled, type Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { cloneElement, type ReactElement } from 'react';
import {
    HeadingMessage,
    MediaMessage,
    MessageThread,
    TextMessage,
} from '@/components/imessage';
import { BlogPostHeader } from './BlogPostHeader';
import { richTextToBubbles } from './richTextToBubbles';

type BlogPostProps = {
    post: Content.BlogPostDocument;
};

/**
 * Force a slice's FIRST bubble to start a new message group, so two adjacent
 * body slices never merge into one grouped run. Intra-slice grouping (from
 * {@link richTextToBubbles}) is left untouched for the remaining bubbles.
 */
const startSliceGroup = (bubbles: ReactElement[]): ReactElement[] =>
    bubbles.length > 0
        ? [
              cloneElement(bubbles[0] as ReactElement<{ startsGroup?: boolean }>, {
                  startsGroup: true,
              }),
              ...bubbles.slice(1),
          ]
        : bubbles;

/**
 * A blog post rendered as an iMessage conversation. The post's own framing —
 * `title` and `image` — is SENT (outgoing, blue, right), and the body ARRIVES
 * as a run of incoming replies (grey, left): each `rich_text` slice is split
 * into one bubble per top-level block (paragraphs/list items → text bubbles,
 * images/embeds → media bubbles, via {@link richTextToBubbles}); other slice
 * types (e.g. `heading`) stay a single incoming bubble. {@link MessageThread}
 * receives every bubble as a direct child, so it derives the tail/grouping and
 * the outgoing header groups above the incoming body run.
 */
export const BlogPost = ({ post }: BlogPostProps) => {
    const { title, image, body } = post.data;

    return (
        <main className='min-h-screen'>
            {/* iMessage thread-screen header identifying this post (mobile only). */}
            <BlogPostHeader post={post} />
            <div className='py-16'>
                <MessageThread>
                    {isFilled.richText(title) && (
                        <HeadingMessage>
                            {/* The post title is the page's h1 (a11y). */}
                            <h1>{asText(title)}</h1>
                        </HeadingMessage>
                    )}
                    {isFilled.image(image) && (
                        <MediaMessage direction='outgoing'>
                            <PrismicNextImage field={image} />
                        </MediaMessage>
                    )}
                    {body.flatMap((slice) =>
                        startSliceGroup(
                            slice.slice_type === 'rich_text'
                                ? richTextToBubbles(
                                      slice.primary.content,
                                      slice.id
                                  )
                                : [
                                      <TextMessage key={slice.id}>
                                          <PrismicRichText
                                              field={slice.primary.heading}
                                          />
                                      </TextMessage>,
                                  ]
                        )
                    )}
                </MessageThread>
            </div>
        </main>
    );
};
