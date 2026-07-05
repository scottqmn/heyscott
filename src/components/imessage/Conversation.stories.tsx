import { PrismicNextImage } from '@prismicio/next';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ConversationText } from './ConversationText';
import { HeadingMessage } from './HeadingMessage';
import { MediaMessage } from './MediaMessage';
import { MessageThread } from './MessageThread';
import { TextMessage } from './TextMessage';
import { mockConversation, mockImage } from './mocks';

/**
 * The whole rendering read end-to-end: a Prismic rich-text field turned into
 * an iMessage conversation — headings incoming, text/lists/media outgoing.
 */
const meta = {
    title: 'iMessage/Conversation',
    component: ConversationText,
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ConversationText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Driven by `ConversationText` + `messageSerializers` (as the blog uses it). */
export const FromRichText: Story = {
    args: { field: mockConversation },
    decorators: [
        (Story) => (
            <div className='py-8'>
                <Story />
            </div>
        ),
    ],
};

/** The same shape assembled by hand from the individual message components. */
export const Manual: Story = {
    // `field` is unused by the custom render, but satisfies the typed component.
    args: { field: mockConversation },
    render: () => (
        <div className='py-8'>
            <MessageThread>
                <HeadingMessage>Shipping the blog</HeadingMessage>
                <TextMessage>
                    Rewrote heyscott on the modern stack this week.
                </TextMessage>
                <HeadingMessage>What changed</HeadingMessage>
                <TextMessage>• Next 16 + React 19</TextMessage>
                <TextMessage grouped>• Tailwind v4 theme tokens</TextMessage>
                <TextMessage grouped>• A Prismic-backed blog</TextMessage>
                <MediaMessage caption='preview.png'>
                    <PrismicNextImage
                        field={mockImage}
                        className='h-auto w-full'
                    />
                </MediaMessage>
                <TextMessage>And it all renders as a conversation.</TextMessage>
            </MessageThread>
        </div>
    ),
};
