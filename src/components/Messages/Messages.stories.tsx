import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Messages } from './Messages';

/**
 * The homepage splash: the original iMessage conversation that is heyscott's
 * identity, animated in with framer-motion.
 */
const meta = {
    title: 'Primitives/Messages (splash)',
    component: Messages,
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Messages>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
