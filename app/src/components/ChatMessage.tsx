'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === 'user') {
    return (
      <div 
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '24px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease',
        }}
      >
        <div 
          style={{
            maxWidth: '70%',
            backgroundColor: 'var(--other-box)',
            borderRadius: '20px',
            padding: '12px 18px',
            wordBreak: 'break-word',
          }}
        >
          <p 
            style={{
              color: 'var(--text-primary)',
              fontSize: '15px',
              lineHeight: '1.5',
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{
        marginBottom: '32px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
        transition: 'all 0.4s ease',
      }}
    >
      <div 
        style={{
          maxWidth: '100%',
          color: 'var(--text-secondary)',
        }}
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 style={{
                color: 'var(--text-primary)',
                fontSize: '24px',
                fontWeight: 600,
                marginTop: '24px',
                marginBottom: '16px',
                lineHeight: '1.3',
              }}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 style={{
                color: 'var(--text-primary)',
                fontSize: '20px',
                fontWeight: 600,
                marginTop: '20px',
                marginBottom: '12px',
                lineHeight: '1.3',
              }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{
                color: 'var(--text-primary)',
                fontSize: '18px',
                fontWeight: 600,
                marginTop: '16px',
                marginBottom: '8px',
                lineHeight: '1.3',
              }}>{children}</h3>
            ),
            p: ({ children }) => (
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '16px',
              }}>{children}</p>
            ),
            ul: ({ children }) => (
              <ul style={{
                listStyle: 'disc',
                paddingLeft: '24px',
                marginBottom: '16px',
                color: 'var(--text-secondary)',
                fontSize: '15px',
                lineHeight: '1.6',
              }}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol style={{
                listStyle: 'decimal',
                paddingLeft: '24px',
                marginBottom: '16px',
                color: 'var(--text-secondary)',
                fontSize: '15px',
                lineHeight: '1.6',
              }}>{children}</ol>
            ),
            li: ({ children }) => (
              <li style={{
                marginBottom: '8px',
                color: 'var(--text-secondary)',
              }}>{children}</li>
            ),
            a: ({ href, children }) => (
              <a 
                href={href}
                style={{
                  color: '#4A9EFF',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#7AB8FF';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#4A9EFF';
                  e.currentTarget.style.textDecoration = 'none';
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote style={{
                borderLeft: '3px solid var(--border-color)',
                paddingLeft: '16px',
                margin: '16px 0',
                fontStyle: 'italic',
                color: 'var(--text-muted)',
              }}>
                {children}
              </blockquote>
            ),
            code: ({ inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const codeString = String(children).replace(/\n$/, '');
              
              if (!inline && language) {
                return (
                  <div style={{
                    position: 'relative',
                    marginBottom: '16px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--other-box)',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: '#1A1A1C',
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>{language}</span>
                      <button
                        onClick={() => handleCopy(codeString)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--text-primary)';
                          e.currentTarget.style.borderColor = 'var(--text-muted)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: '16px',
                        backgroundColor: 'transparent',
                        fontSize: '14px',
                        lineHeight: '1.5',
                      }}
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                );
              }
              
              return (
                <code 
                  style={{
                    backgroundColor: 'var(--other-box)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#FF7B72',
                    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}