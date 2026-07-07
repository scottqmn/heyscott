/**
 * The blog index. The recirculation composer that lists posts now lives on the
 * global layout (`src/app/layout.tsx`), floating over every route, so this page
 * no longer renders its own — that would double it up on `/blog`.
 */
export default function BlogIndexPage() {
    return <main className='min-h-screen' />;
}
