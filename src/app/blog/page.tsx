import { HomeConversation } from '@/components/HomeConversation';

/**
 * The blog index. The design's desktop pane always shows a conversation, never a
 * blank pane — so `/blog` renders the homepage "Scott" conversation in the main
 * pane (the same content `/` uses) rather than an empty `<main>`. The sidebar
 * (global layout) is the actual post index.
 */
export default function BlogIndexPage() {
    return <HomeConversation />;
}
