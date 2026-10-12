import React from 'react';

interface MarkdownContentProps {
  content: string;
  language?: 'en' | 'ur';
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, language }) => {
  const isUrdu =
    language === 'ur' ||
    /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(content);

  // Split into lines for structured block parsing
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentBlockquote: string[] = [];
  let currentList: string[] = [];

  const flushBlockquote = (key: string) => {
    if (currentBlockquote.length > 0) {
      elements.push(
        <blockquote
          key={key}
          className={`${
            isUrdu
              ? 'border-r-2 border-[#D4AF37] pr-3.5 pl-2 py-1.5 my-2 bg-[#D4AF37]/5 rounded-l text-zinc-200 italic text-sm text-right'
              : 'border-l-2 border-[#D4AF37] pl-3 py-1 my-2 bg-[#D4AF37]/5 rounded-r text-zinc-200 italic text-sm text-left'
          }`}
        >
          {currentBlockquote.map((line, idx) => (
            <p key={idx}>{renderInline(line)}</p>
          ))}
        </blockquote>
      );
      currentBlockquote = [];
    }
  };

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key} className={`space-y-1.5 my-2 ${isUrdu ? 'pr-2' : 'pl-2'}`}>
          {currentList.map((item, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-2 text-sm text-zinc-300 ${
                isUrdu ? 'flex-row-reverse text-right' : 'text-left'
              }`}
            >
              <span className="text-[#D4AF37] mt-1 shrink-0 text-xs">◆</span>
              <div className="flex-1">{renderInline(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Blockquote
    if (trimmed.startsWith('>')) {
      flushList(`list-${index}`);
      currentBlockquote.push(trimmed.replace(/^>\s*/, ''));
      return;
    } else {
      flushBlockquote(`quote-${index}`);
    }

    // Bullet / List item
    if (trimmed.startsWith('•') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      const cleanItem = trimmed
        .replace(/^•\s*/, '')
        .replace(/^-\s*/, '')
        .replace(/^\d+\.\s*/, '');
      currentList.push(cleanItem);
      return;
    } else {
      flushList(`list-${index}`);
    }

    // Empty line / paragraph break
    if (trimmed === '') {
      return;
    }

    // Standard paragraph or heading
    if (trimmed.startsWith('###')) {
      elements.push(
        <h4
          key={`h4-${index}`}
          className={`font-semibold text-[#FFE08A] text-xs sm:text-sm mt-3 mb-1 font-mono tracking-wide break-words ${
            isUrdu ? 'text-right' : 'text-left'
          }`}
        >
          {renderInline(trimmed.replace(/^###\s*/, ''))}
        </h4>
      );
    } else if (trimmed.startsWith('##')) {
      elements.push(
        <h3
          key={`h3-${index}`}
          className={`font-bold text-[#FFE08A] text-sm sm:text-base mt-3 mb-1 font-mono tracking-wide break-words ${
            isUrdu ? 'text-right' : 'text-left'
          }`}
        >
          {renderInline(trimmed.replace(/^##\s*/, ''))}
        </h3>
      );
    } else {
      elements.push(
        <p
          key={`p-${index}`}
          className={`text-xs sm:text-sm leading-relaxed text-zinc-300 my-1.5 break-words [overflow-wrap:anywhere] ${
            isUrdu ? 'text-right leading-[1.8]' : 'text-left'
          }`}
        >
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushBlockquote('final-quote');
  flushList('final-list');

  return (
    <div
      dir={isUrdu ? 'rtl' : 'ltr'}
      className={`space-y-1 text-xs sm:text-sm break-words [overflow-wrap:anywhere] max-w-full overflow-hidden ${
        isUrdu ? 'text-right font-sans' : 'text-left'
      }`}
    >
      {elements}
    </div>
  );
};

/**
 * Safely parse bold, italics, code, and links
 */
function renderInline(text: string): React.ReactNode[] {
  // Regex pattern matching bold (**text**), italics (*text*), inline code (`code`), markdown links ([text](url))
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="text-[#FFE08A] font-semibold break-words">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="text-zinc-300 italic break-words">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="bg-black/60 text-[#D4AF37] px-1.5 py-0.5 rounded text-[11px] sm:text-xs font-mono border border-white/10 break-all max-w-full inline-block"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FFE08A] underline underline-offset-2 hover:text-[#FFF5CC] transition-colors break-all"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
