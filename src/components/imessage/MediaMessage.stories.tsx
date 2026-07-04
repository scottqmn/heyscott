import { PrismicNextImage } from '@prismicio/next';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MediaMessage } from './MediaMessage';
import { mockImage } from './mocks';

/**
 * Images and embeds render as OUTGOING attachments (right-aligned, blue SVG
 * tail) so media flows in the conversation like a sent photo or video.
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
    args: { focusOnScroll: false },
} satisfies Meta<typeof MediaMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
    args: {
        caption: 'photo.jpg',
        children: <PrismicNextImage field={mockImage} className='h-auto w-full' />,
    },
};

export const ImageWithReceipt: Story = {
    args: {
        receipt: 'read',
        children: <PrismicNextImage field={mockImage} className='h-auto w-full' />,
    },
};

export const Embed: Story = {
    args: {
        children: (
            <div className='[&_iframe]:block [&_iframe]:aspect-video [&_iframe]:w-full'>
                <iframe
                    title='Embedded video'
                    // Self-contained (no network) so the story renders offline.
                    srcDoc="<div style='display:grid;place-items:center;height:100%;background:#111;color:#fff;font-family:sans-serif;font-size:20px'>▶ Embedded video</div>"
                />
            </div>
        ),
    },
};
