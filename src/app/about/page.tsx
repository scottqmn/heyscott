import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About — Hey Scott!',
    description: 'A developer based in Los Angeles, CA.',
};

/**
 * The about page's content is rendered as conversation messages by
 * `ConversationView` (see `content.ts`); this route just needs to exist.
 */
export default function About() {
    return null;
}
