import type { FilledImageFieldImage, RichTextField } from '@prismicio/client';

/**
 * Mock content for Storybook stories. Images use seeded picsum.photos URLs so
 * they're real photos yet stable across reloads (the `/seed/<name>` keeps the
 * same image each time).
 */
export const mockImage: FilledImageFieldImage = {
    id: 'mock-image',
    url: 'https://picsum.photos/seed/heyscott-photo/900/600',
    alt: 'A landscape attachment',
    copyright: null,
    dimensions: { width: 900, height: 600 },
    edit: { x: 0, y: 0, zoom: 1, background: 'transparent' },
};

/** A portrait attachment, to show the mask scaling to a tall bubble. */
export const mockTallImage: FilledImageFieldImage = {
    id: 'mock-tall-image',
    url: 'https://picsum.photos/seed/heyscott-tall/640/1040',
    alt: 'A tall portrait attachment',
    copyright: null,
    dimensions: { width: 640, height: 1040 },
    edit: { x: 0, y: 0, zoom: 1, background: 'transparent' },
};

/** A real YouTube embed URL for the embed placeholder story. */
export const MOCK_YOUTUBE_EMBED = 'https://www.youtube.com/embed/aqz-KE-bpKQ';

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

/** A short conversation: headings (outgoing) + text/list/image (incoming). */
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
