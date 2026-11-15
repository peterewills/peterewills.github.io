import React, { useState, useEffect } from 'react';
import Home from './Home';
import MarkdownViewer from './MarkdownViewer';
import Sidebar from './Sidebar';
import { fileToHash, hashToFile } from './fs';
import './App.css';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(() => hashToFile(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setSelectedFile(hashToFile(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const select = (filePath) => {
    if (filePath && filePath.endsWith('.pdf')) {
      window.open(filePath, '_blank', 'noopener');
      return;
    }
    window.location.hash = filePath ? fileToHash(filePath) : '';
  };

  return (
    <div className="app-container">
      {selectedFile && <Sidebar onFileSelect={select} currentPath={selectedFile} />}
      <div className="app-main">
        {selectedFile ? (
          <MarkdownViewer filePath={selectedFile} onClose={() => select(null)} />
        ) : (
          <Home onFileSelect={select} />
        )}
      </div>
    </div>
  );
};

export default App;
