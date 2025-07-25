import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MarkdownViewer from './MarkdownViewer';
import './ResourcesLayout.css';

const ResourcesLayout = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="resources-layout">
      <MarkdownViewer filePath={selectedFile} />
      <Sidebar 
        onFileSelect={setSelectedFile} 
        currentPath={selectedFile}
      />
    </div>
  );
};

export default ResourcesLayout;