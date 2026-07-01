// src/components/BackToTop.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: 'var(--glass-bg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 999,
        transition: 'all var(--transition-fast)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        color: 'var(--color-fg)'
      }}
      className="btn-icon"
      aria-label="Back to top"
      title="Back to top"
    >
      <Icon name="arrow-up" style={{ width: '18px', height: '18px' }} />
    </button>
  );
};
