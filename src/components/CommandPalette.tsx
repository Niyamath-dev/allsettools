// src/components/CommandPalette.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TOOLS } from '@/lib/registry';
import { Icon } from './Icons';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Toggle command palette on Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setActiveIndex(0);
      setQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const filteredTools = query.trim() === ''
    ? TOOLS.slice(0, 8) // Show first 8 popular/default tools
    : TOOLS.filter(t =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
    );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % filteredTools.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[activeIndex]) {
        navigate(filteredTools[activeIndex].id);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const navigate = (id: string) => {
    router.push(`/tools/${id}`);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) setIsOpen(false);
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '12vh',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div style={{
        width: '90%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        maxHeight: '420px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn var(--transition-fast) forwards'
      }}>
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-border)',
          padding: '14px 18px',
          gap: '12px'
        }}>
          <Icon name="search" style={{ color: 'var(--color-fg-muted)', width: '20px', height: '20px' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type tool name or keywords to search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--color-fg)',
              fontFamily: 'inherit',
              fontSize: '1rem'
            }}
          />
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 6px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-fg-muted)',
            fontFamily: 'var(--font-mono)'
          }}>ESC</span>
        </div>

        {/* Results List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px'
        }}>
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => navigate(tool.id)}
                  onMouseEnter={() => setActiveIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    gap: '14px',
                    backgroundColor: isActive ? 'var(--color-bg-hover)' : 'transparent',
                    border: isActive ? '1px solid var(--color-border-hover)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Icon name={tool.icon} style={{
                    width: '18px',
                    height: '18px',
                    color: isActive ? 'var(--color-fg)' : 'var(--color-fg-muted)'
                  }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: isActive ? 'var(--color-fg)' : 'var(--color-fg-muted)'
                    }}>{tool.name}</div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-fg-dimmed)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{tool.description}</div>
                  </div>
                  {isActive && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-fg-muted)',
                      fontFamily: 'var(--font-mono)'
                    }}>↵ Enter</span>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--color-fg-muted)',
              fontSize: '0.875rem'
            }}>No tools match &ldquo;{query}&rdquo;</div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div style={{
          padding: '8px 18px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--color-fg-dimmed)',
          backgroundColor: 'var(--color-bg-subtle)'
        }}>
          <span>Use ↑↓ keys to navigate</span>
          <span>Press ↵ to open</span>
        </div>
      </div>
    </div>
  );
};
