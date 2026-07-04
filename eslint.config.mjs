import next from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const config = [
    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'out/**',
            'public/**',
            'storybook-static/**',
            'prismicio-types.d.ts',
        ],
    },
    ...next,
    prettier,
]

export default config
