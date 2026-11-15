import React, { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './MarkdownViewer.css';

const MarkdownViewer = ({ filePath, onClose }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(filePath)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load file: ${response.statusText}`);
        return response.text();
      })
      .then((text) => setContent(text))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filePath]);

  const displayPath = `~${filePath.replace(/^\/resources/, '')}`;

  return (
    <div className="markdown-viewer">
      <div className="viewer-header">
        <button className="back-button" onClick={onClose}>← home</button>
        <span className="viewer-path">{displayPath}</span>
      </div>
      {loading && <div className="viewer-loading">Loading...</div>}
      {error && <div className="viewer-error">Error: {error}</div>}
      {!loading && !error && (
        <div className="viewer-content">
          <article className="viewer-article">
            <MarkdownRenderer content={content} />
          </article>
        </div>
      )}
    </div>
  );
};

export default MarkdownViewer;
