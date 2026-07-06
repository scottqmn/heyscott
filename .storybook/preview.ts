import type { Preview } from '@storybook/nextjs-vite';
// Load the real iMessage theme / Tailwind v4 tokens so bubbles render with
// the same colors and fonts as the app.
import '../src/app/globals.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        backgrounds: { disable: true },
    },
};

export default preview;
