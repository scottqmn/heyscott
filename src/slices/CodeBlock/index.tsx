import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { CodeBlock } from '@/components/CodeBlock';

export type CodeBlockProps = SliceComponentProps<Content.CodeBlockSlice>;

const CodeBlockSlice = ({ slice }: CodeBlockProps) => {
    const { code, language, filename } = slice.primary;

    if (!code) return null;

    return (
        <div className='mx-auto max-w-2xl px-5 py-4'>
            <CodeBlock
                code={code}
                language={language ?? 'plaintext'}
                filename={filename || undefined}
            />
        </div>
    );
};

export default CodeBlockSlice;
