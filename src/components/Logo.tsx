// src/components/Logo.tsx
import React from 'react';
import LogoImage from '@/app/ALL Set Tools logo.png';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 28, showText = true, className = '' }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          height: `50px`,
          width: 'auto',
          overflow: 'hidden',
          display: 'block',
          transition: 'all 0.3s ease'
        }}
      >
        <img
          src={LogoImage.src}
          alt="AllSetTools"
          style={{
            height: '100%',
            width: 'auto',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'left'
          }}
          className="logo-img"
        />
      </div>
    </div>
  );
};
