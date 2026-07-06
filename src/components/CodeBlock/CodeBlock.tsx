import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';

import { cn } from '@/lib/utils';

type Props = {
    code: string;
    language?: string;
    filename?: string;
    className?: string;
};

const escapeHtml = (s: string) =>
    s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

function CodeBlock({ code, language = 'javascript', filename, className }: Props) {
    const grammar = Prism.languages[language];
    const html = grammar
        ? Prism.highlight(code, grammar, language)
        : escapeHtml(code);

    return (
        <div
            data-slot='code-block'
            className={cn(
                'grid min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[18px] bg-muted ring-1 ring-border',
                className
            )}
        >
            {filename && (
                <div className='border-b border-border bg-muted px-4 py-2 font-mono text-xs text-muted-foreground'>
                    {filename}
                </div>
            )}
            <pre
                className={`language-${language} overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed`}
            >
                <code dangerouslySetInnerHTML={{ __html: html }} />
            </pre>
        </div>
    );
}

export { CodeBlock };
export default CodeBlock;
