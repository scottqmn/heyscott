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
