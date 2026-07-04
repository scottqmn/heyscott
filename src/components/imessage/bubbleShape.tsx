export type BubbleDirection = 'incoming' | 'outgoing';

/*
 * The bubble + tail silhouette, reproducing heyscott's ORIGINAL human-made
 * iMessage tail (Messages/components/Message/Message.module.scss). That tail is
 * a two-pseudo-element trick: a rounded bubble body, a same-color `::before`
 * bulge hooking off the bottom corner, and a background-colored `::after` that
 * carves the concave underside. We rebuild the identical shape as an SVG
 * `<mask>` (white = body ∪ before, black = after) so it can paint text bubbles
 * AND mask media to the same outline. All tail metrics are the originals; like
 * the CSS, the tail is a constant pixel size regardless of the bubble's size.
 */

/** Body corner radius (px) — from the original `.bubble { border-radius: 25px }`. */
export const BUBBLE_RADIUS = 25;
/** How far (px) the tail flicks out past the body (original `::before right:-7`). */
export const BUBBLE_TAIL_OUT = 7;

const TAIL_HEIGHT = 25; // original ::before/::after height
const BEFORE_LEFT_INSET = 13; // ::before left edge sits 13px inside the body edge
const BEFORE_CORNER_RX = 16; // ::before bottom-inner corner (border-bottom-*-radius: 16px 14px)
const BEFORE_CORNER_RY = 14;
const AFTER_WIDTH = 26; // ::after width
const AFTER_CORNER = 10; // ::after bottom-inner corner radius

type MaskShapesArgs = { width: number; height: number };

/**
 * The three shapes composing the mask, authored for the outgoing (tail
 * bottom-right) side. `width` includes the {@link BUBBLE_TAIL_OUT} protrusion,
 * so the body is `width - BUBBLE_TAIL_OUT` wide and the tail tip lands at
 * (`width`, `height`).
 */
function maskShapes({ width, height }: MaskShapesArgs) {
    const bw = width - BUBBLE_TAIL_OUT; // body width
    const r = Math.max(0, Math.min(BUBBLE_RADIUS, bw / 2, height / 2));
    const th = Math.min(TAIL_HEIGHT, height);
    const top = height - th;

    const beforeLeft = bw - BEFORE_LEFT_INSET;
    const before = [
        `M ${beforeLeft} ${top}`,
        `H ${width}`, // top edge to the tip's x (= bw + BUBBLE_TAIL_OUT)
        `V ${height}`, // down the tip edge
        `H ${beforeLeft + BEFORE_CORNER_RX}`, // back along the bottom
        `Q ${beforeLeft} ${height} ${beforeLeft} ${height - BEFORE_CORNER_RY}`, // inner corner
        'Z',
    ].join(' ');

    const after = [
        `M ${bw} ${top}`,
        `H ${bw + AFTER_WIDTH}`,
        `V ${height}`,
        `H ${bw + AFTER_CORNER}`,
        `Q ${bw} ${height} ${bw} ${height - AFTER_CORNER}`,
        'Z',
    ].join(' ');

    return { bw, r, before, after };
}

type BubbleMaskProps = {
    id: string;
    width: number;
    height: number;
    direction: BubbleDirection;
};

/**
 * An SVG `<mask>` (userSpaceOnUse) reproducing the original tail silhouette.
 * Reference it from a filled `<rect>` (text bubble) or via CSS `mask-image`
 * (media) to take the bubble+tail shape. Mirrored for incoming.
 */
export function BubbleMask({ id, width, height, direction }: BubbleMaskProps) {
    const { bw, r, before, after } = maskShapes({ width, height });
    const shapes = (
        <>
            <rect x={0} y={0} width={bw} height={height} rx={r} ry={r} fill='#fff' />
            <path d={before} fill='#fff' />
            <path d={after} fill='#000' />
        </>
    );
    return (
        <mask
            id={id}
            maskUnits='userSpaceOnUse'
            x={0}
            y={0}
            width={width}
            height={height}
        >
            {direction === 'outgoing' ? (
                shapes
            ) : (
                <g transform={`translate(${width}, 0) scale(-1, 1)`}>{shapes}</g>
            )}
        </mask>
    );
}
