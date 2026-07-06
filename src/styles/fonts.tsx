import { Inter, Playfair_Display, Source_Code_Pro } from 'next/font/google';

// Sans
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Serif
export const playfairDisplay = Playfair_Display({
    weight: ['700'],
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-playfair-display',
});

// Mono
export const sourceCodePro = Source_Code_Pro({
    weight: ['400', '500'],
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-source-code-pro',
});
