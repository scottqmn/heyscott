import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';
import config from '../slicemachine.config.json';

/**
 * The Prismic repository name. Mirrors needless's wiring but resolves the
 * name from the environment first so the captain can point heyscott at its
 * own Prismic repo without editing committed config. Falls back to the
 * placeholder in slicemachine.config.json.
 *
 * NOTE: `heyscott` in slicemachine.config.json is a PLACEHOLDER. Set
 * NEXT_PUBLIC_PRISMIC_ENVIRONMENT (and PRISMIC_ACCESS_TOKEN for private
 * repos) in .env.local once the real repository exists.
 */
export const repositoryName =
    process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName;

/**
 * Maps Prismic documents to URLs in this app. The blog lives under /blog,
 * matching the App Router pages in src/app/blog.
 */
const routes: prismic.ClientConfig['routes'] = [
    { type: 'blog_post', path: '/blog/:uid' },
];

/**
 * Creates a Prismic client for the repository. `config` is passed through so
 * route handlers can enable preview/draft mode.
 */
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
    const client = prismic.createClient(repositoryName, {
        routes,
        fetchOptions:
            process.env.NODE_ENV === 'production'
                ? { next: { tags: ['prismic'] }, cache: 'force-cache' }
                : { next: { revalidate: 5 } },
        ...config,
    });

    prismicNext.enableAutoPreviews({ client });

    return client;
};
