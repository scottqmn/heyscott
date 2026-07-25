'use client';

import { usePathname } from 'next/navigation';
import { usePostSidebar } from '@/components/PostSidebar/PostSidebarContext';

type PostListComposerProps = {
    /** Placeholder text shown in the compose-bar pill. */
    placeholder?: string;
};

/**
 * A bottom-anchored iMessage compose bar: a single full-width rounded pill
 * text input that FLOATS over the page (its own blur + faint translucent fill,
 * no panel/bar behind it). It is **decorative for now** — a real, focusable
 * input the visitor can type into, but submitting does NOTHING. Post links live
 * in the {@link PostSidebar} now, not here.
 *
 * SCOPED (D6): the composer belongs to the thread surfaces, so it does NOT
 * render on `/contact` (which has its own compose bar) and NOT while the mobile
 * Posts overlay is open (the design's list screen has no composer). It's a
 * client component only so it can read the route + overlay state; the input
 * itself is still plain and JS-free.
 */
export const PostListComposer = ({
    placeholder = 'Read the blog…',
}: PostListComposerProps) => {
    const pathname = usePathname();
    const sidebar = usePostSidebar();

    if (pathname === '/contact' || sidebar?.open) return null;

    return (
        // Offset by the 334px rail on md+ so the pill sits in the content area
        // (beside the sidebar), aligned with the main panel — not centered in
        // the full viewport where it'd hide behind the fixed rail. Full-width on
        // mobile (no rail).
        <div className='fixed inset-x-0 bottom-0 z-50 md:pl-[334px]'>
            {/* The compose bar has NO panel/frame — the full-width pill itself
                floats over the page (its own blur + faint fill keep it legible),
                reading as a hovering control, not a docked bar. Pad the bottom
                past the iOS home indicator / bottom toolbar (safe-area inset) so
                it isn't tucked under system UI where taps get swallowed. */}
            <div className='pb-[env(safe-area-inset-bottom)]'>
                <div className='mx-auto max-w-xl px-4 py-2.5'>
                    <input
                        type='text'
                        placeholder={placeholder}
                        aria-label='Message'
                        className='w-full touch-manipulation rounded-full border border-border bg-background/60 px-4 py-2 text-base text-foreground backdrop-blur transition-colors placeholder:text-muted-foreground hover:border-muted-foreground/40 focus:border-muted-foreground/40 focus:outline-none'
                    />
                </div>
            </div>
        </div>
    );
};
