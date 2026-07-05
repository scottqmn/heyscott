import { PrismicNextImage } from '@prismicio/next';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MediaMessage } from './MediaMessage';
import { MOCK_YOUTUBE_EMBED, mockImage, mockTallImage } from './mocks';

/**
 * Images and embeds render as INCOMING attachments (grey side, tail
 * bottom-left). The media fills the bubble edge-to-edge and is clipped to the
 * speech-bubble silhouette — tail included — so it takes the exact bubble
 * shape. Real placeholders (seeded picsum.photos / a YouTube embed) show the
 * mask against actual content.
 */
const meta = {
    title: 'iMessage/MediaMessage',
    component: MediaMessage,
    parameters: { layout: 'padded' },
    decorators: [
        (Story) => (
            <div className='mx-auto max-w-xl'>
                <Story />
            </div>
        ),
    ],
    args: { revealOnScroll: false },
} satisfies Meta<typeof MediaMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
    args: {
        caption: 'landscape.jpg',
        children: <PrismicNextImage field={mockImage} className='h-auto w-full' />,
    },
};

/** A portrait image — the mask scales to a tall bubble, tail still clipped. */
export const TallImage: Story = {
    args: {
        caption: 'portrait.jpg',
        children: (
            <PrismicNextImage field={mockTallImage} className='h-auto w-full' />
        ),
    },
};

export const Embed: Story = {
    args: {
        children: (
            <div className='[&_iframe]:block [&_iframe]:aspect-video [&_iframe]:w-full'>
                <iframe
                    title='YouTube video'
                    src={MOCK_YOUTUBE_EMBED}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                />
            </div>
        ),
    },
};
