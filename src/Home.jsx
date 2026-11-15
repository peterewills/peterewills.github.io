import React from 'react';
import FileTree from './FileTree';

// figlet "larry3d" font
const ASCII_ART = [
  "  __                              __                                       ___    ___",
  " /\\ \\                            /\\ \\__                                __ /\\_ \\  /\\_ \\",
  " \\_\\ \\  _ __        _____      __\\ \\ ,_\\    __   _ __       __  __  __/\\_\\\\//\\ \\ \\//\\ \\     ____",
  " /'_` \\/\\`'__\\     /\\ '__`\\  /'__`\\ \\ \\/  /'__`\\/\\`'__\\    /\\ \\/\\ \\/\\ \\/\\ \\ \\ \\ \\  \\ \\ \\   /',__\\",
  "/\\ \\L\\ \\ \\ \\/ __   \\ \\ \\L\\ \\/\\  __/\\ \\ \\_/\\  __/\\ \\ \\/     \\ \\ \\_/ \\_/ \\ \\ \\ \\_\\ \\_ \\_\\ \\_/\\__, `\\",
  "\\ \\___,_\\ \\_\\/\\_\\   \\ \\ ,__/\\ \\____\\\\ \\__\\ \\____\\\\ \\_\\      \\ \\___x___/'\\ \\_\\/\\____\\/\\____\\/\\____/",
  " \\/__,_ /\\/_/\\/_/    \\ \\ \\/  \\/____/ \\/__/\\/____/ \\/_/       \\/__//__/   \\/_/\\/____/\\/____/\\/___/",
  "                      \\ \\_\\",
  "                       \\/_/",
].join('\n');

const BIO = `Hi! My name is Peter. I'm a machine learning engineer working on full-stack
machine learning, software engineering, and statistics.`;

const Home = ({ onFileSelect }) => (
  <div className="home">
    <div className="home-header">
      <span>peter@pwills.com ~</span>
      <div className="header-links">
        <a className="resume-link" href="/recipes/">
          recipes
        </a>
        <span className="link-separator">|</span>
        <a className="resume-link" href="/resources/resume.pdf" target="_blank" rel="noopener noreferrer">
          resume
        </a>
        <span className="link-separator">|</span>
        <a className="resume-link" href="https://github.com/peterewills" target="_blank" rel="noopener noreferrer">
          github
        </a>
        <span className="link-separator">|</span>
        <a className="resume-link" href="https://www.linkedin.com/in/peterewills" target="_blank" rel="noopener noreferrer">
          linkedin
        </a>
      </div>
    </div>
    <div className="home-body">
      <div className="home-column">
        <pre className="ascii-art">{ASCII_ART}</pre>
        <p className="splash-message">{BIO}</p>
        <FileTree onFileSelect={onFileSelect} className="home-tree" />
      </div>
    </div>
  </div>
);

export default Home;
