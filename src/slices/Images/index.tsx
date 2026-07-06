import { Content, isFilled } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

export type ImagesProps = SliceComponentProps<Content.ImagesSlice>;

const Images = ({ slice }: ImagesProps) => {
    const images = slice.items.filter((item) => isFilled.image(item.image));

    if (images.length === 0) return null;

    return (
        <div className='mx-auto max-w-2xl space-y-4 px-5 py-4'>
            {images.map(({ image, caption }, index) => (
                <figure key={image.url ?? index}>
                    <div className='overflow-hidden rounded-[18px]'>
                        <PrismicNextImage field={image} />
                    </div>
                    {caption && (
                        <figcaption className='mt-2 text-center text-sm text-muted-foreground'>
                            {caption}
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    );
};

export default Images;
