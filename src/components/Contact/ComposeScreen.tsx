import Link from 'next/link';
import { PostAvatar } from '@/components/PostSidebar/parts';

/** An up-arrow for the iMessage blue send button. */
const SendArrowGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={18}
        height={18}
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

const fieldClass =
    'w-full rounded-[11px] bg-[var(--sidebar-search-bg)] px-3.5 py-2.5 text-[16px] text-[var(--sidebar-primary)] placeholder:text-[var(--sidebar-secondary)] focus:outline-none';

/**
 * The design's "New Message" compose screen, mapped onto a real contact page: a
 * 56px blurred `--panel-bg` header ("New Message" centered, a "Done" link back
 * to `/` on the right), then an iMessage "New Message to Scott" mockup — a To:
 * recipient chip, name + email, a message field, and the blue circular send.
 *
 * DECORATIVE for now, like the composer pill: the fields are real/typeable but
 * Send is inert (no submit, no destination). It ships as a UI mockup — a real
 * contact target (mailto vs backend) comes later. Not a `<form>`, so pressing
 * Enter never navigates.
 */
export const ComposeScreen = () => (
    <main className='min-h-screen'>
        {/* 56px blurred header: centered title + absolute "Done". */}
        <div className='sticky top-0 z-30 flex h-14 items-center justify-center border-b border-[var(--sidebar-separator)] bg-[var(--panel-bg)] px-[18px] backdrop-blur-[20px] [-webkit-backdrop-filter:blur(20px)]'>
            <span className='text-[15px] font-semibold text-[var(--sidebar-primary)]'>
                New Message
            </span>
            <Link
                href='/'
                className='absolute right-[18px] text-[15px] font-semibold text-[var(--sidebar-accent)]'
            >
                Done
            </Link>
        </div>

        {/* New-message-to-Scott mockup. A plain <div> (not a <form>) so it's
            inert — decorative for now, like the composer pill. */}
        <div className='mx-auto flex w-full max-w-xl flex-col gap-3 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+6rem)]'>
            {/* To: Scott recipient chip. */}
            <div className='flex items-center gap-2 border-b border-[var(--sidebar-separator)] pb-3'>
                <span className='text-[15px] text-[var(--sidebar-secondary)]'>
                    To:
                </span>
                <span className='flex items-center gap-1.5 rounded-full bg-[var(--sidebar-search-bg)] py-0.5 pr-2.5 pl-0.5'>
                    <PostAvatar
                        image={null}
                        title='Scott'
                        seed='scott'
                        className='h-6 w-6 text-[11px]'
                    />
                    <span className='text-[14px] font-medium text-[var(--sidebar-primary)]'>
                        Scott
                    </span>
                </span>
            </div>

            <label className='sr-only' htmlFor='contact-name'>
                Your name
            </label>
            <input
                id='contact-name'
                name='name'
                type='text'
                autoComplete='name'
                placeholder='Your name'
                className={fieldClass}
            />

            <label className='sr-only' htmlFor='contact-email'>
                Your email
            </label>
            <input
                id='contact-email'
                name='email'
                type='email'
                autoComplete='email'
                placeholder='Your email'
                className={fieldClass}
            />

            {/* Message + blue circular send. */}
            <div className='flex items-end gap-2'>
                <label className='sr-only' htmlFor='contact-message'>
                    Message
                </label>
                <textarea
                    id='contact-message'
                    name='message'
                    rows={5}
                    placeholder='iMessage'
                    className='min-h-[44px] w-full flex-1 resize-none rounded-[18px] border border-[var(--sidebar-separator)] bg-[var(--sidebar-bg)] px-3.5 py-2.5 text-[16px] text-[var(--sidebar-primary)] placeholder:text-[var(--sidebar-secondary)] focus:outline-none'
                />
                {/* Inert — decorative send (no submit / destination yet). */}
                <button
                    type='button'
                    aria-label='Send'
                    aria-disabled='true'
                    className='mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--sidebar-accent)] text-white'
                >
                    <SendArrowGlyph />
                </button>
            </div>

            <p className='text-[12px] text-[var(--sidebar-secondary)]'>
                Preview only — this compose screen is decorative for now.
            </p>
        </div>
    </main>
);
