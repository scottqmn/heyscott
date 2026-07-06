import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import { richTextComponents } from '@/lib/prismic/components';

export type HeadingProps = SliceComponentProps<Content.HeadingSlice>;

const Heading = ({ slice }: HeadingProps) => {
    const { heading, label } = slice.primary;

    return (
        <div className='mx-auto max-w-2xl space-y-1 px-5 pt-8'>
            <div className='text-2xl font-medium md:text-3xl'>
                <PrismicRichText
                    field={heading}
                    components={richTextComponents}
                />
            </div>
            {label ? (
                <div className='text-lg text-muted-foreground'>{label}</div>
            ) : null}
        </div>
    );
};

export default Heading;
