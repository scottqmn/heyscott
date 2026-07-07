/**
 * Opacity a message starts at, before it has scrolled into view. It fades from
 * here up to full opacity as it's revealed. Tunable — toward 1 for a subtler
 * reveal, toward 0 for a stronger one.
 */
export const HIDDEN_OPACITY = 0.25;

/** Opacity of a message once it has been revealed. */
export const REVEALED_OPACITY = 1;

/**
 * IntersectionObserver rootMargin for the reveal trigger. The negative bottom
 * margin reveals a message a little after it enters from the bottom, so the
 * fade-in reads as it scrolls up into view.
 */
export const REVEAL_ROOT_MARGIN = '0px 0px -10% 0px';

/**
 * Entrance animation for the reveal WRAPPERS (`RevealOnView` / `QueuedReveal`) —
 * matches the splash `splashIn` feel (globals.css): fade in while un-nudging a
 * small downward offset and a very slight shrink. Shared so both wrappers reveal
 * identically. (The `Message` bubble reveal is a plain opacity fade from
 * {@link HIDDEN_OPACITY}; these constants drive the transform-based wrappers.)
 */
export const REVEAL_DURATION_MS = 500;
export const REVEAL_EASING = 'ease-out';
/** Hidden (pre-reveal) transform: nudged down + very slightly shrunk. */
export const REVEAL_HIDDEN_TRANSFORM = 'translateY(12px) scale(0.98)';
/** Revealed transform: settled into place. */
export const REVEAL_REVEALED_TRANSFORM = 'translateY(0) scale(1)';
