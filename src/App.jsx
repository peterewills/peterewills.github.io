import React, { useState } from 'react';
import Terminal from './Terminal';
import MarkdownViewer from './MarkdownViewer';
import Sidebar from './Sidebar';
import './App.css';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="app-container">
      <div className="app-main">
        {selectedFile ? (
          <MarkdownViewer filePath={selectedFile} />
        ) : (
          <Terminal />
        )}
      </div>
      <Sidebar 
        onFileSelect={setSelectedFile} 
        currentPath={selectedFile}
      />
    </div>
  );
};

export default App;