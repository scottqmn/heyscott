'use client';

import { useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

type Theme = 'system' | 'light' | 'dark';

/** localStorage key + the attribute the no-flash script in `layout.tsx` reads. */
const STORAGE_KEY = 'theme';

/** Current persisted theme (client). */
const readTheme = (): Theme => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : 'system';
};

/** External store so the toggle reflects the persisted value without a
 *  setState-in-effect; also picks up changes from other tabs. */
const listeners = new Set<() => void>();
const subscribe = (onChange: () => void) => {
    listeners.add(onChange);
    window.addEventListener('storage', onChange);
    return () => {
        listeners.delete(onChange);
        window.removeEventListener('storage', onChange);
    };
};

/**
 * Apply a theme app-wide: an explicit theme sets `data-theme` on `<html>` (which
 * `globals.css` themes for the WHOLE palette — background/foreground/borders AND
 * the sidebar + imessage bubbles) and persists it; "system" clears both so the
 * `prefers-color-scheme` default takes over.
 */
const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    if (theme === 'system') {
        root.removeAttribute('data-theme');
        localStorage.removeItem(STORAGE_KEY);
    } else {
        root.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }
    listeners.forEach((listener) => listener());
};

const OPTIONS: { value: Theme; label: string }[] = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
];

/**
 * The sidebar settings' one control (for now): a System / Light / Dark theme
 * toggle. The actual pre-paint application happens in the layout's inline script
 * (no flash); this reflects + updates the persisted choice.
 */
export const ThemeToggle = () => {
    const theme = useSyncExternalStore(
        subscribe,
        readTheme,
        () => 'system' as Theme
    );

    return (
        <div>
            <p className='px-1 pb-1.5 text-[13px] font-semibold text-[var(--sidebar-primary)]'>
                Appearance
            </p>
            <div
                role='radiogroup'
                aria-label='Appearance'
                className='flex gap-1 rounded-xl bg-[var(--sidebar-search-bg)] p-1'
            >
                {OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type='button'
                        role='radio'
                        aria-checked={theme === option.value}
                        onClick={() => applyTheme(option.value)}
                        className={cn(
                            'flex-1 rounded-lg px-2 py-1.5 text-[13px] font-medium transition-colors',
                            theme === option.value
                                ? 'bg-[var(--sidebar-accent)] text-white'
                                : 'text-[var(--sidebar-secondary)] hover:text-[var(--sidebar-primary)]'
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
