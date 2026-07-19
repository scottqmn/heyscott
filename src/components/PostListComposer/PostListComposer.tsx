type PostListComposerProps = {
    /** Placeholder text shown in the compose-bar pill. */
    placeholder?: string;
};

/**
 * A bottom-anchored iMessage compose bar: a single full-width rounded pill
 * text input that FLOATS over the page (its own blur + faint translucent fill,
 * no panel/bar behind it). It is **decorative for now** — a real, focusable
 * input the visitor can type into, but submitting does NOTHING (no send, no
 * navigation); the payoff comes later. Post links live in the {@link PostSidebar}
 * now, not here. The name is kept for import stability even though it no longer
 * composes a list.
 *
 * NOTE: a plain `<input>` needs no client JS to be focusable/typeable, so this
 * is a server component — keeping the floating chrome free of a JS dependency,
 * in the spirit of the JS-free splash.
 */
export const PostListComposer = ({
    placeholder = 'Read the blog…',
}: PostListComposerProps) => {
    return (
        <div className='fixed inset-x-0 bottom-0 z-50'>
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
