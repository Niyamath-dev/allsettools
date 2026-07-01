// src/components/tools/social-tools.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/components/Toast';

// Common copy action
const copyToClipboard = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};

// ==========================================
// 1. YOUTUBE TAG GENERATOR
// ==========================================
export const YouTubeTagGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!keyword.trim()) {
      toast.error('Please enter a root keyword topic.');
      return;
    }
    const clean = keyword.trim().toLowerCase();
    
    // SEO Tag formulas
    const templates = [
      clean,
      `${clean} tutorial`,
      `${clean} for beginners`,
      `how to ${clean}`,
      `best ${clean}`,
      `${clean} 2026`,
      `easy ${clean} guide`,
      `${clean} tips`,
      `${clean} course`,
      `what is ${clean}`,
      `${clean} explained`,
      `${clean} tricks`,
      `learn ${clean}`
    ];
    setGeneratedTags(templates);
    setSelectedTags(templates);
    toast.success('Tags generated!');
  };

  const toggleSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Topic Keywords</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. Next.js, Vegan Cooking, Video Editing"
            className="input"
          />
          <button onClick={handleGenerate} className="btn btn-primary">Generate Tags</button>
        </div>
      </div>

      {generatedTags.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Generated tags ({selectedTags.length} selected)</h3>
            <button onClick={() => copyToClipboard(selectedTags.join(', '))} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Copy Selected Tags
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {generatedTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <span
                  key={tag}
                  onClick={() => toggleSelect(tag)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: active ? '#2563eb' : 'var(--color-bg-subtle)',
                    color: active ? '#ffffff' : 'var(--color-fg)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tag} {active ? '✓' : '+'}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. YOUTUBE TITLE GENERATOR
// ==========================================
export const YouTubeTitleGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('beginners');
  const [titles, setTitles] = useState<Array<{ type: string; title: string }>>([]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error('Please enter a video topic.');
      return;
    }
    const capTopic = topic.trim().replace(/\b\w/g, c => c.toUpperCase());
    
    const variants = [
      { type: 'Clickbait / Hook', title: `I Tried ${capTopic} For 30 Days (Here's What Happened!)` },
      { type: 'Clickbait / Hook', title: `Don't Learn ${capTopic} Until You Watch This Video!` },
      { type: 'How-to / Educational', title: `How to Master ${capTopic} in 10 Minutes (Step-by-Step Guide)` },
      { type: 'How-to / Educational', title: `The Ultimate ${capTopic} Guide for ${audience === 'beginners' ? 'Beginners' : 'Pros'}` },
      { type: 'Listicle', title: `10 Fatal ${capTopic} Mistakes You Must Avoid` },
      { type: 'Listicle', title: `5 Simple ${capTopic} Hacks That Actually Work` },
      { type: 'Question / Curiosity', title: `Is ${capTopic} Actually Worth It in 2026?` },
      { type: 'Question / Curiosity', title: `Why Everyone is Wrong About ${capTopic}...` },
      { type: 'Review / Comparison', title: `${capTopic} Review: The Honest Truth (No sponsor)` },
      { type: 'Review / Comparison', title: `${capTopic} vs Competition: Which is Better?` }
    ];
    setTitles(variants);
    toast.success('Titles generated successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Topic Configuration</h3>
        
        <div className="grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label className="label">Video Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Next.js App Router, Calisthenics Routine"
              className="input"
            />
          </div>
          <div>
            <label className="label">Target Audience</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="input">
              <option value="beginners">Beginners</option>
              <option value="experts">Experts / Professionals</option>
              <option value="general">General Public</option>
            </select>
          </div>
        </div>

        <button onClick={handleGenerate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          Generate Titles
        </button>
      </div>

      {titles.length > 0 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Generated Title Variants</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, listStyle: 'none' }}>
            {titles.map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#3b82f6', fontWeight: 700, display: 'block', marginBottom: '2px' }}>{item.type}</span>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.title}</span>
                </div>
                <button onClick={() => copyToClipboard(item.title)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. YOUTUBE DESCRIPTION GENERATOR
// ==========================================
export const YouTubeDescriptionGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [socials, setSocials] = useState('Follow me on:\nTwitter: @myusername\nInstagram: @myusername');
  const [timestamps, setTimestamps] = useState('00:00 - Introduction\n01:30 - Core concepts\n05:45 - Summary');
  const [out, setOut] = useState('');

  const generateDescription = () => {
    if (!topic.trim()) {
      toast.error('Please enter a brief video topic description.');
      return;
    }
    const template = `🎬 ABOUT THIS VIDEO
${topic}

📌 TIMESTAMPS
${timestamps}

🔗 CONNECT WITH ME
${socials}

👍 Support the channel by Liking & Subscribing for more guides!
#youtube #seo #tutorial`;
    setOut(template);
    toast.success('Description generated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Description Builder</h3>
        
        <div>
          <label className="label">About the Video / Overview</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What happens in this video? E.g. In this tutorial we go over standard state structures..."
            className="input"
            style={{ height: '80px' }}
          />
        </div>

        <div className="grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label className="label">Video Timestamps</label>
            <textarea value={timestamps} onChange={(e) => setTimestamps(e.target.value)} className="input" style={{ height: '100px', fontFamily: 'var(--font-mono)' }} />
          </div>
          <div>
            <label className="label">Social Handles / Links</label>
            <textarea value={socials} onChange={(e) => setSocials(e.target.value)} className="input" style={{ height: '100px' }} />
          </div>
        </div>

        <button onClick={generateDescription} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate Description</button>
      </div>

      {out && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Compiled Description Output</h3>
            <button onClick={() => copyToClipboard(out)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Copy All</button>
          </div>
          <textarea readOnly value={out} className="input" style={{ height: '220px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. INSTAGRAM BIO GENERATOR
// ==========================================
export const InstagramBioGenerator: React.FC = () => {
  const [role, setRole] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [tone, setTone] = useState('aesthetic');
  const [bios, setBios] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!role.trim()) {
      toast.error('Please input your occupation or role.');
      return;
    }
    
    const r = role.trim();
    const h = hobbies.trim() || 'travelling';

    const templates = {
      aesthetic: [
        `✨ ${r}\n🌿 ${h}\n💫 Making waves & chasing horizons\n👇 Collab here`,
        `☾ ${r} | wanderer\n✈️ based in my dreams\n⚡️ ${h} addict\n💌 dm for projects`,
        `📍 Living life in pixels\n💫 ${r} & creative mind\n🎨 passion for ${h}\n👋 Say hi below`
      ],
      minimal: [
        `${r}.\n${h}.\n💌 dm or contact`,
        `• ${r}\n• ${h}\n• email for bookings`,
        `Focused on ${r} and ${h}.\n📥 enquiries`
      ],
      funny: [
        `Professionally: ${r}.\nPersonally: Professional overthinker.\n☕️ Powered by caffeine and ${h}`,
        `Standard ${r} by day, ${h} champion by night.\n🤫 Shhh, I'm working`,
        `I put the 'pro' in procrastination and ${r}.\n🏆 ${h} runner-up`
      ]
    }[tone as 'aesthetic' | 'minimal' | 'funny'] || [];

    setBios(templates);
    toast.success('Instagram bios generated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Profile Settings</h3>
        
        <div className="grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label className="label">Occupation / Title</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. UI/UX Designer, Chef" className="input" />
          </div>
          <div>
            <label className="label">Hobbies / Interests</label>
            <input type="text" value={hobbies} onChange={(e) => setHobbies(e.target.value)} placeholder="e.g. hiking, coffee art" className="input" />
          </div>
        </div>

        <div>
          <label className="label">Bio Vibe Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="input">
            <option value="aesthetic">Aesthetic / Sparkly</option>
            <option value="minimal">Minimalist / Clean</option>
            <option value="funny">Humorous / Witty</option>
          </select>
        </div>

        <button onClick={handleGenerate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate Bios</button>
      </div>

      {bios.length > 0 && (
        <div className="grid-cols-3" style={{ gap: '1rem' }}>
          {bios.map((b, idx) => (
            <div key={idx} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-fg-muted)' }}>Option {idx + 1}</span>
              <pre style={{ margin: 0, fontSize: '0.85rem', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: '1.5', flex: 1 }}>{b}</pre>
              <button onClick={() => copyToClipboard(b)} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>Copy Bio</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. TIKTOK CAPTION GENERATOR
// ==========================================
export const TikTokCaptionGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [captions, setCaptions] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error('Please enter a TikTok video topic.');
      return;
    }
    const clean = topic.trim();
    
    const templates = [
      `Wait until the end... 😱 | Topic: ${clean} #fyp #viral #foryou #trending`,
      `Did anyone else know this? 🤯 ${clean} #mindblown #xyzbca #tiktokguides`,
      `How I solved my biggest problem using ${clean} ✨ #growth #hack #learnontiktok`,
      `Day 1 of trying ${clean}. Do we like it? 👇 #aesthetic #vlog #aestheticroutine`,
      `Don't scroll! This ${clean} hack is a game-changer 💥 #lifehacks #viralshorts`
    ];
    setCaptions(templates);
    toast.success('Captions compiled!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>TikTok Video Concept</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. morning routine, core coding workout"
            className="input"
          />
          <button onClick={handleGenerate} className="btn btn-primary">Generate Captions</button>
        </div>
      </div>

      {captions.length > 0 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Captions Output</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, listStyle: 'none' }}>
            {captions.map((cap, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <span style={{ fontSize: '0.85rem' }}>{cap}</span>
                <button onClick={() => copyToClipboard(cap)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. PINTEREST DESCRIPTION GENERATOR
// ==========================================
export const PinterestDescriptionGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [out, setOut] = useState('');

  const generate = () => {
    if (!topic.trim()) {
      toast.error('Please enter a Pin topic.');
      return;
    }
    const keys = keywords.split(',').map(k => `#${k.trim().toLowerCase().replace(/\s+/g, '')}`).join(' ');
    const desc = `📌 Looking for inspiration on ${topic}? Check out this absolute step-by-step guide. Perfect for anyone wanting to learn more about the best aesthetics and tips! Save this pin for later and click through to read the full guide. \n\n${keys}`;
    setOut(desc);
    toast.success('Pinterest pin description generated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Pinterest Pin Setup</h3>
        
        <div>
          <label className="label">Pin Topic / Board Title</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Aesthetic Home Office Layouts" className="input" />
        </div>

        <div>
          <label className="label">Search Keywords (comma separated)</label>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. desk decor, home office setup, productivity" className="input" />
        </div>

        <button onClick={generate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate Description</button>
      </div>

      {out && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Optimized Description</h3>
            <button onClick={() => copyToClipboard(out)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Copy Description</button>
          </div>
          <textarea readOnly value={out} className="input" style={{ height: '140px', fontSize: '0.85rem', lineHeight: '1.5' }} />
        </div>
      )}
    </div>
  );
};

// ==========================================
// 7. LINKEDIN HEADLINE GENERATOR
// ==========================================
export const LinkedInHeadlineGenerator: React.FC = () => {
  const [role, setRole] = useState('');
  const [valueProp, setValueProp] = useState('');
  const [skill, setSkill] = useState('');
  const [headlines, setHeadlines] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!role.trim() || !valueProp.trim()) {
      toast.error('Please input your job role and target value proposition.');
      return;
    }
    const r = role.trim();
    const v = valueProp.trim();
    const s = skill.trim() || 'Next.js';
    
    const variants = [
      `${r} | Helping business owners ${v} | Specialty in ${s}`,
      `${r} @ Tech | Solving problems and ${v} through advanced ${s} frameworks`,
      `Passionate ${r} focused on ${v} | Speaker, mentor, & ${s} expert`,
      `${r} helping clients ${v}. Let's build together! 🚀`,
      `${r} specializing in ${s} | Creating values to ${v}`
    ];
    setHeadlines(variants);
    toast.success('LinkedIn headlines generated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Professional Persona Details</h3>
        
        <div className="grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label className="label">Current Job Title / Role</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior Software Engineer" className="input" />
          </div>
          <div>
            <label className="label">Top Speciality Skill</label>
            <input type="text" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g. React & TypeScript" className="input" />
          </div>
        </div>

        <div>
          <label className="label">Value Proposition (What do you help people do?)</label>
          <input type="text" value={valueProp} onChange={(e) => setValueProp(e.target.value)} placeholder="e.g. scale SaaS products 10x, design high converting funnels" className="input" />
        </div>

        <button onClick={handleGenerate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate Headlines</button>
      </div>

      {headlines.length > 0 && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Headline Projections</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, listStyle: 'none' }}>
            {headlines.map((headline, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{headline}</span>
                <button onClick={() => copyToClipboard(headline)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 8. TWEET FORMATTER & THREADER
// ==========================================
export const TweetFormatter: React.FC = () => {
  const [text, setText] = useState('');
  const [tweets, setTweets] = useState<string[]>([]);

  const formatThreads = () => {
    if (!text.trim()) {
      toast.error('Please input or paste a long text paragraph.');
      return;
    }
    
    // Segment on paragraph endings or sentences to stay under 280-char limit
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    const result: string[] = [];
    
    let currentTweet = '';
    
    paragraphs.forEach((p) => {
      // If single paragraph is too large, split into sentences
      if (p.length > 250) {
        const sentences = p.match(/[^.!?]+[.!?]+(\s|$)/g) || [p];
        sentences.forEach((s) => {
          if ((currentTweet + ' ' + s).length > 250) {
            result.push(currentTweet.trim());
            currentTweet = s;
          } else {
            currentTweet += ' ' + s;
          }
        });
      } else {
        if ((currentTweet + '\n\n' + p).length > 250) {
          if (currentTweet) result.push(currentTweet.trim());
          currentTweet = p;
        } else {
          currentTweet = currentTweet ? currentTweet + '\n\n' + p : p;
        }
      }
    });
    if (currentTweet) result.push(currentTweet.trim());

    // Map index numbers (e.g. "1/5 ...")
    const threaded = result.map((t, idx) => `${idx + 1}/${result.length}\n${t}`);
    setTweets(threaded);
    toast.success('Split paragraphs into structured thread!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Paste Long Article Content</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your long post details here..."
          className="input"
          style={{ height: '160px' }}
        />
        <button onClick={formatThreads} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Segment into Tweets Thread</button>
      </div>

      {tweets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Thread Preview ({tweets.length} Posts)</h3>
            <button onClick={() => copyToClipboard(tweets.join('\n\n---\n\n'))} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Copy Full Thread
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tweets.map((tw, idx) => (
              <div key={idx} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <pre style={{ margin: 0, fontSize: '0.875rem', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: '1.5' }}>{tw}</pre>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Characters: {tw.length} / 280</span>
                  <button onClick={() => copyToClipboard(tw)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Copy Post</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 9. HASHTAG ANALYTICS
// ==========================================
export const HashtagAnalytics: React.FC = () => {
  const [hashtagInput, setHashtagInput] = useState('#javascript #programming #developer #webdev #code');
  
  const [result, setResult] = useState({
    totalCount: 0,
    averageLength: 0,
    nicheCount: 0,
    midCount: 0,
    highCount: 0
  });

  const analyze = () => {
    const rawTags = hashtagInput.match(/#\w+/g) || [];
    if (rawTags.length === 0) {
      toast.error('No hashtags found. Make sure to prefix with #.');
      return;
    }

    const totalCount = rawTags.length;
    const totalLength = rawTags.reduce((sum, tag) => sum + tag.length - 1, 0);
    const averageLength = totalLength / totalCount;

    // Simulate difficulty grouping based on length/character weights
    let niche = 0, mid = 0, high = 0;
    rawTags.forEach(t => {
      const len = t.length - 1;
      if (len < 6) high++; // Short tag (very general e.g. #code)
      else if (len >= 6 && len <= 12) mid++;
      else niche++;
    });

    setResult({
      totalCount,
      averageLength,
      nicheCount: niche,
      midCount: mid,
      highCount: high
    });
    toast.success('Hashtags analyzed!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Hashtag Analytics Inputs</h3>
        <textarea
          value={hashtagInput}
          onChange={(e) => setHashtagInput(e.target.value)}
          placeholder="Paste hashtags here..."
          className="input"
          style={{ height: '80px' }}
        />
        <button onClick={analyze} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Analyze Tags</button>
      </div>

      {result.totalCount > 0 && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Analytics Overview</h3>
          
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Count:</span>
                <strong>{result.totalCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Average Tag Length:</span>
                <strong>{result.averageLength.toFixed(1)} chars</strong>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>High Competition Tags:</span>
                <strong style={{ color: 'var(--color-danger, red)' }}>{result.highCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mid Competition Tags:</span>
                <strong style={{ color: '#3b82f6' }}>{result.midCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Niche / Low Competition:</span>
                <strong style={{ color: 'var(--color-success)' }}>{result.nicheCount}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 10. EMOJI PICKER
// ==========================================
const EMOJIS = {
  "Smileys & Emotions": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😇", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "🥴", "😠", "😡", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺", "🤠", "🤡", "👹", "👺", "👻", "💀", "👽", "👾", "🤖", "🎃"],
  "Activities & Travel": ["⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳️", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "⛸", "🎿", "🛷", "🥌", "🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛵", "🏍", "🛺", "🚲", "🛴", "🛹", "🚏", "🛣", "🛤", "⛽️", "🚨", "🚥", "🚦", "🏗", "🏢", "🏚", "🏠", "🏡", "🏘", "🛖", "⛪️", "🕌", "⛺️", "🌅", "🌅", "🌄", "🌇", "🌉", "🌋", "🏔", "⛰", "🏔"],
  "Food & Drinks": ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", " melon", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶", "🫑", "🌽", "🥕", "🫒", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🍕", "🌮", "🌯"],
  "Objects & Symbols": ["⌚️", "📱", "📲", "💻", "⌨️", "🖥", "🖨", "🖱", "🖲", "🕹", "🗜", "💽", "💾", "💿", "DVD", "📼", "📷", "📸", "📹", "🎥", "📽", "🎞", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙", "🎚", "🎛", "🧭", "⏱", "⏲", "⏰", "⏳", "⏳", "🔋", "🔌", "💡", "🔦", "🕯", "🔬", "🔭", "📡", "💸", "💵", "💴", "💶", "💷"]
};

export const EmojiPicker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleEmojiClick = (emoji: string) => {
    copyToClipboard(emoji);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Search Emojis</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type keywords to filter emojis (e.g. smile, heart, fire)..."
          className="input"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {Object.entries(EMOJIS).map(([category, list]) => {
          const filtered = list.filter(emoji =>
            searchTerm ? category.toLowerCase().includes(searchTerm.toLowerCase()) || emoji.includes(searchTerm) : true
          );

          if (filtered.length === 0) return null;

          return (
            <div key={category} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-fg-muted)', fontWeight: 600 }}>{category}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '10px' }}>
                {filtered.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEmojiClick(emoji)}
                    title="Click to copy!"
                    style={{
                      fontSize: '1.5rem',
                      background: 'none',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.1s ease',
                      backgroundColor: 'var(--color-bg-subtle)'
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)';
                      (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
