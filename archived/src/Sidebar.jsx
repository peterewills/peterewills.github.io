import React, { useState } from 'react';
import { fileStructure, defaultExpandedFolders } from './fileStructure';
import './Sidebar.css';

const Sidebar = ({ onFileSelect, currentPath }) => {
  const [expandedFolders, setExpandedFolders] = useState(
    defaultExpandedFolders.reduce((acc, folder) => {
      acc[folder] = true;
      return acc;
    }, {})
  );

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }));
  };

  const renderFileTree = (structure, prefix = '', isLast = true) => {
    const entries = Object.entries(structure);
    
    return entries.map(([name, value], index) => {
      const isLastItem = index === entries.length - 1;
      const connector = isLastItem ? '└── ' : '├── ';
      const extension = isLastItem ? '    ' : '│   ';
      
      if (typeof value === 'string') {
        // It's a file
        const isActive = currentPath === value;
        
        return (
          <div key={name} className="tree-item">
            <span className="tree-prefix">{prefix}{connector}</span>
            <span 
              className={`tree-file ${isActive ? 'active' : ''}`}
              onClick={() => onFileSelect(value)}
            >
              {name}
            </span>
          </div>
        );
      } else {
        // It's a folder
        const isExpanded = expandedFolders[name];
        return (
          <React.Fragment key={name}>
            <div className="tree-item">
              <span className="tree-prefix">{prefix}{connector}</span>
              <span 
                className="tree-folder"
                onClick={() => toggleFolder(name)}
              >
                {isExpanded ? '▾' : '▸'} {name}/
              </span>
            </div>
            {isExpanded && (
              <div className="tree-children">
                {renderFileTree(value, prefix + extension, isLastItem)}
              </div>
            )}
          </React.Fragment>
        );
      }
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">~/resources</span>
      </div>
      <button 
        className="return-to-terminal-btn"
        onClick={() => onFileSelect(null)}
      >
        ← Return to Terminal
      </button>
      <div className="sidebar-content">
        <pre className="file-tree">
          {renderFileTree(fileStructure)}
        </pre>
      </div>
    </div>
  );
};

export default Sidebar;