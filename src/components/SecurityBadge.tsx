// src/components/SecurityBadge.tsx
import React from 'react';
import { Icon } from './Icons';

export const SecurityBadge: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        color: 'var(--color-fg)',
        alignItems: 'flex-start',
        marginBottom: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: 'var(--color-success)',
          flexShrink: 0,
        }}
      >
        <Icon name="shield-check" style={{ width: '18px', height: '18px' }} />
      </div>
      <div>
        <h5
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            margin: '0 0 4px 0',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            padding: 0,
          }}
        >
          Secure Client-Side Sandbox
        </h5>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-fg-muted)',
            lineHeight: '1.5',
            margin: 0,
          }}
        >
          This utility executes <strong>100% locally</strong> in your web browser. Your data and files are processed in-memory and are <strong>never uploaded to our servers</strong>. This client-side execution structure renders remote malware transmission, stored file vulnerabilities, and server data leaks impossible.
        </p>
      </div>
    </div>
  );
};
