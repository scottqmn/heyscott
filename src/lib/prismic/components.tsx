import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import type { JSXMapSerializer } from '@prismicio/react';
import { CodeBlock } from '@/components/CodeBlock';

/**
 * Rich-text serializers shared by PrismicRichText across the blog. Mirrors
 * needless: Prismic links become next/link, images render through
 * PrismicNextImage, and preformatted blocks get syntax highlighting.
 */
export const richTextComponents: JSXMapSerializer = {
    hyperlink: ({ node, children, key }) => (
        <PrismicNextLink key={key} field={node.data}>
            {children}
        </PrismicNextLink>
    ),
    image: ({ node, key }) => (
        <PrismicNextImage
            key={key}
            field={node}
            className='not-prose my-6 overflow-hidden rounded-[18px]'
            style={{ objectFit: 'contain' }}
        />
    ),
    preformatted: ({ node, key }) => (
        <CodeBlock key={key} code={node.text} className='not-prose my-6' />
    ),
};
