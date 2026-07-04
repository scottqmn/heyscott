import { clsx } from 'clsx';

export type ReceiptStatus = 'delivered' | 'read';

type ReadReceiptProps = {
    status: ReceiptStatus;
    className?: string;
};

const LABEL: Record<ReceiptStatus, string> = {
    delivered: 'Delivered',
    read: 'Read',
};

/**
 * The status line shown under the last outgoing message. A single check for
 * "Delivered", a double check for "Read" — drawn as SVG so the ticks stay
 * crisp at any size — followed by the text label, mirroring iMessage chrome.
 */
export const ReadReceipt = ({ status, className }: ReadReceiptProps) => {
    const read = status === 'read';
    return (
        <div
            className={clsx(
                'mt-0.5 flex items-center justify-end gap-1 pr-2 text-[0.7rem] text-muted-foreground',
                className
            )}
        >
            <svg
                width='16'
                height='10'
                viewBox='0 0 16 10'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden='true'
                focusable='false'
            >
                <polyline points='1 5.5 4 8.5 9 2' />
                {read && <polyline points='7 8.5 12 2' />}
            </svg>
            <span className={clsx(read && 'font-medium text-foreground')}>
                {LABEL[status]}
            </span>
        </div>
    );
};
