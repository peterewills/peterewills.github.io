import React, { useState } from 'react';
import { fileStructure, defaultExpandedFolders } from './fileStructure';
import './FileTree.css';

const FileTree = ({ onFileSelect, currentPath, className = '' }) => {
  const [expanded, setExpanded] = useState(
    Object.fromEntries(defaultExpandedFolders.map((f) => [f, true]))
  );

  const toggle = (folder) => setExpanded((prev) => ({ ...prev, [folder]: !prev[folder] }));

  const render = (structure, prefix = '') => {
    const entries = Object.entries(structure);
    return entries.map(([name, value], index) => {
      const last = index === entries.length - 1;
      const connector = last ? '└── ' : '├── ';
      const extension = last ? '    ' : '│   ';

      if (typeof value === 'string' && !value.startsWith('/resources/')) {
        const external = /^https?:/.test(value);
        return (
          <div key={name} className="tree-item">
            <span className="tree-prefix">{prefix}{connector}</span>
            <a
              className="tree-file tree-link"
              href={value}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {name}{external ? ' ↗' : ''}
            </a>
          </div>
        );
      }

      if (typeof value === 'string') {
        return (
          <div key={name} className="tree-item">
            <span className="tree-prefix">{prefix}{connector}</span>
            <button
              className={`tree-file ${currentPath === value ? 'active' : ''}`}
              onClick={() => onFileSelect(value)}
            >
              {name}
            </button>
          </div>
        );
      }

      return (
        <React.Fragment key={name}>
          <div className="tree-item">
            <span className="tree-prefix">{prefix}{connector}</span>
            <button className="tree-folder" onClick={() => toggle(name)} aria-expanded={!!expanded[name]}>
              {expanded[name] ? '▾' : '▸'} {name}/
            </button>
          </div>
          {expanded[name] && render(value, prefix + extension)}
        </React.Fragment>
      );
    });
  };

  return (
    <pre className={`file-tree ${className}`}>
      <div className="tree-item tree-root">~</div>
      {render(fileStructure)}
    </pre>
  );
};

export default FileTree;
