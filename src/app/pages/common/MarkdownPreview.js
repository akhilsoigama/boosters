'use client';
import ReactMarkdown from 'react-markdown';
import TurndownService from 'turndown';
import { useState } from 'react';

const turndownService = new TurndownService();
const convertHtmlToMarkdown = (html) => {
    return turndownService.turndown(html);
};

const CodeBlock = ({ language, value }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); 
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <pre>
                <code className={`language-${language}`}>{value}</code>
            </pre>
            <button
                onClick={copyToClipboard}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '5px 10px',
                    background: '#0070f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
};

const MarkdownPreview = ({ content }) => {
    const markdownContent = convertHtmlToMarkdown(content);

    return (
        <div className="mt-4 p-4 rounded-lg prose dark:prose-invert">
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <CodeBlock
                                language={match[1]}
                                value={String(children).replace(/\n$/, '')}
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {markdownContent}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownPreview;