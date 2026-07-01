// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { TOOLS, Tool } from '@/lib/registry';
import { BlogPost } from '@/lib/blog';
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'blog' | 'tools' | 'feedback'>('analytics');
  
  // Analytics State
  const [stats, setStats] = useState({ totalOperations: 0, totalFavs: 0, userSince: 'Today' });
  
  // Blog State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogCat, setBlogCat] = useState<'security' | 'performance' | 'tutorials'>('tutorials');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogBody, setBlogBody] = useState('');
  const [customPosts, setCustomPosts] = useState<BlogPost[]>([]);

  // Feedback State
  const [feedbacks, setFeedbacks] = useState<FeedbackLog[]>([]);

  // Load States on mount
  useEffect(() => {
    try {
      // Load Analytics
      const ops = localStorage.getItem('allsettools_usage_count') || '0';
      const favs = JSON.parse(localStorage.getItem('allsettools_favorites') || '[]');
      setStats({
        totalOperations: parseInt(ops),
        totalFavs: favs.length,
        userSince: new Date().toLocaleDateString()
      });

      // Load Custom Blog Posts
      const posts = JSON.parse(localStorage.getItem('allsettools_local_blog_posts') || '[]');
      setCustomPosts(posts);

      // Load Feedback
      const logs = JSON.parse(localStorage.getItem('allsettools_feedback_logs') || '[]');
      setFeedbacks(logs);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Handle blog submit
  const publishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogSlug || !blogBody) {
      toast.error('Please fill all required fields.');
      return;
    }

    const newPost: BlogPost = {
      slug: blogSlug.toLowerCase().replace(/[^a-z0-9\-]/g, '-'),
      title: blogTitle,
      excerpt: blogExcerpt || blogBody.substring(0, 100) + '...',
      content: blogBody,
      category: blogCat,
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '3 min read',
      author: 'Administrator'
    };

    const updated = [newPost, ...customPosts];
    setCustomPosts(updated);
    localStorage.setItem('allsettools_local_blog_posts', JSON.stringify(updated));
    toast.success('New blog post published successfully!');

    // Reset Form
    setBlogTitle('');
    setBlogSlug('');
    setBlogExcerpt('');
    setBlogBody('');
  };

  // Delete Blog Post
  const deletePost = (slug: string) => {
    const updated = customPosts.filter(p => p.slug !== slug);
    setCustomPosts(updated);
    localStorage.setItem('allsettools_local_blog_posts', JSON.stringify(updated));
    toast.show('Blog post deleted.', 'info');
  };

  // Clear Feedback
  const clearFeedbacks = () => {
    setFeedbacks([]);
    localStorage.removeItem('allsettools_feedback_logs');
    toast.show('Feedback logs cleared.', 'info');
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem' }}>
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Admin Dashboard' }]} />

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem', border: 'none' }}>
          Workspace Admin Console
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-fg-muted)' }}>
          Manage static assets, draft tutorials, analyze usage metrics, and inspect feedback.
        </p>
      </div>

      {/* Tabs list */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('analytics')} className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}>Analytics</button>
        <button onClick={() => setActiveTab('blog')} className={`btn ${activeTab === 'blog' ? 'btn-primary' : 'btn-secondary'}`}>Draft Articles</button>
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

      {/* 2. BLOG DRAFT PANEL */}
      {activeTab === 'blog' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="tool-container">
          {/* Draft Form */}
          <form onSubmit={publishPost} className="card" style={{ padding: '1.75rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', border: 'none', padding: 0 }}>Create Tutorial Article</h3>
            
            <div className="grid-cols-2" style={{ gap: '1rem' }}>
              <div>
                <label className="label">Title</label>
                <input type="text" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} className="input" placeholder="e.g. Master CSS layouts" required />
              </div>
              <div>
                <label className="label">Slug (URL Path)</label>
                <input type="text" value={blogSlug} onChange={e => setBlogSlug(e.target.value)} className="input" placeholder="master-css-layouts" required />
              </div>
            </div>

            <div className="grid-cols-2" style={{ gap: '1rem' }}>
              <div>
                <label className="label">Category</label>
                <select value={blogCat} onChange={e => setBlogCat(e.target.value as any)} className="input">
                  <option value="security">Security</option>
                  <option value="performance">Performance</option>
                  <option value="tutorials">Tutorials</option>
                </select>
              </div>
              <div>
                <label className="label">Excerpt / Summary</label>
                <input type="text" value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} className="input" placeholder="A brief overview of layout techniques..." />
              </div>
            </div>

            <div>
              <label className="label">Body Content (Markdown Supported)</label>
              <textarea
                value={blogBody}
                onChange={e => setBlogBody(e.target.value)}
                className="input textarea"
                placeholder="# Master Layouts&#10;&#10;Here is some body context..."
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Publish Article</button>
          </form>

          {/* List of custom posts */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Custom Articles ({customPosts.length})</h3>
            {customPosts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {customPosts.map(post => (
                  <div key={post.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-card)' }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>{post.publishedAt}</span>
                    </div>
                    <button onClick={() => deletePost(post.slug)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'var(--color-border)' }}>Delete</button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-dimmed)' }}>No custom articles published yet.</p>
            )}
          </aside>
        </div>
      )}

      {/* 3. TOOL MANAGER PANEL */}
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

      {/* 4. USER FEEDBACK LOGS PANEL */}
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
              Calculations and edits are registered via local storage event counters. No network pings or database queries are generated.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Can I draft custom tutorials permanently?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              Yes. Custom articles draft logs are stored in your current browser&apos;s local cache. Clearing site files will wipe these local posts.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Is there access control on this dashboard?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              For this validation version, the console is open for layout verification, allowing you to test drafts, analytics, and feedback inputs.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Where can I manage tools definitions?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              The tool registry data schema is hardcoded inside static JavaScript registries to guarantee offline launch speeds.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
