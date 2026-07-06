import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { ConversationText } from '@/components/imessage';

export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

/**
 * Blog body content, rendered as an iMessage conversation: headings arrive as
 * incoming bubbles, text and media are sent as outgoing bubbles.
 */
const RichText = ({ slice }: RichTextProps) => {
    return (
        <div className='py-4'>
            <ConversationText field={slice.primary.content} />
        </div>
    );
};

export default RichText;
