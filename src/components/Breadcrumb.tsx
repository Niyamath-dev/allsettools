// src/components/Breadcrumb.tsx
import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="breadcrumbs-separator" style={{ margin: '0 0.25rem' }}>/</span>}
            {isLast || !item.url ? (
              <span style={{ color: 'var(--color-fg)', fontWeight: 500 }} aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.url} style={{ color: 'var(--color-fg-muted)' }}>
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
