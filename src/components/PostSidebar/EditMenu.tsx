'use client';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ThemeToggle } from './ThemeToggle';

/** The iOS Messages "more" glyph — an ellipsis in a circle. */
const MoreGlyph = () => (
    <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        width={22}
        height={22}
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
    >
        <circle cx='12' cy='12' r='9' />
        <circle cx='8' cy='12' r='0.9' fill='currentColor' stroke='none' />
        <circle cx='12' cy='12' r='0.9' fill='currentColor' stroke='none' />
        <circle cx='16' cy='12' r='0.9' fill='currentColor' stroke='none' />
    </svg>
);

/**
 * The sidebar header's Edit / "more" control (the iOS Messages list affordance),
 * a shadcn {@link Popover}. For now its only setting is the {@link ThemeToggle}
 * (System / Light / Dark), which themes the whole app. Sits beside the compose
 * pencil, styled to match it (~30px, accent color). `defaultOpen` is for the
 * Storybook example.
 */
export const EditMenu = ({ defaultOpen }: { defaultOpen?: boolean }) => (
    <Popover defaultOpen={defaultOpen}>
        <PopoverTrigger asChild>
            <button
                type='button'
                aria-label='Settings'
                className='flex h-[30px] w-[30px] shrink-0 items-center justify-center text-[var(--sidebar-accent)]'
            >
                <MoreGlyph />
            </button>
        </PopoverTrigger>
        <PopoverContent align='end'>
            <ThemeToggle />
        </PopoverContent>
    </Popover>
);
