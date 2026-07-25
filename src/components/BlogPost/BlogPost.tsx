import { asText, isFilled, type Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { cloneElement, type ReactElement } from 'react';
import { MediaMessage, MessageThread, TextMessage } from '@/components/imessage';
import { ThreadHeader } from '@/components/ThreadHeader';
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
 * A blog post rendered as an iMessage conversation. The post's identity (its
 * `title` + avatar) lives in the always-visible {@link ThreadHeader} — the
 * title is the page `<h1>`, so there's no title bubble. The `image` is SENT
 * (outgoing, blue, right), then the body ARRIVES as a run of incoming replies
 * (grey, left): each `rich_text` slice is split into one bubble per top-level
 * block (paragraphs/list items → text bubbles, images/embeds → media bubbles,
 * via {@link richTextToBubbles}); other slice types (e.g. `heading`) stay a
 * single incoming bubble. {@link MessageThread} receives every bubble as a
 * direct child, so it derives the tail/grouping.
 */
export const BlogPost = ({ post }: BlogPostProps) => {
    const { title, image, body } = post.data;

    return (
        <main className='min-h-screen'>
            {/* Thread header carries the post identity (avatar + title as the
                page h1), so the body no longer needs a title bubble. */}
            <ThreadHeader
                title={asText(title)}
                image={isFilled.image(image) ? image : null}
                seed={post.uid}
            />
            <div className='py-16'>
                <MessageThread>
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
