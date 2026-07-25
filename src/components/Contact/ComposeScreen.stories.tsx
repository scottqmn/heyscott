import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComposeScreen } from './ComposeScreen';

/**
 * The design's "New Message" compose screen (→ the `/contact` page): a 56px
 * blurred header ("New Message" + "Done"), then an iMessage "New Message to
 * Scott" form (recipient chip · name · email · message · blue send). Submit is a
 * placeholder `mailto:` — the real destination is the captain's call.
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
