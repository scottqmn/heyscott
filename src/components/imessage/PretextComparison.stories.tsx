import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DynamicBubble, type MeasureStrategy } from './DynamicBubble';
import { LOREM, MEDIUM_TEXT, SHORT_TEXT } from './mocks';

/**
 * **Experiment — DIY vs. pretext, side by side.**
 *
 * The exact same content rendered with both text-hug measurement engines so the
 * wrap tightness / correctness can be compared directly:
 *  - **left** `measure="dom"` — the current DIY approach (force the real DOM to
 *    wrap and read it back with `getClientRects`; exact, but N reflows/measure).
 *  - **right** `measure="pretext"` — `@chenglou/pretext` canvas measurement
 *    (no reflow, but only *approximates* the browser's line-breaking).
 *
 * Both columns use an identical fixed column width, so the only variable is the
 * measurement engine. Watch the box width: pretext hugs equal-or-looser, and
 * most looser on CJK — but it never overflows / adds a line. Full write-up and
 * numbers in `pretext-experiment/README.md`. This branch
 * (`fm/heyscott-pretext-t7`) is a throwaway comparison — not for merge.
 */
const meta = {
    title: 'iMessage/PretextComparison',
    component: DynamicBubble,
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DynamicBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A short CJK + Latin + emoji mix — where the two engines diverge the most. */
const CJK_TEXT =
    '这是一个中文测试 mixed with English and emoji 🚀 to see how it wraps.';
/** A long unbreakable token (URL) — stresses overflow-wrap handling. */
const URL_TEXT =
    'Check out https://github.com/chenglou/pretext for the source and README.';

const CASES: { label: string; text: string }[] = [
    { label: 'short', text: SHORT_TEXT },
    { label: 'medium', text: MEDIUM_TEXT },
    { label: 'long', text: LOREM },
    { label: 'url', text: URL_TEXT },
    { label: 'cjk + latin', text: CJK_TEXT },
];

/** One case rendered both directions with a given strategy, in a fixed cell. */
function CaseBlock({
    label,
    text,
    strategy,
    cellW,
}: {
    label: string;
    text: string;
    strategy: MeasureStrategy;
    cellW: number;
}) {
    return (
        <div className='space-y-2'>
            <p className='text-muted-foreground text-xs tracking-wide uppercase'>
                {label}
            </p>
            {/* Fixed-width cell → both engines see the identical max width. */}
            <div style={{ width: cellW, maxWidth: '100%' }} className='space-y-2'>
                <div className='flex justify-end'>
                    <DynamicBubble direction='outgoing' measure={strategy}>
                        {text}
                    </DynamicBubble>
                </div>
                <div className='flex justify-start'>
                    <DynamicBubble direction='incoming' measure={strategy}>
                        {text}
                    </DynamicBubble>
                </div>
            </div>
        </div>
    );
}

function Column({
    strategy,
    title,
    subtitle,
    cellW,
}: {
    strategy: MeasureStrategy;
    title: string;
    subtitle: string;
    cellW: number;
}) {
    return (
        <div className='space-y-6'>
            <div className='border-border border-b pb-2'>
                <h2 className='text-base font-semibold'>{title}</h2>
                <p className='text-muted-foreground text-sm'>{subtitle}</p>
            </div>
            {CASES.map((c) => (
                <CaseBlock
                    key={c.label}
                    label={c.label}
                    text={c.text}
                    strategy={strategy}
                    cellW={cellW}
                />
            ))}
        </div>
    );
}

function Comparison({ cellW }: { cellW: number }) {
    return (
        <div className='p-8'>
            <div className='mx-auto grid max-w-5xl grid-cols-2 gap-10'>
                <Column
                    strategy='dom'
                    title='DIY — measure="dom"'
                    subtitle='getClientRects binary-search · exact, reflows'
                    cellW={cellW}
                />
                <Column
                    strategy='pretext'
                    title='pretext — measure="pretext"'
                    subtitle='canvas measurement · no reflow, approximate'
                    cellW={cellW}
                />
            </div>
        </div>
    );
}

/**
 * The headline comparison at ~318px of text width. For Latin/URL content the two
 * engines render **identically** (pretext matches the DOM wrap exactly). The
 * **CJK row is where they visibly diverge**: pretext hugs to a clearly wider box
 * than the DIY DOM measure — its approximation of CJK line-breaking is looser.
 * In every row the line count matches, so nothing overflows.
 */
export const SideBySide: Story = {
    // `args` satisfy the typed component; the custom render ignores them.
    args: { children: null, direction: 'incoming' },
    render: () => <Comparison cellW={430} />,
};

/**
 * Generous columns — with more room the engines agree even more; the CJK gap
 * shrinks too. Shows the divergence is width- and script-dependent, not
 * constant: pretext is closest to the DOM when there's slack.
 */
export const WideColumns: Story = {
    args: { children: null, direction: 'incoming' },
    render: () => <Comparison cellW={600} />,
};
