'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import InputPrompt from '@/components/InputPrompt';
import DefaultView from '@/components/DefaultView';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${content}". As an AI assistant, I'm here to help you with various tasks and questions.

## Key Capabilities

Here are some things I can help you with:

- **Code Analysis**: Review and debug code across multiple languages
- **Writing Assistance**: Help with creative and technical writing
- **Problem Solving**: Break down complex problems into manageable steps
- **Research**: Provide information on a wide range of topics

### Example Code

Here's a simple example in Python:

\`\`\`python
def greet(name):
    """A simple greeting function"""
    return f"Hello, {name}! Welcome to Grok."

# Usage
print(greet("User"))
\`\`\`

Feel free to ask me anything else! I'm here to provide thoughtful, detailed responses to help you accomplish your goals.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Main Content Area - Full Height */}
      <div 
        style={{
          height: '100vh',
          backgroundColor: 'var(--app-background)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {messages.length === 0 ? (
          <DefaultView onSuggestionClick={handleSendMessage} />
        ) : (
          <div 
            className="custom-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingTop: '24px',
              paddingBottom: '120px', // Space for floating input
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            <div 
              style={{
                maxWidth: '720px',
                margin: '0 auto',
                width: '100%',
              }}
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    padding: '20px 0',
                  }}
                >
                  <div 
                    style={{
                      display: 'inline-flex',
                      gap: '6px',
                      padding: '14px 18px',
                      backgroundColor: 'var(--other-box)',
                      borderRadius: '20px',
                    }}
                  >
                    <span 
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--text-muted)',
                        borderRadius: '50%',
                        animation: 'pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        animationDelay: '0ms',
                      }}
                    />
                    <span 
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--text-muted)',
                        borderRadius: '50%',
                        animation: 'pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        animationDelay: '200ms',
                      }}
                    />
                    <span 
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'var(--text-muted)',
                        borderRadius: '50%',
                        animation: 'pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        animationDelay: '400ms',
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Floating Input - Completely Independent */}
      <InputPrompt onSendMessage={handleSendMessage} isLoading={isLoading} />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}