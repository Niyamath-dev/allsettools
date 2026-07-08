// src/components/tools/text-tools.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/components/Toast';
import { Icon } from '@/components/Icons';

// Helper: Copy utility
const copyToClipboard = (text: string) => {
  if (!text) {
    toast.error('Nothing to copy!');
    return;
  }
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};

// 1. Word Counter
export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({ words: 0, chars: 0, sentences: 0, paragraphs: 0, readingTime: 0 });

  useEffect(() => {
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim() !== '').length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter(p => p.trim() !== '').length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute average

    setStats({ words, chars, sentences, paragraphs, readingTime });
  }, [text]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label className="label">Input Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input textarea"
          placeholder="Paste or type your text here..."
        />
      </div>
      
      {/* Stats Display Grid */}
      <div className="grid-cols-4">
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.words}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Words</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.chars}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Characters</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.sentences}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Sentences</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>~{stats.readingTime} min</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Reading Time</div>
        </div>
      </div>
    </div>
  );
};

// 2. Character Counter
export const CharacterCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({ total: 0, noSpaces: 0, bytes: 0, lines: 0 });

  useEffect(() => {
    const total = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const bytes = new Blob([text]).size;
    const lines = text === '' ? 0 : text.split('\n').length;
    setStats({ total, noSpaces, bytes, lines });
  }, [text]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label className="label">Input Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input textarea"
          placeholder="Paste or type your text here..."
        />
      </div>
      <div className="grid-cols-4">
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Total Characters</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.noSpaces}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Without Spaces</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.bytes} B</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Size in Bytes</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.lines}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Lines</div>
        </div>
      </div>
    </div>
  );
};

// 3. Case Converter
export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toSentence = () => {
    const sentences = text.toLowerCase().split(/([.!?]\s+)/);
    const converted = sentences.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    setText(converted);
  };
  const toTitle = () => {
    const title = text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setText(title);
  };
  const toCamel = () => {
    const camel = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    setText(camel);
  };
  const toSnake = () => {
    const snake = text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    setText(snake);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input textarea"
        placeholder="Type or paste text to convert casing..."
      />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={toUpper} className="btn btn-secondary">UPPERCASE</button>
        <button onClick={toLower} className="btn btn-secondary">lowercase</button>
        <button onClick={toSentence} className="btn btn-secondary">Sentence case</button>
        <button onClick={toTitle} className="btn btn-secondary">Title Case</button>
        <button onClick={toCamel} className="btn btn-secondary">camelCase</button>
        <button onClick={toSnake} className="btn btn-secondary">snake_case</button>
        <button onClick={() => copyToClipboard(text)} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          Copy Output
        </button>
      </div>
    </div>
  );
};

// 4. Text Compare
export const TextCompare: React.FC = () => {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [differences, setDifferences] = useState<{ type: 'same' | 'added' | 'removed'; val: string }[]>([]);

  const compareText = () => {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const diffs: typeof differences = [];

    // Simple line-by-line comparison algorithm for lightweight client operations
    const maxLen = Math.max(linesA.length, linesB.length);
    for (let i = 0; i < maxLen; i++) {
      const lineA = linesA[i];
      const lineB = linesB[i];

      if (lineA === lineB) {
        diffs.push({ type: 'same', val: lineA || '' });
      } else {
        if (lineA !== undefined) diffs.push({ type: 'removed', val: `- ${lineA}` });
        if (lineB !== undefined) diffs.push({ type: 'added', val: `+ ${lineB}` });
      }
    }
    setDifferences(diffs);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-cols-2">
        <div>
          <label className="label">Original Text (A)</label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="input textarea"
            placeholder="Enter original text..."
          />
        </div>
        <div>
          <label className="label">Modified Text (B)</label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="input textarea"
            placeholder="Enter modified text..."
          />
        </div>
      </div>
      <button onClick={compareText} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Compare Text
      </button>

      {differences.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <label className="label">Diff Comparison Output</label>
          <div className="tool-output-panel" style={{ display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-mono)' }}>
            {differences.map((d, idx) => (
              <span
                key={idx}
                style={{
                  color: d.type === 'added' ? 'var(--color-success)' : d.type === 'removed' ? 'var(--color-danger)' : 'var(--color-fg-muted)',
                  backgroundColor: d.type === 'added' ? 'rgba(0,230,118,0.06)' : d.type === 'removed' ? 'rgba(255,51,51,0.06)' : 'transparent',
                  padding: '2px 4px',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {d.val || '\u00A0'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Remove Duplicate Lines
export const RemoveDuplicateLines: React.FC = () => {
  const [text, setText] = useState('');
  const [removedCount, setRemovedCount] = useState(0);

  const cleanLines = () => {
    const lines = text.split('\n');
    const unique = Array.from(new Set(lines));
    setText(unique.join('\n'));
    setRemovedCount(lines.length - unique.length);
    toast.success(`Removed ${lines.length - unique.length} duplicate lines!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input textarea"
        placeholder="Enter lines (one per row) to deduplicate..."
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={cleanLines} className="btn btn-primary">Remove Duplicates</button>
        {removedCount > 0 && (
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-success)' }}>
            ✓ Cleaned {removedCount} duplicate lines
          </span>
        )}
        <button onClick={() => copyToClipboard(text)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>
          Copy Output
        </button>
      </div>
    </div>
  );
};

// 6. Text Sorter
export const TextSorter: React.FC = () => {
  const [text, setText] = useState('');
  const [sortType, setSortType] = useState<'asc' | 'desc' | 'length' | 'reverse'>('asc');

  const sortLines = () => {
    const lines = text.split('\n').filter(l => l !== '');
    let sorted = [...lines];
    if (sortType === 'asc') {
      sorted.sort((a, b) => a.localeCompare(b));
    } else if (sortType === 'desc') {
      sorted.sort((a, b) => b.localeCompare(a));
    } else if (sortType === 'length') {
      sorted.sort((a, b) => a.length - b.length);
    } else if (sortType === 'reverse') {
      sorted.reverse();
    }
    setText(sorted.join('\n'));
    toast.success('Lines sorted successfully');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input textarea"
        placeholder="Enter lines of text to sort..."
      />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as any)}
          className="input"
          style={{ width: 'auto' }}
        >
          <option value="asc">Alphabetical (A to Z)</option>
          <option value="desc">Alphabetical (Z to A)</option>
          <option value="length">Length (Short to Long)</option>
          <option value="reverse">Reverse Line Order</option>
        </select>
        <button onClick={sortLines} className="btn btn-primary">Sort</button>
        <button onClick={() => copyToClipboard(text)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>
          Copy Output
        </button>
      </div>
    </div>
  );
};

// 7. Reverse Text
export const ReverseText: React.FC = () => {
  const [text, setText] = useState('');
  
  const reverseLetters = () => {
    setText(text.split('').reverse().join(''));
  };

  const reverseWords = () => {
    setText(text.split(/\s+/).reverse().join(' '));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input textarea"
        placeholder="Enter text to reverse..."
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={reverseLetters} className="btn btn-secondary">Reverse Characters</button>
        <button onClick={reverseWords} className="btn btn-secondary">Reverse Word Order</button>
        <button onClick={() => copyToClipboard(text)} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          Copy
        </button>
      </div>
    </div>
  );
};

// 8. Lorem Ipsum Generator
export const LoremIpsumGenerator: React.FC = () => {
  const [paras, setParas] = useState(3);
  const [output, setOutput] = useState('');

  const sentences = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Proin vel diam at ex elementum feugiat.",
    "Sed id leo et quam tincidunt rhoncus non in urna.",
    "Donec et nisl et sem hendrerit elementum.",
    "Aenean congue eros quis metus mollis vulputate.",
    "Quisque imperdiet purus nec magna elementum luctus.",
    "Curabitur ut urna tristique, egestas elit ut, aliquet lorem.",
    "Mauris pulvinar lectus a felis interdum posuere."
  ];

  const generateLorem = () => {
    let result = [];
    for (let i = 0; i < paras; i++) {
      let p = [];
      const sentenceCount = 4 + Math.floor(Math.random() * 4); // 4-7 sentences
      for (let j = 0; j < sentenceCount; j++) {
        p.push(sentences[Math.floor(Math.random() * sentences.length)]);
      }
      result.push(p.join(' '));
    }
    setOutput(result.join('\n\n'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label className="label" style={{ marginBottom: 0 }}>Paragraphs:</label>
        <input
          type="number"
          min="1"
          max="20"
          value={paras}
          onChange={(e) => setParas(parseInt(e.target.value) || 1)}
          className="input"
          style={{ width: '80px' }}
        />
        <button onClick={generateLorem} className="btn btn-primary">Generate Placeholder</button>
      </div>
      {output && (
        <div>
          <textarea
            value={output}
            readOnly
            className="input textarea"
            style={{ height: '200px' }}
          />
          <button onClick={() => copyToClipboard(output)} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
            Copy Lorem Ipsum
          </button>
        </div>
      )}
    </div>
  );
};

// 9. Random Text Generator
export const RandomTextGenerator: React.FC = () => {
  const [len, setLen] = useState(16);
  const [useLetters, setUseLetters] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [output, setOutput] = useState('');

  const generateRandom = () => {
    let chars = '';
    if (useLetters) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (chars === '') {
      toast.error('Select at least one character type!');
      return;
    }

    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setOutput(result);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">String Length</label>
          <input
            type="number"
            min="4"
            max="128"
            value={len}
            onChange={(e) => setLen(parseInt(e.target.value) || 8)}
            className="input"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={useLetters} onChange={(e) => setUseLetters(e.target.checked)} /> Include Letters
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} /> Include Numbers
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} /> Include Symbols
          </label>
        </div>
      </div>
      <button onClick={generateRandom} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate String</button>
      {output && (
        <div className="tool-output-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ wordBreak: 'break-all' }}>{output}</span>
          <button onClick={() => copyToClipboard(output)} className="btn btn-icon">
            <Icon name="tag" style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      )}
    </div>
  );
};

// 10. Markdown Editor
export const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Sample Title\n\nWrite some markdown here.\n\n- Bullet item A\n- Bullet item B\n\n**Bold Text** and *Italics*.');
  const [html, setHtml] = useState('');

  useEffect(() => {
    // Simple helper parser regex compiler for local markdown compiling
    let parsed = markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '<br />');

    // Wrap list items in ul tags
    if (parsed.includes('<li>')) {
      parsed = parsed.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    }
    setHtml(parsed);
  }, [markdown]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-cols-2">
        <div>
          <label className="label">Markdown Code</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="input textarea"
            style={{ height: '300px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">Live Rendered HTML</label>
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="input"
            style={{ height: '300px', overflowY: 'auto', backgroundColor: 'var(--color-bg-subtle)' }}
          />
        </div>
      </div>
      <button onClick={() => copyToClipboard(html)} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
        Copy Raw HTML
      </button>
    </div>
  );
};

// 11. HTML Formatter
export const HTMLFormatter: React.FC = () => {
  const [html, setHtml] = useState('');

  const formatHTML = () => {
    // Basic structural indentation parsing script
    let formatted = '';
    let reg = /(>)(<)(\/*)/g;
    let htmlClean = html.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    
    htmlClean.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (node.match(/^<\w[^>]*[^\/]>$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      let padding = '';
      for (let i = 0; i < pad; i++) {
        padding += '  ';
      }

      formatted += padding + node + '\r\n';
      pad += indent;
    });

    setHtml(formatted.trim());
    toast.success('HTML Prettified!');
  };

  const minifyHTML = () => {
    const minified = html.replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/<!--.*?-->/g, '')
      .trim();
    setHtml(minified);
    toast.success('HTML Minified!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        className="input textarea"
        style={{ height: '240px', fontFamily: 'var(--font-mono)' }}
        placeholder="Paste your HTML markup here..."
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={formatHTML} className="btn btn-secondary">Prettify Code</button>
        <button onClick={minifyHTML} className="btn btn-secondary">Minify HTML</button>
        <button onClick={() => copyToClipboard(html)} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          Copy Result
        </button>
      </div>
    </div>
  );
};

// 12. JSON Formatter
export const JSONFormatter: React.FC = () => {
  const [json, setJson] = useState('');

  const formatJSON = (spaces = 2) => {
    try {
      if (json.trim() === '') return;
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed, null, spaces));
      toast.success('JSON formatted successfully!');
    } catch (e) {
      toast.error('Invalid JSON structure.');
    }
  };

  const minifyJSON = () => {
    try {
      if (json.trim() === '') return;
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed));
      toast.success('JSON minified!');
    } catch (e) {
      toast.error('Invalid JSON syntax.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="input textarea"
        style={{ height: '240px', fontFamily: 'var(--font-mono)' }}
        placeholder='Paste raw JSON here, e.g. {"key": "value"}'
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => formatJSON(2)} className="btn btn-secondary">Prettify (2 Spaces)</button>
        <button onClick={() => formatJSON(4)} className="btn btn-secondary">Prettify (4 Spaces)</button>
        <button onClick={minifyJSON} className="btn btn-secondary">Minify JSON</button>
        <button onClick={() => copyToClipboard(json)} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          Copy Result
        </button>
      </div>
    </div>
  );
};

// 13. JSON to CSV Converter
export const JSONToCSV: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('[\n  {"id": 1, "name": "Alice", "role": "Admin"},\n  {"id": 2, "name": "Bob", "role": "Editor"}\n]');
  const [csvOutput, setCsvOutput] = useState('');

  const convertToCSV = () => {
    try {
      if (!jsonInput.trim()) return;
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        toast.error('JSON input must be an array of objects.');
        return;
      }
      if (parsed.length === 0) {
        setCsvOutput('');
        toast.success('Empty array converted.');
        return;
      }

      const headers = Object.keys(parsed[0]);
      const csvRows = [
        headers.join(','),
        ...parsed.map(obj => 
          headers.map(header => {
            const val = obj[header];
            const escaped = ('' + val).replace(/"/g, '\\"');
            return escaped.includes(',') ? `"${escaped}"` : escaped;
          }).join(',')
        )
      ];

      setCsvOutput(csvRows.join('\n'));
      toast.success('JSON successfully converted to CSV!');
    } catch {
      toast.error('Invalid JSON. Please check syntax.');
    }
  };

  const downloadCSV = () => {
    if (!csvOutput) return;
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'converted_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloading CSV file...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">JSON Array Input</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
            placeholder="Paste JSON array here..."
          />
        </div>
        <div>
          <label className="label">CSV Output</label>
          <textarea
            readOnly
            value={csvOutput}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
            placeholder="CSV format results will display here..."
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={convertToCSV} className="btn btn-primary">Convert to CSV</button>
        {csvOutput && <button onClick={downloadCSV} className="btn btn-secondary">Download CSV File</button>}
        {csvOutput && <button onClick={() => copyToClipboard(csvOutput)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy CSV</button>}
      </div>
    </div>
  );
};

// 14. CSV to JSON Converter
export const CSVToJSON: React.FC = () => {
  const [csvInput, setCsvInput] = useState('id,name,role\n1,Alice,Admin\n2,Bob,Editor');
  const [jsonOutput, setJsonOutput] = useState('');

  const convertToJSON = () => {
    if (!csvInput.trim()) return;
    const lines = csvInput.split('\n').map(l => l.trim()).filter(l => l !== '');
    if (lines.length === 0) return;

    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const currentline = lines[i].split(',');
      const obj: Record<string, any> = {};
      for (let j = 0; j < headers.length; j++) {
        const val = currentline[j] ? currentline[j].trim() : '';
        // Try parsing number
        const num = Number(val);
        obj[headers[j]] = isNaN(num) || val === '' ? val : num;
      }
      result.push(obj);
    }

    setJsonOutput(JSON.stringify(result, null, 2));
    toast.success('CSV parsed successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">CSV Text Input (comma separated)</label>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
            placeholder="Paste CSV rows here..."
          />
        </div>
        <div>
          <label className="label">JSON Array Output</label>
          <textarea
            readOnly
            value={jsonOutput}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
            placeholder="JSON array results will display here..."
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={convertToJSON} className="btn btn-primary">Convert to JSON</button>
        {jsonOutput && <button onClick={() => copyToClipboard(jsonOutput)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy JSON</button>}
      </div>
    </div>
  );
};

// 15. Base64 to Image Decoder
export const Base64ToImage: React.FC = () => {
  const [base64Text, setBase64Text] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const decodeImage = () => {
    if (!base64Text.trim()) return;
    const trimmed = base64Text.trim();
    // Prepend data URL prefix if not present
    if (trimmed.startsWith('data:image/')) {
      setImgUrl(trimmed);
    } else {
      setImgUrl(`data:image/png;base64,${trimmed}`);
    }
    toast.success('Base64 decoded as image!');
  };

  const downloadImage = () => {
    if (!imgUrl) return;
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = 'decoded_resource.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloading image...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Paste Base64 Image Code</label>
        <textarea
          value={base64Text}
          onChange={(e) => setBase64Text(e.target.value)}
          className="input textarea"
          style={{ height: '140px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
          placeholder="Paste raw base64 string or data:image/png;base64,... code"
        />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={decodeImage} className="btn btn-primary">Decode Image</button>
        {imgUrl && <button onClick={downloadImage} className="btn btn-secondary">Download Image</button>}
      </div>

      {imgUrl && (
        <div className="card text-center" style={{ padding: '1.5rem', marginTop: '0.5rem' }}>
          <label className="label" style={{ textAlign: 'left' }}>Rendered Preview</label>
          <img
            src={imgUrl}
            alt="Decoded Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '350px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              marginTop: '0.5rem',
              backgroundColor: '#f1f5f9'
            }}
            onError={() => toast.error('Error rendering image. Make sure base64 code is correct.')}
          />
        </div>
      )}
    </div>
  );
};

// 16. Text Repeater
export const TextRepeater: React.FC = () => {
  const [text, setText] = useState('Hello!');
  const [count, setCount] = useState(5);
  const [delimiter, setDelimiter] = useState('newline');
  const [customDelim, setCustomDelim] = useState(' - ');
  const [output, setOutput] = useState('');

  const repeatText = () => {
    if (!text) return;
    if (count <= 0) return;

    let delimStr = '';
    if (delimiter === 'newline') delimStr = '\n';
    else if (delimiter === 'comma') delimStr = ', ';
    else if (delimiter === 'space') delimStr = ' ';
    else delimStr = customDelim;

    const list = Array(count).fill(text);
    setOutput(list.join(delimStr));
    toast.success('Text repeated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Text to Repeat</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Repeat Count</label>
          <input type="number" min="1" max="1000" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="input" />
        </div>
        <div>
          <label className="label">Separator</label>
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="input">
            <option value="newline">New Line (\n)</option>
            <option value="comma">Comma (,)</option>
            <option value="space">Space ( )</option>
            <option value="custom">Custom Separator</option>
          </select>
        </div>
      </div>

      {delimiter === 'custom' && (
        <div>
          <label className="label">Custom Separator Character</label>
          <input type="text" value={customDelim} onChange={(e) => setCustomDelim(e.target.value)} className="input" style={{ width: '120px' }} />
        </div>
      )}

      <button onClick={repeatText} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Repeat Text</button>

      {output && (
        <div>
          <label className="label">Repeated Output</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '180px', fontFamily: 'var(--font-mono)' }}
          />
          <button onClick={() => copyToClipboard(output)} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Copy Output</button>
        </div>
      )}
    </div>
  );
};

// 17. Text to Speech Converter
export const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('Welcome to AllSetTools! Explore over one hundred free, client-side tools.');
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!text.trim()) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast.error('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel(); // clear queue
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
    toast.success('Reading text aloud...');
  };

  const stop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      toast.show('Speech cancelled.', 'info');
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Text to Read Aloud</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input textarea"
          style={{ height: '150px' }}
        />
      </div>

      <div className="grid-cols-2" style={{ gap: '1rem', alignItems: 'center' }}>
        <div>
          <label className="label">Speed Rate: {rate}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={e => setRate(parseFloat(e.target.value) || 1)}
            style={{ width: '100%', accentColor: 'var(--color-fg)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', paddingTop: '1.25rem' }}>
          <button onClick={speak} disabled={speaking} className="btn btn-primary" style={{ flex: 1 }}>
            {speaking ? 'Reading...' : 'Speak Text'}
          </button>
          {speaking && <button onClick={stop} className="btn btn-secondary" style={{ flex: 1 }}>Stop</button>}
        </div>
      </div>
    </div>
  );
};

// 18. List Randomizer
export const ListRandomizer: React.FC = () => {
  const [input, setInput] = useState('Item 1\nItem 2\nItem 3\nItem 4\nItem 5');
  const [output, setOutput] = useState('');

  const shuffle = () => {
    if (!input.trim()) return;
    const items = input.split('\n').filter(i => i.trim() !== '');
    
    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    setOutput(items.join('\n'));
    toast.success('List items randomized!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Original List (one item per line)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">Shuffled / Randomized Output</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={shuffle} className="btn btn-primary">Shuffle List</button>
        {output && <button onClick={() => copyToClipboard(output)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy List</button>}
      </div>
    </div>
  );
};

// 19. Paraphrasing Tool
export const ParaphrasingTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('standard');
  const [output, setOutput] = useState('');

  const paraphrase = () => {
    if (!input.trim()) return;
    let text = input;
    const synonyms: Record<string, string[]> = {
      'beautiful': ['gorgeous', 'stunning', 'splendid'],
      'quickly': ['rapidly', 'promptly', 'swiftly'],
      'smart': ['intelligent', 'brilliant', 'clever'],
      'easy': ['simple', 'effortless', 'straightforward'],
      'difficult': ['challenging', 'hard', 'demanding'],
      'make': ['create', 'generate', 'build'],
      'help': ['assist', 'support', 'aid'],
      'improve': ['enhance', 'boost', 'refine'],
      'very': ['extremely', 'exceedingly', 'highly'],
      'change': ['modify', 'alter', 'transform'],
      'tool': ['utility', 'application', 'program'],
      'fast': ['rapid', 'quick', 'speedy'],
      'free': ['complimentary', 'no-cost', 'open-source'],
      'secure': ['safe', 'protected', 'private']
    };

    const words = text.split(/\b/);
    const rewritten = words.map(w => {
      const lower = w.toLowerCase();
      if (synonyms[lower]) {
        const choices = synonyms[lower];
        const idx = mode === 'standard' ? 0 : mode === 'formal' ? 1 : Math.floor(Math.random() * choices.length);
        const chosen = choices[idx % choices.length];
        if (w[0] === w[0].toUpperCase()) {
          return chosen.charAt(0).toUpperCase() + chosen.slice(1);
        }
        return chosen;
      }
      return w;
    });

    setOutput(rewritten.join(''));
    toast.success('Text paraphrased successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Original Text</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '200px' }}
            placeholder="Enter your original text here..."
          />
        </div>
        <div>
          <label className="label">Paraphrased Text</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '200px' }}
            placeholder="Paraphrased version will appear here..."
          />
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '1rem', alignItems: 'center' }}>
        <div>
          <label className="label">Paraphrase Style / Tone</label>
          <select value={mode} onChange={e => setMode(e.target.value)} className="input">
            <option value="standard">Standard (Clear & Direct)</option>
            <option value="formal">Formal (Academic & Professional)</option>
            <option value="creative">Creative (Diverse vocabulary)</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', paddingTop: '1.25rem' }}>
          <button onClick={paraphrase} disabled={!input.trim()} className="btn btn-primary" style={{ flex: 1 }}>Paraphrase Text</button>
          {output && <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied text!'); }} className="btn btn-secondary" style={{ flex: 1 }}>Copy Text</button>}
        </div>
      </div>
    </div>
  );
};

// 20. Grammar Checker
export const GrammarChecker: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const checkGrammar = () => {
    if (!input.trim()) return;
    let text = input;
    let errors: string[] = [];

    const sentences = text.split(/(?<=[.!?])\s+/);
    const capSentences = sentences.map(s => {
      if (s.trim().length > 0 && s[0] !== s[0].toUpperCase()) {
        errors.push(`Capitalization: Capitalized first letter of "${s.substring(0, 10)}..."`);
        return s.trim()[0].toUpperCase() + s.trim().slice(1);
      }
      return s;
    });
    text = capSentences.join(' ');

    const typoCorrections: Record<string, string> = {
      'teh': 'the',
      'recieve': 'receive',
      'adress': 'address',
      'seperate': 'separate',
      'untill': 'until',
      'accomodate': 'accommodate',
      'goverment': 'government',
      'occured': 'occurred',
      'commited': 'committed',
      'definetly': 'definitely'
    };

    const words = text.split(/\b/);
    const correctedWords = words.map(w => {
      const lower = w.toLowerCase();
      if (typoCorrections[lower]) {
        errors.push(`Spelling: Corrected typo "${w}" to "${typoCorrections[lower]}"`);
        const corrected = typoCorrections[lower];
        if (w[0] === w[0].toUpperCase()) {
          return corrected.charAt(0).toUpperCase() + corrected.slice(1);
        }
        return corrected;
      }
      return w;
    });
    text = correctedWords.join('');

    setLogs(errors.length > 0 ? errors : ['No issues found! Your writing looks correct.']);
    setOutput(text);
    setChecked(true);
    toast.success(errors.length > 0 ? `Found ${errors.length} grammar recommendations!` : 'Writing is grammatically clean!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Your Draft Content</label>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setChecked(false); }}
            className="input textarea"
            style={{ height: '220px' }}
            placeholder="Paste your text draft here (e.g. teh adress seperate...)"
          />
        </div>
        <div>
          <label className="label">Corrected Text</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '220px' }}
            placeholder="Corrected text will display here..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={checkGrammar} disabled={!input.trim()} className="btn btn-primary">Check Writing</button>
        {output && <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied corrected text!'); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy Text</button>}
      </div>

      {checked && (
        <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-bg-subtle)' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Audit Findings</h4>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.8125rem', lineHeight: '1.6', color: 'var(--color-fg-muted)' }}>
            {logs.map((log, idx) => (
              <li key={idx} style={{ color: log.startsWith('No') ? 'var(--color-success)' : 'var(--color-fg)' }}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// 21. HTML to Markdown Converter
export const HTMLToMarkdown: React.FC = () => {
  const [input, setInput] = useState('<h1>Hello World</h1>\n<p>This is <strong>bold</strong> text and a <a href="https://google.com">link</a>.</p>');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) return;
    let md = input;

    md = md.replace(/<h1.*?>([\s\S]*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2.*?>([\s\S]*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3.*?>([\s\S]*?)<\/h3>/gi, '### $1\n\n');
    
    md = md.replace(/<(strong|b).*?>([\s\S]*?)<\/\1>/gi, '**$2**');
    md = md.replace(/<(em|i).*?>([\s\S]*?)<\/\1>/gi, '*$2*');

    md = md.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

    md = md.replace(/<p.*?>([\s\S]*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<br\s*\/?>/gi, '\n');

    md = md.replace(/<[^>]*>/g, '');

    setOutput(md.trim());
    toast.success('Converted HTML to Markdown!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">HTML Markup Code</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
            placeholder="Paste HTML here..."
          />
        </div>
        <div>
          <label className="label">Markdown Output</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
            placeholder="Markdown results will display here..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={convert} className="btn btn-primary">Convert HTML</button>
        {output && <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied Markdown!'); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy Markdown</button>}
      </div>
    </div>
  );
};

// 22. Multi-Language Translator
export const MultiLanguageTranslator: React.FC = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [detectedSource, setDetectedSource] = useState('');
  const [listening, setListening] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const recognitionRef = React.useRef<any>(null);

  const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'id', name: 'Indonesian' },
    { code: 'sv', name: 'Swedish' },
    { code: 'th', name: 'Thai' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' },
    { code: 'la', name: 'Latin' },
  ];

  const getLanguageName = (code: string) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return lang ? lang.name : code.toUpperCase();
  };

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('allsettools_translator_history');
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (srcText: string, trText: string, srcL: string, trL: string) => {
    try {
      const stored = localStorage.getItem('allsettools_translator_history');
      let current: any[] = stored ? JSON.parse(stored) : [];
      current = current.filter(item => item.text !== srcText);
      current.unshift({
        text: srcText,
        translatedText: trText,
        sourceLang: srcL,
        targetLang: trL,
        timestamp: Date.now()
      });
      current = current.slice(0, 5);
      localStorage.setItem('allsettools_translator_history', JSON.stringify(current));
      setHistoryList(current);
    } catch (e) {
      console.error(e);
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem('allsettools_translator_history');
      setHistoryList([]);
      toast.success('History cleared');
    } catch (e) {
      console.error(e);
    }
  };

  const loadHistoryItem = (item: any) => {
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setText(item.text);
    setTranslatedText(item.translatedText);
    toast.success('Loaded translation from history');
  };

  // Perform translation fetch
  const performTranslation = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setTranslatedText('');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: trimmedText,
          from: sourceLang,
          to: targetLang,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTranslatedText(data.translatedText);
        if (sourceLang === 'auto' && data.detectedSource) {
          setDetectedSource(data.detectedSource);
        } else {
          setDetectedSource('');
        }
        saveToHistory(trimmedText, data.translatedText, sourceLang, targetLang);
      } else {
        toast.error(data.error || 'Failed to translate');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Translation network error');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced translation for "Translate as you type"
  useEffect(() => {
    if (!autoTranslate || !text.trim()) {
      if (!text.trim()) {
        setTranslatedText('');
        setDetectedSource('');
      }
      return;
    }

    const timer = setTimeout(() => {
      performTranslation();
    }, 700);

    return () => clearTimeout(timer);
  }, [text, sourceLang, targetLang, autoTranslate]);

  // Swap languages & contents
  const swapLanguages = () => {
    if (sourceLang === 'auto') {
      const newSource = targetLang;
      setSourceLang(newSource);
      setTargetLang('en');
    } else {
      const tempLang = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(tempLang);
    }
    const tempText = text;
    setText(translatedText);
    setTranslatedText(tempText);
  };

  // Speech-to-Text transcription
  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = sourceLang !== 'auto' ? sourceLang : 'en-US';

    rec.onstart = () => {
      setListening(true);
      toast.success('Listening... speak into your microphone.');
    };

    rec.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setText(prev => (prev ? prev + ' ' + resultText : resultText));
    };

    rec.onerror = (e: any) => {
      const errorType = e && e.error ? e.error : 'unknown';
      console.warn('Speech recognition warning:', errorType);
      setListening(false);
      
      if (errorType === 'no-speech') {
        toast.show('No speech was detected.', 'info');
      } else if (errorType === 'not-allowed') {
        toast.error('Microphone permission denied. Check your browser settings.');
      } else if (errorType === 'audio-capture') {
        toast.error('No microphone found.');
      } else {
        toast.error(`Speech recognition error: ${errorType}`);
      }
    };

    rec.onend = () => {
      setListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // Text-to-Speech synthesis
  const speak = (textToSpeak: string, langCode: string) => {
    if (!textToSpeak.trim()) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast.error('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const resolvedLang = langCode === 'auto' ? (detectedSource || 'en') : langCode;
    utterance.lang = resolvedLang;
    window.speechSynthesis.speak(utterance);
    toast.success(`Reading aloud...`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Selector and swap header */}
      <div className="grid-cols-2" style={{ gap: '1.5rem', marginBottom: '-0.75rem', position: 'relative' }}>
        {/* Source Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label className="label">Translate From</label>
          <select
            value={sourceLang}
            onChange={(e) => {
              setSourceLang(e.target.value);
              setDetectedSource('');
            }}
            className="input"
            style={{ appearance: 'auto' }}
          >
            <option value="auto">🌐 Auto-Detect Language</option>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button (Absolute Positioned between columns on desktop) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -10%)',
          zIndex: 10,
        }} className="hide-on-mobile">
          <button
            onClick={swapLanguages}
            className="btn btn-secondary"
            title="Swap Languages"
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
            </svg>
          </button>
        </div>

        {/* Target Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label className="label">Translate To</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="input"
            style={{ appearance: 'auto' }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Swap Row */}
      <div className="show-on-mobile" style={{ display: 'none', justifyContent: 'center', margin: '0.25rem 0' }}>
        <button
          onClick={swapLanguages}
          className="btn btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '20px',
            padding: '4px 16px',
            fontSize: '0.875rem',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
          </svg>
          Swap Languages
        </button>
      </div>

      {/* Main Translation Cards Grid */}
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        {/* Source Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-fg-muted)' }}>
              Source Text
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>
              {text.length} / 5,000 chars
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 5000))}
              className="input textarea"
              style={{ height: '220px', resize: 'vertical' }}
              placeholder="Enter text to translate..."
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            {/* Speech-to-Text Button */}
            <button
              onClick={listening ? stopListening : startListening}
              className={`btn ${listening ? 'btn-primary' : 'btn-secondary'}`}
              title={listening ? 'Stop listening' : 'Translate from voice (Speech-to-Text)'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                minWidth: '38px',
                height: '38px',
                position: 'relative',
              }}
            >
              {listening ? (
                <>
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s infinite',
                  }} />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
                </svg>
              )}
            </button>

            {/* Read Aloud Button */}
            <button
              onClick={() => speak(text, sourceLang)}
              disabled={!text.trim()}
              className="btn btn-secondary"
              title="Speak source text (Text-to-Speech)"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', minWidth: '38px', height: '38px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>

            {/* Copy Button */}
            <button
              onClick={() => {
                if (!text) return toast.error('Nothing to copy!');
                navigator.clipboard.writeText(text);
                toast.success('Source text copied!');
              }}
              disabled={!text.trim()}
              className="btn btn-secondary"
              title="Copy to clipboard"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', minWidth: '38px', height: '38px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>

            {/* Clear Button */}
            <button
              onClick={() => {
                setText('');
                setTranslatedText('');
                setDetectedSource('');
              }}
              disabled={!text.trim()}
              className="btn btn-secondary"
              title="Clear input"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', minWidth: '38px', height: '38px', marginLeft: 'auto' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Target Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-fg-muted)' }}>
              Translation
            </span>
            {detectedSource && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-success)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                }}
              >
                Detected: {getLanguageName(detectedSource)}
              </span>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              readOnly
              value={translatedText}
              className="input textarea"
              style={{
                height: '220px',
                resize: 'none',
                backgroundColor: 'var(--color-bg-subtle)',
              }}
              placeholder={isLoading ? 'Translating...' : 'Translation will appear here...'}
            />
            {isLoading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(1px)',
                  borderRadius: '6px',
                }}
              >
                <div style={{
                  border: '4px solid rgba(0,0,0,0.1)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  borderLeftColor: 'var(--color-fg)',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            {/* Read Aloud Button */}
            <button
              onClick={() => speak(translatedText, targetLang)}
              disabled={!translatedText.trim()}
              className="btn btn-secondary"
              title="Speak translated text (Text-to-Speech)"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', minWidth: '38px', height: '38px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>

            {/* Copy Button */}
            <button
              onClick={() => {
                if (!translatedText) return toast.error('Nothing to copy!');
                navigator.clipboard.writeText(translatedText);
                toast.success('Translation copied!');
              }}
              disabled={!translatedText.trim()}
              className="btn btn-secondary"
              title="Copy to clipboard"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', minWidth: '38px', height: '38px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Options and Manual Translate Action */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          gap: '1rem',
          backgroundColor: 'var(--color-bg-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="auto-translate"
            checked={autoTranslate}
            onChange={(e) => setAutoTranslate(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-fg)' }}
          />
          <label htmlFor="auto-translate" style={{ fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}>
            Translate as you type (real-time)
          </label>
        </div>

        <button
          onClick={performTranslation}
          disabled={isLoading || !text.trim()}
          className="btn btn-primary"
          style={{ minWidth: '150px' }}
        >
          {isLoading ? 'Translating...' : 'Translate Text'}
        </button>
      </div>

      {/* History panel */}
      {historyList.length > 0 && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Translation History</h4>
            <button
              onClick={clearHistory}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', minHeight: 'auto', height: '28px' }}
            >
              Clear
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {historyList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => loadHistoryItem(item)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'background-color 0.15s ease',
                }}
                className="history-item-hover"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', marginRight: '1rem' }}>
                  <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.text}
                  </span>
                  <span style={{ color: 'var(--color-fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.translatedText}
                  </span>
                </div>
                <div style={{ flexShrink: 0, fontSize: '0.75rem', color: 'var(--color-fg-muted)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span>{getLanguageName(item.sourceLang)}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span>{getLanguageName(item.targetLang)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSS Styles injection specifically for animations and mobile responsive swap visibility */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .history-item-hover:hover {
          background-color: var(--color-border) !important;
        }
        @media (max-width: 768px) {
          .hide-on-mobile {
            display: none !important;
          }
          .show-on-mobile {
            display: flex !important;
          }
        }
      `}} />
    </div>
  );
};



