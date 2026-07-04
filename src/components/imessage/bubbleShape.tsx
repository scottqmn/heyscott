export type BubbleDirection = 'incoming' | 'outgoing';

/** Corner radius (px) of the bubble body — constant regardless of bubble size. */
export const BUBBLE_RADIUS = 18;
/** How far (px) the tail flicks out past the body on the tail side. */
export const BUBBLE_TAIL_OUT = 6;

/**
 * Builds the SVG path for the tail that hooks off the body's bottom corner,
 * for the outgoing (right) side. `bodyW` is the body's width, `h` its height,
 * `r` its corner radius, and `q` the tail protrusion; the tip lands at
 * (`bodyW + q`, `h`).
 */
export function tailPath(bodyW: number, h: number, r: number, q: number) {
    return [
        `M ${bodyW - r} ${h}`,
        `Q ${bodyW} ${h} ${bodyW + q} ${h}`,
        `Q ${bodyW + 2} ${h - 9} ${bodyW - 6} ${h - r}`,
        'Z',
    ].join(' ');
}

type SilhouetteProps = {
    width: number;
    height: number;
    direction: BubbleDirection;
    radius?: number;
    tailOut?: number;
};

/**
 * The raw SVG shapes whose UNION is the speech-bubble silhouette: a rounded
 * rectangle body (inset by the tail protrusion on the tail side) plus the tail
 * hooking off the bottom corner — right for outgoing, mirrored to the left for
 * incoming. Dynamic: the body stretches to the given width/height while the
 * corner radius and tail stay a constant pixel size.
 *
 * Render inside a `<clipPath>` to mask media to the bubble shape (tail
 * included), or inside a colored `<g>` to paint a text bubble's background.
 */
export function BubbleSilhouette({
    width,
    height,
    direction,
    radius = BUBBLE_RADIUS,
    tailOut = BUBBLE_TAIL_OUT,
}: SilhouetteProps) {
    const q = Math.max(0, Math.min(tailOut, width * 0.25));
    const bodyW = width - q;
    const r = Math.max(0, Math.min(radius, bodyW / 2, height / 2));

    const shapes = (
        <>
            <rect x={0} y={0} width={bodyW} height={height} rx={r} ry={r} />
            <path d={tailPath(bodyW, height, r, q)} />
        </>
    );

    if (direction === 'outgoing') return shapes;
    // Mirror the whole silhouette across the vertical centerline for incoming.
    return <g transform={`translate(${width}, 0) scale(-1, 1)`}>{shapes}</g>;
}
