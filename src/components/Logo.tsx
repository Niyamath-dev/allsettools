// src/components/Logo.tsx
import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 28, showText = true, className = '' }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 2px 8px rgba(139, 92, 246, 0.25))',
          transition: 'transform 0.3s ease',
          display: 'block'
        }}
        className="logo-svg"
      >
        <defs>
          <linearGradient id="allsetLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--logo-grad-start, #8b5cf6)" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="var(--logo-grad-end, #06b6d4)" />
          </linearGradient>
        </defs>
        {/* Outer Hexagonal Nut (represents "Tools") */}
        <path
          d="M16 2L28.12 9v14L16 30L3.88 23V9L16 2Z"
          fill="url(#allsetLogoGrad)"
        />
        {/* Checkmark overlay (represents "All Set") */}
        <path
          d="M11 16.5L14.5 20L21.5 11"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span 
          className="logo-text" 
          style={{ 
            fontWeight: 800, 
            fontSize: '1.25rem', 
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--color-fg) 60%, var(--color-fg-muted) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}
        >
          AllSetTools
        </span>
      )}
    </div>
  );
};
