import type { ReactNode } from 'react';

/**
 * App-router template — re-mounts on every navigation (unlike `layout`), so the
 * `.page-fade` CSS animation replays on each route change for a slight, fast
 * fade-in of the page content (see `globals.css`). Respects
 * `prefers-reduced-motion`. Applies across `/`, `/blog`, `/blog/<slug>`,
 * `/contact`.
 */
export default function Template({ children }: { children: ReactNode }) {
    return <div className='page-fade'>{children}</div>;
}
