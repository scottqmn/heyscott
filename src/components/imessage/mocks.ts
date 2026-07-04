import type { FilledImageFieldImage, RichTextField } from '@prismicio/client';

/**
 * Self-contained mock content for Storybook stories — a data-URI SVG stands in
 * for a real photo so stories render identically offline and in CI (no network,
 * no live Prismic repo).
 */
const PLACEHOLDER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
    <stop offset='0' stop-color='%23075b97'/><stop offset='1' stop-color='%234aa3df'/>
  </linearGradient></defs>
  <rect width='800' height='600' fill='url(%23g)'/>
  <text x='400' y='310' font-family='sans-serif' font-size='48' fill='white' text-anchor='middle'>photo.jpg</text>
</svg>`;

const PLACEHOLDER_URL = `data:image/svg+xml;utf8,${PLACEHOLDER_SVG.replace(/\n\s*/g, '')}`;

export const mockImage: FilledImageFieldImage = {
    id: 'mock-image',
    url: PLACEHOLDER_URL,
    alt: 'A placeholder attachment',
    copyright: null,
    dimensions: { width: 800, height: 600 },
    edit: { x: 0, y: 0, zoom: 1, background: 'transparent' },
};

/** A short conversation: headings (incoming) + text/list/image (outgoing). */
export const mockConversation: RichTextField = [
    { type: 'heading1', text: 'Shipping the blog', spans: [] },
    {
        type: 'paragraph',
        text: 'Rewrote heyscott on the modern stack this week.',
        spans: [],
    },
    { type: 'heading2', text: 'What changed', spans: [] },
    { type: 'list-item', text: 'Next 16 + React 19', spans: [] },
    { type: 'list-item', text: 'Tailwind v4 theme tokens', spans: [] },
    { type: 'list-item', text: 'A Prismic-backed blog', spans: [] },
    {
        type: 'paragraph',
        text: 'And it all renders as an iMessage conversation.',
        spans: [],
    },
    {
        type: 'image',
        id: mockImage.id,
        url: mockImage.url,
        alt: mockImage.alt,
        copyright: mockImage.copyright,
        dimensions: mockImage.dimensions,
        edit: mockImage.edit,
    },
];
