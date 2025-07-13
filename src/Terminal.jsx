import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history, isProcessing]);

  const processCommand = async () => {
    if (!currentInput.trim() || isProcessing) return;

    const userMessage = currentInput.trim();
    setCurrentInput('');

    // Add user input to history
    setHistory(prev => [...prev, { type: 'input', content: userMessage }]);
    setIsProcessing(true);

    // Build messages array from history
    const messages = history
      .filter(item => item.type === 'input' || item.type === 'output')
      .map(item => ({
        role: item.type === 'input' ? 'user' : 'assistant',
        content: item.content
      }));

    try {
      const response = await fetch('https://artemis-production-9690.up.railway.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      // Add empty output entry that we'll update
      setHistory(prev => [...prev, { type: 'output', content: '', isStreaming: true }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'token' || data.type === 'content') {
                assistantMessage += data.content;
                setHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1].content = assistantMessage;
                  return newHistory;
                });
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }

      setHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].isStreaming = false;
        return newHistory;
      });
    } catch (error) {
      console.error('Error:', error);
      setHistory(prev => [...prev, {
        type: 'error',
        content: 'Error: Failed to connect to Artemis API'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      processCommand();
    }
  };

  const asciiArt = `
 ░▒▓██████▓▒░░▒▓███████▓▒░▒▓████████▓▒░▒▓████████▓▒░▒▓██████████████▓▒░░▒▓█▓▒░░▒▓███████▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░
░▒▓████████▓▒░▒▓███████▓▒░  ░▒▓█▓▒░   ░▒▓██████▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓██████▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓███████▓▒░
`;

  const splashMessage = `
 Agentic Research & Tool-Enhanced Machine Intelligence System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ARTEMIS is an AI agent that leverages multiple tools and data sources
to provide comprehensive information about Dr. Peter Wills.

Available capabilities:
 • Professional background analysis
 • Technical expertise assessment
 • Project portfolio exploration
 • Real-time information synthesis

Type your query and press Enter to begin.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  return (
    <div className="terminal">
      <div className="terminal-header">
        <span>artemis@zenburn ~ $</span>
        <a href="/resources/resume.pdf" className="resume-link" target="_blank" rel="noopener noreferrer">
          Resume →
        </a>
      </div>
      <div className="terminal-body" ref={terminalRef}>
        {history.length === 0 && (
          <div className="splash-screen">
            <pre className="ascii-art">{asciiArt}</pre>
            <pre className="splash-message">{splashMessage}</pre>
            <div className="resume-prompt">
              To view Peter's resume directly, <a href="/resources/resume.pdf" className="inline-resume-link" target="_blank" rel="noopener noreferrer">click here</a>
            </div>
          </div>
        )}
        {history.map((item, index) => (
          <div key={index} className={`history-item ${item.type}`}>
            {item.type === 'input' && (
              <div className="input-line">
                <span className="prompt">&gt; </span>
                <span className="input-text">{item.content}</span>
              </div>
            )}
            {item.type === 'output' && (
              <div className="output-text">
                {item.content}
                {item.isStreaming && <span className="cursor">▌</span>}
              </div>
            )}
            {item.type === 'error' && (
              <div className="error-text">{item.content}</div>
            )}
          </div>
        ))}
        {!isProcessing && (
          <div className="input-line active">
            <span className="prompt">&gt; </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="terminal-input"
              spellCheck="false"
              autoComplete="off"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
