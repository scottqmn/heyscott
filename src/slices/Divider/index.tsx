import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

export type DividerProps = SliceComponentProps<Content.DividerSlice>;

const Divider = ({ slice }: DividerProps) => {
    const { style } = slice.primary;

    if (style === 'asterism') {
        return (
            <div
                className='mx-auto my-8 max-w-2xl px-5 text-center text-2xl text-muted-foreground select-none'
                aria-hidden
            >
                ⁂
            </div>
        );
    }

    return (
        <div className='mx-auto my-8 max-w-2xl px-5'>
            <hr className='border-border' />
        </div>
    );
};

export default Divider;
