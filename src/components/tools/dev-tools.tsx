// src/components/tools/dev-tools.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/components/Toast';
import { Icon } from '@/components/Icons';

const copyToClipboard = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};

// 1. JSON Validator
export const JSONValidator: React.FC = () => {
  const [json, setJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateJSON = () => {
    if (json.trim() === '') {
      setError(null);
      setIsValid(null);
      return;
    }
    try {
      JSON.parse(json);
      setIsValid(true);
      setError(null);
      toast.success('JSON is valid!');
    } catch (e: any) {
      setIsValid(false);
      setError(e.message);
      toast.error('JSON has errors!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="input textarea"
        style={{ height: '240px', fontFamily: 'var(--font-mono)' }}
        placeholder='Paste JSON here to check syntax validity...'
      />
      <button onClick={validateJSON} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Validate JSON
      </button>

      {isValid === true && (
        <div style={{ padding: '1rem', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(0,230,118,0.05)', color: 'var(--color-success)', fontSize: '0.875rem' }}>
          ✓ Valid JSON. No syntax errors detected.
        </div>
      )}

      {isValid === false && (
        <div style={{ padding: '1rem', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,51,51,0.05)', color: 'var(--color-danger)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
          ✖ Invalid JSON: {error}
        </div>
      )}
    </div>
  );
};

// 2. JSON Viewer (Recursive Tree Renderer)
interface TreeNodeProps {
  data: any;
  label?: string;
  isLast?: boolean;
}

const JsonTreeNode: React.FC<TreeNodeProps> = ({ data, label, isLast = true }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const type = typeof data;

  if (data === null) {
    return (
      <div style={{ paddingLeft: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
        {label && <span style={{ color: 'var(--color-fg-muted)' }}>&ldquo;{label}&rdquo;: </span>}
        <span style={{ color: 'var(--color-danger)' }}>null</span>
        {!isLast && ','}
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div style={{ paddingLeft: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
        <span
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ cursor: 'pointer', color: 'var(--color-fg-muted)', userSelect: 'none' }}
        >
          {isExpanded ? '▼' : '▶'}{' '}
          {label && <span style={{ color: 'var(--color-fg-muted)' }}>&ldquo;{label}&rdquo;: </span>}
          [<span style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)' }}> {data.length} items </span>]
        </span>
        {isExpanded && (
          <div style={{ borderLeft: '1px solid var(--color-border)', marginLeft: '6px' }}>
            {data.map((item, idx) => (
              <JsonTreeNode key={idx} data={item} isLast={idx === data.length - 1} />
            ))}
          </div>
        )}
        <span>]</span>
        {!isLast && ','}
      </div>
    );
  }

  if (type === 'object') {
    const keys = Object.keys(data);
    return (
      <div style={{ paddingLeft: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
        <span
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ cursor: 'pointer', color: 'var(--color-fg-muted)', userSelect: 'none' }}
        >
          {isExpanded ? '▼' : '▶'}{' '}
          {label && <span style={{ color: 'var(--color-fg-muted)' }}>&ldquo;{label}&rdquo;: </span>}
          {'{'}
        </span>
        {isExpanded && (
          <div style={{ borderLeft: '1px solid var(--color-border)', marginLeft: '6px' }}>
            {keys.map((k, idx) => (
              <JsonTreeNode key={k} label={k} data={data[k]} isLast={idx === keys.length - 1} />
            ))}
          </div>
        )}
        <span>{'}'}</span>
        {!isLast && ','}
      </div>
    );
  }

  // Primitive strings, numbers, booleans
  let color = 'var(--color-success)';
  if (type === 'number') color = 'var(--color-warning)';
  if (type === 'boolean') color = 'var(--color-primary)';

  return (
    <div style={{ paddingLeft: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
      {label && <span style={{ color: 'var(--color-fg-muted)' }}>&ldquo;{label}&rdquo;: </span>}
      <span style={{ color }}>{type === 'string' ? `"${data}"` : String(data)}</span>
      {!isLast && ','}
    </div>
  );
};

export const JSONViewer: React.FC = () => {
  const [json, setJson] = useState('{"status": "success", "data": {"items": [1, 2, 3], "config": {"secure": true, "port": 8080}}}');
  const [parsed, setParsed] = useState<any>(null);

  useEffect(() => {
    try {
      setParsed(JSON.parse(json));
    } catch (e) {
      setParsed(null);
    }
  }, [json]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2">
        <div>
          <label className="label">JSON String</label>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="input textarea"
            placeholder="Paste JSON here to parse tree view..."
            style={{ height: '280px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">Interactive Object Tree</label>
          <div className="input" style={{ height: '280px', overflowY: 'auto', backgroundColor: 'var(--color-bg-subtle)', padding: '1rem' }}>
            {parsed ? (
              <JsonTreeNode data={parsed} />
            ) : (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>Waiting for valid JSON string...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. XML Formatter
export const XMLFormatter: React.FC = () => {
  const [xml, setXml] = useState('');

  const formatXML = () => {
    let formatted = '';
    let reg = /(>)(<)(\/*)/g;
    let wspace = xml.replace(/\s+/g, ' ').replace(reg, '$1\r\n$2$3');
    let pad = 0;
    wspace.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      let padding = '';
      for (let i = 0; i < pad; i++) padding += '  ';
      formatted += padding + node + '\r\n';
      pad += indent;
    });

    setXml(formatted.trim());
    toast.success('XML formatted!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={xml}
        onChange={(e) => setXml(e.target.value)}
        className="input textarea"
        style={{ fontFamily: 'var(--font-mono)' }}
        placeholder="Paste your raw XML code..."
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={formatXML} className="btn btn-primary">Format XML</button>
        <button onClick={() => copyToClipboard(xml)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy</button>
      </div>
    </div>
  );
};

// 4. SQL Formatter
export const SQLFormatter: React.FC = () => {
  const [sql, setSql] = useState('');

  const formatSQL = () => {
    let clean = sql
      .replace(/\s+/g, ' ')
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|AND|OR|ON|VALUES|INSERT INTO|UPDATE|SET)\b/gi, '\n$1')
      .replace(/,\s*/g, ',\n  ')
      .trim();
    setSql(clean);
    toast.success('SQL query formatted!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        className="input textarea"
        style={{ fontFamily: 'var(--font-mono)' }}
        placeholder="SELECT * FROM users WHERE status = 'active'"
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={formatSQL} className="btn btn-primary">Format SQL Query</button>
        <button onClick={() => copyToClipboard(sql)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy</button>
      </div>
    </div>
  );
};

// 5. Base64 Encode Decode
export const Base64EncodeDecode: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      toast.success('Encoded to Base64');
    } catch (e) {
      toast.error('Failed to encode.');
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      toast.success('Decoded Base64 string');
    } catch (e) {
      toast.error('Invalid Base64 input.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-cols-2">
        <div>
          <label className="label">Raw Text / Base64</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input textarea"
            placeholder="Enter plain text to encode, or base64 to decode..."
          />
        </div>
        <div>
          <label className="label">Resulting Output</label>
          <textarea
            value={output}
            readOnly
            className="input textarea"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={encode} className="btn btn-secondary">Encode Base64</button>
        <button onClick={decode} className="btn btn-secondary">Decode Base64</button>
        <button onClick={() => copyToClipboard(output)} className="btn btn-primary" style={{ marginLeft: 'auto' }}>Copy Output</button>
      </div>
    </div>
  );
};

// 6. JWT Decoder
export const JWTDecoder: React.FC = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const decodeJWT = () => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must contain header, payload and signature parts.');
      }
      
      const headerDec = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payloadDec = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      setHeader(JSON.stringify(headerDec, null, 2));
      setPayload(JSON.stringify(payloadDec, null, 2));
      setIsValid(true);
      toast.success('JWT Decoded!');
    } catch (e) {
      setHeader('');
      setPayload('');
      setIsValid(false);
      toast.error('Invalid JWT format.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label className="label">Paste JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="input"
          style={{ height: '80px', fontFamily: 'var(--font-mono)' }}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY..."
        />
      </div>
      <button onClick={decodeJWT} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Decode Token</button>

      {isValid && (
        <div className="grid-cols-2" style={{ gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label className="label">JWT Header</label>
            <pre style={{ height: '180px', fontSize: '0.8rem' }}>{header}</pre>
          </div>
          <div>
            <label className="label">JWT Claims / Payload</label>
            <pre style={{ height: '180px', fontSize: '0.8rem' }}>{payload}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

// 7. URL Encoder Decoder
export const URLEncoderDecoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      toast.error('Invalid URL escape sequence.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-cols-2">
        <div>
          <label className="label">Input String</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input textarea"
            placeholder="Enter query string..."
          />
        </div>
        <div>
          <label className="label">Output String</label>
          <textarea
            value={output}
            readOnly
            className="input textarea"
            placeholder="Output value..."
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={encode} className="btn btn-secondary">Encode URL</button>
        <button onClick={decode} className="btn btn-secondary">Decode URL</button>
        <button onClick={() => copyToClipboard(output)} className="btn btn-primary" style={{ marginLeft: 'auto' }}>Copy</button>
      </div>
    </div>
  );
};

// 8. Regex Tester
export const RegexTester: React.FC = () => {
  const [regex, setRegex] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Test 123 input text 456 here.');
  const [matches, setMatches] = useState<string[]>([]);

  useEffect(() => {
    try {
      if (!regex) return;
      const re = new RegExp(regex, flags);
      const results = text.match(re);
      setMatches(results || []);
    } catch (e) {
      setMatches([]);
    }
  }, [regex, flags, text]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label className="label">Regular Expression Pattern</label>
          <input
            type="text"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            className="input"
            style={{ fontFamily: 'var(--font-mono)' }}
            placeholder="e.g. \d+"
          />
        </div>
        <div style={{ width: '80px' }}>
          <label className="label">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="input"
            placeholder="g"
          />
        </div>
      </div>
      <div>
        <label className="label">Test String</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input textarea"
          placeholder="Enter text to search matches against..."
        />
      </div>
      <div>
        <label className="label">Matches Found ({matches.length})</label>
        <div className="tool-output-panel" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {matches.map((m, idx) => (
            <span key={idx} style={{ padding: '2px 8px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg-card)' }}>
              {m}
            </span>
          ))}
          {matches.length === 0 && <span style={{ color: 'var(--color-fg-dimmed)' }}>No matches.</span>}
        </div>
      </div>
    </div>
  );
};

// 9. Hash Generator
export const HashGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha512: '' });

  const generateHashes = async () => {
    if (!text) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Cryptographic sha hashes using standard browser Web Crypto APIs
    const buffer1 = await crypto.subtle.digest('SHA-1', data);
    const buffer256 = await crypto.subtle.digest('SHA-256', data);
    const buffer512 = await crypto.subtle.digest('SHA-512', data);

    const toHex = (buf: ArrayBuffer) =>
      Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    setHashes({
      sha1: toHex(buffer1),
      sha256: toHex(buffer256),
      sha512: toHex(buffer512)
    });
  };

  useEffect(() => {
    generateHashes();
  }, [text]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Input String</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input"
          style={{ height: '80px' }}
          placeholder="Type value to compute crypt hashes..."
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="label">SHA-256</label>
          <div className="tool-output-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ overflowX: 'auto', marginRight: '1rem' }}>{hashes.sha256 || 'Waiting for text...'}</span>
            <button onClick={() => copyToClipboard(hashes.sha256)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Copy</button>
          </div>
        </div>
        <div>
          <label className="label">SHA-512</label>
          <div className="tool-output-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ overflowX: 'auto', marginRight: '1rem' }}>{hashes.sha512 || 'Waiting for text...'}</span>
            <button onClick={() => copyToClipboard(hashes.sha512)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Copy</button>
          </div>
        </div>
        <div>
          <label className="label">SHA-1</label>
          <div className="tool-output-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ overflowX: 'auto', marginRight: '1rem' }}>{hashes.sha1 || 'Waiting for text...'}</span>
            <button onClick={() => copyToClipboard(hashes.sha1)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 10. UUID Generator
export const UUIDGenerator: React.FC = () => {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUUIDs = () => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }));
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUUIDs();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label className="label" style={{ marginBottom: 0 }}>UUID Count:</label>
        <input
          type="number"
          min="1"
          max="50"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          className="input"
          style={{ width: '80px' }}
        />
        <button onClick={generateUUIDs} className="btn btn-primary">Generate UUIDs</button>
      </div>
      {uuids.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <pre style={{ maxHeight: '200px', fontSize: '0.875rem' }}>{uuids.join('\n')}</pre>
          <button onClick={() => copyToClipboard(uuids.join('\n'))} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
            Copy All UUIDs
          </button>
        </div>
      )}
    </div>
  );
};

// 11. API Tester
export const APITester: React.FC = () => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState<number | null>(null);

  const makeRequest = async () => {
    setResponse('Loading response...');
    setStatus(null);
    try {
      const res = await fetch(url, { method });
      setStatus(res.status);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResponse(`Error fetching resource:\n${e.message}\nNote: Check for CORS issues if accessing external APIs.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="input" style={{ width: '100px' }}>
          <option>GET</option>
          <option>POST</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input"
          placeholder="https://api.domain.com/endpoint"
        />
        <button onClick={makeRequest} className="btn btn-primary">Send</button>
      </div>

      <div>
        <label className="label">Response Output {status && `(Status: ${status})`}</label>
        <pre style={{ height: '220px', fontSize: '0.85rem' }}>{response || 'Trigger a request to view responses.'}</pre>
      </div>
    </div>
  );
};

// 12. Cron Generator
export const CronGenerator: React.FC = () => {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [cronString, setCronString] = useState('* * * * *');

  useEffect(() => {
    setCronString(`${minute} ${hour} ${day} ${month} ${dayOfWeek}`);
  }, [minute, hour, day, month, dayOfWeek]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-5" style={{ gap: '8px' }}>
        <div>
          <label className="label">Min</label>
          <select value={minute} onChange={(e) => setMinute(e.target.value)} className="input">
            <option value="*">* (any)</option>
            <option value="0">0</option>
            <option value="*/5">*/5 (every 5m)</option>
            <option value="*/15">*/15</option>
          </select>
        </div>
        <div>
          <label className="label">Hour</label>
          <select value={hour} onChange={(e) => setHour(e.target.value)} className="input">
            <option value="*">* (any)</option>
            <option value="0">0 (midnight)</option>
            <option value="12">12 (noon)</option>
            <option value="*/2">*/2 (every 2h)</option>
          </select>
        </div>
        <div>
          <label className="label">Day</label>
          <select value={day} onChange={(e) => setDay(e.target.value)} className="input">
            <option value="*">* (any)</option>
            <option value="1">1st</option>
            <option value="15">15th</option>
          </select>
        </div>
        <div>
          <label className="label">Month</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="input">
            <option value="*">* (any)</option>
            <option value="1">Jan</option>
            <option value="6">Jun</option>
          </select>
        </div>
        <div>
          <label className="label">Weekday</label>
          <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className="input">
            <option value="*">* (any)</option>
            <option value="0">Sun</option>
            <option value="1">Mon</option>
            <option value="5">Fri</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">CRON Syntax Expression</label>
        <div className="tool-output-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{cronString}</span>
          <button onClick={() => copyToClipboard(cronString)} className="btn btn-secondary">Copy</button>
        </div>
      </div>
    </div>
  );
};

// 13. Color Picker & contrast calculator
export const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#ffffff');
  const [bg, setBg] = useState('#000000');
  const [contrast, setContrast] = useState(21);

  const calculateContrast = (c1: string, c2: string) => {
    // Relative luminance calculation script for contrast checking
    const getRGB = (hex: string) => {
      const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthand, (m, r, g, b) => r + r + g + g + b + b);
      const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return res ? {
        r: parseInt(res[1], 16),
        g: parseInt(res[2], 16),
        b: parseInt(res[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };

    const getLuminance = (rgb: { r: number, g: number, b: number }) => {
      const a = [rgb.r, rgb.g, rgb.b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const lum1 = getLuminance(getRGB(c1));
    const lum2 = getLuminance(getRGB(c2));
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  useEffect(() => {
    const score = calculateContrast(color, bg);
    setContrast(parseFloat(score.toFixed(2)));
  }, [color, bg]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-cols-2">
        <div>
          <label className="label">Text Color</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }} />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="input" />
          </div>
        </div>
        <div>
          <label className="label">Background Color</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }} />
            <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="input" />
          </div>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: bg, color: color, padding: '1.5rem', textAlign: 'center', border: '1px solid var(--color-border)' }}>
        <h4 style={{ color: 'inherit', marginBottom: '0.25rem' }}>Contrast Preview Block</h4>
        <p style={{ color: 'inherit', fontSize: '0.8125rem' }}>Visual layout of text contrast parameters.</p>
      </div>

      <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <div>Contrast Ratio: <span style={{ fontWeight: 'bold' }}>{contrast} : 1</span></div>
        <div style={{ fontSize: '0.8125rem', marginTop: '0.5rem', color: 'var(--color-fg-muted)' }}>
          {contrast >= 7 ? '✓ AAA Compliant (Exceptional readability)' : contrast >= 4.5 ? '✓ AA Compliant (Standard readability)' : '✖ Fails standard readability scores'}
        </div>
      </div>
    </div>
  );
};

// 14. CSS Minifier
export const CSSMinifier: React.FC = () => {
  const [css, setCss] = useState('');

  const minify = () => {
    const minified = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
      .replace(/\s+/g, ' ') // collapse whitespaces
      .replace(/\s*([{}|:;])\s*/g, '$1') // remove padding around punctuation
      .trim();
    setCss(minified);
    toast.success('CSS Minified!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={css}
        onChange={(e) => setCss(e.target.value)}
        className="input textarea"
        placeholder=".class { margin: 10px; }"
        style={{ fontFamily: 'var(--font-mono)' }}
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={minify} className="btn btn-primary">Minify CSS</button>
        <button onClick={() => copyToClipboard(css)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy</button>
      </div>
    </div>
  );
};

// 15. JS Minifier
export const JSMinifier: React.FC = () => {
  const [js, setJs] = useState('');

  const minify = () => {
    // Basic script compression formatting
    const minified = js
      .replace(/\/\*[\s\S]*?\*\//g, '') // comments block
      .replace(/\/\/.*$/gm, '') // line comments
      .replace(/\s+/g, ' ') // whitespaces
      .trim();
    setJs(minified);
    toast.success('JS code compressed!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={js}
        onChange={(e) => setJs(e.target.value)}
        className="input textarea"
        placeholder="function add(a, b) { return a + b; }"
        style={{ fontFamily: 'var(--font-mono)' }}
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={minify} className="btn btn-primary">Minify Javascript</button>
        <button onClick={() => copyToClipboard(js)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy</button>
      </div>
    </div>
  );
};

// 16. HTML Minifier
export const HTMLMinifier: React.FC = () => {
  const [html, setHtml] = useState('');

  const minify = () => {
    const minified = html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/<!--[\s\S]*?-->/g, '')
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
        placeholder="<div>   <span> Content </span> </div>"
        style={{ fontFamily: 'var(--font-mono)' }}
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={minify} className="btn btn-primary">Minify HTML</button>
        <button onClick={() => copyToClipboard(html)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy</button>
      </div>
    </div>
  );
};

// 17. HTML Entity Encoder/Decoder
export const HTMLEntities: React.FC = () => {
  const [input, setInput] = useState('<h1>Hello & Welcome!</h1>');
  const [output, setOutput] = useState('');

  const encode = () => {
    const encoded = input.replace(/[\u00A0-\u9999<>&]/g, (i) => `&#${i.charCodeAt(0)};`);
    setOutput(encoded);
    toast.success('HTML entities encoded!');
  };

  const decode = () => {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    setOutput(doc.documentElement.textContent || '');
    toast.success('HTML entities decoded!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Raw Content Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '180px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">Result Output</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '180px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={encode} className="btn btn-primary">Encode Entities</button>
        <button onClick={decode} className="btn btn-secondary">Decode Entities</button>
        {output && <button onClick={() => copyToClipboard(output)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy Result</button>}
      </div>
    </div>
  );
};

// 18. String to Hex Converter
export const StringHex: React.FC = () => {
  const [input, setInput] = useState('Hello');
  const [output, setOutput] = useState('');

  const encode = () => {
    let hex = '';
    for (let i = 0; i < input.length; i++) {
      hex += input.charCodeAt(i).toString(16).padStart(2, '0') + ' ';
    }
    setOutput(hex.trim().toUpperCase());
    toast.success('Encoded to Hex representation!');
  };

  const decode = () => {
    try {
      const cleanHex = input.replace(/[^a-fA-F0-9]/g, '');
      let str = '';
      for (let i = 0; i < cleanHex.length; i += 2) {
        str += String.fromCharCode(parseInt(cleanHex.substring(i, i + 2), 16));
      }
      setOutput(str);
      toast.success('Decoded from Hex string!');
    } catch {
      toast.error('Invalid Hex string format.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Input String / Hex</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '180px', fontFamily: 'var(--font-mono)' }}
            placeholder="e.g. Hello or 48 65 6C 6C 6F"
          />
        </div>
        <div>
          <label className="label">Converted Output</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '180px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={encode} className="btn btn-primary">Text ➔ Hex</button>
        <button onClick={decode} className="btn btn-secondary">Hex ➔ Text</button>
        {output && <button onClick={() => copyToClipboard(output)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy Output</button>}
      </div>
    </div>
  );
};

// 19. JSON Minifier
export const JSONMinifier: React.FC = () => {
  const [json, setJson] = useState('{\n  "id": 1,\n  "status": "active",\n  "metadata": {\n    "tags": ["prod", "web"]\n  }\n}');

  const minify = () => {
    try {
      if (!json.trim()) return;
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed));
      toast.success('JSON Minified successfully!');
    } catch {
      toast.error('Invalid JSON structure.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="input textarea"
        style={{ height: '240px', fontFamily: 'var(--font-mono)' }}
        placeholder="Paste JSON here..."
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={minify} className="btn btn-primary">Minify JSON</button>
        <button onClick={() => copyToClipboard(json)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy JSON</button>
      </div>
    </div>
  );
};

// 20. XML to JSON Converter
export const XMLToJSON: React.FC = () => {
  const [xml, setXml] = useState('<user id="1">\n  <name>Alice</name>\n  <role>Admin</role>\n</user>');
  const [json, setJson] = useState('');

  const convertXML = () => {
    try {
      if (!xml.trim()) return;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      const errorNode = xmlDoc.querySelector('parsererror');
      if (errorNode) {
        toast.error('XML Syntax Error');
        return;
      }

      const xmlToJsonNode = (xmlNode: Node): any => {
        let obj: any = {};
        if (xmlNode.nodeType === 1) { // element
          const elem = xmlNode as Element;
          if (elem.attributes.length > 0) {
            obj['@attributes'] = {};
            for (let j = 0; j < elem.attributes.length; j++) {
              const attribute = elem.attributes.item(j);
              if (attribute) obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if (xmlNode.nodeType === 3) { // text
          return xmlNode.nodeValue;
        }

        if (xmlNode.hasChildNodes()) {
          for (let i = 0; i < xmlNode.childNodes.length; i++) {
            const item = xmlNode.childNodes.item(i);
            const nodeName = item.nodeName;
            if (nodeName === '#text') {
              const text = item.nodeValue?.trim();
              if (text) return text;
              continue;
            }
            if (obj[nodeName] === undefined) {
              obj[nodeName] = xmlToJsonNode(item);
            } else {
              if (!Array.isArray(obj[nodeName])) {
                obj[nodeName] = [obj[nodeName]];
              }
              obj[nodeName].push(xmlToJsonNode(item));
            }
          }
        }
        return obj;
      };

      const result = xmlToJsonNode(xmlDoc.documentElement);
      setJson(JSON.stringify(result, null, 2));
      toast.success('XML successfully converted to JSON!');
    } catch {
      toast.error('XML parsing exception error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">XML Input markup</label>
          <textarea
            value={xml}
            onChange={(e) => setXml(e.target.value)}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">JSON Array Output</label>
          <textarea
            readOnly
            value={json}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={convertXML} className="btn btn-primary">Convert XML to JSON</button>
        {json && <button onClick={() => copyToClipboard(json)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy JSON</button>}
      </div>
    </div>
  );
};

// 21. Base32 Encoder/Decoder
export const Base32EncodeDecode: React.FC = () => {
  const [input, setInput] = useState('AllSetTools platform');
  const [output, setOutput] = useState('');

  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const encode = () => {
    let binary = '';
    for (let i = 0; i < input.length; i++) {
      binary += input.charCodeAt(i).toString(2).padStart(8, '0');
    }
    let result = '';
    for (let i = 0; i < binary.length; i += 5) {
      const chunk = binary.slice(i, i + 5).padEnd(5, '0');
      result += base32Chars[parseInt(chunk, 2)];
    }
    const padLength = (8 - (result.length % 8)) % 8;
    setOutput(result + '='.repeat(padLength));
    toast.success('Encoded to Base32!');
  };

  const decode = () => {
    try {
      const cleanStr = input.replace(/=+$/, '').toUpperCase().replace(/\s/g, '');
      let binary = '';
      for (let i = 0; i < cleanStr.length; i++) {
        const index = base32Chars.indexOf(cleanStr[i]);
        if (index === -1) throw new Error('Invalid Base32 character');
        binary += index.toString(2).padStart(5, '0');
      }
      let result = '';
      for (let i = 0; i < binary.length; i += 8) {
        const chunk = binary.slice(i, i + 8);
        if (chunk.length < 8) break;
        result += String.fromCharCode(parseInt(chunk, 2));
      }
      setOutput(result);
      toast.success('Decoded from Base32!');
    } catch {
      toast.error('Invalid Base32 string input.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Plain Text / Base32 Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '180px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">Result Output</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '180px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={encode} className="btn btn-primary">Encode Base32</button>
        <button onClick={decode} className="btn btn-secondary">Decode Base32</button>
        {output && <button onClick={() => copyToClipboard(output)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy Output</button>}
      </div>
    </div>
  );
};

// 22. SVG Minifier
export const SVGMinifier: React.FC = () => {
  const [input, setInput] = useState('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <!-- Logo graphic -->\n  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />\n</svg>');
  const [output, setOutput] = useState('');

  const minify = () => {
    if (!input.trim()) return;
    let text = input;
    text = text.replace(/<!--[\s\S]*?-->/g, ''); 
    text = text.replace(/<\?xml[\s\S]*?\?>/i, ''); 
    text = text.replace(/\s+/g, ' '); 
    text = text.replace(/>\s+</g, '><'); 
    setOutput(text.trim());
    toast.success('SVG minified successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Raw SVG Source</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '200px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">Minified SVG Output</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '200px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={minify} className="btn btn-primary">Minify SVG</button>
        {output && <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied SVG!'); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy SVG</button>}
      </div>
    </div>
  );
};

// 23. SQL Minifier
export const SQLMinifier: React.FC = () => {
  const [input, setInput] = useState('SELECT * FROM users\n-- Fetch all active accounts\nWHERE active = 1\nORDER BY created_at DESC;');
  const [output, setOutput] = useState('');

  const minify = () => {
    if (!input.trim()) return;
    let text = input;
    text = text.replace(/\/\*[\s\S]*?\*\//g, ''); 
    text = text.replace(/--.*$/gm, ''); 
    text = text.replace(/\s+/g, ' '); 
    setOutput(text.trim());
    toast.success('SQL query minified!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Raw SQL Query</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '200px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">Minified SQL Output</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '200px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={minify} className="btn btn-primary">Minify SQL</button>
        {output && <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied SQL!'); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy SQL</button>}
      </div>
    </div>
  );
};

// 24. User Agent Parser
export const UserAgentParser: React.FC = () => {
  const [input, setInput] = useState('');
  const [browser, setBrowser] = useState('');
  const [os, setOs] = useState('');
  const [engine, setEngine] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      setInput(window.navigator.userAgent);
    }
  }, []);

  const parseUA = () => {
    const ua = input.toLowerCase();
    
    // Browser Detect
    let b = 'Unknown Browser';
    if (ua.includes('chrome')) b = 'Google Chrome';
    else if (ua.includes('firefox')) b = 'Mozilla Firefox';
    else if (ua.includes('safari')) b = 'Apple Safari';
    else if (ua.includes('edge')) b = 'Microsoft Edge';
    
    // OS Detect
    let o = 'Unknown OS';
    if (ua.includes('win')) o = 'Windows';
    else if (ua.includes('mac')) o = 'macOS';
    else if (ua.includes('linux')) o = 'Linux';
    else if (ua.includes('android')) o = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) o = 'iOS';

    // Engine Detect
    let eng = 'Unknown Engine';
    if (ua.includes('applewebkit')) eng = 'WebKit / Blink';
    else if (ua.includes('gecko')) eng = 'Gecko';

    setBrowser(b);
    setOs(o);
    setEngine(eng);
    toast.success('User Agent parsed!');
  };

  useEffect(() => {
    if (input) parseUA();
  }, [input]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">User Agent String</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="input textarea"
          style={{ height: '80px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
        />
      </div>

      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Detected Browser</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>{browser}</div>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Operating System</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>{os}</div>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Layout Engine</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>{engine}</div>
        </div>
      </div>
    </div>
  );
};

// 25. JSON Schema Generator
export const JSONSchemaGenerator: React.FC = () => {
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "Widget",\n  "price": 12.50,\n  "tags": ["new", "sale"]\n}');
  const [output, setOutput] = useState('');

  const generate = () => {
    try {
      const parsed = JSON.parse(input);
      const generateSchema = (obj: any): any => {
        if (obj === null) return { type: 'null' };
        if (Array.isArray(obj)) {
          return {
            type: 'array',
            items: obj.length > 0 ? generateSchema(obj[0]) : {}
          };
        }
        if (typeof obj === 'object') {
          const properties: Record<string, any> = {};
          Object.entries(obj).forEach(([key, val]) => {
            properties[key] = generateSchema(val);
          });
          return { type: 'object', properties };
        }
        return { type: typeof obj };
      };

      const schema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        ...generateSchema(parsed)
      };

      setOutput(JSON.stringify(schema, null, 2));
      toast.success('JSON Schema generated!');
    } catch (e) {
      toast.show('Invalid JSON format', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Sample JSON Object</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">Inferred JSON Schema</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={generate} className="btn btn-primary">Generate Schema</button>
        {output && <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied Schema!'); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy Schema</button>}
      </div>
    </div>
  );
};

// 26. XML Minifier
export const XMLMinifier: React.FC = () => {
  const [input, setInput] = useState('<note>\n  <to>Tove</to>\n  <!-- Test comment -->\n  <from>Jani</from>\n</note>');
  const [output, setOutput] = useState('');

  const minify = () => {
    if (!input.trim()) return;
    let text = input;
    text = text.replace(/<!--[\s\S]*?-->/g, ''); 
    text = text.replace(/\s+/g, ' '); 
    text = text.replace(/>\s+</g, '><'); 
    setOutput(text.trim());
    toast.success('XML minified successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Raw XML Source</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '200px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <div>
          <label className="label">Minified XML Output</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '200px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={minify} className="btn btn-primary">Minify XML</button>
        {output && <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied XML!'); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Copy XML</button>}
      </div>
    </div>
  );
};

