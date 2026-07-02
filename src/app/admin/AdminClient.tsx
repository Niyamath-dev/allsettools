// src/app/admin/AdminClient.tsx
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

export default function AdminClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<'tools' | 'feedback' | 'integrations'>('feedback');
  
  // Feedback State
  const [feedbacks, setFeedbacks] = useState<FeedbackLog[]>([]);

  // Google Sheets Integration State
  const [sheetUrl, setSheetUrl] = useState('');
  const [testingContact, setTestingContact] = useState(false);
  const [testingFeedback, setTestingFeedback] = useState(false);

  // Check login state on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/session');
        const data = await res.json().catch(() => ({}));
        if (data.loggedIn) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };

    checkSession();

    try {
      // Load Feedback
      const logs = JSON.parse(localStorage.getItem('allsettools_feedback_logs') || '[]');
      setFeedbacks(logs);

      // Load Google Sheets Settings
      setSheetUrl(localStorage.getItem('allsettools_google_sheet_url') || localStorage.getItem('allsettools_contact_sheet_url') || '');
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      toast.error('Please enter your email and password.');
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      if (res.ok) {
        setIsLoggedIn(true);
        toast.success('Successfully logged in as Admin!');
        setAuthPassword('');
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Sign-in network error:', err);
      toast.error('Network error during login.');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsLoggedIn(false);
    toast.show('Logged out successfully.', 'info');
  };

  // Clear Feedback
  const clearFeedbacks = () => {
    setFeedbacks([]);
    localStorage.removeItem('allsettools_feedback_logs');
    toast.show('Feedback logs cleared.', 'info');
  };

  // Save Webhook URLs
  const saveUrls = () => {
    const trimmed = sheetUrl.trim();
    localStorage.setItem('allsettools_google_sheet_url', trimmed);
    localStorage.setItem('allsettools_contact_sheet_url', trimmed); // backcompat
    localStorage.setItem('allsettools_feedback_sheet_url', trimmed); // backcompat
    toast.success('Google Sheets integration settings saved!');
  };

  // Test Connection to Webhook
  const testConnection = async (type: 'contact' | 'feedback') => {
    const url = sheetUrl.trim();
    if (!url) {
      toast.error(`Please provide a Google Sheets Web App URL first.`);
      return;
    }
    
    if (type === 'contact') setTestingContact(true);
    else setTestingFeedback(true);

    try {
      const payload = type === 'contact' ? {
        id: 'test-' + Math.random().toString(36).substring(2, 6),
        name: 'Test Name (Admin)',
        email: 'test@allsettools.dev',
        subject: 'Connection Verification',
        message: 'This is a test connection request from AllSetTools admin integrations tab.',
        submittedAt: new Date().toLocaleString()
      } : {
        id: 'test-' + Math.random().toString(36).substring(2, 6),
        name: 'Test Name (Admin)',
        email: 'test@allsettools.dev',
        tool: 'admin-console',
        rating: 5,
        comment: 'This is a test feedback submission from AllSetTools admin integrations tab.',
        submittedAt: new Date().toLocaleDateString()
      };

      const res = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-sheet-url': url
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Connection verification successful! Row successfully appended.');
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || 'Connection verification failed.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Connection test failed: ' + (err.message || 'Network error'));
    } finally {
      if (type === 'contact') setTestingContact(false);
      else setTestingFeedback(false);
    }
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
              Sign in to access tools telemetry & reviews.
            </p>
          </div>

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
        <button onClick={() => setActiveTab('tools')} className={`btn ${activeTab === 'tools' ? 'btn-primary' : 'btn-secondary'}`}>Tool Manager</button>
        <button onClick={() => setActiveTab('feedback')} className={`btn ${activeTab === 'feedback' ? 'btn-primary' : 'btn-secondary'}`}>User Feedback</button>
        <button onClick={() => setActiveTab('integrations')} className={`btn ${activeTab === 'integrations' ? 'btn-primary' : 'btn-secondary'}`}>Google Sheets Integration</button>
      </div>

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

      {/* 4. GOOGLE SHEETS INTEGRATION PANEL */}
      {activeTab === 'integrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Settings Card */}
          <div className="card" style={{ padding: '2rem', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', border: 'none', padding: 0 }}>Configure Webhook URLs</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', margin: 0, marginTop: '-0.5rem' }}>
              Add the Web App URLs generated from your Google Apps Script deployment.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label" style={{ fontWeight: 600 }}>Google Sheets Web App URL</label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={e => setSheetUrl(e.target.value)}
                    className="input"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    style={{ flex: 1 }}
                  />
                </div>
                <small style={{ color: 'var(--color-fg-dimmed)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                  Paste the single Web App URL copied from your Google Spreadsheet's Apps Script deployment.
                </small>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                <label className="label" style={{ fontWeight: 600, marginBottom: '4px' }}>Test Integrations</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => testConnection('contact')}
                    disabled={testingContact}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    {testingContact ? 'Testing Contact Sheet...' : 'Test Contact Form'}
                  </button>
                  <button
                    onClick={() => testConnection('feedback')}
                    disabled={testingFeedback}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    {testingFeedback ? 'Testing Feedback Sheet...' : 'Test Feedback Form'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <button onClick={saveUrls} className="btn btn-primary">
                  Save Webhook Settings
                </button>
              </div>
            </div>
          </div>

          {/* Guide Card */}
          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', border: 'none', padding: 0 }}>Google Sheets Setup Instructions</h3>
            
            <div style={{ fontSize: '0.9rem', color: 'var(--color-fg-muted)', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.6' }}>
              <div>
                <strong style={{ color: 'var(--color-fg)' }}>Step 1: Create a Google Spreadsheet</strong>
                <p style={{ margin: '4px 0 0 0' }}>Open your Google Drive, create a new spreadsheet, and name it (e.g. <code>AllSetTools Submissions</code>).</p>
              </div>
              
              <div>
                <strong style={{ color: 'var(--color-fg)' }}>Step 2: Open Extensions</strong>
                <p style={{ margin: '4px 0 0 0' }}>In the spreadsheet menu, navigate to <strong>Extensions</strong> &rarr; <strong>Apps Script</strong>. This opens the Google Apps Script IDE.</p>
              </div>

              <div>
                <strong style={{ color: 'var(--color-fg)' }}>Step 3: Paste the Deployment Code</strong>
                <p style={{ margin: '4px 0 0 0' }}>Delete any starter template code in the Apps Script window and paste the code snippet below:</p>
                <div style={{ position: 'relative', marginTop: '8px' }}>
                  <pre style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'auto',
                    maxHeight: '300px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    border: '1px solid var(--color-border)'
                  }}>
{`function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet;
    var headers = [];
    
    if (data.type === "contact") {
      sheet = doc.getSheetByName("Contact Submissions") || doc.insertSheet("Contact Submissions");
      headers = ["id", "submittedAt", "name", "email", "subject", "message"];
    } else if (data.type === "feedback") {
      sheet = doc.getSheetByName("User Feedback") || doc.insertSheet("User Feedback");
      headers = ["id", "submittedAt", "name", "email", "tool", "rating", "comment"];
    } else {
      sheet = doc.getSheets()[0];
      headers = Object.keys(data);
    }
    
    // Create headers row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");
    }
    
    // Build row data matches headers
    var row = headers.map(function(h) {
      return data[h] !== undefined ? data[h] : "";
    });
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "row": row }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}
                  </pre>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`function doPost(e) {\n  try {\n    var rawData = e.postData.contents;\n    var data = JSON.parse(rawData);\n    \n    var doc = SpreadsheetApp.getActiveSpreadsheet();\n    var sheet;\n    var headers = [];\n    \n    if (data.type === "contact") {\n      sheet = doc.getSheetByName("Contact Submissions") || doc.insertSheet("Contact Submissions");\n      headers = ["id", "submittedAt", "name", "email", "subject", "message"];\n    } else if (data.type === "feedback") {\n      sheet = doc.getSheetByName("User Feedback") || doc.insertSheet("User Feedback");\n      headers = ["id", "submittedAt", "name", "email", "tool", "rating", "comment"];\n    } else {\n      sheet = doc.getSheets()[0];\n      headers = Object.keys(data);\n    }\n    \n    // Create headers row if empty\n    if (sheet.getLastRow() === 0) {\n      sheet.appendRow(headers);\n      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");\n    }\n    \n    // Build row data matches headers\n    var row = headers.map(function(h) {\n      return data[h] !== undefined ? data[h] : "";\n    });\n    \n    sheet.appendRow(row);\n    \n    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "row": row }))\n      .setMimeType(ContentService.MimeType.JSON);\n  } catch (err) {\n    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))\n      .setMimeType(ContentService.MimeType.JSON);\n  }\n}`);
                      toast.success('Apps Script code copied to clipboard!');
                    }}
                    className="btn btn-secondary" 
                    style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    Copy Snippet
                  </button>
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--color-fg)' }}>Step 4: Save & Deploy as Web App</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                  <li>Click the floppy disk icon (Save) at the top of the editor.</li>
                  <li>Click the blue <strong>Deploy</strong> button &rarr; <strong>New deployment</strong>.</li>
                  <li>Click the gear icon (Select type) and select <strong>Web app</strong>.</li>
                  <li>Set <strong>Execute as</strong> to <code>Me (your-email@gmail.com)</code>.</li>
                  <li>Set <strong>Who has access</strong> to <code>Anyone</code>. <em style={{ fontSize: '0.8rem' }}>(This is required so the server API can submit entries without Google login)</em>.</li>
                  <li>Click <strong>Deploy</strong>. Copy the generated <strong>Web app URL</strong>.</li>
                </ul>
              </div>

              <div>
                <strong style={{ color: 'var(--color-fg)' }}>Step 5: Verify the Integration</strong>
                <p style={{ margin: '4px 0 0 0' }}>Paste the Web App URL into the configuration panel above, click <strong>Save Webhook Settings</strong>, and trigger a <strong>Test Connection</strong> to verify integration.</p>
              </div>
            </div>
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
              Yes. Access is gated behind a secure login portal using a single, unique administrator account email and password configured in your environment variables.
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
