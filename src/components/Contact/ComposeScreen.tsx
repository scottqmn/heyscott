'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeftGlyph } from '@/components/PostSidebar/parts';
import { cn } from '@/lib/utils';
import { ComposerTextarea } from './ComposerTextarea';

/** Up-arrow for the send button. */
const SendArrowGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={16}
        height={16}
        fill='none'
        stroke='currentColor'
        strokeWidth={2.5}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M12 19V5' />
        <path d='M5 12l7-7 7 7' />
    </svg>
);

/** Plus glyph for the attach circle. */
const PlusGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={16}
        height={16}
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
    >
        <path d='M12 5v14M5 12h14' />
    </svg>
);

/** Outline chat-bubble glyph for the empty state. */
const ChatBubbleGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={26}
        height={26}
        fill='none'
        stroke='currentColor'
        strokeWidth={1.75}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z' />
    </svg>
);

/** Small blue check-circle shown once the email validates. */
const CheckCircle = () => (
    <span className='flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-[var(--sidebar-accent)] text-white'>
        <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            width={12}
            height={12}
            fill='none'
            stroke='currentColor'
            strokeWidth={3}
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <path d='M20 6 9 17l-5-5' />
        </svg>
    </span>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The `/contact` "New Message" compose screen, rebuilt on `Compose.dc.html`'s
 * three regions: (1) a `From:` email row with a red "Required" hint when
 * touched-invalid and a blue check circle when it validates; (2) a centered
 * empty state (a 54px `--in-bubble` bubble glyph + copy); (3) a docked bottom
 * composer bar — a `+` circle, an auto-growing message pill, and a send button
 * whose fill is `--tertiary` until (email valid && body non-empty), then accent.
 *
 * DECORATIVE (per the captain): Send doesn't actually send — it just flips a
 * "Delivered" line — but the enabled/disabled styling is real. Header follows
 * D19: mobile shows a back chevron (no "Done"); desktop shows "Done" (no back).
 */
export const ComposeScreen = () => {
    const [email, setEmail] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [message, setMessage] = useState('');
    const [delivered, setDelivered] = useState(false);

    const emailValid = EMAIL_RE.test(email.trim());
    const showRequired = emailTouched && !emailValid;
    const canSend = emailValid && message.trim().length > 0;

    const send = () => {
        if (!canSend) return;
        setDelivered(true);
    };

    return (
        <main className='flex min-h-screen flex-col'>
            {/* Header (56px, blurred): mobile back chevron / desktop "Done". */}
            <div className='sticky top-0 z-30 flex h-14 shrink-0 items-center justify-center border-b border-[var(--sidebar-separator)] bg-[var(--panel-bg)] px-[18px] backdrop-blur-[20px] [-webkit-backdrop-filter:blur(20px)]'>
                <Link
                    href='/'
                    aria-label='Back'
                    className='absolute left-2 flex items-center text-[var(--sidebar-accent)] md:hidden'
                >
                    <ChevronLeftGlyph />
                </Link>
                <span className='text-[15px] font-semibold text-[var(--sidebar-primary)]'>
                    New Message
                </span>
                <Link
                    href='/'
                    className='absolute right-[18px] hidden text-[15px] font-semibold text-[var(--sidebar-accent)] md:block'
                >
                    Done
                </Link>
            </div>

            {/* From: email row. */}
            <div className='flex min-h-[44px] shrink-0 items-center gap-2 border-b border-[var(--sidebar-separator)] px-4 py-[11px]'>
                <label
                    htmlFor='contact-email'
                    className='text-[16px] text-[var(--sidebar-secondary)]'
                >
                    From:
                </label>
                <input
                    id='contact-email'
                    type='email'
                    inputMode='email'
                    autoComplete='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder='your@email.com'
                    aria-invalid={showRequired || undefined}
                    className='min-w-0 flex-1 bg-transparent text-[16px] text-[var(--sidebar-primary)] placeholder:text-[var(--sidebar-secondary)] focus:outline-none'
                />
                {showRequired && (
                    <span className='shrink-0 text-[13px] text-[#ff3b30]'>
                        Required
                    </span>
                )}
                {emailValid && <CheckCircle />}
            </div>

            {/* Centered empty state. */}
            <div className='flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center'>
                <div className='flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[var(--color-imessage-received)] text-[var(--sidebar-secondary)]'>
                    <ChatBubbleGlyph />
                </div>
                <p className='max-w-[290px] text-[15px] text-[var(--sidebar-secondary)]'>
                    Questions, corrections, or a good book recommendation…
                </p>
                {delivered && (
                    <p className='text-[13px] font-medium text-[var(--sidebar-accent)]'>
                        Delivered
                    </p>
                )}
            </div>

            {/* Docked composer bar. */}
            <div className='sticky bottom-0 flex shrink-0 items-end gap-2 border-t border-[var(--sidebar-separator)] bg-[var(--panel-bg)] px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-[20px] [-webkit-backdrop-filter:blur(20px)]'>
                <button
                    type='button'
                    aria-label='Add attachment'
                    aria-disabled='true'
                    className='mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--sidebar-separator)] text-[var(--sidebar-tertiary)]'
                >
                    <PlusGlyph />
                </button>
                <label className='sr-only' htmlFor='contact-message'>
                    Message
                </label>
                <ComposerTextarea
                    id='contact-message'
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder='Message'
                    className='max-h-[84px] flex-1 rounded-[18px] border-[var(--sidebar-separator)] bg-background'
                />
                <button
                    type='button'
                    aria-label='Send'
                    aria-disabled={!canSend || undefined}
                    onClick={send}
                    className={cn(
                        'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-colors',
                        canSend
                            ? 'bg-[var(--sidebar-accent)]'
                            : 'bg-[var(--sidebar-tertiary)]'
                    )}
                >
                    <SendArrowGlyph />
                </button>
            </div>
        </main>
    );
};
