// src/components/Header.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon } from './Icons';
import { CATEGORIES, TOOLS } from '@/lib/registry';
import { toast } from './Toast';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]?.id ?? '');
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        megaOpen &&
        megaRef.current &&
        !megaRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [megaOpen]);

  // Initialize theme & language preferences
  useEffect(() => {
    // 1. Theme Configuration
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // 2. Language Preference Load
    const savedLang = localStorage.getItem('allsettools_lang') || 'en';
    setLang(savedLang);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    toast.show(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('allsettools_lang', newLang);
    setLangDropdownOpen(false);
    toast.success(`Language set to ${newLang === 'en' ? 'English' : newLang === 'es' ? 'Español' : newLang === 'fr' ? 'Français' : 'Deutsch'}`);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const triggerSearch = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
    setMenuOpen(false);
  };

  const langNames: Record<string, string> = {
    en: 'EN',
    es: 'ES',
    fr: 'FR',
    de: 'DE'
  };

  return (
    <header className="header animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, backgroundColor: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)' }}>
      <div className="container header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>

        {/* Left Side Brand Logo */}
        <Link href="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
          <Logo size={28} showText={true} />
        </Link>

        {/* Center Search Bar Trigger (Hidden on Mobile viewports) */}
        <button
          onClick={triggerSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            gap: '10px',
            cursor: 'pointer',
            color: 'var(--color-fg-muted)',
            fontSize: '0.8125rem',
            width: '220px',
            maxWidth: '100%',
            textAlign: 'left',
            transition: 'all var(--transition-fast)',
            boxShadow: 'var(--shadow-sm)'
          }}
          className="search-trigger desktop-only"
          aria-label="Search tools"
        >
          <Icon name="search" style={{ width: '14px', height: '14px' }} />
          <span style={{ flex: 1 }}>Search tools...</span>
          <kbd style={{
            fontSize: '0.65rem',
            background: 'var(--color-bg-subtle)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--color-border)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-primary)'
          }}>⌘K</kbd>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>

          {/* Tools Mega Menu Dropdown — Two-panel design with Bootstrap utilities */}
          <div className="nav-item-container" onMouseEnter={() => { if (!megaOpen) setActiveCat(CATEGORIES[0]?.id ?? activeCat); }}>
            <button
              ref={toggleButtonRef}
              onClick={() => setMegaOpen(!megaOpen)}
              className="nav-item d-inline-flex align-items-center gap-1"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg)', padding: 0 }}
            >
              Tools
              <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▼</span>
            </button>

            <div ref={megaRef} className={`mega-menu${megaOpen ? ' show' : ''}`}>
              {/* LEFT: Category sidebar */}
              <div className="mega-menu-sidebar">
                <div className="mega-menu-sidebar-header text-uppercase fw-bold" style={{ letterSpacing: '0.08em' }}>
                  Browse by Category
                </div>
                {CATEGORIES.map(category => {
                  const count = TOOLS.filter(t => t.category === category.id).length;
                  return (
                    <Link
                      key={category.id}
                      href={`/tools/${category.id}`}
                      className={`mega-menu-cat-item${activeCat === category.id ? ' active' : ''}`}
                      onMouseEnter={() => setActiveCat(category.id)}
                      onClick={() => setMegaOpen(false)}
                    >
                      <span className="mega-menu-cat-icon">
                        <Icon name={category.icon} style={{ width: '14px', height: '14px' }} />
                      </span>
                      <span className="flex-grow-1 fw-medium">{category.name}</span>
                      <span className="badge rounded-pill ms-auto" style={{
                        backgroundColor: 'var(--color-bg-active)',
                        color: 'var(--color-fg-muted)',
                        fontSize: '0.65rem'
                      }}>{count}</span>
                    </Link>
                  );
                })}
              </div>

              {/* RIGHT: Tools panel for active category */}
              <div className="mega-menu-panel">
                {(() => {
                  const cat = CATEGORIES.find(c => c.id === activeCat);
                  const catTools = TOOLS.filter(t => t.category === activeCat);
                  const tools = catTools.slice(0, 18);
                  return (
                    <>
                      <div className="mega-menu-panel-header">
                        <div className="d-flex align-items-center gap-2">
                          <Icon name={cat?.icon ?? 'settings'} style={{ width: '16px', height: '16px', color: 'var(--color-primary)' }} />
                          <span className="mega-menu-panel-title fw-bold">{cat?.name ?? 'Tools'}</span>
                          <span className="badge rounded-pill" style={{
                            backgroundColor: 'var(--color-primary)',
                            color: '#fff',
                            fontSize: '0.65rem'
                          }}>{catTools.length}</span>
                        </div>
                        <Link href={`/tools/${activeCat}`} className="mega-menu-view-all btn btn-sm btn-outline-primary" onClick={() => setMegaOpen(false)}>
                          View all ↗
                        </Link>
                      </div>

                      <div className="mega-menu-tools-grid">
                        {tools.map(tool => (
                          <Link href={`/tools/${tool.id}`} key={tool.id} className="mega-menu-tool-item" onClick={() => setMegaOpen(false)}>
                            <span className="mega-menu-tool-icon">
                              <Icon name={tool.icon} style={{ width: '15px', height: '15px' }} />
                            </span>
                            <span>
                              <div className="mega-menu-tool-name fw-semibold">{tool.name}</div>
                              <div className="mega-menu-tool-desc text-muted">{tool.description?.slice(0, 52)}{(tool.description?.length ?? 0) > 52 ? '…' : ''}</div>
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div className="mega-menu-footer">
                        <span className="mega-menu-footer-text d-flex align-items-center gap-2">
                          <span className="badge bg-success rounded-pill">Free</span>
                          200+ client-side tools · no signup
                        </span>
                        <Link href="/tools" className="mega-menu-footer-link btn btn-sm btn-primary" onClick={() => setMegaOpen(false)}>
                          View All Tools →
                        </Link>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <Link href="/blog" className="nav-item" style={{ border: 'none' }}>Blog</Link>
          <Link href="/about" className="nav-item" style={{ border: 'none' }}>About</Link>
          <Link href="/contact" className="nav-item" style={{ border: 'none' }}>Contact</Link>
          <Link href="/admin" className="nav-item" style={{ border: 'none' }}>Admin</Link>



          {/* Theme Toggle Button — Sun in dark mode, Moon in light mode */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            style={{ width: '36px', height: '36px', position: 'relative', overflow: 'hidden' }}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span
              key={theme}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'themeSpin 0.35s cubic-bezier(0.16,1,0.3,1) forwards'
              }}
            >
              <Icon
                name={theme === 'dark' ? 'sun' : 'moon'}
                style={{ width: '18px', height: '18px', color: theme === 'dark' ? '#f59e0b' : '#6366f1' }}
              />
            </span>
          </button>
        </nav>

        {/* Mobile Hamburger menu Button */}
        <div className="mobile-only">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
            aria-label="Toggle mobile navigation menu"
          >
            <span style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              width: '18px'
            }}>
              <span style={{ height: '2px', backgroundColor: 'var(--color-fg)', width: '100%', transition: 'all var(--transition-fast)', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}></span>
              <span style={{ height: '2px', backgroundColor: 'var(--color-fg)', width: '100%', transition: 'all var(--transition-fast)', opacity: menuOpen ? 0 : 1 }}></span>
              <span style={{ height: '2px', backgroundColor: 'var(--color-fg)', width: '100%', transition: 'all var(--transition-fast)', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}></span>
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          backgroundColor: '#fff',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          gap: '1.5rem',
          animation: 'fadeIn var(--transition-fast) forwards'
        }}>
          {/* Search Trigger for Mobile */}
          <button
            onClick={triggerSearch}
            className="input"
            style={{
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-fg-muted)'
            }}
          >
            <Icon name="search" style={{ width: '16px', height: '16px' }} />
            Search all tools...
          </button>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-fg-dimmed)', letterSpacing: '0.05em', marginBottom: '4px' }}>Categories</h4>
            {CATEGORIES.map(category => (
              <Link
                key={category.id}
                href={`/tools/${category.id}`}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: '0.9rem', color: 'var(--color-fg)', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Icon name={category.icon} style={{ width: '14px', height: '14px' }} />
                {category.name}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <Link href="/blog" onClick={() => setMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>Blog Tutorials</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>About Us</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>Contact Us</Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600 }}>Admin Console</Link>
          </div>

          {/* Toggle buttons inside drawer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', minWidth: '130px' }}
            >
              <Icon
                name={theme === 'dark' ? 'sun' : 'moon'}
                style={{ width: '16px', height: '16px', color: theme === 'dark' ? '#f59e0b' : '#6366f1' }}
              />
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>


          </div>
        </div>
      )}
    </header>
  );
};
