import Link from 'next/link';
import { Messages } from '@/components/Messages';

export default function Home() {
    return (
        <main className='relative'>
            <Messages />
            <nav className='pb-10 text-center'>
                <Link
                    href='/blog'
                    className='text-base text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'
                >
                    read the blog →
                </Link>
            </nav>
        </main>
    );
}
