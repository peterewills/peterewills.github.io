import React, { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './MarkdownViewer.css';

const MarkdownViewer = ({ filePath }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filePath) {
      setContent('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filePath]);

  if (!filePath) {
    return (
      <div className="markdown-viewer">
        <div className="viewer-welcome">
          <p className="welcome-text">
            Select a recipe from the list to get started.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="markdown-viewer">
        <div className="viewer-loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="markdown-viewer">
        <div className="viewer-error">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-viewer">
      <div className="viewer-content">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

export default MarkdownViewer;
