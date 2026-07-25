/**
 * The design's centered `Jul 14  ·  3 min read` divider (D10) — the first child
 * of the thread, above the first bubble: 11px `--tertiary`, the date bold in
 * `--secondary`. Centered in the same column as the bubbles.
 */
export const ThreadDateDivider = ({
    date,
    readTime,
}: {
    date: string;
    readTime: string;
}) => (
    <div className='mx-auto w-full max-w-xl px-5'>
        <div className='py-1 text-center text-[11px] text-[var(--sidebar-tertiary)]'>
            <b className='font-semibold text-[var(--sidebar-secondary)]'>
                {date}
            </b>
            {'  ·  '}
            {readTime}
        </div>
    </div>
);
