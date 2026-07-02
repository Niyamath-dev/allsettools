// src/components/tools/pdf-tools.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';
import { toast } from '@/components/Toast';
import { Icon } from '@/components/Icons';

// Helper: Format bytes to human readable size
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Helper: Parse page range string (e.g., "1, 3-5, 8") to 0-indexed page number array
const parsePageRanges = (rangeStr: string, totalPages: number): number[] => {
  const pages = new Set<number>();
  const parts = rangeStr.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr.trim(), 10);
      const end = parseInt(endStr.trim(), 10);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) {
            pages.add(i - 1); // 0-indexed for pdf-lib
          }
        }
      }
    } else {
      const page = parseInt(trimmed, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        pages.add(page - 1);
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
};

// ==========================================
// 1. PROTECT PDF COMPONENT
// ==========================================
export const ProtectPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [encrypting, setEncrypting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [algorithm, setAlgorithm] = useState<'AES-256' | 'RC4-128'>('AES-256');

  // Permission settings
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [allowModifying, setAllowModifying] = useState(true);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl('');
    }
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    setShowPassword(true);
    toast.success('Generated a strong password!');
  };

  const protect = async () => {
    if (!file) return;
    if (!password) {
      toast.error('Please enter a password!');
      return;
    }
    setEncrypting(true);
    setDownloadUrl('');

    try {
      const buffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      const encryptedBytes = await encryptPDF(pdfBytes, password, {
        algorithm: algorithm === 'AES-256' ? 'AES-256' : 'RC4',
        allowPrinting,
        allowCopying,
        allowModifying
      });

      const blob = new Blob([encryptedBytes as any], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('PDF protected successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Encryption failed: ' + (err.message || 'unknown error'));
    } finally {
      setEncrypting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Upload PDF File</label>
        <input type="file" accept=".pdf" onChange={handleFile} className="input" style={{ paddingTop: '8px' }} />
      </div>

      {file && (
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <strong>File Selected:</strong> {file.name} ({formatBytes(file.size)})
          </div>

          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <div>
              <label className="label">Enter Password</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set PDF open password"
                  className="input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="button"
                onClick={generatePassword}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Generate Strong Password
              </button>
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <div>
              <label className="label">Encryption Level</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as any)}
                className="input"
              >
                <option value="AES-256">AES 256-bit (Recommended - Secure)</option>
                <option value="RC4-128">RC4 128-bit (Legacy - High Compatibility)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={allowPrinting} onChange={(e) => setAllowPrinting(e.target.checked)} />
                Allow Printing
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={allowCopying} onChange={(e) => setAllowCopying(e.target.checked)} />
                Allow Text/Image Copying
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={allowModifying} onChange={(e) => setAllowModifying(e.target.checked)} />
                Allow Modifying
              </label>
            </div>
          </div>

          <button
            onClick={protect}
            disabled={encrypting}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
          >
            {encrypting ? 'Encrypting PDF...' : 'Protect PDF'}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="card" style={{ padding: '1.25rem', borderColor: 'var(--color-success)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-success)' }}>
            ✓ PDF Protected Successfully!
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: '4px 0 12px 0' }}>
            The password has been set. Remember to save the password securely.
          </p>
          <a
            href={downloadUrl}
            download={`${file?.name.split('.pdf')[0]}_protected.pdf`}
            className="btn btn-primary"
            style={{ display: 'inline-block' }}
          >
            Download Protected PDF
          </a>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. UNLOCK PDF COMPONENT
// ==========================================
export const UnlockPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isEncryptedFile, setIsEncryptedFile] = useState<boolean | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setDownloadUrl('');
      setPassword('');
      setIsEncryptedFile(null);

      try {
        const buffer = await selectedFile.arrayBuffer();
        const check = await isEncrypted(new Uint8Array(buffer));
        setIsEncryptedFile(check.encrypted);
        if (!check.encrypted) {
          toast.success('This PDF is not password protected!');
        } else {
          toast.info(`Protected PDF detected (Uses ${check.algorithm || 'RC4/AES'})`);
        }
      } catch (err) {
        console.error(err);
        toast.error('Could not check PDF security status.');
      }
    }
  };

  const unlock = async () => {
    if (!file) return;
    if (isEncryptedFile === false) {
      toast.success('No decryption needed! File downloaded directly.');
      const blob = new Blob([await file.arrayBuffer()], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      return;
    }
    if (!password) {
      toast.error('Please enter the password!');
      return;
    }
    setDecrypting(true);
    setDownloadUrl('');

    try {
      const buffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      const decryptedBytes = await decryptPDF(pdfBytes, password);
      const blob = new Blob([decryptedBytes as any], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('PDF unlocked successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Wrong password or decryption failed!');
    } finally {
      setDecrypting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Upload Password-Protected PDF</label>
        <input type="file" accept=".pdf" onChange={handleFile} className="input" style={{ paddingTop: '8px' }} />
      </div>

      {file && (
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <strong>File Selected:</strong> {file.name} ({formatBytes(file.size)})
          </div>

          {isEncryptedFile !== false && (
            <div>
              <label className="label">Enter Password</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter current open password"
                  className="input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={unlock}
            disabled={decrypting}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
          >
            {decrypting ? 'Decrypting PDF...' : isEncryptedFile === false ? 'Download Unprotected File' : 'Unlock PDF'}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="card" style={{ padding: '1.25rem', borderColor: 'var(--color-success)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-success)' }}>
            ✓ PDF Unlocked Successfully!
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: '4px 0 12px 0' }}>
            The password protection has been completely removed.
          </p>
          <a
            href={downloadUrl}
            download={`${file?.name.split('.pdf')[0]}_unlocked.pdf`}
            className="btn btn-primary"
            style={{ display: 'inline-block' }}
          >
            Download Unlocked PDF
          </a>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. MERGE PDF COMPONENT
// ==========================================
interface MergeItem {
  id: string;
  file: File;
  size: number;
}

export const MergePDF: React.FC = () => {
  const [files, setFiles] = useState<MergeItem[]>([]);
  const [merging, setMerging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems: MergeItem[] = Array.from(e.target.files).map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        size: f.size
      }));
      setFiles((prev) => [...prev, ...newItems]);
      setDownloadUrl('');
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setDownloadUrl('');
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= files.length) return;
    
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setFiles(updated);
    setDownloadUrl('');
  };

  const merge = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge!');
      return;
    }
    setMerging(true);
    setDownloadUrl('');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const buffer = await item.file.arrayBuffer();
        const pdfBytes = new Uint8Array(buffer);

        // Pre-check if any PDF is encrypted
        const check = await isEncrypted(pdfBytes);
        if (check.encrypted) {
          throw new Error(`The file "${item.file.name}" is password protected. Please unlock it before merging.`);
        }

        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('PDFs merged successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Merge failed. Make sure none of the PDFs are corrupted or protected.');
    } finally {
      setMerging(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Upload PDF Files to Merge</label>
        <input type="file" accept=".pdf" multiple onChange={handleFiles} className="input" style={{ paddingTop: '8px' }} />
      </div>

      {files.length > 0 && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>PDF Files Queue ({files.length})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
            {files.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                  <Icon name="file-text" style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.file.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', flexShrink: 0 }}>
                    ({formatBytes(item.size)})
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    disabled={index === 0}
                    onClick={() => moveFile(index, 'up')}
                    className="btn btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                  >
                    ▲
                  </button>
                  <button
                    disabled={index === files.length - 1}
                    onClick={() => moveFile(index, 'down')}
                    className="btn btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="btn btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'var(--color-danger, red)' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={merge}
            disabled={merging || files.length < 2}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            {merging ? 'Merging PDFs...' : 'Merge PDFs'}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="card" style={{ padding: '1.25rem', borderColor: 'var(--color-success)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-success)' }}>
            ✓ PDFs Merged Successfully!
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: '4px 0 12px 0' }}>
            A single PDF containing all pages in the order list has been built.
          </p>
          <a
            href={downloadUrl}
            download="merged_document.pdf"
            className="btn btn-primary"
            style={{ display: 'inline-block' }}
          >
            Download Merged PDF
          </a>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. SPLIT PDF COMPONENT
// ==========================================
interface SplitPageLink {
  pageNumber: number;
  url: string;
}

export const SplitPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [splitMode, setSplitMode] = useState<'range' | 'individual'>('range');
  const [rangeInput, setRangeInput] = useState('');
  const [splitting, setSplitting] = useState(false);
  const [rangeDownloadUrl, setRangeDownloadUrl] = useState('');
  const [pageLinks, setPageLinks] = useState<SplitPageLink[]>([]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTotalPages(null);
      setRangeDownloadUrl('');
      setPageLinks([]);
      
      try {
        const buffer = await selectedFile.arrayBuffer();
        const pdfBytes = new Uint8Array(buffer);

        const check = await isEncrypted(pdfBytes);
        if (check.encrypted) {
          toast.error('Protected PDF detected. Please unlock it first.');
          setFile(null);
          return;
        }

        const pdf = await PDFDocument.load(pdfBytes);
        setTotalPages(pdf.getPageCount());
        setRangeInput(`1-${pdf.getPageCount()}`);
      } catch (err) {
        console.error(err);
        toast.error('Could not load PDF page metrics.');
        setFile(null);
      }
    }
  };

  const split = async () => {
    if (!file || !totalPages) return;
    setSplitting(true);
    setRangeDownloadUrl('');
    setPageLinks([]);

    try {
      const buffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);

      if (splitMode === 'range') {
        if (!rangeInput.trim()) {
          toast.error('Please enter page ranges.');
          setSplitting(false);
          return;
        }
        
        const pageIndices = parsePageRanges(rangeInput, totalPages);
        if (pageIndices.length === 0) {
          toast.error('Invalid page range input!');
          setSplitting(false);
          return;
        }

        const splitDoc = await PDFDocument.create();
        const sourceDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await splitDoc.copyPages(sourceDoc, pageIndices);
        copiedPages.forEach((page) => splitDoc.addPage(page));

        const splitBytes = await splitDoc.save();
        const blob = new Blob([splitBytes as any], { type: 'application/pdf' });
        setRangeDownloadUrl(URL.createObjectURL(blob));
        toast.success('Selected pages extracted successfully!');
      } else {
        // Individual page extract
        const sourceDoc = await PDFDocument.load(pdfBytes);
        const links: SplitPageLink[] = [];
        
        for (let i = 0; i < totalPages; i++) {
          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(sourceDoc, [i]);
          singleDoc.addPage(copiedPage);

          const singleBytes = await singleDoc.save();
          const blob = new Blob([singleBytes as any], { type: 'application/pdf' });
          links.push({
            pageNumber: i + 1,
            url: URL.createObjectURL(blob)
          });
        }
        setPageLinks(links);
        toast.success(`Split PDF into ${totalPages} individual pages!`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Splitting operation failed.');
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Upload PDF to Split</label>
        <input type="file" accept=".pdf" onChange={handleFile} className="input" style={{ paddingTop: '8px' }} />
      </div>

      {file && totalPages !== null && (
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <strong>File Selected:</strong> {file.name} ({formatBytes(file.size)})<br />
            <strong>Total Pages:</strong> {totalPages}
          </div>

          <div>
            <label className="label">Splitting Mode</label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <input
                  type="radio"
                  name="split-mode"
                  checked={splitMode === 'range'}
                  onChange={() => {
                    setSplitMode('range');
                    setRangeDownloadUrl('');
                    setPageLinks([]);
                  }}
                />
                Extract Custom Range
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <input
                  type="radio"
                  name="split-mode"
                  checked={splitMode === 'individual'}
                  onChange={() => {
                    setSplitMode('individual');
                    setRangeDownloadUrl('');
                    setPageLinks([]);
                  }}
                />
                Split into Single Pages
              </label>
            </div>
          </div>

          {splitMode === 'range' && (
            <div>
              <label className="label">Page Ranges</label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 8-10"
                className="input"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', display: 'block', marginTop: '4px' }}>
                Specify page numbers and/or ranges separated by commas. Example: 1-3, 5, 8. Max pages: {totalPages}.
              </span>
            </div>
          )}

          <button
            onClick={split}
            disabled={splitting}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            {splitting ? 'Processing...' : 'Split PDF'}
          </button>
        </div>
      )}

      {rangeDownloadUrl && (
        <div className="card" style={{ padding: '1.25rem', borderColor: 'var(--color-success)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-success)' }}>
            ✓ Extracted PDF Ready!
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: '4px 0 12px 0' }}>
            The selected pages have been compiled into a new PDF.
          </p>
          <a
            href={rangeDownloadUrl}
            download={`${file?.name.split('.pdf')[0]}_split.pdf`}
            className="btn btn-primary"
            style={{ display: 'inline-block' }}
          >
            Download Split PDF
          </a>
        </div>
      )}

      {pageLinks.length > 0 && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Extracted Pages ({pageLinks.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
            {pageLinks.map((link) => (
              <a
                key={link.pageNumber}
                href={link.url}
                download={`${file?.name.split('.pdf')[0]}_page_${link.pageNumber}.pdf`}
                className="btn btn-secondary"
                style={{ textAlign: 'center', padding: '8px', fontSize: '0.8125rem' }}
              >
                Page {link.pageNumber} ⬇
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. PDF METADATA VIEW/EDIT COMPONENT
// ==========================================
export const PDFMetadataViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    creator: '',
    producer: '',
    keywords: '',
    creationDate: '',
    modificationDate: '',
    pages: 0
  });
  const [saving, setSaving] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setDownloadUrl('');

      try {
        const buffer = await selectedFile.arrayBuffer();
        const pdfBytes = new Uint8Array(buffer);

        const check = await isEncrypted(pdfBytes);
        if (check.encrypted) {
          toast.error('This PDF is password protected. Please unlock it first.');
          setFile(null);
          return;
        }

        const pdf = await PDFDocument.load(pdfBytes);
        
        setMetadata({
          title: pdf.getTitle() || '',
          author: pdf.getAuthor() || '',
          subject: pdf.getSubject() || '',
          creator: pdf.getCreator() || '',
          producer: pdf.getProducer() || '',
          keywords: (pdf.getKeywords() || '').split(';').join(', '),
          creationDate: pdf.getCreationDate()?.toLocaleString() || 'Unknown',
          modificationDate: pdf.getModificationDate()?.toLocaleString() || 'Unknown',
          pages: pdf.getPageCount()
        });
        
        toast.success('PDF metadata loaded successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to parse PDF metadata.');
        setFile(null);
      }
    }
  };

  const handleSave = async () => {
    if (!file) return;
    setSaving(true);
    setDownloadUrl('');

    try {
      const buffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(buffer);
      const pdf = await PDFDocument.load(pdfBytes);

      // Set metadata
      pdf.setTitle(metadata.title);
      pdf.setAuthor(metadata.author);
      pdf.setSubject(metadata.subject);
      pdf.setCreator(metadata.creator);
      pdf.setProducer(metadata.producer);
      pdf.setKeywords(metadata.keywords.split(',').map(s => s.trim()).filter(Boolean));

      const modifiedBytes = await pdf.save();
      const blob = new Blob([modifiedBytes as any], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('Metadata updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update metadata.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Upload PDF File</label>
        <input type="file" accept=".pdf" onChange={handleFile} className="input" style={{ paddingTop: '8px' }} />
      </div>

      {file && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <strong>File Selected:</strong> {file.name} ({formatBytes(file.size)})
          </div>

          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <div>
              <label className="label">Document Title</label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                className="input"
              />
            </div>
            
            <div>
              <label className="label">Author</label>
              <input
                type="text"
                value={metadata.author}
                onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Subject</label>
              <input
                type="text"
                value={metadata.subject}
                onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Keywords (comma separated)</label>
              <input
                type="text"
                value={metadata.keywords}
                onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Application Creator</label>
              <input
                type="text"
                value={metadata.creator}
                onChange={(e) => setMetadata({ ...metadata, creator: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">PDF Producer</label>
              <input
                type="text"
                value={metadata.producer}
                onChange={(e) => setMetadata({ ...metadata, producer: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <hr style={{ borderColor: 'var(--color-border)', margin: '4px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>
            <div><strong>Total Pages:</strong> {metadata.pages}</div>
            <div><strong>Creation Date:</strong> {metadata.creationDate}</div>
            <div><strong>Modification Date:</strong> {metadata.modificationDate}</div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
          >
            {saving ? 'Saving...' : 'Save & Compile PDF'}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="card" style={{ padding: '1.25rem', borderColor: 'var(--color-success)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-success)' }}>
            ✓ Metadata Updated Successfully!
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: '4px 0 12px 0' }}>
            Click the download link below to save the PDF with edited properties.
          </p>
          <a
            href={downloadUrl}
            download={`${file?.name.split('.pdf')[0]}_metadata.pdf`}
            className="btn btn-primary"
            style={{ display: 'inline-block' }}
          >
            Download Updated PDF
          </a>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. JPG/PNG TO PDF COMPONENT
// ==========================================
interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  size: number;
}

export const ImageToPDF: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');
  const [orientation, setOrientation] = useState<'Portrait' | 'Landscape'>('Portrait');
  const [margin, setMargin] = useState<'None' | 'Small' | 'Large'>('None');
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems: ImageItem[] = Array.from(e.target.files).map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        previewUrl: URL.createObjectURL(f),
        size: f.size
      }));
      setImages((prev) => [...prev, ...newItems]);
      setDownloadUrl('');
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
    setDownloadUrl('');
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setImages(updated);
    setDownloadUrl('');
  };

  const convert = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least 1 image!');
      return;
    }
    setConverting(true);
    setDownloadUrl('');

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const buffer = await item.file.arrayBuffer();
        const imgBytes = new Uint8Array(buffer);

        let img;
        if (item.file.type === 'image/png' || item.file.name.toLowerCase().endsWith('.png')) {
          img = await pdfDoc.embedPng(imgBytes);
        } else {
          // Treat as JPG/JPEG
          img = await pdfDoc.embedJpg(imgBytes);
        }

        const { width: imgWidth, height: imgHeight } = img.scale(1);

        // Standard size sizes in points (72 points = 1 inch)
        let pageWidth = imgWidth;
        let pageHeight = imgHeight;

        if (pageSize === 'A4') {
          pageWidth = 595.28;
          pageHeight = 841.89;
        } else if (pageSize === 'Letter') {
          pageWidth = 612;
          pageHeight = 792;
        }

        if (pageSize !== 'Fit' && orientation === 'Landscape') {
          const temp = pageWidth;
          pageWidth = pageHeight;
          pageHeight = temp;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        let marginSize = 0;
        if (margin === 'Small') marginSize = 10;
        else if (margin === 'Large') marginSize = 30;

        const usableWidth = pageWidth - (marginSize * 2);
        const usableHeight = pageHeight - (marginSize * 2);

        // Aspect ratio calculations
        const widthRatio = usableWidth / imgWidth;
        const heightRatio = usableHeight / imgHeight;
        const scaleFactor = pageSize === 'Fit' ? 1 : Math.min(widthRatio, heightRatio);

        const drawWidth = imgWidth * scaleFactor;
        const drawHeight = imgHeight * scaleFactor;

        // Center inside page
        const x = marginSize + (usableWidth - drawWidth) / 2;
        const y = marginSize + (usableHeight - drawHeight) / 2;

        page.drawImage(img, {
          x,
          y,
          width: drawWidth,
          height: drawHeight
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('Images converted to PDF successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Image to PDF conversion failed.');
    } finally {
      setConverting(false);
    }
  };

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Upload Images (JPG, JPEG, PNG)</label>
        <input type="file" accept="image/png, image/jpeg, image/jpg" multiple onChange={handleImages} className="input" style={{ paddingTop: '8px' }} />
      </div>

      {images.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <strong>Images Uploaded:</strong> {images.length}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {images.map((item, index) => (
              <div
                key={item.id}
                style={{
                  width: '120px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  position: 'relative'
                }}
              >
                <img
                  src={item.previewUrl}
                  alt="thumbnail"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)'
                  }}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--color-fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px', textAlign: 'center' }}>
                  {item.file.name}
                </div>
                
                <div style={{ display: 'flex', gap: '4px', width: '100%', justifyContent: 'center' }}>
                  <button
                    disabled={index === 0}
                    onClick={() => moveImage(index, 'up')}
                    className="btn btn-secondary"
                    style={{ padding: '2px 6px', fontSize: '0.65rem' }}
                  >
                    ◀
                  </button>
                  <button
                    disabled={index === images.length - 1}
                    onClick={() => moveImage(index, 'down')}
                    className="btn btn-secondary"
                    style={{ padding: '2px 6px', fontSize: '0.65rem' }}
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => removeImage(item.id)}
                    className="btn btn-secondary"
                    style={{ padding: '2px 6px', fontSize: '0.65rem', color: 'var(--color-danger, red)' }}
                  >
                    ✖
                  </button>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 600
                  }}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          <hr style={{ borderColor: 'var(--color-border)', margin: '4px 0' }} />

          <div className="grid-cols-3" style={{ gap: '1rem' }}>
            <div>
              <label className="label">Page Size</label>
              <select value={pageSize} onChange={(e) => setPageSize(e.target.value as any)} className="input">
                <option value="A4">A4 Standard</option>
                <option value="Letter">US Letter</option>
                <option value="Fit">Fit to Image Size</option>
              </select>
            </div>

            <div>
              <label className="label">Page Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="input"
                disabled={pageSize === 'Fit'}
              >
                <option value="Portrait">Portrait</option>
                <option value="Landscape">Landscape</option>
              </select>
            </div>

            <div>
              <label className="label">Margins</label>
              <select value={margin} onChange={(e) => setMargin(e.target.value as any)} className="input">
                <option value="None">None (Full Page Image)</option>
                <option value="Small">Small (10px)</option>
                <option value="Large">Large (30px)</option>
              </select>
            </div>
          </div>

          <button
            onClick={convert}
            disabled={converting}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
          >
            {converting ? 'Converting Images...' : 'Convert to PDF'}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="card" style={{ padding: '1.25rem', borderColor: 'var(--color-success)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-success)' }}>
            ✓ Conversion Complete!
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: '4px 0 12px 0' }}>
            All images have been successfully compiled into a single PDF document.
          </p>
          <a
            href={downloadUrl}
            download="images_converted.pdf"
            className="btn btn-primary"
            style={{ display: 'inline-block' }}
          >
            Download PDF File
          </a>
        </div>
      )}
    </div>
  );
};
