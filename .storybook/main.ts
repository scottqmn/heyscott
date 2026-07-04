import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [],
    framework: {
        name: '@storybook/nextjs-vite',
        options: {},
    },
    // heyscott has no public/ dir — its static assets live under src/app.
    viteFinal: async (cfg) => {
        // `@prismicio/next` re-exports server-only (CJS) preview utilities that
        // the Storybook bundler can't parse; swap it for a browser stub so the
        // presentational components (PrismicNextImage/Link) still render.
        const stub = fileURLToPath(
            new URL('./mocks/prismicio-next.tsx', import.meta.url)
        );
        cfg.resolve = cfg.resolve ?? {};
        const alias = cfg.resolve.alias;
        if (Array.isArray(alias)) {
            cfg.resolve.alias = [
                ...alias,
                { find: '@prismicio/next', replacement: stub },
            ];
        } else {
            cfg.resolve.alias = {
                ...(alias ?? {}),
                '@prismicio/next': stub,
            };
        }
        return cfg;
    },
};

export default config;
