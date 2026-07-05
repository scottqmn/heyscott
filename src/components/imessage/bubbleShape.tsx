export type BubbleDirection = 'incoming' | 'outgoing';

/*
 * The bubble + tail silhouette, reproducing heyscott's ORIGINAL human-made
 * iMessage tail (Messages/components/Message/Message.module.scss). That tail is
 * a rounded body with a same-color `::before` bulge hooking off the bottom
 * corner and a background-colored `::after` that carves the concave underside —
 * a compact "scoop-and-hook".
 *
 * We rebuild the identical shape as ONE `<clipPath>` = rounded-rect body ∪ a
 * single traced "tail-hook" path (the visible `::before − ::after` region).
 * A single-path clipPath (not a CSS mask) is what maps reliably onto both an
 * SVG `<rect>` (text bubbles) and an HTML element via `clip-path` (masked
 * media) — CSS `mask-image` referencing an SVG `<mask>` renders inconsistently.
 * All tail metrics are the originals; like the CSS, the tail is a CONSTANT
 * pixel size regardless of the bubble's size.
 */

/** Body corner radius (px) — from the original `.bubble { border-radius: 25px }`. */
export const BUBBLE_RADIUS = 25;
/** How far (px) the tail flicks out past the body (original `::before right:-7`). */
export const BUBBLE_TAIL_OUT = 7;

const TAIL_HEIGHT = 25; // original ::before/::after height
const BEFORE_INSET = 13; // ::before left edge sits 13px inside the body edge
const BEFORE_CORNER_RX = 16; // ::before bottom-inner corner (16px 14px)
const BEFORE_CORNER_RY = 14;
const AFTER_CORNER = 10; // ::after bottom-inner corner radius
/**
 * Corner radius on the tail-side edge where consecutive same-sender bubbles
 * connect within a group — deliberately MORE rounded than the body so the
 * connecting corners bulge (clamped to the bubble's geometry).
 */
const GROUPED_RADIUS = 40;

type Corners = { tl: number; tr: number; br: number; bl: number };

/**
 * A rounded-rectangle body with independent corner radii, authored for the
 * outgoing side and mirrored (in JS) for incoming. Grouped bubbles flatten the
 * tail-side corners here, the way real iMessage tightens a stack.
 */
function bodyPath(
    bw: number,
    height: number,
    { tl, tr, br, bl }: Corners,
    mirror: boolean,
    totalWidth: number
): string {
    const mx = (x: number) => (mirror ? totalWidth - x : x);
    const s = mirror ? 0 : 1; // arc sweep — flips with the mirror to stay convex
    return [
        `M ${mx(tl)} 0`,
        `H ${mx(bw - tr)}`,
        `A ${tr} ${tr} 0 0 ${s} ${mx(bw)} ${tr}`,
        `V ${height - br}`,
        `A ${br} ${br} 0 0 ${s} ${mx(bw - br)} ${height}`,
        `H ${mx(bl)}`,
        `A ${bl} ${bl} 0 0 ${s} ${mx(0)} ${height - bl}`,
        `V ${tl}`,
        `A ${tl} ${tl} 0 0 ${s} ${mx(tl)} 0`,
        'Z',
    ].join(' ');
}

/**
 * The tail-hook as a single path. Authored for the outgoing (bottom-right)
 * side: the hook fills the body's rounded-corner cutout from `bw - 13` and
 * flicks out to the tip at (`bw + 7`, `height`), with the `::after` corner arc
 * carving its concave underside. For incoming it is mirrored by computing
 * `totalWidth - x` on every coordinate (and flipping the arc sweep) — done in
 * JS rather than an SVG `<g transform>`, which does not clip reliably inside a
 * `<clipPath>`.
 */
function tailHookPath(
    bw: number,
    height: number,
    mirror: boolean,
    totalWidth: number
): string {
    const q = BUBBLE_TAIL_OUT;
    // Where ::before's right edge (x = bw + q) meets the ::after carve arc.
    const yTip = height - AFTER_CORNER + Math.sqrt(AFTER_CORNER ** 2 - (q - AFTER_CORNER) ** 2);
    const mx = (x: number) => (mirror ? totalWidth - x : x);
    const sweep = mirror ? 1 : 0;
    return [
        `M ${mx(bw - BEFORE_INSET)} ${height - TAIL_HEIGHT}`,
        `H ${mx(bw)}`,
        `L ${mx(bw)} ${height - AFTER_CORNER}`,
        `A ${AFTER_CORNER} ${AFTER_CORNER} 0 0 ${sweep} ${mx(bw + q)} ${yTip}`, // carved underside
        `L ${mx(bw + q)} ${height}`,
        `H ${mx(bw - BEFORE_INSET + BEFORE_CORNER_RX)}`,
        `Q ${mx(bw - BEFORE_INSET)} ${height} ${mx(bw - BEFORE_INSET)} ${height - BEFORE_CORNER_RY}`,
        'Z',
    ].join(' ');
}

type BubbleClipProps = {
    id: string;
    width: number;
    height: number;
    direction: BubbleDirection;
    /** Draw the tail. Omitted for grouped messages that aren't the group's last. */
    tail?: boolean;
    /** Flatten the tail-side TOP corner (a same-side message sits above). */
    flattenTop?: boolean;
    /** Flatten the tail-side BOTTOM corner (a same-side message sits below). */
    flattenBottom?: boolean;
};

/**
 * A `<clipPath>` (userSpaceOnUse) whose region is the original bubble+tail
 * silhouette: a rounded body optionally unioned with the tail hook. `width`
 * includes the {@link BUBBLE_TAIL_OUT} protrusion, so the body is
 * `width - BUBBLE_TAIL_OUT` wide and the tail tip lands at (`width`, `height`) —
 * mirrored to the left for incoming.
 *
 * Grouped messages set `tail={false}` (no hook) and flatten the tail-side
 * corners that touch their group neighbors. Reference it via
 * `clip-path: url(#id)` from an SVG `<rect>` (text) or an HTML element (media).
 */
export function BubbleClip({
    id,
    width,
    height,
    direction,
    tail = true,
    flattenTop = false,
    flattenBottom = false,
}: BubbleClipProps) {
    const bw = width - BUBBLE_TAIL_OUT;
    const r = Math.max(0, Math.min(BUBBLE_RADIUS, bw / 2, height / 2));
    // Extra-round the corners where the bubble connects to a group neighbor,
    // clamped to the bubble's own geometry.
    const groupedR = Math.max(0, Math.min(GROUPED_RADIUS, bw / 2, height / 2));
    const mirror = direction === 'incoming';
    // Tail-side corners are the top/bottom-right (mirrored to the left for
    // incoming). Round them MORE where the bubble stacks; the bottom-right
    // corner stays the body radius when the tail is drawn (the hook owns it).
    const corners: Corners = {
        tl: r,
        bl: r,
        tr: flattenTop ? groupedR : r,
        br: tail ? r : flattenBottom ? groupedR : r,
    };
    return (
        <clipPath id={id} clipPathUnits='userSpaceOnUse'>
            <path d={bodyPath(bw, height, corners, mirror, width)} />
            {tail && <path d={tailHookPath(bw, height, mirror, width)} />}
        </clipPath>
    );
}
