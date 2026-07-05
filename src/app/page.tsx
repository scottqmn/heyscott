/**
 * The homepage renders nothing itself — the site is one continuous
 * conversation rendered by `ConversationView` in the root layout, which derives
 * each page's messages from the URL. This page just needs to exist as the `/`
 * route so navigation resolves.
 */
export default function Home() {
    return null;
}
