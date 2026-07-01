// src/components/tools/more-dev-tools.tsx
"use client";

import React, { useState, useEffect } from 'react';
import * as yaml from 'js-yaml';
import { toast } from '@/components/Toast';
import { Icon } from '@/components/Icons';

// Helper: Base64Url Encoding for JWT
const base64UrlEncode = (str: string | Uint8Array): string => {
  let base64;
  if (typeof str === 'string') {
    base64 = btoa(unescape(encodeURIComponent(str)));
  } else {
    base64 = btoa(String.fromCharCode(...str));
  }
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

// Helper: Base64Url Decoding for JWT
const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return decodeURIComponent(escape(atob(base64)));
};

// Cryptographic JWT Signing using Web Crypto API
const signJWT = async (headerStr: string, payloadStr: string, secret: string, algorithm: string): Promise<string> => {
  const encoder = new TextEncoder();
  const headerB64 = base64UrlEncode(headerStr);
  const payloadB64 = base64UrlEncode(payloadStr);
  const tokenInput = `${headerB64}.${payloadB64}`;
  const inputData = encoder.encode(tokenInput);
  const keyData = encoder.encode(secret);

  let hashName: string;
  if (algorithm === 'HS256') hashName = 'SHA-256';
  else if (algorithm === 'HS384') hashName = 'SHA-384';
  else if (algorithm === 'HS512') hashName = 'SHA-512';
  else throw new Error('Unsupported algorithm');

  const key = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: hashName } },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign('HMAC', key, inputData);
  const signatureUint8 = new Uint8Array(signature);
  const signatureB64 = base64UrlEncode(signatureUint8);
  
  return `${tokenInput}.${signatureB64}`;
};

// Recursive JSON sorting helper for Diff
const sortJSONKeys = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortJSONKeys);
  return Object.keys(obj).sort().reduce((result: any, key) => {
    result[key] = sortJSONKeys(obj[key]);
    return result;
  }, {});
};

// Delimiter-aware CSV parser
const parseCSV = (csvText: string, delimiter: string = ','): string[][] => {
  const lines = csvText.split(/\r?\n/);
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }).filter(row => row.length > 1 || row[0] !== '');
};

// Delimiter-aware CSV compiler
const formatCSV = (rows: string[][], delimiter: string = ','): string => {
  return rows.map(row => 
    row.map(val => {
      let escaped = val.replace(/"/g, '""');
      if (escaped.includes(delimiter) || escaped.includes('\n') || escaped.includes(' ') || escaped.includes('"')) {
        escaped = `"${escaped}"`;
      }
      return escaped;
    }).join(delimiter)
  ).join('\n');
};

// ==========================================
// 1. JWT GENERATOR
// ==========================================
export const JWTGenerator: React.FC = () => {
  const [algorithm, setAlgorithm] = useState('HS256');
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "admin": true,\n  "iat": 1719672000,\n  "exp": 1722350400\n}');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [token, setToken] = useState('');

  // Auto-sync alg header when algorithm changes
  useEffect(() => {
    try {
      const parsed = JSON.parse(header);
      parsed.alg = algorithm;
      setHeader(JSON.stringify(parsed, null, 2));
    } catch (e) {}
  }, [algorithm]);

  const generate = async () => {
    try {
      // Validate JSON inputs
      JSON.parse(header);
      JSON.parse(payload);
    } catch (err) {
      toast.error('Invalid JSON format in Header or Payload!');
      return;
    }

    try {
      const jwt = await signJWT(header, payload, secret, algorithm);
      setToken(jwt);
      toast.success('JWT Generated!');
    } catch (err: any) {
      console.error(err);
      toast.error('Signing failed: ' + err.message);
    }
  };

  const copy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    toast.success('Token copied to clipboard!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">Algorithm</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="input">
            <option value="HS256">HS256 (HMAC-SHA256)</option>
            <option value="HS384">HS384 (HMAC-SHA384)</option>
            <option value="HS512">HS512 (HMAC-SHA512)</option>
          </select>
        </div>
        <div>
          <label className="label">Signing Secret Key</label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="input"
            placeholder="Secret string key"
          />
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">Header (JSON)</label>
          <textarea
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            className="input"
            style={{ height: '180px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </div>
        <div>
          <label className="label">Payload Claims (JSON)</label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="input"
            style={{ height: '180px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <button onClick={generate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Generate JWT Token
      </button>

      {token && (
        <div className="card" style={{ padding: '1.25rem', marginTop: '0.5rem' }}>
          <label className="label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Generated JWT Token</span>
            <button onClick={copy} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
              Copy Token
            </button>
          </label>
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              wordBreak: 'break-all',
              lineHeight: '1.5'
            }}
          >
            {token}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. JWT VALIDATOR
// ==========================================
export const JWTValidator: React.FC = () => {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState('HS256');
  const [validation, setValidation] = useState<{
    isValid: boolean | null;
    signatureValid: boolean | null;
    claimsMessage: string;
    decodedHeader: string;
    decodedPayload: string;
  }>({
    isValid: null,
    signatureValid: null,
    claimsMessage: '',
    decodedHeader: '',
    decodedPayload: ''
  });

  const validate = async () => {
    if (!token.trim()) {
      toast.error('Please paste a JWT token!');
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      setValidation({
        isValid: false,
        signatureValid: false,
        claimsMessage: 'Invalid token structure. Must contain header, payload, and signature split by dots.',
        decodedHeader: '',
        decodedPayload: ''
      });
      toast.error('Invalid token structure.');
      return;
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const payloadStr = base64UrlDecode(parts[1]);

      let sigValid = false;
      if (secret) {
        try {
          const resigned = await signJWT(headerStr, payloadStr, secret, algorithm);
          sigValid = resigned.split('.')[2] === parts[2];
        } catch (e) {
          sigValid = false;
        }
      } else {
        sigValid = false;
      }

      // Claims validation
      const payloadObj = JSON.parse(payloadStr);
      const currentTime = Math.floor(Date.now() / 1000);
      let claimsMsg = 'Valid claims.';
      
      if (payloadObj.exp && currentTime > payloadObj.exp) {
        claimsMsg = `Token expired on ${new Date(payloadObj.exp * 1000).toLocaleString()}`;
      } else if (payloadObj.nbf && currentTime < payloadObj.nbf) {
        claimsMsg = `Token not active before ${new Date(payloadObj.nbf * 1000).toLocaleString()}`;
      }

      const isTokenValid = secret ? (sigValid && claimsMsg === 'Valid claims.') : true;

      setValidation({
        isValid: isTokenValid,
        signatureValid: secret ? sigValid : null,
        claimsMessage: claimsMsg,
        decodedHeader: JSON.stringify(JSON.parse(headerStr), null, 2),
        decodedPayload: JSON.stringify(payloadObj, null, 2)
      });

      if (isTokenValid) {
        toast.success('JWT Verified successfully!');
      } else {
        toast.error('JWT validation failed.');
      }

    } catch (err: any) {
      console.error(err);
      setValidation({
        isValid: false,
        signatureValid: false,
        claimsMessage: 'Parsing failed: ' + err.message,
        decodedHeader: '',
        decodedPayload: ''
      });
      toast.error('Verification failed.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Paste JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
          className="input"
          style={{ height: '80px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
        />
      </div>

      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">Algorithm</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="input">
            <option value="HS256">HS256 (HMAC-SHA256)</option>
            <option value="HS384">HS384 (HMAC-SHA384)</option>
            <option value="HS512">HS512 (HMAC-SHA512)</option>
          </select>
        </div>
        <div>
          <label className="label">Secret (Optional to only decode, required to verify signature)</label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Type secret key here"
            className="input"
          />
        </div>
      </div>

      <button onClick={validate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Verify & Decode Token
      </button>

      {validation.isValid !== null && (
        <div className="card" style={{ padding: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
            <div>
              <strong>Signature Check:</strong>{' '}
              {validation.signatureValid === null ? (
                <span style={{ color: 'var(--color-fg-muted)' }}>Not verified (no secret entered)</span>
              ) : validation.signatureValid ? (
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>✓ Valid Signature</span>
              ) : (
                <span style={{ color: 'var(--color-danger, red)', fontWeight: 600 }}>✗ Invalid Signature</span>
              )}
            </div>
            <div>
              <strong>Claims Status:</strong>{' '}
              {validation.claimsMessage === 'Valid claims.' ? (
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>✓ Claims Valid</span>
              ) : (
                <span style={{ color: 'var(--color-danger, red)', fontWeight: 600 }}>{validation.claimsMessage}</span>
              )}
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <label className="label">Decoded Header</label>
              <pre
                style={{
                  height: '150px',
                  fontSize: '0.8rem',
                  padding: '8px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                {validation.decodedHeader}
              </pre>
            </div>
            <div>
              <label className="label">Decoded Payload Claims</label>
              <pre
                style={{
                  height: '150px',
                  fontSize: '0.8rem',
                  padding: '8px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                {validation.decodedPayload}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. YAML FORMATTER & VALIDATOR
// ==========================================
export const YAMLFormatterValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [spaces, setSpaces] = useState(2);
  const [status, setStatus] = useState<{ isValid: boolean | null; error: string }>({ isValid: null, error: '' });

  const processYAML = (action: 'format' | 'validate') => {
    if (!input.trim()) {
      toast.error('Please enter YAML text!');
      return;
    }

    try {
      const doc = yaml.load(input);
      setStatus({ isValid: true, error: '' });
      
      if (action === 'format') {
        const formatted = yaml.dump(doc, { indent: spaces, lineWidth: -1 });
        setOutput(formatted);
        toast.success('YAML Formatted successfully!');
      } else {
        toast.success('YAML is valid!');
      }
    } catch (err: any) {
      console.error(err);
      setStatus({ isValid: false, error: err.message || 'Syntax error' });
      setOutput('');
      toast.error('Invalid YAML syntax!');
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success('YAML copied!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">YAML Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="paste: yaml_contents_here..."
            className="input"
            style={{ height: '240px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </div>
        <div>
          <label className="label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Formatted Output</span>
            {output && (
              <button onClick={copy} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                Copy
              </button>
            )}
          </label>
          <textarea
            readOnly
            value={output}
            placeholder="formatted yaml will output here..."
            className="input"
            style={{ height: '240px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', backgroundColor: 'var(--color-bg-subtle)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => processYAML('format')} className="btn btn-primary">Format YAML</button>
        <button onClick={() => processYAML('validate')} className="btn btn-secondary">Validate YAML</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label className="label" style={{ margin: 0 }}>Indentation Spaces:</label>
          <select value={spaces} onChange={(e) => setSpaces(parseInt(e.target.value))} className="input" style={{ width: '80px' }}>
            <option value="2">2</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>

      {status.isValid !== null && (
        <div
          className="card"
          style={{
            padding: '1rem',
            borderColor: status.isValid ? 'var(--color-success)' : 'var(--color-danger, red)',
            backgroundColor: 'var(--color-bg-subtle)'
          }}
        >
          {status.isValid ? (
            <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>✓ YAML is fully valid.</div>
          ) : (
            <div>
              <div style={{ color: 'var(--color-danger, red)', fontWeight: 600, marginBottom: '4px' }}>✗ Invalid YAML syntax:</div>
              <pre style={{ fontSize: '0.75rem', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {status.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. JSON DIFF
// ==========================================
interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

const computeLCSDiff = (linesA: string[], linesB: string[]): DiffLine[] => {
  const n = linesA.length;
  const m = linesB.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({ type: 'unchanged', text: linesA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: linesB[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'removed', text: linesA[i - 1] });
      i--;
    }
  }
  return result;
};

export const JSONDiff: React.FC = () => {
  const [jsonA, setJsonA] = useState('{\n  "name": "AllSetTools",\n  "version": "1.0",\n  "active": true,\n  "features": ["PDF", "Convert"]\n}');
  const [jsonB, setJsonB] = useState('{\n  "name": "AllSetTools Dev",\n  "version": "1.0",\n  "features": ["PDF", "Convert", "YAML"]\n}');
  const [diff, setDiff] = useState<DiffLine[]>([]);

  const compare = () => {
    try {
      const objA = JSON.parse(jsonA);
      const objB = JSON.parse(jsonB);

      // Sort keys recursively to compare structurally
      const strA = JSON.stringify(sortJSONKeys(objA), null, 2);
      const strB = JSON.stringify(sortJSONKeys(objB), null, 2);

      const linesA = strA.split('\n');
      const linesB = strB.split('\n');

      const difference = computeLCSDiff(linesA, linesB);
      setDiff(difference);
      toast.success('Diff rendered!');
    } catch (e: any) {
      toast.error('Invalid JSON inputs! Please format JSON correctly.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">JSON object A (Original)</label>
          <textarea
            value={jsonA}
            onChange={(e) => setJsonA(e.target.value)}
            className="input"
            style={{ height: '160px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </div>
        <div>
          <label className="label">JSON object B (Modified)</label>
          <textarea
            value={jsonB}
            onChange={(e) => setJsonB(e.target.value)}
            className="input"
            style={{ height: '160px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <button onClick={compare} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Compare JSONs
      </button>

      {diff.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Structural Differences</h3>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
              lineHeight: '1.6'
            }}
          >
            {diff.map((line, idx) => {
              let color = 'inherit';
              let bgColor = 'transparent';
              let prefix = ' ';
              if (line.type === 'added') {
                color = '#2da44e'; // green text
                bgColor = 'rgba(46, 160, 67, 0.15)'; // light green bg
                prefix = '+';
              } else if (line.type === 'removed') {
                color = '#cf222e'; // red text
                bgColor = 'rgba(248, 81, 73, 0.15)'; // light red bg
                prefix = '-';
              }
              return (
                <div
                  key={idx}
                  style={{
                    color,
                    backgroundColor: bgColor,
                    display: 'flex',
                    gap: '8px',
                    padding: '1px 8px',
                    borderRadius: 'var(--radius-xs)'
                  }}
                >
                  <span style={{ opacity: 0.5, userSelect: 'none', width: '20px' }}>{idx + 1}</span>
                  <span style={{ fontWeight: 600, userSelect: 'none' }}>{prefix}</span>
                  <span style={{ whiteSpace: 'pre-wrap' }}>{line.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. CSV VIEWER & EDITOR
// ==========================================
export const CSVViewerEditor: React.FC = () => {
  const [csvInput, setCsvInput] = useState('Name,Age,Role,Active\nJohn Doe,30,Developer,Yes\nJane Smith,25,Designer,No\nBob Johnson,35,Manager,Yes');
  const [delimiter, setDelimiter] = useState(',');
  const [rows, setRows] = useState<string[][]>([]);
  const [isViewing, setIsViewing] = useState(false);

  const loadCSV = () => {
    if (!csvInput.trim()) {
      toast.error('Please enter CSV data!');
      return;
    }
    const parsed = parseCSV(csvInput, delimiter);
    setRows(parsed);
    setIsViewing(true);
    toast.success('CSV loaded into interactive editor grid!');
  };

  const updateCell = (rIdx: number, cIdx: number, val: string) => {
    const updated = [...rows];
    updated[rIdx][cIdx] = val;
    setRows(updated);
  };

  const addRow = () => {
    if (rows.length === 0) return;
    const colCount = rows[0].length;
    setRows([...rows, Array(colCount).fill('')]);
    toast.success('Row added!');
  };

  const deleteRow = (rIdx: number) => {
    if (rows.length <= 1) {
      toast.error('Cannot delete the last row!');
      return;
    }
    setRows(rows.filter((_, idx) => idx !== rIdx));
    toast.success('Row removed!');
  };

  const addColumn = () => {
    if (rows.length === 0) return;
    const updated = rows.map(row => [...row, '']);
    setRows(updated);
    toast.success('Column added!');
  };

  const deleteColumn = (cIdx: number) => {
    if (rows[0].length <= 1) {
      toast.error('Cannot delete the last column!');
      return;
    }
    const updated = rows.map(row => row.filter((_, idx) => idx !== cIdx));
    setRows(updated);
    toast.success('Column removed!');
  };

  const exportCSV = () => {
    const csvContent = formatCSV(rows, delimiter);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'edited_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV file exported successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {!isViewing ? (
        <>
          <div>
            <label className="label">CSV Data Input</label>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="input"
              style={{ height: '180px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
              placeholder="Name,Age,Role..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label className="label" style={{ margin: 0 }}>Delimiter:</label>
              <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="input" style={{ width: '120px' }}>
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="&#9;">Tab</option>
              </select>
            </div>
            <button onClick={loadCSV} className="btn btn-primary">Load & Edit Grid</button>
          </div>
        </>
      ) : (
        <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>CSV Editor Grid</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addRow} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>+ Add Row</button>
              <button onClick={addColumn} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>+ Add Column</button>
              <button onClick={exportCSV} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Export & Download</button>
              <button onClick={() => setIsViewing(false)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Back</button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--color-border)', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
                {rows[0]?.map((_, colIdx) => (
                  <th key={colIdx} style={{ border: '1px solid var(--color-border)', padding: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem' }}>Col {colIdx + 1}</span>
                      <button
                        onClick={() => deleteColumn(colIdx)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-danger, red)', cursor: 'pointer', fontSize: '0.75rem' }}
                        title="Delete Column"
                      >
                        ✖
                      </button>
                    </div>
                  </th>
                ))}
                <th style={{ width: '40px', border: '1px solid var(--color-border)' }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ border: '1px solid var(--color-border)', padding: '4px' }}>
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.8rem',
                          padding: '4px',
                          color: 'var(--color-fg)'
                        }}
                      />
                    </td>
                  ))}
                  <td style={{ border: '1px solid var(--color-border)', padding: '4px', textAlign: 'center' }}>
                    <button
                      onClick={() => deleteRow(rIdx)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger, red)', cursor: 'pointer', fontSize: '0.8rem' }}
                      title="Delete Row"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
