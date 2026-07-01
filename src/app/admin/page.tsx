// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { TOOLS } from '@/lib/registry';
import { toast } from '@/components/Toast';

interface FeedbackLog {
  id: string;
  name: string;
  email: string;
  tool: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

interface AdminUser {
  email: string;
  passwordHash: string;
}

const PRE_SEEDED_ADMIN = {
  email: 'admin@allsettools.dev',
  password: 'AdminPass123'
};

const SECRET_REGISTRATION_PASSCODE = 'ALLSET_SECURE_2026';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPasscode, setAuthPasscode] = useState('');

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'tools' | 'feedback'>('analytics');
  
  // Analytics State
  const [stats, setStats] = useState({ totalOperations: 0, totalFavs: 0, userSince: 'Today' });
  
  // Feedback State
  const [feedbacks, setFeedbacks] = useState<FeedbackLog[]>([]);

  // Check login state on mount
  useEffect(() => {
    const session = sessionStorage.getItem('allsettools_admin_session');
    if (session === 'true') {
      setIsLoggedIn(true);
    }

    try {
      // Load Analytics
      const ops = localStorage.getItem('allsettools_usage_count') || '0';
      const favs = JSON.parse(localStorage.getItem('allsettools_favorites') || '[]');
      setStats({
        totalOperations: parseInt(ops),
        totalFavs: favs.length,
        userSince: new Date().toLocaleDateString()
      });

      // Load Feedback
      const logs = JSON.parse(localStorage.getItem('allsettools_feedback_logs') || '[]');
      setFeedbacks(logs);
    } catch (e) {
      console.error(e);
    }
  }, [isLoggedIn]);

  // Handle Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      toast.error('Please enter your email and password.');
      return;
    }

    // 1. Check against pre-seeded admin
    if (authEmail === PRE_SEEDED_ADMIN.email && authPassword === PRE_SEEDED_ADMIN.password) {
      sessionStorage.setItem('allsettools_admin_session', 'true');
      setIsLoggedIn(true);
      toast.success('Successfully logged in as Admin!');
      setAuthPassword('');
      return;
    }

    // 2. Check against registered admins in LocalStorage
    try {
      const registeredUsers: AdminUser[] = JSON.parse(localStorage.getItem('allsettools_admin_users') || '[]');
      const found = registeredUsers.find(u => u.email === authEmail && u.passwordHash === authPassword);
      if (found) {
        sessionStorage.setItem('allsettools_admin_session', 'true');
        setIsLoggedIn(true);
        toast.success('Successfully logged in!');
        setAuthPassword('');
        return;
      }
    } catch (e) {
      console.error(e);
    }

    toast.error('Invalid email or password.');
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword || !authPasscode) {
      toast.error('All fields are required.');
      return;
    }

    if (authPasscode !== SECRET_REGISTRATION_PASSCODE) {
      toast.error('Invalid Registration Passcode.');
      return;
    }

    try {
      const registeredUsers: AdminUser[] = JSON.parse(localStorage.getItem('allsettools_admin_users') || '[]');
      
      // Check if user already exists
      if (authEmail === PRE_SEEDED_ADMIN.email || registeredUsers.some(u => u.email === authEmail)) {
        toast.error('Admin email is already registered.');
        return;
      }

      const newUser: AdminUser = {
        email: authEmail,
        passwordHash: authPassword
      };

      registeredUsers.push(newUser);
      localStorage.setItem('allsettools_admin_users', JSON.stringify(registeredUsers));
      sessionStorage.setItem('allsettools_admin_session', 'true');
      setIsLoggedIn(true);
      toast.success('Registration successful! Logged in.');
      
      // Reset form
      setAuthEmail('');
      setAuthPassword('');
      setAuthPasscode('');
    } catch (e) {
      console.error(e);
      toast.error('Registration failed.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('allsettools_admin_session');
    setIsLoggedIn(false);
    toast.show('Logged out successfully.', 'info');
  };

  // Clear Feedback
  const clearFeedbacks = () => {
    setFeedbacks([]);
    localStorage.removeItem('allsettools_feedback_logs');
    toast.show('Feedback logs cleared.', 'info');
  };

  if (!isLoggedIn) {
    return (
      <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem 0' }}>
        <div className="card" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem',
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', margin: '0 0 0.25rem 0', border: 'none', padding: 0 }}>
              Admin Access Gate
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', margin: 0 }}>
              {authTab === 'login' ? 'Sign in to access tools telemetry & reviews.' : 'Create a new secure admin account.'}
            </p>
          </div>

          {/* Form Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <button
              onClick={() => setAuthTab('login')}
              className={`btn ${authTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, fontSize: '0.8125rem', padding: '8px' }}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthTab('register')}
              className={`btn ${authTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, fontSize: '0.8125rem', padding: '8px' }}
            >
              Register
            </button>
          </div>

          {authTab === 'login' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label" style={{ fontSize: '0.8125rem' }}>Admin Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="input"
                  placeholder="admin@allsettools.dev"
                  required
                />
              </div>
              <div>
                <label className="label" style={{ fontSize: '0.8125rem' }}>Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Sign In to Console
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label" style={{ fontSize: '0.8125rem' }}>Admin Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="input"
                  placeholder="name@domain.com"
                  required
                />
              </div>
              <div>
                <label className="label" style={{ fontSize: '0.8125rem' }}>Create Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="input"
                  placeholder="Secure password"
                  required
                />
              </div>
              <div>
                <label className="label" style={{ fontSize: '0.8125rem' }}>Secret Passcode</label>
                <input
                  type="password"
                  value={authPasscode}
                  onChange={e => setAuthPasscode(e.target.value)}
                  className="input"
                  placeholder="Enter secret registration key"
                  required
                />
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-fg-muted)', marginTop: '4px', display: 'block' }}>
                  Ask the project owner for the secure registration key code.
                </span>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Create Admin Account
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Admin Dashboard' }]} />
        <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: '0.8125rem', color: 'var(--color-danger)' }}>
          Logout Console
        </button>
      </div>

      <div style={{ marginBottom: '2.5rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem', border: 'none' }}>
          Workspace Admin Console
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-fg-muted)' }}>
          Manage local configurations, analyze usage metrics, and inspect feedback ratings.
        </p>
      </div>

      {/* Tabs list */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('analytics')} className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}>Analytics</button>
        <button onClick={() => setActiveTab('tools')} className={`btn ${activeTab === 'tools' ? 'btn-primary' : 'btn-secondary'}`}>Tool Manager</button>
        <button onClick={() => setActiveTab('feedback')} className={`btn ${activeTab === 'feedback' ? 'btn-primary' : 'btn-secondary'}`}>User Feedback</button>
      </div>

      {/* 1. ANALYTICS PANEL */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Highlight Cards */}
          <div className="grid-cols-3">
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>Total Executions</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0.25rem 0' }}>{stats.totalOperations}</div>
              <p style={{ fontSize: '0.75rem' }}>Client-side browser runs</p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>Saved Favorites</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0.25rem 0' }}>{stats.totalFavs}</div>
              <p style={{ fontSize: '0.75rem' }}>Starred tools checklist</p>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>Session Created</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.75rem 0' }}>{stats.userSince}</div>
              <p style={{ fontSize: '0.75rem' }}>Site session initial entry</p>
            </div>
          </div>

          {/* Simple Custom styled monochrome bar chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>Simulated Tool Category Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                  <span>Developer Tools</span>
                  <span>45% of total usage</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '45%', backgroundColor: 'var(--color-fg)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                  <span>Text Utilities</span>
                  <span>25% of total usage</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '25%', backgroundColor: 'var(--color-fg)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                  <span>Image Compressor & Converters</span>
                  <span>20% of total usage</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '20%', backgroundColor: 'var(--color-fg)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                  <span>SEO & Business Calculators</span>
                  <span>10% of total usage</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '10%', backgroundColor: 'var(--color-fg)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TOOL MANAGER PANEL */}
      {activeTab === 'tools' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Local Registry Flags</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '8px' }}>Tool Name</th>
                  <th style={{ padding: '8px' }}>Category</th>
                  <th style={{ padding: '8px' }}>Trending</th>
                  <th style={{ padding: '8px' }}>Popular</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.slice(0, 12).map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{t.name}</td>
                    <td style={{ padding: '8px', textTransform: 'capitalize' }}>{t.category}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        backgroundColor: t.isTrending ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
                        color: t.isTrending ? 'var(--color-success)' : 'var(--color-fg-dimmed)',
                        border: '1px solid var(--color-border)'
                      }}>
                        {t.isTrending ? 'Trending' : 'None'}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        backgroundColor: t.isPopular ? 'rgba(255, 179, 0, 0.1)' : 'transparent',
                        color: t.isPopular ? 'var(--color-warning)' : 'var(--color-fg-dimmed)',
                        border: '1px solid var(--color-border)'
                      }}>
                        {t.isPopular ? 'Popular' : 'None'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-fg-dimmed)' }}>
            Showing 12 primary database registry mappings. Static definitions cannot be mutated runtime without git files updates.
          </div>
        </div>
      )}

      {/* 3. USER FEEDBACK LOGS PANEL */}
      {activeTab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Aggregated Reviews ({feedbacks.length})</h3>
            {feedbacks.length > 0 && <button onClick={clearFeedbacks} className="btn btn-secondary" style={{ color: 'var(--color-danger)' }}>Clear Logs</button>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.length > 0 ? (
              feedbacks.map(f => (
                <div key={f.id} className="card" style={{ padding: '1.25rem', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{f.name} <span style={{ fontWeight: 'normal', color: 'var(--color-fg-muted)', fontSize: '0.8rem' }}>({f.email})</span></span>
                    <span style={{ color: 'var(--color-warning)', fontSize: '0.85rem' }}>
                      {'★'.repeat(f.rating) + '☆'.repeat(5 - f.rating)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)', display: 'flex', gap: '8px' }}>
                    <span>Ref: {f.tool}</span>
                    <span>•</span>
                    <span>Date: {f.submittedAt}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--color-fg-muted)', fontStyle: 'italic' }}>
                    &ldquo;{f.comment}&rdquo;
                  </p>
                </div>
              ))
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--color-bg-subtle)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', color: 'var(--color-fg-muted)' }}>
                No feedback entries submitted yet. Visit the <a href="/feedback" style={{ color: 'var(--color-fg)', textDecoration: 'underline' }}>Feedback page</a> to log testing submissions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAQs Collapsible Accordion */}
      <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem', marginTop: '3rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'var(--color-fg)', border: 'none', padding: 0 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>How are the usage analytics tracked?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              Calculations and tool operations are tracked locally in your browser cache registry. No external network queries or analytics scripts are sent.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Where is user feedback stored?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              Feedback logs are recorded in your current browser session&apos;s LocalStorage database, allowing you to audit reviews and clear statistics at any time.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Is there access control on this dashboard?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              Yes. Access is gated behind a client-side login layer. Registering a new admin user requires entering a secret registration code key.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Where can I manage tools definitions?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              Static configuration mapping flags are hardcoded inside Javascript database registry schemas to ensure microsecond execution speeds.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
