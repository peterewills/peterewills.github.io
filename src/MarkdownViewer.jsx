import React, { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './MarkdownViewer.css';

const MarkdownViewer = ({ filePath }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filePath) {
      setContent('');
      setLoading(false);
      return;
    }

    // Handle PDF files
    if (filePath.endsWith('.pdf')) {
      // Remove leading slash to make path relative
      const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      window.open(relativePath, '_blank');
      setContent('Opening PDF in new tab...');
      setLoading(false);
      return;
    }

    // Load markdown files
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
          <pre className="ascii-welcome">
{`
╔════════════════════════════════════════════════╗
║                                                ║
║          Welcome to Peter's Resources          ║
║                                                ║
║  Select a file from the sidebar to view it.   ║
║                                                ║
╚════════════════════════════════════════════════╝
`}
          </pre>
          <p className="welcome-text">
            Browse through my Data Science study guide, technical writings, 
            or view my resume using the file tree on the left.
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
      <div className="viewer-header">
        <span className="viewer-path">{filePath}</span>
      </div>
      <div className="viewer-content">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

export default MarkdownViewer;