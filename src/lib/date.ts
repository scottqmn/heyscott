import { asDate } from '@prismicio/client';
import type { DateField, TimestampField } from '@prismicio/client';

/**
 * Formats a Prismic date field as e.g. "July 4, 2026". Returns an empty
 * string for unfilled fields so callers can guard on truthiness.
 */
export function formatPostDate(field: DateField | TimestampField): string {
    const date = asDate(field);
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
