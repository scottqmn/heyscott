import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import { ChatBubble } from '@/components/ChatBubble';

export type QuoteProps = SliceComponentProps<Content.QuoteSlice>;

/**
 * A pull quote rendered as an incoming iMessage bubble — the blog's nod to
 * heyscott's chat identity in the middle of long-form content.
 */
const Quote = ({ slice }: QuoteProps) => {
    const { quote, attribution } = slice.primary;

    return (
        <div className='mx-auto max-w-2xl px-5 py-2'>
            <ChatBubble variant='received' className='text-lg'>
                <PrismicRichText field={quote} />
            </ChatBubble>
            {attribution && (
                <div className='mt-1 pl-4 text-sm text-muted-foreground'>
                    — {attribution}
                </div>
            )}
        </div>
    );
};

export default Quote;
