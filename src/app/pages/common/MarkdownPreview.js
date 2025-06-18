'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // ✅ this allows HTML rendering in Markdown
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(media.matches);
    const listener = (e) => setIsDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);
  return isDark;
};

const CodeBlock = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isDark = useDarkMode();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="relative group mt-2">
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : vs}
        showLineNumbers
        wrapLines
        customStyle={{
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          padding: '1rem',
        }}
      >
        {value}
      </SyntaxHighlighter>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

const MarkdownPreview = ({ content = '' }) => {
  const isDark = useDarkMode();

  return (
    <div className="mt-4 rounded-lg p-4 prose dark:prose-invert max-w-none overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // ✅ allows HTML tags inside Markdown
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const rawCode = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return <CodeBlock language={match[1]} value={rawCode} />;
            }

            return (
              <code
                className="rounded px-1.5 py-0.5 text-sm font-mono bg-gray-100 text-red-600 dark:bg-gray-800 dark:text-red-400"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
