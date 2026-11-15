import React from 'react';
import FileTree from './FileTree';
import './Sidebar.css';

const Sidebar = ({ onFileSelect, currentPath }) => (
  <nav className="sidebar">
    <div className="sidebar-header">
      <button className="sidebar-home" onClick={() => onFileSelect(null)}>
        ← home
      </button>
    </div>
    <div className="sidebar-content">
      <FileTree onFileSelect={onFileSelect} currentPath={currentPath} />
    </div>
  </nav>
);

export default Sidebar;
