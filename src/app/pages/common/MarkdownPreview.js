'use client'
import ReactMarkdown from 'react-markdown';
import TurndownService from 'turndown';

const turndownService = new TurndownService();
const convertHtmlToMarkdown = (html) => {
    return turndownService.turndown(html);
};

const MarkdownPreview = ({ content }) => {
    const markdownContent = convertHtmlToMarkdown(content);

    return (
        <div className="mt-4 p-4 rounded-lg prose dark:prose-invert">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
    );
};
export default MarkdownPreview