import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComposeScreen } from './ComposeScreen';

/**
 * The design's "New Message" compose screen (→ the `/contact` page), on
 * `Compose.dc.html`'s three regions: a `From:` email row (with a Required hint /
 * check circle), a centered empty state, and a docked composer bar whose send
 * enables once the email validates and the body is non-empty. Decorative — Send
 * just flips a "Delivered" line.
 */
const meta = {
    title: 'Blog/ComposeScreen',
    component: ComposeScreen,
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ComposeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Desktop width. */
export const Default: Story = {};

/** Phone viewport. */
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
