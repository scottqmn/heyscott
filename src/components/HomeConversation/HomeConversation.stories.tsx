import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HomeConversation } from './HomeConversation';

/**
 * The homepage as the "Scott" iMessage conversation: an always-visible thread
 * header carries the identity ("Scott", the page h1 — no title bubble), and the
 * same static splash copy renders as the conversation body at full opacity.
 */
const meta = {
    title: 'Blog/HomeConversation',
    component: HomeConversation,
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HomeConversation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Desktop width. */
export const Default: Story = {};

/** Phone viewport (header shows the mobile back chevron). */
export const Mobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'iphone',
            viewports: {
                iphone: {
                    name: 'iPhone',
                    type: 'mobile',
                    styles: { width: '390px', height: '812px' },
                },
            },
        },
    },
};
