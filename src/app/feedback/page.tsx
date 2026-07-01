// src/app/feedback/page.tsx
"use client";

import React, { useState } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { TOOLS } from '@/lib/registry';
import { toast } from '@/components/Toast';

export default function UserFeedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tool, setTool] = useState('general');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      toast.error('Please enter a comment.');
      return;
    }

    const payload = {
      id: Math.random().toString(36).substring(2, 9),
      name: name || 'Anonymous',
      email: email || 'No email provided',
      tool,
      rating,
      comment,
      submittedAt: new Date().toLocaleDateString()
    };

    try {
      const logs = JSON.parse(localStorage.getItem('allsettools_feedback_logs') || '[]');
      logs.push(payload);
      localStorage.setItem('allsettools_feedback_logs', JSON.stringify(logs));
      toast.success('Thank you! Your feedback has been received.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to log feedback.');
    }

    setName('');
    setEmail('');
    setTool('general');
    setRating(5);
    setComment('');
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem' }}>
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Submit Feedback' }]} />
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem', border: 'none' }}>
          User Feedback System
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-fg-muted)' }}>
          Help us improve AllSetTools. Let us know if you found bugs, need new utilities, or have suggestions.
        </p>
      </div>

      <form onSubmit={submitFeedback} className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
        <div className="grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label className="label">Name (Optional)</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Your Name" />
          </div>
          <div>
            <label className="label">Email (Optional)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@domain.com" />
          </div>
        </div>

        <div className="grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label className="label">Topic / Tool Reference</label>
            <select value={tool} onChange={e => setTool(e.target.value)} className="input">
              <option value="general">General Site Experience</option>
              {TOOLS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Rating (1 to 5 Stars)</label>
            <select value={rating} onChange={e => setRating(parseInt(e.target.value))} className="input">
              <option value="5">★★★★★ (5 Stars)</option>
              <option value="4">★★★★☆ (4 Stars)</option>
              <option value="3">★★★☆☆ (3 Stars)</option>
              <option value="2">★★☆☆☆ (2 Stars)</option>
              <option value="1">★☆☆☆☆ (1 Star)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Comments / Suggestions</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="input textarea"
            placeholder="Describe your request, issue, or feedback details..."
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
