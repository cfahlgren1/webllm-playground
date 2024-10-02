import React, { useRef, useEffect } from 'react';
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import RemarkBreaks from "remark-breaks";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import RehypeKatex from "rehype-katex";
import { unified } from "unified";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";

import 'highlight.js/styles/dracula.css';

interface ChatBoxProps {
  messages: { content: string; role: 'system' | 'user' | 'assistant' }[];
  onExampleClick: (message: string) => void;
  isGenerating: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onExampleClick, isGenerating }) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isGenerating) {
      const scrollInterval = setInterval(scrollToBottom, 100);
      return () => clearInterval(scrollInterval);
    }
  }, [isGenerating]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      scrollToBottom();
    }
  }, [messages]);

  const exampleMessages = [
    "Show me the code for a simple web app",
    "Implement fib(n) in Python",
    "What is refraction?",
    "Explain thermal conductivity"
  ];

  const messageFormatter = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkMath)
    .use(remarkGfm)
    .use(RemarkBreaks)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(RehypeKatex)
    .use(rehypeHighlight);

  const renderMarkdown = (content: string) => {
    const processedContent = messageFormatter.processSync(content);

    return <div dangerouslySetInnerHTML={{ __html: String(processedContent) }} />;
  };

  const renderExampleButtons = () => {
    const buttons = [];
    for (let index = 0; index < exampleMessages.length; index++) {
      const message = exampleMessages[index];
      buttons.push(
        <button
          key={index}
          onClick={() => onExampleClick(message)}
          className="bg-[var(--bg-color)] text-[var(--text-color)] font-semibold p-1 px-2 rounded-lg text-sm transition duration-300 ease-in-out text-center border-[var(--border-color)] border-[1.5px] h-20 flex items-center justify-center hover:bg-[var(--hover-bg-color)] hover:border-[var(--hover-border-color)]"
        >
          {message}
        </button>
      );
    }
    return buttons;
  };

  const renderMessages = () => {
    const messageElements = [];
    for (const message of messages) {
      messageElements.push(
        <div
          key={messageElements.length}
          className={`rounded-lg p-3 text-sm ${
            message.role === 'user'
              ? 'border-[var(--border-color)] border-[1.5px] bg-[var(--bg-color)] shadow-sm'
              : ''
          }`}
        >
          <div className="prose prose-invert max-w-none">
            {renderMarkdown(message.content)}
          </div>
        </div>
      );
    }
    return messageElements;
  };

  return (
    <div className="flex-grow overflow-hidden flex flex-col">
      <div
        ref={chatBoxRef}
        className="flex-grow overflow-y-auto no-scrollbar p-4 w-full mx-auto relative shadow-md"
      >
        {messages.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mx-auto">
            {renderExampleButtons()}
          </div>
        ) : (
          <div className="space-y-2">
            {renderMessages()}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;