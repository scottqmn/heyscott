import CodeBlock from './CodeBlock';
import Divider from './Divider';
import Heading from './Heading';
import Images from './Images';
import Quote from './Quote';
import RichText from './RichText';

/**
 * Maps Prismic slice types to their React components, consumed by
 * `<SliceZone>` on the blog post pages.
 */
export const components = {
    code_block: CodeBlock,
    divider: Divider,
    heading: Heading,
    images: Images,
    quote: Quote,
    rich_text: RichText,
};
