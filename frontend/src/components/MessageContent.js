import React from 'react';

// Simple markdown parser for chat messages
const parseMarkdown = (text) => {
  if (!text) return [];
  
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  lines.forEach((line, lineIndex) => {
    // Check for headings (###, ##, #)
    const h3Match = line.match(/^### (.+)$/);
    const h2Match = line.match(/^## (.+)$/);
    const h1Match = line.match(/^# (.+)$/);

    if (h3Match) {
      elements.push(
        <h3 key={key++} className="text-lg font-bold mt-3 mb-2">
          {parseInlineMarkdown(h3Match[1])}
        </h3>
      );
      return;
    }
    
    if (h2Match) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold mt-4 mb-2">
          {parseInlineMarkdown(h2Match[1])}
        </h2>
      );
      return;
    }
    
    if (h1Match) {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold mt-4 mb-3">
          {parseInlineMarkdown(h1Match[1])}
        </h1>
      );
      return;
    }

    // Check for bullet points (- or *)
    const bulletMatch = line.match(/^[\s]*[-*] (.+)$/);
    if (bulletMatch) {
      elements.push(
        <li key={key++} className="ml-4 mb-1">
          {parseInlineMarkdown(bulletMatch[1])}
        </li>
      );
      return;
    }

    // Check for numbered lists (1. 2. etc)
    const numberedMatch = line.match(/^[\s]*\d+\. (.+)$/);
    if (numberedMatch) {
      elements.push(
        <li key={key++} className="ml-4 mb-1 list-decimal">
          {parseInlineMarkdown(numberedMatch[1])}
        </li>
      );
      return;
    }

    // Regular paragraph
    if (line.trim()) {
      elements.push(
        <p key={key++} className="mb-2">
          {parseInlineMarkdown(line)}
        </p>
      );
    } else if (lineIndex < lines.length - 1) {
      // Empty line - add spacing
      elements.push(<br key={key++} />);
    }
  });

  return elements.length > 0 ? elements : [text];
};

// Parse inline markdown (bold, italic, code, links)
const parseInlineMarkdown = (text) => {
  const parts = [];
  let currentText = text;
  let key = 0;

  const combinedRegex = /(\*\*(.+?)\*\*)|(?<!\*)\*(?!\*)(.+?)\*(?!\*)|`(.+?)`|\[(.+?)\]\((.+?)\)/g;
  
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(currentText)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++}>{currentText.substring(lastIndex, match.index)}</span>
      );
    }

    // Bold
    if (match[1]) {
      parts.push(<strong key={key++} className="font-bold">{match[2]}</strong>);
    }
    // Italic
    else if (match[3]) {
      parts.push(<em key={key++} className="italic">{match[3]}</em>);
    }
    // Code
    else if (match[4]) {
      parts.push(
        <code key={key++} className="bg-gray-200 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">
          {match[4]}
        </code>
      );
    }
    // Link
    else if (match[5] && match[6]) {
      parts.push(
        <a
          key={key++}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {match[5]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < currentText.length) {
    parts.push(<span key={key++}>{currentText.substring(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [text];
};

function MessageContent({ content, isUser }) {
  const parsedContent = parseMarkdown(content);

  return (
    <div className={`text-base leading-relaxed break-words ${isUser ? 'text-white' : 'text-gray-800'}`}>
      {parsedContent}
    </div>
  );
}

export default MessageContent;
