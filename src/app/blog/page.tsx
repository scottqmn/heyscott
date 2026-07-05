import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog — Hey Scott!',
    description: 'Notes and posts from Scott.',
};

/**
 * The blog index's content (a lead-in + the post list) is rendered as
 * conversation messages by `ConversationView`; this route just needs to exist.
 */
export default function BlogIndex() {
    return null;
}
