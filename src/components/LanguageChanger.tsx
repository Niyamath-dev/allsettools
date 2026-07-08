// src/components/LanguageChanger.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'id', name: 'Bahasa Indonesia' },
];

export const LanguageChanger: React.FC = () => {
  const [lang, setLang] = useState('en');
  const pathname = usePathname();

  // Check the google translate cookie on mount & periodic sync
  useEffect(() => {
    const checkCookie = () => {
      if (typeof document === 'undefined') return;
      const match = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
      const activeLang = match ? match[1] : 'en';
      setLang(activeLang);
    };

    checkCookie();
    // Run interval to sync language code if Google alters it
    const timer = setInterval(checkCookie, 2000);
    return () => clearInterval(timer);
  }, []);

  // Force Google Translate reload on route transitions to prevent Next.js from reverting DOM translations
  useEffect(() => {
    const refreshTranslation = () => {
      if (typeof document === 'undefined') return;
      const match = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
      const activeLang = match ? match[1] : 'en';

      const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleSelect) {
        if (googleSelect.value !== activeLang) {
          googleSelect.value = activeLang;
          googleSelect.dispatchEvent(new Event('change'));
        }
      }
    };

    // Delay slightly to let Next.js finish compiling the newly routed DOM elements
    const timer = setTimeout(refreshTranslation, 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLang(val);

    // 1. Direct Cookie Update (helps Google Translate load on page refresh)
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/en/${val}; path=/;`;
    if (hostname.includes('.')) {
      document.cookie = `googtrans=/en/${val}; path=/; domain=.${hostname};`;
    }

    // 2. Update native Google Translate element if mounted
    const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleSelect) {
      googleSelect.value = val;
      googleSelect.dispatchEvent(new Event('change'));
    } else {
      // Reload page if script isn't interactive yet so it applies the cookie translation
      window.location.reload();
    }
  };

  return (
    <div className="google-translate-wrapper" style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
      {/* Globe Icon */}
      <span className="globe-icon" style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        color: 'var(--color-fg-muted)',
        pointerEvents: 'none',
        zIndex: 2,
      }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </span>

      {/* Selector Dropdown */}
      <select
        value={lang}
        onChange={handleLangChange}
        className="language-select-dropdown"
        style={{
          backgroundColor: 'var(--color-bg-card, #fff)',
          color: 'var(--color-fg, #000)',
          border: '1px solid var(--color-border, #ccc)',
          padding: '8px 36px 8px 34px',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: 500,
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          transition: 'all 0.15s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code} style={{ color: 'var(--color-fg)' }}>
            {item.name}
          </option>
        ))}
      </select>

      {/* Down Chevron Arrow */}
      <span style={{
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        color: 'var(--color-fg-muted)',
        pointerEvents: 'none',
        zIndex: 2,
      }}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
};
