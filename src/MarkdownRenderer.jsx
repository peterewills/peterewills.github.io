import React from 'react';

const MarkdownRenderer = ({ content }) => {
  const parseMarkdown = (text) => {
    if (!text) return null;

    // Split by lines to handle block elements
    const lines = text.split('\n');
    const elements = [];
    let currentList = null;
    let listType = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for lists
      const bulletMatch = line.match(/^(\s*)[•\-\*]\s+(.+)$/);
      const numberedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);

      if (bulletMatch) {
        const [, indent, content] = bulletMatch;
        if (listType !== 'ul') {
          if (currentList) elements.push(currentList);
          currentList = { type: 'ul', items: [] };
          listType = 'ul';
        }
        currentList.items.push({ indent: indent.length, content });
        continue;
      }

      if (numberedMatch) {
        const [, indent, , content] = numberedMatch;
        if (listType !== 'ol') {
          if (currentList) elements.push(currentList);
          currentList = { type: 'ol', items: [] };
          listType = 'ol';
        }
        currentList.items.push({ indent: indent.length, content });
        continue;
      }

      // If we have a list and this isn't a list item, close the list
      if (currentList && !bulletMatch && !numberedMatch) {
        elements.push(currentList);
        currentList = null;
        listType = null;
      }

      // Process regular lines
      if (line.trim()) {
        elements.push({ type: 'line', content: line });
      } else {
        elements.push({ type: 'empty' });
      }
    }

    // Don't forget to add the last list if exists
    if (currentList) {
      elements.push(currentList);
    }

    return elements;
  };

  const parseInlineMarkdown = (text) => {
    const parts = [];
    let remaining = text;
    let lastIndex = 0;

    // Combined regex for all inline elements
    const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|__(.+?)__|_(.+?)_|`(.+?)`)/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }

      // Determine match type and add it
      if (match[2]) {
        // Bold italic (***text***)
        parts.push({ type: 'bold-italic', content: match[2] });
      } else if (match[3]) {
        // Bold (**text**)
        parts.push({ type: 'bold', content: match[3] });
      } else if (match[4]) {
        // Italic (*text*)
        parts.push({ type: 'italic', content: match[4] });
      } else if (match[5]) {
        // Underline (__text__)
        parts.push({ type: 'underline', content: match[5] });
      } else if (match[6]) {
        // Underline (_text_)
        parts.push({ type: 'underline', content: match[6] });
      } else if (match[7]) {
        // Code (`text`)
        parts.push({ type: 'code', content: match[7] });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const renderInline = (parts) => {
    return parts.map((part, index) => {
      switch (part.type) {
        case 'bold':
          return <span key={index} className="md-bold">{part.content}</span>;
        case 'italic':
          return <span key={index} className="md-italic">{part.content}</span>;
        case 'bold-italic':
          return <span key={index} className="md-bold md-italic">{part.content}</span>;
        case 'underline':
          return <span key={index} className="md-underline">{part.content}</span>;
        case 'code':
          return <span key={index} className="md-code">{part.content}</span>;
        default:
          return <span key={index}>{part.content}</span>;
      }
    });
  };

  const elements = parseMarkdown(content);
  if (!elements) return null;

  return (
    <>
      {elements.map((element, index) => {
        if (element.type === 'line') {
          const isToolLine = element.content.trim().startsWith('🔧');
          return (
            <div key={index} className={isToolLine ? "md-tool-line" : "md-line"}>
              {renderInline(parseInlineMarkdown(element.content))}
            </div>
          );
        } else if (element.type === 'empty') {
          return <div key={index} className="md-empty">&nbsp;</div>;
        } else if (element.type === 'ul' || element.type === 'ol') {
          return (
            <div key={index} className={`md-list md-${element.type}`}>
              {element.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="md-list-item"
                  style={{ paddingLeft: `${item.indent * 2}ch` }}
                >
                  <span className="md-list-marker">
                    {element.type === 'ul' ? '•' : `${itemIndex + 1}.`}
                  </span>
                  <span className="md-list-content">
                    {renderInline(parseInlineMarkdown(item.content))}
                  </span>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default MarkdownRenderer;