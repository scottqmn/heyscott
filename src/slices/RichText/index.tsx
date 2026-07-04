import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import { richTextComponents } from '@/lib/prismic/components';

export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

const RichText = ({ slice }: RichTextProps) => {
    return (
        <div className='prose prose-lg mx-auto max-w-2xl px-5'>
            <PrismicRichText
                field={slice.primary.content}
                components={richTextComponents}
            />
        </div>
    );
};

export default RichText;
