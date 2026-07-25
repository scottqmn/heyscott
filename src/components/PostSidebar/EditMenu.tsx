'use client';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ThemeToggle } from './ThemeToggle';

/**
 * The sidebar header's **"Edit"** control (the design's literal iOS Messages
 * list affordance) — a 14px (desktop) / 16px (mobile) accent-coloured text
 * button on the LEFT of the header's control row. It's a shadcn {@link Popover};
 * for now its only setting is the {@link ThemeToggle} (System / Light / Dark),
 * which themes the whole app. The popover anchors under the label (`align=start`
 * → opens down-left), matching the design. `defaultOpen` is for the Storybook
 * example.
 */
export const EditMenu = ({ defaultOpen }: { defaultOpen?: boolean }) => (
    <Popover defaultOpen={defaultOpen}>
        <PopoverTrigger asChild>
            <button
                type='button'
                className='-ml-1 shrink-0 px-1 text-[16px] text-[var(--sidebar-accent)] md:text-[14px]'
            >
                Edit
            </button>
        </PopoverTrigger>
        <PopoverContent align='start'>
            <ThemeToggle />
        </PopoverContent>
    </Popover>
);
