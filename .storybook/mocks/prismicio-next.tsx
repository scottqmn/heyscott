/*
 * Lightweight browser stub for `@prismicio/next`, aliased in only for the
 * Storybook build (see ../main.ts). The real package re-exports server-only
 * preview utilities (CJS) that the Storybook bundler can't process; stories
 * only need the presentational pieces, so we render plain elements here.
 */
import type { ReactNode } from 'react';

type ImageLike = { url?: string | null; alt?: string | null } | null | undefined;

export function PrismicNextImage({
    field,
    className,
}: {
    field: ImageLike;
    className?: string;
}) {
    if (!field?.url) return null;
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={field.url} alt={field.alt ?? ''} className={className} />
    );
}

type LinkLike = { url?: string | null } | null | undefined;

export function PrismicNextLink({
    field,
    children,
    className,
}: {
    field?: LinkLike;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <a href={field?.url ?? '#'} className={className}>
            {children}
        </a>
    );
}

export function PrismicPreview({ children }: { children?: ReactNode }) {
    return <>{children}</>;
}

export function enableAutoPreviews() {}
export async function redirectToPreviewURL() {}
export async function exitPreview() {}
