import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MarkdownRenderer = ({ content }) => {
  // Parse link references and footnote definitions
  const parseReferences = (text) => {
    const lines = text.split('\n');
    const linkRefs = {};
    const footnotes = {};
    const contentLines = [];
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      
      // Check for footnote definitions [^id]: text BEFORE link references
      const footnoteMatch = line.match(/^\[\^(\w+)\]:\s*(.+)$/);
      if (footnoteMatch) {
        let footnoteText = footnoteMatch[2];
        i++;
        
        // Collect continuation lines (indented with spaces or blank lines followed by indented lines)
        while (i < lines.length) {
          if (lines[i].match(/^(\s{4}|\t)/)) {
            footnoteText += ' ' + lines[i].trim();
            i++;
          } else if (lines[i].trim() === '' && i + 1 < lines.length && lines[i + 1].match(/^(\s{4}|\t)/)) {
            // Skip blank line if followed by indented content
            i++;
          } else {
            break;
          }
        }
        
        footnotes[footnoteMatch[1]] = footnoteText.trim();
        continue;
      }
      
      // Check for link reference definitions [ref]: url
      const linkRefMatch = line.match(/^\[([^\]]+)\]:\s*(.+)$/);
      if (linkRefMatch && !linkRefMatch[1].startsWith('^')) {
        linkRefs[linkRefMatch[1]] = linkRefMatch[2].trim();
        i++;
        continue;
      }
      
      contentLines.push(line);
      i++;
    }
    
    return { content: contentLines.join('\n'), linkRefs, footnotes };
  };

  // Protect LaTeX blocks from markdown parsing
  const protectLatex = (text) => {
    const latexBlocks = [];
    let protectedText = text;
    
    // Protect display LaTeX ($$...$$ and \\[...\\])
    protectedText = protectedText.replace(/\$\$([\s\S]*?)\$\$/g, (match, content) => {
      const index = latexBlocks.length;
      latexBlocks.push({ type: 'display', content });
      return `__LATEX_BLOCK_${index}__`;
    });
    
    protectedText = protectedText.replace(/\\\\\[([\s\S]*?)\\\\\]/g, (match, content) => {
      const index = latexBlocks.length;
      latexBlocks.push({ type: 'display', content });
      return `__LATEX_BLOCK_${index}__`;
    });
    
    // Protect inline LaTeX ($...$)
    protectedText = protectedText.replace(/\$([^\$\n]+?)\$/g, (match, content) => {
      const index = latexBlocks.length;
      latexBlocks.push({ type: 'inline', content });
      return `__LATEX_BLOCK_${index}__`;
    });
    
    // Protect inline LaTeX (\\(...\\))
    protectedText = protectedText.replace(/\\\\\(([\s\S]*?)\\\\\)/g, (match, content) => {
      const index = latexBlocks.length;
      latexBlocks.push({ type: 'inline', content });
      return `__LATEX_BLOCK_${index}__`;
    });
    
    return { text: protectedText, latexBlocks };
  };

  const parseMarkdown = (text) => {
    if (!text) return null;

    // Normalize line endings (handle CRLF and CR)
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // First protect LaTeX blocks
    const { text: protectedText, latexBlocks } = protectLatex(normalizedText);

    // Extract references from protected text
    const { content: cleanText, linkRefs, footnotes } = parseReferences(protectedText);
    
    // Create footnote number mapping
    const footnoteIds = Object.keys(footnotes);
    const footnoteNumbers = {};
    footnoteIds.forEach((id, index) => {
      footnoteNumbers[id] = index + 1;
    });

    // Split by lines to handle block elements
    const lines = cleanText.split('\n');
    const elements = [];
    let currentList = null;
    let listType = null;
    let currentTable = null;
    let inTable = false;
    let currentCodeBlock = null;
    let inCodeBlock = false;
    let currentParagraph = null;

    // Helper to end current paragraph
    const endParagraph = () => {
      if (currentParagraph) {
        elements.push(currentParagraph);
        currentParagraph = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === undefined) continue;

      // Check for code blocks (both Jekyll and standard markdown)
      const highlightStart = line.match(/^{%\s*highlight\s+(\w+)\s*%}$/);
      const highlightEnd = line.match(/^{%\s*endhighlight\s*%}$/);
      const codeBlockStart = line.match(/^```(\w*)$/);
      const codeBlockEnd = line.match(/^```$/) && inCodeBlock;
      
      if ((highlightStart || codeBlockStart) && !inCodeBlock) {
        endParagraph();
        const language = highlightStart ? highlightStart[1] : (codeBlockStart && codeBlockStart[1] ? codeBlockStart[1] : 'text');
        currentCodeBlock = { type: 'codeblock', language, content: [] };
        inCodeBlock = true;
        continue;
      }
      
      if ((highlightEnd || codeBlockEnd) && inCodeBlock) {
        if (currentCodeBlock) {
          currentCodeBlock.content = currentCodeBlock.content.join('\n');
          elements.push(currentCodeBlock);
        }
        currentCodeBlock = null;
        inCodeBlock = false;
        continue;
      }
      
      if (inCodeBlock) {
        currentCodeBlock.content.push(line);
        continue;
      }

      // Check for lists and list continuations first
      const bulletMatch = line.match(/^(\s*)[•\-\*]\s+(.+)$/);
      const numberedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
      
      // Check for list continuation (indented line when in a list)  
      const continuationMatch = currentList && !bulletMatch && !numberedMatch && line.match(/^(\s+)(.+)$/);
      
      // Handle list continuation before other processing
      if (continuationMatch) {
        // Add continuation to the last list item
        const lastItem = currentList.items[currentList.items.length - 1];
        if (lastItem && continuationMatch[2]) {
          lastItem.content += ' ' + continuationMatch[2].trim();
        }
        continue;
      }
      
      // Handle empty lines within lists - don't close the list
      if (currentList && line.trim() === '') {
        continue;
      }

      if (bulletMatch) {
        endParagraph();
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
        endParagraph();
        const [, indent, , content] = numberedMatch;
        if (listType !== 'ol') {
          if (currentList) elements.push(currentList);
          currentList = { type: 'ol', items: [] };
          listType = 'ol';
        }
        currentList.items.push({ indent: indent.length, content });
        continue;
      }

      // If we have a list and this isn't a list item or continuation, close the list
      if (currentList && !bulletMatch && !numberedMatch && !continuationMatch && line.trim() !== '') {
        elements.push(currentList);
        currentList = null;
        listType = null;
      }

      // Check for HTML comments (including multi-line)
      if (line.match(/^<!--/)) {
        endParagraph();
        // Skip HTML comments (single line or start of multi-line)
        if (line.match(/-->$/)) {
          // Complete comment on one line
          continue;
        } else {
          // Multi-line comment, skip until end
          i++;
          while (i < lines.length && !lines[i].match(/-->$/)) {
            i++;
          }
          continue;
        }
      }

      // Check for HTML block (with optional : prefix for org-mode)
      const htmlBlockMatch = line.match(/^:?<(\w+).*>/);
      if (htmlBlockMatch) {
        endParagraph();
        const tagName = htmlBlockMatch[1];
        // Remove leading colon if present
        let htmlContent = line.startsWith(':') ? line.slice(1) : line;
        
        // For complete single-line HTML (including closing tag)
        if (line.includes(`</${tagName}>`)) {
          elements.push({ type: 'html', content: htmlContent });
          continue;
        }
        
        // For self-closing tags
        if (line.endsWith('/>')) {
          elements.push({ type: 'html', content: htmlContent });
          continue;
        }
        
        // Collect multi-line HTML block
        i++;
        while (i < lines.length && !lines[i].includes(`</${tagName}>`)) {
          htmlContent += '\n' + lines[i];
          i++;
        }
        if (i < lines.length) {
          htmlContent += '\n' + lines[i];
        }
        
        const htmlElement = { type: 'html', content: htmlContent };
        elements.push(htmlElement);
        continue;
      }

      // Check for horizontal rule
      if (line.match(/^---+$/) || line.match(/^\*\*\*+$/) || line.match(/^___+$/)) {
        endParagraph();
        elements.push({ type: 'hr' });
        continue;
      }

      // Check for headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        endParagraph();
        const [, hashes, content] = headerMatch;
        elements.push({ type: `h${hashes.length}`, content });
        continue;
      }

      // Check for table rows
      if (line.includes('|')) {
        endParagraph();
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        
        // Check if this is a separator line
        if (cells.every(cell => /^[-:]+$/.test(cell))) {
          if (currentTable && currentTable.rows.length === 1) {
            currentTable.hasHeader = true;
          }
          continue;
        }
        
        // Start a new table or add to existing one
        if (!inTable) {
          if (currentTable) elements.push(currentTable);
          currentTable = { type: 'table', rows: [], hasHeader: false };
          inTable = true;
        }
        
        currentTable.rows.push(cells);
        continue;
      } else if (inTable) {
        // End of table
        elements.push(currentTable);
        currentTable = null;
        inTable = false;
      }

      // Process regular lines - group into paragraphs
      if (line.trim()) {
        // Check if this line contains HTML that wasn't caught by block detection
        if (line.includes('<iframe') || line.includes('<div') || line.includes('<img')) {
          endParagraph();
          elements.push({ type: 'html', content: line.startsWith(':') ? line.slice(1) : line });
        } else if (currentParagraph) {
          currentParagraph.content += ' ' + line.trim();
        } else {
          currentParagraph = { type: 'paragraph', content: line.trim() };
        }
      } else {
        // Empty line - end current paragraph if exists
        if (currentParagraph) {
          elements.push(currentParagraph);
          currentParagraph = null;
        }
        // Only add empty element if the last element isn't already empty
        if (elements.length === 0 || elements[elements.length - 1].type !== 'empty') {
          elements.push({ type: 'empty' });
        }
      }
    }

    // Don't forget to add the last list if exists
    if (currentList) {
      elements.push(currentList);
    }
    
    // Don't forget to add the last table if exists
    if (currentTable) {
      elements.push(currentTable);
    }
    
    // Don't forget the last paragraph if exists
    if (currentParagraph) {
      elements.push(currentParagraph);
    }
    
    // Remove trailing empty elements
    while (elements.length > 0 && elements[elements.length - 1].type === 'empty') {
      elements.pop();
    }

    return { elements, linkRefs, footnotes, footnoteNumbers, latexBlocks };
  };

  const parseInlineMarkdown = (text) => {
    const parts = [];
    let remaining = text;
    let lastIndex = 0;

    // Combined regex for all inline elements (LaTeX is handled separately)
    // Note: Order matters - check footnotes before shorthand reference links
    const regex = /(\[([^\]]+)\]\(([^\)]+)\)|\[([^\]]+)\]\[([^\]]+)\]|\[\^(\w+)\]|\[([^\]]+)\](?!\[)|__LATEX_BLOCK_(\d+)__|\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|__(.+?)__|_(.+?)_|`(.+?)`)/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }

      // Determine match type and add it
      if (match[2] && match[3]) {
        // Inline link [text](url)
        parts.push({ type: 'link', text: match[2], url: match[3] });
      } else if (match[4] && match[5]) {
        // Reference link [text][ref]
        parts.push({ type: 'ref-link', text: match[4], ref: match[5] });
      } else if (match[6]) {
        // Footnote [^id]
        parts.push({ type: 'footnote', id: match[6] });
      } else if (match[7]) {
        // Shorthand reference link [ref]
        parts.push({ type: 'ref-link', text: match[7], ref: match[7] });
      } else if (match[8]) {
        // LaTeX block placeholder
        parts.push({ type: 'latex-block', index: parseInt(match[8]) });
      } else if (match[9]) {
        // Bold italic (***text***)
        parts.push({ type: 'bold-italic', content: match[9] });
      } else if (match[10]) {
        // Bold (**text**)
        parts.push({ type: 'bold', content: match[10] });
      } else if (match[11]) {
        // Italic (*text*)
        parts.push({ type: 'italic', content: match[11] });
      } else if (match[12]) {
        // Underline (__text__)
        parts.push({ type: 'underline', content: match[12] });
      } else if (match[13]) {
        // Underline (_text_)
        parts.push({ type: 'underline', content: match[13] });
      } else if (match[14]) {
        // Code (`text`)
        parts.push({ type: 'code', content: match[14] });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const renderInline = (parts, latexBlocks = []) => {
    return parts.map((part, index) => {
      switch (part.type) {
        case 'bold':
          return <span key={index} className="md-bold">{renderInline(parseInlineMarkdown(part.content), latexBlocks)}</span>;
        case 'italic':
          return <span key={index} className="md-italic">{renderInline(parseInlineMarkdown(part.content), latexBlocks)}</span>;
        case 'bold-italic':
          return <span key={index} className="md-bold md-italic">{renderInline(parseInlineMarkdown(part.content), latexBlocks)}</span>;
        case 'underline':
          return <span key={index} className="md-underline">{renderInline(parseInlineMarkdown(part.content), latexBlocks)}</span>;
        case 'code':
          return <span key={index} className="md-code">{part.content}</span>;
        case 'latex-block':
          if (latexBlocks && latexBlocks[part.index]) {
            const latexBlock = latexBlocks[part.index];
            try {
              const html = katex.renderToString(latexBlock.content, {
                throwOnError: false,
                displayMode: false // Always inline, even for $$
              });
              return <span key={index} className="md-latex" dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (e) {
              return <span key={index} className="md-latex-error">{latexBlock.content}</span>;
            }
          }
          return <span key={index} className="md-latex-error">Missing LaTeX block</span>;
        case 'link':
          return <a key={index} href={part.url} className="md-link" target="_blank" rel="noopener noreferrer">{part.text}</a>;
        case 'ref-link':
          return <span key={index} className="md-ref-link" data-ref={part.ref}>[{part.text}][{part.ref}]</span>;
        case 'footnote':
          return <sup key={index} className="md-footnote">[^{part.id}]</sup>;
        default:
          return <span key={index}>{part.content}</span>;
      }
    });
  };

  const parsed = parseMarkdown(content);
  if (!parsed) return null;
  
  const { elements, linkRefs, footnotes, footnoteNumbers, latexBlocks } = parsed;

  // Update inline rendering to use references and footnote numbers
  const renderInlineWithRefs = (parts) => {
    return parts.map((part, index) => {
      if (part.type === 'ref-link' && linkRefs[part.ref]) {
        return <a key={index} href={linkRefs[part.ref]} className="md-link" target="_blank" rel="noopener noreferrer">{part.text}</a>;
      }
      if (part.type === 'footnote') {
        const num = footnoteNumbers[part.id];
        if (num) {
          return (
            <sup key={index}>
              <a href={`#footnote-${num}`} id={`footnote-ref-${num}`} className="md-footnote-link">
                [{num}]
              </a>
            </sup>
          );
        }
      }
      // For styled text (bold, italic, etc), we need to parse their content recursively
      if (part.type === 'bold' || part.type === 'italic' || part.type === 'bold-italic' || part.type === 'underline') {
        const className = part.type === 'bold' ? 'md-bold' : 
                         part.type === 'italic' ? 'md-italic' : 
                         part.type === 'bold-italic' ? 'md-bold md-italic' : 
                         'md-underline';
        return <span key={index} className={className}>{renderInlineWithRefs(parseInlineMarkdown(part.content))}</span>;
      }
      return renderInline([part], latexBlocks)[0];
    });
  };

  
  return (
    <>
      {elements.map((element, index) => {
        if (element.type === 'line' || element.type === 'paragraph') {
          const isToolLine = element.content.trim().startsWith('🔧');
          return (
            <div key={index} className={isToolLine ? "md-tool-line" : "md-line"}>
              {renderInlineWithRefs(parseInlineMarkdown(element.content))}
            </div>
          );
        } else if (element.type === 'empty') {
          return <div key={index} className="md-empty">&nbsp;</div>;
        } else if (element.type === 'hr') {
          return <hr key={index} className="md-hr" />;
        } else if (element.type.startsWith('h')) {
          const HeadingTag = element.type;
          return (
            <HeadingTag key={index} className={`md-${element.type}`}>
              {renderInlineWithRefs(parseInlineMarkdown(element.content))}
            </HeadingTag>
          );
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
                    {renderInlineWithRefs(parseInlineMarkdown(item.content))}
                  </span>
                </div>
              ))}
            </div>
          );
        } else if (element.type === 'table') {
          return (
            <table key={index} className="md-table">
              <tbody>
                {element.rows.map((row, rowIndex) => {
                  const isHeader = element.hasHeader && rowIndex === 0;
                  const CellTag = isHeader ? 'th' : 'td';
                  return (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <CellTag key={cellIndex} className={isHeader ? 'md-th' : 'md-td'}>
                          {renderInlineWithRefs(parseInlineMarkdown(cell))}
                        </CellTag>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        } else if (element.type === 'codeblock') {
          return (
            <div key={index} className="md-codeblock">
              <div className="md-codeblock-header">
                <span className="md-codeblock-language">{element.language}</span>
              </div>
              <pre className="md-codeblock-content">
                <code>{element.content}</code>
              </pre>
            </div>
          );
        } else if (element.type === 'html') {
          // Render HTML content using dangerouslySetInnerHTML
          return (
            <div 
              key={index} 
              className="md-html-block"
              dangerouslySetInnerHTML={{ __html: element.content }} 
            />
          );
        }
        return null;
      })}
      
      {/* Render footnotes at the bottom */}
      {Object.keys(footnotes).length > 0 && (
        <div className="md-footnotes">
          <hr className="md-hr" />
          <div className="md-footnotes-title">Footnotes</div>
          {Object.entries(footnotes).map(([id, text]) => {
            const num = footnoteNumbers[id];
            return (
              <div key={id} className="md-footnote-item" id={`footnote-${num}`}>
                <a href={`#footnote-ref-${num}`} className="md-footnote-back">
                  [{num}]
                </a>
                <span className="md-footnote-text">
                  {renderInlineWithRefs(parseInlineMarkdown(text))}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MarkdownRenderer;