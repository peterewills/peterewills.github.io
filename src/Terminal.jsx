import React, { useState, useRef, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const getEndpoint = () => {
    // Check for force remote flag in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const forceRemote = urlParams.get('remote') === 'true';
    
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1';

    // Use remote API if forced or in production
    if (forceRemote || !isDevelopment) {
      return 'https://artemis-production-9690.up.railway.app/api/chat';
    }
    
    // Otherwise use local API
    return 'http://localhost:8000/api/chat';
  };

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
      console.log('Connecting to:', getEndpoint());
      const response = await fetch(getEndpoint(), {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          stream: true
        }),
      });

      console.log('Response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
      console.error('API Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        endpoint: getEndpoint(),
        type: error.constructor.name
      });
      
      // More detailed error message
      let errorMessage = error.message || 'Failed to connect to Artemis API';
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        const endpoint = getEndpoint();
        errorMessage = `Failed to fetch from ${endpoint}\nPossible causes:\n- CORS blocking (check browser console)\n- Network issues\n- Server unreachable`;
      }
      
      setHistory(prev => [...prev, {
        type: 'error',
        content: `Error: ${errorMessage}`
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
 ________  ________  _________  _______   _____ ______   ___  ________
|\\   **  \\|\\   **  \\|\\___   ___\\\\  ___ \\ |\\   * \\  *   \\|\\  \\|\\   ____\\
\\ \\  \\|\\  \\ \\  \\|\\  \\|___ \\  \\_\\ \\   **/|\\ \\  \\\\\\**\\ \\  \\ \\  \\ \\  \\___|_
 \\ \\   __  \\ \\   *  *\\   \\ \\  \\ \\ \\  \\_|/_\\ \\  \\\\|__| \\  \\ \\  \\ \\_____  \\
  \\ \\  \\ \\  \\ \\  \\\\  \\|   \\ \\  \\ \\ \\  \\_|\\ \\ \\  \\    \\ \\  \\ \\  \\|____|\\  \\
   \\ \\__\\ \\__\\ \\__\\\\ *\\    \\ \\*_\\ \\ \\_______\\ \\__\\    \\ \\__\\ \\__\\____\\_\\  \\
    \\|__|\\|__|\\|__|\\|__|    \\|__|  \\|_______|\\|__|     \\|__|\\|__|\\_________\\
                                                                \\|_________|
`;

  const splashMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi! My name is Peter. I'm a machine learning engineer specializing in agentic systems,
full-stack machine learning, software engineering, and statistics.

I built Artemis as a fun way to demonstrate an AI agent that uses tools. I think this
paradigm is the direction data science as a whole is heading - not that classical DS &
ML will go away, but the outputs of those pipelines will be consumed by agents who will
then surface insights.

Of course, this is entirely unnecessary. But hey - better than another engineering blog
no one reads.

Available capabilities:
 • Professional background analysis
 • Technical expertise assessment
 • Project portfolio exploration
 • Real-time information synthesis

Example queries:
 • "Tell me about Peter!"
 • "What was Peter's research about?"
 • "What were Peter's responsibilities while working at Stitch Fix?"

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
                (If you'd rather just view my resume, <a href="/resources/resume.pdf" className="inline-resume-link" target="_blank" rel="noopener noreferrer">click here</a>.)
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
                <MarkdownRenderer content={item.content} />
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
