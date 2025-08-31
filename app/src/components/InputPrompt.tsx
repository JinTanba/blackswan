'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';

interface InputPromptProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function InputPrompt({ onSendMessage, isLoading }: InputPromptProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '720px',
        zIndex: 1000,
      }}
    >
      <div 
        style={{
          backgroundColor: '#252628',
          borderRadius: '30px',
          padding: '10px 10px 10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '60px',
        }}
      >
        {/* Attachment button */}
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: '6px',
            cursor: 'pointer',
            color: '#8B8B8D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Expert dropdown */}
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: '6px 10px',
            cursor: 'pointer',
            color: '#8B8B8D',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 17L12 22L22 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 12L12 17L22 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span>Expert</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path 
              d="M6 9L12 15L18 9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Text input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How can Grok help?"
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#FCFCFC',
            fontSize: '15px',
            padding: '10px 0',
          }}
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          type="button"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: 'none',
            cursor: message.trim() && !isLoading ? 'pointer' : 'not-allowed',
            backgroundColor: message.trim() && !isLoading 
              ? 'rgba(255, 255, 255, 0.9)' 
              : 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <rect x="3" y="10" width="3" height="4" fill={message.trim() ? '#000' : '#666'} />
            <rect x="8" y="7" width="3" height="10" fill={message.trim() ? '#000' : '#666'} />
            <rect x="13" y="4" width="3" height="16" fill={message.trim() ? '#000' : '#666'} />
            <rect x="18" y="9" width="3" height="6" fill={message.trim() ? '#000' : '#666'} />
          </svg>
        </button>
      </div>
    </div>
  );
}