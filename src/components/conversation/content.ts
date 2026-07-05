/**
 * Hardcoded incoming copy for non-post pages (Scott's side of the
 * conversation). Blog post bodies come from `src/lib/posts.ts` instead.
 *
 * PLACEHOLDER: this is stand-in copy while Scott's real homepage/about text is
 * pending — swap in the actual copy when it's available.
 */

/** `/` — reuses the homepage splash's messages. */
export const HOME_LINES = [
    "Hey! I'm a little busy at the moment.",
    'Talk soon?',
];

/** `/about` — placeholder about copy. */
export const ABOUT_LINES = [
    "I'm Scott — a developer based in Los Angeles.",
    'I build for the web and, apparently, turn my whole site into a text thread.',
    '(This about copy is a placeholder for now.)',
];

/** `/blog` — a lead-in before the post list. */
export const BLOG_LINES = ["Here's what I've been writing lately 👇"];

/** Unknown `/blog/<slug>`. */
export const NOT_FOUND_LINES = ["Hmm, I can't find that one — try another?"];

/** Lead-in before in-thread recirculation links. */
export const RECIRC_LEAD = 'A few more things I wrote:';
