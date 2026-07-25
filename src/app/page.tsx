import { HomeConversation } from '@/components/HomeConversation';

/**
 * The homepage — Scott's identity rendered as the "Scott" iMessage conversation
 * (the SAME copy as the original splash), now framed by the global sidebar +
 * composer chrome. It's the pinned FIRST row in the sidebar (see `layout.tsx` /
 * `homeSidebarPost`) and the selected row on `/`. The original JS-free
 * `Messages` splash component is kept in the codebase (+ Storybook); the copy
 * lives in `Messages/constants.ts`, which `HomeConversation` reuses.
 */
export default function Home() {
    return <HomeConversation />;
}
