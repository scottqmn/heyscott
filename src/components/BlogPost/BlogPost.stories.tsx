import type { Content, RichTextField } from '@prismicio/client';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockImage } from '@/components/imessage/mocks';
import { BlogPost } from './BlogPost';

/**
 * A whole blog post rendered as an iMessage conversation: the post's `title`
 * and `image` are SENT (outgoing/blue), then the body ARRIVES as a run of
 * incoming replies. Each `rich_text` slice is split into ONE bubble per block —
 * paragraphs become text bubbles (inline bold/italic/links preserved), images
 * and embeds become media bubbles. Driven by mock content (no live repo).
 */
const meta = {
    title: 'Blog/BlogPost',
    component: BlogPost,
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BlogPost>;

export default meta;
type Story = StoryObj<typeof meta>;

const titleField: RichTextField = [
    { type: 'heading1', text: 'Shipping the blog', spans: [] },
];

const headingField: RichTextField = [
    { type: 'heading2', text: 'What changed', spans: [] },
];

/**
 * A rich-text slice body that exercises the grouping + heading behaviour:
 * - a heading node → an OUTGOING (sent) bubble with a semantic <h2>;
 * - two paragraphs with no blank line between them → grouped incoming run (one
 *   with a bold span, one with a link);
 * - a blank line (empty paragraph) → group break: the next paragraph starts a
 *   fresh run;
 * - another blank line, then a bulleted list and a numbered list, each
 *   collapsed into a single bubble with native inline markers;
 * - a standalone image and a standalone YouTube embed (each its own message);
 * - a closing paragraph.
 */
const richBody: RichTextField = [
    { type: 'heading2', text: 'How the rewrite went', spans: [] },
    {
        type: 'paragraph',
        text: 'Rewrote heyscott on the modern stack this week.',
        spans: [{ start: 12, end: 24, type: 'strong' }],
    },
    {
        type: 'paragraph',
        text: 'These two paragraphs have no blank line, so they group.',
        spans: [
            {
                start: 45,
                end: 50,
                type: 'hyperlink',
                data: { link_type: 'Web', url: 'https://heyscott.com' },
            },
        ],
    },
    { type: 'paragraph', text: '', spans: [] },
    {
        type: 'paragraph',
        text: 'A blank line starts a fresh group — like messages sent apart.',
        spans: [],
    },
    { type: 'paragraph', text: '', spans: [] },
    { type: 'list-item', text: 'Next 16 and React 19', spans: [] },
    { type: 'list-item', text: 'Tailwind v4 theme tokens', spans: [] },
    { type: 'list-item', text: 'A Prismic-backed blog', spans: [] },
    { type: 'o-list-item', text: 'First, split the body into bubbles', spans: [] },
    { type: 'o-list-item', text: 'Then group them like a real thread', spans: [] },
    {
        type: 'image',
        id: mockImage.id,
        url: mockImage.url,
        alt: mockImage.alt,
        copyright: mockImage.copyright,
        dimensions: mockImage.dimensions,
        edit: mockImage.edit,
    },
    {
        type: 'embed',
        oembed: {
            embed_url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
            type: 'video',
            version: '1.0',
            title: 'Big Buck Bunny',
            provider_name: 'YouTube',
            width: 560,
            height: 315,
            html: '<iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="Big Buck Bunny" allowfullscreen></iframe>',
        },
    },
    {
        type: 'paragraph',
        text: 'Media reads as its own message, on both sides.',
        spans: [],
    },
];

/** A SECOND rich-text slice: its first paragraph would group with the one
 *  ending the previous slice, but a slice boundary starts a fresh group. */
const richBodyTwo: RichTextField = [
    {
        type: 'paragraph',
        text: 'This paragraph lives in a SEPARATE slice, so it starts a new group.',
        spans: [],
    },
    {
        type: 'paragraph',
        text: 'This one is in the same slice, so it groups with the line above.',
        spans: [],
    },
];

const richTextSlice = (
    id: string,
    content: RichTextField
): Content.RichTextSlice => ({
    id,
    slice_type: 'rich_text',
    slice_label: null,
    variation: 'default',
    version: 'initial',
    primary: { content },
    items: [],
});

/** A `heading` slice — the other choice in develop's body; stays one bubble. */
const headingSlice = (id: string, heading: RichTextField): Content.HeadingSlice => ({
    id,
    slice_type: 'heading',
    slice_label: null,
    variation: 'default',
    version: 'initial',
    primary: { heading, label: null },
    items: [],
});

const mockPost: Content.BlogPostDocument = {
    id: 'mock-blog-post',
    uid: 'shipping-the-blog',
    url: '/blog/shipping-the-blog',
    type: 'blog_post',
    href: 'https://example.com/mock',
    tags: [],
    first_publication_date: '2026-07-06T00:00:00+0000',
    last_publication_date: '2026-07-06T00:00:00+0000',
    slugs: ['shipping-the-blog'],
    linked_documents: [],
    lang: 'en-us',
    alternate_languages: [],
    data: {
        title: titleField,
        image: mockImage,
        body: [
            richTextSlice('slice-1', richBody),
            richTextSlice('slice-2', richBodyTwo),
            headingSlice('slice-3', headingField),
        ],
        meta_title: 'Shipping the blog',
        meta_description: 'Rewriting heyscott on a modern stack',
        meta_image: mockImage,
    },
};

export const Default: Story = {
    args: { post: mockPost },
};

/**
 * Mobile — shows the iMessage thread-screen header at the top: the POST's own
 * avatar + title (centered) with an italic Georgia "i" info button, plus a back
 * chevron (left) that opens the Posts list. Mobile-only; hidden on desktop where
 * the Posts rail is always visible.
 */
export const Mobile: Story = {
    args: { post: mockPost },
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

/** A minimal post: title only, no image or body slices. */
export const TitleOnly: Story = {
    args: {
        post: {
            ...mockPost,
            data: {
                ...mockPost.data,
                image: {
                    id: null,
                    url: null,
                    alt: null,
                    copyright: null,
                    dimensions: null,
                    edit: null,
                },
                body: [],
            },
        },
    },
};
