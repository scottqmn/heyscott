/**
 * Opacity applied to messages that are scrolled out of the focus zone.
 * Tunable — bump toward 1 for a subtler effect, toward 0 for a stronger one.
 */
export const UNFOCUSED_OPACITY = 0.6;

/** Opacity of the message currently in the focus zone. */
export const FOCUSED_OPACITY = 1;

/**
 * IntersectionObserver rootMargin that shrinks the viewport to a horizontal
 * band through its vertical center, so the "focused" message is roughly the
 * one the reader is looking at rather than anything merely on screen.
 */
export const FOCUS_ROOT_MARGIN = '-40% 0px -40% 0px';
