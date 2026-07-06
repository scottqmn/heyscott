import { Messages } from '@/components/Messages';

/**
 * The whole live site is currently just the iMessage splash (matching
 * heyscott.com exactly): a "Hey Scott" sent bubble, then "Hey! I'm a little
 * busy at the moment." / "Talk soon?" received bubbles — no links, no nav. No
 * other routes are wired up yet; the blog + the iMessage component library
 * still live in the codebase (and in Storybook) but aren't linked into the
 * live site.
 */
export default function Home() {
    return (
        <main>
            <Messages />
        </main>
    );
}
