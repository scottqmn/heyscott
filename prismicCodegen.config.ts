import type { Config } from 'prismic-ts-codegen';

const config: Config = {
    output: './prismicio-types.d.ts',
    models: ['./customtypes/**/index.json', './src/slices/**/model.json'],
    locales: ['en-us'],
    clientIntegration: {
        includeCreateClientInterface: true,
        includeContentNamespace: true,
    },
};

export default config;
