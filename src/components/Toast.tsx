// src/components/Toast.tsx
"use client";
import React, { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'error' | 'info';
}

type ToastCallback = (msg: ToastMessage) => void;
let toastListeners: ToastCallback[] = [];

export const toast = {
  show: (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    toastListeners.forEach(cb => cb({ id, text, type }));
  },
  success: (text: string) => toast.show(text, 'success'),
  error: (text: string) => toast.show(text, 'error'),
  info: (text: string) => toast.show(text, 'info')
};

export const ToastProvider: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== msg.id));
      }, 3000);
    };

    toastListeners.push(handleToast);
    return () => {
      toastListeners = toastListeners.filter(cb => cb !== handleToast);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '320px',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-fg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          fontSize: '0.875rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn var(--transition-fast) forwards',
          pointerEvents: 'auto'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: t.type === 'success' ? 'var(--color-success)' : t.type === 'error' ? 'var(--color-danger)' : 'var(--color-fg-muted)'
          }} />
          <div style={{ flex: 1 }}>{t.text}</div>
        </div>
      ))}
    </div>
  );
};
