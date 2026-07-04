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

const TALL_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='1040'>
  <defs><linearGradient id='t' x1='0' y1='0' x2='0' y2='1'>
    <stop offset='0' stop-color='%234aa3df'/><stop offset='1' stop-color='%23075b97'/>
  </linearGradient></defs>
  <rect width='640' height='1040' fill='url(%23t)'/>
  <text x='320' y='530' font-family='sans-serif' font-size='44' fill='white' text-anchor='middle'>tall.jpg</text>
</svg>`;

/** A portrait attachment, to show the mask scaling to a tall bubble. */
export const mockTallImage: FilledImageFieldImage = {
    id: 'mock-tall-image',
    url: `data:image/svg+xml;utf8,${TALL_SVG.replace(/\n\s*/g, '')}`,
    alt: 'A tall placeholder attachment',
    copyright: null,
    dimensions: { width: 640, height: 1040 },
    edit: { x: 0, y: 0, zoom: 1, background: 'transparent' },
};

/** Short / medium content, to show the bubble hugging across content lengths. */
export const SHORT_TEXT = 'On it 👍';
export const MEDIUM_TEXT =
    'Rewrote heyscott on the modern stack this week — new blog, iMessage bubbles, and a Storybook.';

/** A wall of text, to show the bubble body + tail SVG growing and wrapping. */
export const LOREM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ' +
    'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
    'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate ' +
    'velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint ' +
    'occaecat cupidatat non proident, sunt in culpa qui officia deserunt ' +
    'mollit anim id est laborum.';

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
