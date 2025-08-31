'use client';

import { useState, useEffect } from 'react';

interface DefaultViewProps {
  onSuggestionClick?: (suggestion: string) => void;
}

export default function DefaultView({ onSuggestionClick }: DefaultViewProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const suggestions = [
    'Tell me the latest news',
    'How can Grok help?',
    'What\'s happening in tech today?',
    'Explain quantum computing simply',
  ];

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '20px',
      }}
    >
      <div 
        style={{
          maxWidth: '680px',
          width: '100%',
          textAlign: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <h1 
          style={{
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #888888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          Grok
        </h1>
        
        <p 
          style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            marginBottom: '40px',
            opacity: 0.9,
          }}
        >
          Ask me anything or choose a suggestion to get started
        </p>
        
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick?.(suggestion)}
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--other-box)',
                border: '1px solid transparent',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                animationDelay: `${index * 50}ms`,
                lineHeight: '1.4',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--other-box)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}