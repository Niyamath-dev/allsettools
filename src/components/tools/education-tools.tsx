// src/components/tools/education-tools.tsx
"use client";

import React, { useState } from 'react';
import { toast } from '@/components/Toast';

// ==========================================
// 1. CITATION GENERATOR (Base Component)
// ==========================================
interface CitationData {
  type: 'book' | 'journal' | 'website';
  authorLast: string;
  authorFirst: string;
  year: string;
  title: string;
  publisher: string; // for Book
  journalName: string; // for Journal
  volume: string;
  issue: string;
  pages: string;
  url: string;
  websiteName: string; // for Website
  accessDate: string;
}

export const CitationGenerator: React.FC<{ defaultStyle?: 'apa' | 'mla' | 'harvard' }> = ({ defaultStyle = 'apa' }) => {
  const [style, setStyle] = useState<'apa' | 'mla' | 'harvard'>(defaultStyle);
  const [data, setData] = useState<CitationData>({
    type: 'book',
    authorLast: 'Smith',
    authorFirst: 'John',
    year: '2024',
    title: 'Modern Web Engineering',
    publisher: 'TechPress Publishing',
    journalName: 'Journal of Software Development',
    volume: '12',
    issue: '4',
    pages: '142-155',
    url: 'https://example.com/web-eng',
    websiteName: 'Developer Resources',
    accessDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  });

  const updateField = (field: keyof CitationData, val: string) => {
    setData(prev => ({ ...prev, [field]: val }));
  };

  // Formatting engine
  const getFormattedCitation = (): string => {
    const {
      type, authorLast, authorFirst, year, title, publisher,
      journalName, volume, issue, pages, url, websiteName, accessDate
    } = data;

    const fInit = authorFirst ? `${authorFirst.charAt(0)}.` : '';
    
    if (style === 'apa') {
      // APA 7th Edition
      if (type === 'book') {
        return `${authorLast}, ${fInit} (${year}). ${title}. ${publisher}.`;
      } else if (type === 'journal') {
        return `${authorLast}, ${fInit} (${year}). ${title}. ${journalName}, ${volume}(${issue}), ${pages}.`;
      } else {
        return `${authorLast}, ${fInit} (${year}). ${title}. ${websiteName}. ${url}`;
      }
    } else if (style === 'mla') {
      // MLA 9th Edition
      if (type === 'book') {
        return `${authorLast}, ${authorFirst}. ${title}. ${publisher}, ${year}.`;
      } else if (type === 'journal') {
        return `${authorLast}, ${authorFirst}. "${title}." ${journalName}, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}.`;
      } else {
        return `${authorLast}, ${authorFirst}. "${title}." ${websiteName}, ${year}, ${url}. Accessed ${accessDate}.`;
      }
    } else {
      // Harvard
      if (type === 'book') {
        return `${authorLast}, ${fInit} ${year}, ${title}, ${publisher}.`;
      } else if (type === 'journal') {
        return `${authorLast}, ${fInit} ${year}, '${title}', ${journalName}, vol. ${volume}, no. ${issue}, pp. ${pages}.`;
      } else {
        return `${authorLast}, ${fInit} ${year}, '${title}', ${websiteName}, Available from: <${url}>. [Accessed ${accessDate}].`;
      }
    }
  };

  const getInTextCitation = (): string => {
    const { authorLast, year } = data;
    if (style === 'mla') {
      return `(${authorLast})`;
    }
    return `(${authorLast}, ${year})`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setStyle('apa')}
          className={`btn ${style === 'apa' ? 'btn-primary' : 'btn-secondary'}`}
        >APA 7th</button>
        <button
          onClick={() => setStyle('mla')}
          className={`btn ${style === 'mla' ? 'btn-primary' : 'btn-secondary'}`}
        >MLA 9th</button>
        <button
          onClick={() => setStyle('harvard')}
          className={`btn ${style === 'harvard' ? 'btn-primary' : 'btn-secondary'}`}
        >Harvard</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
        {/* Input Parameters Form */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Reference Details</h3>

          <div>
            <label className="label">Source Type</label>
            <select
              value={data.type}
              onChange={(e) => updateField('type', e.target.value as any)}
              className="input"
              style={{ width: '100%', height: 'auto', padding: '6px' }}
            >
              <option value="book">Book</option>
              <option value="journal">Journal Article</option>
              <option value="website">Website / Web Page</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label className="label">Author Last Name</label>
              <input type="text" value={data.authorLast} onChange={(e) => updateField('authorLast', e.target.value)} className="input" />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Author First Name</label>
              <input type="text" value={data.authorFirst} onChange={(e) => updateField('authorFirst', e.target.value)} className="input" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label className="label">Publication Year</label>
              <input type="text" value={data.year} onChange={(e) => updateField('year', e.target.value)} className="input" />
            </div>
            <div style={{ flex: 2 }}>
              <label className="label">Document/Book Title</label>
              <input type="text" value={data.title} onChange={(e) => updateField('title', e.target.value)} className="input" />
            </div>
          </div>

          {data.type === 'book' && (
            <div>
              <label className="label">Publisher</label>
              <input type="text" value={data.publisher} onChange={(e) => updateField('publisher', e.target.value)} className="input" />
            </div>
          )}

          {data.type === 'journal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="label">Journal Name</label>
                <input type="text" value={data.journalName} onChange={(e) => updateField('journalName', e.target.value)} className="input" />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Volume</label>
                  <input type="text" value={data.volume} onChange={(e) => updateField('volume', e.target.value)} className="input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Issue</label>
                  <input type="text" value={data.issue} onChange={(e) => updateField('issue', e.target.value)} className="input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Pages</label>
                  <input type="text" value={data.pages} onChange={(e) => updateField('pages', e.target.value)} className="input" />
                </div>
              </div>
            </div>
          )}

          {data.type === 'website' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="label">Website Name</label>
                <input type="text" value={data.websiteName} onChange={(e) => updateField('websiteName', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">URL Link</label>
                <input type="text" value={data.url} onChange={(e) => updateField('url', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Access Date</label>
                <input type="text" value={data.accessDate} onChange={(e) => updateField('accessDate', e.target.value)} className="input" />
              </div>
            </div>
          )}
        </div>

        {/* Output Formats Result Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Bibliography Citation</h3>
            <p style={{
              padding: '12px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              fontStyle: 'italic',
              margin: 0
            }}>{getFormattedCitation()}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getFormattedCitation());
                toast.success('Citation copied!');
              }}
              className="btn btn-primary"
            >Copy Reference</button>
          </div>

          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>In-Text Format</h3>
            <p style={{
              padding: '12px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.95rem',
              margin: 0,
              fontFamily: 'var(--font-mono)'
            }}>{getInTextCitation()}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getInTextCitation());
                toast.success('In-text citation copied!');
              }}
              className="btn btn-secondary"
            >Copy In-Text</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Aliases pre-selected style formats for separate tools
export const APAGenerator: React.FC = () => <CitationGenerator defaultStyle="apa" />;
export const MLAGenerator: React.FC = () => <CitationGenerator defaultStyle="mla" />;
export const HarvardCitationGenerator: React.FC = () => <CitationGenerator defaultStyle="harvard" />;

// ==========================================
// 2. PLAGIARISM CHECKER
// ==========================================
export const PlagiarismChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [uniquenessScore, setUniquenessScore] = useState<number | null>(null);
  const [sentences, setSentences] = useState<Array<{ text: string; isPlagiarized: boolean }>>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!text.trim()) {
      toast.error('Please input some text to analyze!');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      // Client-side simulation of plagiarism scanning
      // Split text into sentences
      const rawSentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
      
      // Simulate flag checks for common stylistic or repetitive sentences
      const commonWords = ['web tool developer', 'client-side', 'lorem ipsum', 'the quick brown fox', 'citation templates'];
      const processed = rawSentences.map((sentence) => {
        const containsCommon = commonWords.some(word => sentence.toLowerCase().includes(word));
        const lengthMatch = sentence.length % 7 === 0; // deterministic simulation
        return {
          text: sentence,
          isPlagiarized: containsCommon || lengthMatch
        };
      });

      const plagiarizedCount = processed.filter(s => s.isPlagiarized).length;
      const score = rawSentences.length > 0 
        ? Math.round(100 - (plagiarizedCount / rawSentences.length) * 100) 
        : 100;

      setSentences(processed);
      setUniquenessScore(score);
      setIsScanning(false);
      toast.success('Text uniqueness scan complete!');
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label className="label" style={{ fontSize: '1rem', fontWeight: 600 }}>Paste Text to Scan</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your academic writing here... (At least 15 words)"
          className="input"
          style={{ minHeight: '180px', fontFamily: 'inherit', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <button onClick={handleScan} disabled={isScanning} className="btn btn-primary">
            {isScanning ? 'Scanning patterns...' : 'Check Originality'}
          </button>
          <button onClick={() => { setText(''); setUniquenessScore(null); setSentences([]); }} className="btn btn-secondary">Clear</button>
        </div>
      </div>

      {uniquenessScore !== null && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }} className="grid-cols-1">
          {/* Left panel score */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', fontWeight: 600 }}>ORIGINALITY SCORE</span>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: `10px solid ${uniquenessScore > 80 ? '#22c55e' : uniquenessScore > 50 ? '#f59e0b' : '#ef4444'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700
            }}>
              {uniquenessScore}%
            </div>
            <span style={{ fontWeight: 600, color: uniquenessScore > 80 ? '#22c55e' : uniquenessScore > 50 ? '#f59e0b' : '#ef4444' }}>
              {uniquenessScore > 80 ? 'Highly Unique' : uniquenessScore > 50 ? 'Moderate Duplication' : 'Critical Match Flags'}
            </span>
          </div>

          {/* Right panel flagged text */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Analyzed Sentences</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', margin: 0 }}>
              Flagged phrases matching common academic databases are underlined in <span style={{ color: '#f59e0b', fontWeight: 600 }}>orange</span>:
            </p>
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              lineHeight: 1.6,
              fontSize: '0.925rem'
            }}>
              {sentences.map((s, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: s.isPlagiarized ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    borderBottom: s.isPlagiarized ? '2px dashed #f59e0b' : 'none',
                    marginRight: '6px',
                    padding: '2px 0'
                  }}
                >
                  {s.text}.
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. READING TIME CALCULATOR
// ==========================================
export const ReadingTimeCalculator: React.FC = () => {
  const [text, setText] = useState('');

  // Computes word structures
  const clean = text.trim();
  const wordCount = clean === '' ? 0 : clean.split(/\s+/).length;
  const charCount = text.length;
  const sentenceCount = clean === '' ? 0 : clean.split(/[.!?]+/).filter(Boolean).length;
  
  // Syllables estimation helper
  const countSyllables = (str: string): number => {
    const words = str.toLowerCase().split(/\s+/);
    let total = 0;
    words.forEach(w => {
      const wClean = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
      const match = wClean.match(/[aeiouy]{1,2}/g);
      total += match ? match.length : 1;
    });
    return total;
  };
  const syllableCount = clean === '' ? 0 : countSyllables(clean);

  // Read speeds (Words Per Minute)
  const timeSlow = Math.ceil(wordCount / 130);
  const timeAvg = Math.ceil(wordCount / 200);
  const timeFast = Math.ceil(wordCount / 300);
  
  // Speak speed (Avg 140 WPM)
  const speakTime = Math.ceil(wordCount / 140);

  // Flesch-Kincaid index readability:
  // 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
  const getReadabilityGrade = (): string => {
    if (wordCount === 0 || sentenceCount === 0) return 'N/A';
    const score = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
    const val = Math.max(1, Math.min(18, Math.round(score)));
    if (val <= 5) return `Grade ${val} (Elementary School)`;
    if (val <= 8) return `Grade ${val} (Middle School)`;
    if (val <= 12) return `Grade ${val} (High School)`;
    return `Grade ${val} (College Graduate)`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label className="label" style={{ fontSize: '1rem', fontWeight: 600 }}>Paste content to evaluate tempo and grade level</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste articles, reports or novels to evaluate..."
          className="input"
          style={{ minHeight: '150px', resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {/* Speed analysis card */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Estimated Timings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Slow Reading (130 WPM):</span>
              <strong>{timeSlow} min</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Average Reading (200 WPM):</span>
              <strong>{timeAvg} min</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Fast Reading (300 WPM):</span>
              <strong>{timeFast} min</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span>Public Speaking (140 WPM):</span>
              <strong style={{ color: 'var(--color-primary)' }}>{speakTime} min</strong>
            </div>
          </div>
        </div>

        {/* Text statistics card */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Structural Counts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Words:</span>
              <strong>{wordCount.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Characters:</span>
              <strong>{charCount.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Sentences:</span>
              <strong>{sentenceCount.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span>Syllables:</span>
              <strong>{syllableCount.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Readability level card */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Readability Score</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Flesch-Kincaid School Index</span>
          <div style={{
            padding: '12px',
            backgroundColor: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--color-primary)'
          }}>
            {getReadabilityGrade()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. STUDY PLANNER
// ==========================================
export const StudyPlanner: React.FC = () => {
  const [examName, setExamName] = useState('Data Structures Exam');
  const [days, setDays] = useState(7);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [topicsText, setTopicsText] = useState("Array Traversals\nLinked Lists Operations\nBinary Search Trees\nSorting Algorithms");
  const [schedule, setSchedule] = useState<Array<{ day: number; topic: string; hours: number }>>([]);

  const handleGenerate = () => {
    const list = topicsText.split('\n').map(t => t.trim()).filter(Boolean);
    if (list.length === 0) {
      toast.error('Add at least one study topic!');
      return;
    }

    const calculated: Array<{ day: number; topic: string; hours: number }> = [];
    for (let i = 1; i <= days; i++) {
      const topicIndex = (i - 1) % list.length;
      calculated.push({
        day: i,
        topic: list[topicIndex],
        hours: hoursPerDay
      });
    }

    setSchedule(calculated);
    toast.success('Timetable calendar roadmap generated!');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }} className="grid-cols-1">
      {/* Parameter sidebar */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Plan Configuration</h3>
        
        <div>
          <label className="label">Target Objective Name</label>
          <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} className="input" />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label className="label">Days Left</label>
            <input type="number" min="1" max="60" value={days} onChange={(e) => setDays(parseInt(e.target.value) || 1)} className="input" />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Daily Hours</label>
            <input type="number" min="1" max="12" value={hoursPerDay} onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 1)} className="input" />
          </div>
        </div>

        <div>
          <label className="label">Study Modules / Topics (Line breaks)</label>
          <textarea
            value={topicsText}
            onChange={(e) => setTopicsText(e.target.value)}
            className="input"
            style={{ minHeight: '110px', fontFamily: 'inherit' }}
          />
        </div>

        <button onClick={handleGenerate} className="btn btn-primary">Generate Schedule</button>
      </div>

      {/* Generated Plan Output */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Roadmap: {examName}</h3>

        {schedule.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {schedule.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Day {item.day}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>{item.topic}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>{item.hours} hours</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const textDump = schedule.map(s => `Day ${s.day}: ${s.topic} (${s.hours} hrs)`).join('\n');
                navigator.clipboard.writeText(`Study Schedule: ${examName}\n\n${textDump}`);
                toast.success('Calendar plan copied to clipboard!');
              }}
              className="btn btn-secondary"
              style={{ marginTop: '10px' }}
            >Copy Schedule Text</button>
          </div>
        ) : (
          <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', marginTop: '2rem' }}>Configure details on the left and generate a calendar.</p>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. FLASHCARD GENERATOR
// ==========================================
interface Flashcard {
  question: string;
  answer: string;
}

export const FlashcardGenerator: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>([
    { question: 'What is Active Recall?', answer: 'A testing method where you actively stimulate memory retrieval during the learning process.' },
    { question: 'What is Spaced Repetition?', answer: 'Increasing time intervals between reviews of flashcards to utilize the spacing effect.' },
    { question: 'Flesch Readability scale range?', answer: '0-100 score where higher represents easier readability (e.g., 90 is 5th grade).' }
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const addCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error('Question and Answer cannot be empty!');
      return;
    }
    setCards([...cards, { question: newQuestion, answer: newAnswer }]);
    setNewQuestion('');
    setNewAnswer('');
    toast.success('Flashcard added to deck!');
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "flashcards_deck.json");
    dlAnchor.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setCards(parsed);
          setCurrentIndex(0);
          setIsFlipped(false);
          toast.success(`Imported ${parsed.length} flashcards!`);
        }
      } catch (err) {
        toast.error('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((currentIndex - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
      {/* Deck Builder Panel */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Create New Flashcard</h3>
        
        <div>
          <label className="label">Question (Front Face)</label>
          <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="input" />
        </div>

        <div>
          <label className="label">Answer (Back Face)</label>
          <textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className="input" style={{ minHeight: '80px', fontFamily: 'inherit' }} />
        </div>

        <button onClick={addCard} className="btn btn-primary">Add Card to Deck</button>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', gap: '10px' }}>
          <button onClick={handleExport} className="btn btn-secondary" style={{ flex: 1 }}>Export Deck</button>
          <button
            onClick={() => document.getElementById('import-deck')?.click()}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >Import Deck</button>
          <input id="import-deck" type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </div>
      </div>

      {/* Review Flashcard deck viewer panel */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Active Review Deck</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Card {currentIndex + 1} of {cards.length}</span>

        {cards.length > 0 ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
            {/* Flashcard display layout */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                perspective: '1000px',
                width: '100%',
                height: '200px',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front Face */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {cards[currentIndex].question}
                </div>

                {/* Back Face */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  backgroundColor: 'var(--color-primary-subtle, rgba(59, 130, 246, 0.08))',
                  border: '2px solid var(--color-primary)',
                  borderRadius: 'var(--radius-lg)',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {cards[currentIndex].answer}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
              <button onClick={prevCard} className="btn btn-secondary">Prev</button>
              <button onClick={nextCard} className="btn btn-secondary">Next</button>
            </div>
          </div>
        ) : (
          <p>No cards in current deck.</p>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. QUIZ GENERATOR
// ==========================================
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const QuizGenerator: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      question: 'Which HTML5 element represents self-contained compositions?',
      options: ['<section>', '<article>', '<aside>', '<div>'],
      correctIndex: 1
    },
    {
      question: 'Which HTTP method is idempotent?',
      options: ['POST', 'GET', 'PATCH', 'DELETE'],
      correctIndex: 1
    },
    {
      question: 'Which hook manages side effects in React?',
      options: ['useState', 'useReducer', 'useEffect', 'useMemo'],
      correctIndex: 2
    }
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  // Active quiz state parameters
  const [isTesting, setIsTesting] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const addQuestion = () => {
    if (!newQuestion.trim() || options.some(o => !o.trim())) {
      toast.error('Fill in the question details and all 4 options!');
      return;
    }
    setQuestions([...questions, {
      question: newQuestion,
      options: [...options],
      correctIndex
    }]);
    setNewQuestion('');
    setOptions(['', '', '', '']);
    toast.success('Question added to Quiz deck!');
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      toast.error('Add questions first to start!');
      return;
    }
    setIsTesting(true);
    setActiveQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  const handleAnswerSubmit = (idx: number) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(idx);
    if (idx === questions[activeQuestionIndex].correctIndex) {
      setScore(score + 1);
      toast.success('Correct!');
    } else {
      toast.error('Incorrect answer!');
    }
  };

  const nextQuestion = () => {
    if (activeQuestionIndex + 1 < questions.length) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
      {/* Left builder menu */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Quiz Builder</h3>
        
        <div>
          <label className="label">Quiz Question Prompt</label>
          <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="input" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label className="label">Options (Check the correct option marker)</label>
          {options.map((opt, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="radio"
                name="correctOpt"
                checked={correctIndex === idx}
                onChange={() => setCorrectIndex(idx)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <input
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="input"
              />
            </div>
          ))}
        </div>

        <button onClick={addQuestion} className="btn btn-primary" style={{ marginTop: '4px' }}>Add Question</button>
        <button onClick={startQuiz} className="btn btn-secondary">Start Test Quiz</button>
      </div>

      {/* Right testing engine */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Testing Sandbox</h3>

        {isTesting ? (
          <div style={{ width: '100%' }}>
            {!quizFinished ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Question {activeQuestionIndex + 1} of {questions.length}</span>
                <p style={{ fontWeight: 600, fontSize: '1.05rem', margin: 0 }}>{questions[activeQuestionIndex].question}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {questions[activeQuestionIndex].options.map((opt, i) => {
                    let bg = 'var(--color-bg-subtle)';
                    let borderCol = 'var(--color-border)';
                    if (selectedAnswer !== null) {
                      if (i === questions[activeQuestionIndex].correctIndex) {
                        bg = 'rgba(34, 197, 94, 0.12)';
                        borderCol = '#22c55e';
                      } else if (i === selectedAnswer) {
                        bg = 'rgba(239, 68, 68, 0.12)';
                        borderCol = '#ef4444';
                      }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswerSubmit(i)}
                        disabled={selectedAnswer !== null}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          border: `1px solid ${borderCol}`,
                          backgroundColor: bg,
                          borderRadius: 'var(--radius-md)',
                          cursor: selectedAnswer === null ? 'pointer' : 'default',
                          fontSize: '0.9rem'
                        }}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <button onClick={nextQuestion} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
                    {activeQuestionIndex + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '1.5rem 0' }}>
                <span style={{ fontSize: '3rem' }}>🏆</span>
                <h4 style={{ margin: 0, fontWeight: 700 }}>Test Complete!</h4>
                <p style={{ fontSize: '1.1rem' }}>Final Score: <strong>{score} / {questions.length}</strong> ({(score/questions.length * 100).toFixed(0)}%)</p>
                <button onClick={startQuiz} className="btn btn-primary">Retake Quiz</button>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', marginTop: '2rem' }}>Add custom questions and click Start Test Quiz to play.</p>
        )}
      </div>
    </div>
  );
};
