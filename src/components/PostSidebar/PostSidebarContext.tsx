'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type PostSidebarState = {
    /** Whether the mobile Posts overlay is open. */
    open: boolean;
    setOpen: (open: boolean) => void;
};

const PostSidebarContext = createContext<PostSidebarState | null>(null);

/**
 * Shares the mobile Posts-overlay open-state so controls OUTSIDE the sidebar —
 * e.g. the blog-post page's "‹ Posts" header — can open it, even though
 * {@link PostSidebar} is mounted separately in `layout.tsx`. Mount this in the
 * layout, wrapping both `{children}` and `<PostSidebar>`.
 */
export const PostSidebarProvider = ({
    children,
    defaultOpen = false,
}: {
    children: ReactNode;
    defaultOpen?: boolean;
}) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <PostSidebarContext.Provider value={{ open, setOpen }}>
            {children}
        </PostSidebarContext.Provider>
    );
};

/**
 * The shared open-state, or `null` when no provider is mounted (e.g. Storybook,
 * where {@link PostSidebar} falls back to its own local state).
 */
export const usePostSidebar = (): PostSidebarState | null =>
    useContext(PostSidebarContext);
