import type { Metadata } from 'next';
import { ComposeScreen } from '@/components/Contact';

export const metadata: Metadata = {
    title: 'New Message',
    description: 'Send Scott a message.',
};

/**
 * The contact page — the design's "New Message" compose screen. Lives inside the
 * global layout, so the sidebar + composer chrome frame it like the blog routes.
 */
export default function ContactPage() {
    return <ComposeScreen />;
}
