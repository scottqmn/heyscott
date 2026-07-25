'use client';

import { useRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * The floating composer input (same look as {@link PostListComposer}'s
 * "Read the blog…" pill) as an AUTO-GROWING `<textarea>`: starts at 1 row and
 * grows with content up to 4 rows (`leading-6` × 4 + `py-2` padding = 7rem),
 * then scrolls. Decorative for now — submit stays inert per the compose-screen
 * decision; this is only about the input's form + behavior.
 */
export const ComposerTextarea = ({
    className,
    ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    const resize = () => {
        const el = ref.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    return (
        <textarea
            ref={ref}
            rows={1}
            onInput={resize}
            className={cn(
                'w-full resize-none touch-manipulation rounded-[22px] border border-border bg-background/60 px-4 py-2 text-base leading-6 text-foreground backdrop-blur transition-colors placeholder:text-muted-foreground hover:border-muted-foreground/40 focus:border-muted-foreground/40 focus:outline-none',
                // Cap at 4 rows, then scroll.
                'max-h-[7rem] overflow-y-auto',
                className
            )}
            {...props}
        />
    );
};
