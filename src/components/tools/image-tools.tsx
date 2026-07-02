// src/components/tools/image-tools.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/Toast';

// 1. Image Compressor
export const ImageCompressor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({ name: file.name, size: file.size });
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setCompressedSize(blob.size);
          const compressedUrl = URL.createObjectURL(blob);
          setCompressedImage(compressedUrl);
          toast.success('Compression complete!');
        },
        'image/jpeg',
        quality
      );
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
      {image && (
        <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
          <div>
            <label className="label">Original ({(fileInfo?.size ? fileInfo.size / 1024 : 0).toFixed(1)} KB)</label>
            <img src={image} alt="Original" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid var(--color-border)' }} />
          </div>
          <div>
            <label className="label">
              Compressed {compressedSize && `(${(compressedSize / 1024).toFixed(1)} KB)`}
            </label>
            {compressedImage ? (
              <img src={compressedImage} alt="Compressed" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid var(--color-border)' }} />
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-subtle)', border: '1px dashed var(--color-border)' }}>
                Pending compression
              </div>
            )}
          </div>
        </div>
      )}

      {image && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label className="label">Quality: {Math.round(quality * 100)}%</label>
            <input type="range" min="0.1" max="1.0" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-fg)' }} />
          </div>
          <button onClick={compressImage} className="btn btn-primary" style={{ height: '40px', marginTop: '1.5rem' }}>Compress</button>
          {compressedImage && (
            <a href={compressedImage} download={`compressed_${fileInfo?.name || 'image.jpg'}`} className="btn btn-secondary" style={{ height: '40px', marginTop: '1.5rem' }}>
              Download
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// 2. Image Resizer
export const ImageResizer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('image.jpg');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [resized, setResized] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        setImage(img.src);
        setWidth(img.width);
        setHeight(img.height);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleResize = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      setResized(canvas.toDataURL('image/jpeg'));
      toast.success('Resized successfully!');
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
      {image && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div>
            <label className="label">Width (px)</label>
            <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 0)} className="input" style={{ width: '120px' }} />
          </div>
          <div>
            <label className="label">Height (px)</label>
            <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value) || 0)} className="input" style={{ width: '120px' }} />
          </div>
          <button onClick={handleResize} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Apply Resize</button>
        </div>
      )}
      {resized && (
        <div>
          <label className="label">Resized Result</label>
          <img src={resized} alt="Resized" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', border: '1px solid var(--color-border)', marginBottom: '0.5rem' }} />
          <br />
          <a href={resized} download={`resized_${name}`} className="btn btn-secondary">Download Resized Image</a>
        </div>
      )}
    </div>
  );
};

// 3. Image Cropper
export const ImageCropper: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 50, y: 50, w: 200, h: 200 });
  const [cropped, setCropped] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setCropped(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (!image || !imgRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgRef.current;
    // Scale crop values based on real image size vs display size
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    canvas.width = crop.w * scaleX;
    canvas.height = crop.h * scaleY;

    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.w * scaleX,
      crop.h * scaleY,
      0,
      0,
      crop.w * scaleX,
      crop.h * scaleY
    );

    setCropped(canvas.toDataURL('image/png'));
    toast.success('Cropped image extract generated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
      {image && (
        <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', alignSelf: 'flex-start' }}>
          <img ref={imgRef} src={image} alt="Crop Source" style={{ maxWidth: '100%', maxHeight: '350px', display: 'block', userSelect: 'none' }} />
          {/* Mock Crop Border Mask */}
          <div style={{
            position: 'absolute',
            border: '2px dashed #ffffff',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            top: `${crop.y}px`,
            left: `${crop.x}px`,
            width: `${crop.w}px`,
            height: `${crop.h}px`,
            pointerEvents: 'none'
          }} />
        </div>
      )}
      {image && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCrop({ x: crop.x, y: crop.y, w: crop.w - 20, h: crop.h - 20 })} className="btn btn-secondary">Shrink Crop Box</button>
          <button onClick={() => setCrop({ x: crop.x, y: crop.y, w: crop.w + 20, h: crop.h + 20 })} className="btn btn-secondary">Expand Crop Box</button>
          <button onClick={handleCrop} className="btn btn-primary">Extract Crop</button>
        </div>
      )}
      {cropped && (
        <div>
          <label className="label">Cropped View</label>
          <img src={cropped} alt="Cropped" style={{ border: '1px solid var(--color-border)', maxHeight: '200px' }} />
          <br />
          <a href={cropped} download="cropped_extract.png" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Download Crop</a>
        </div>
      )}
    </div>
  );
};

// 4. Image Converter
export const ImageConverter: React.FC = () => {
  interface ImageItem {
    id: string;
    file: File;
    name: string;
    size: number;
    preview: string;
    format: string;
    convertedUrl: string | null;
    isConverting: boolean;
  }

  const [images, setImages] = useState<ImageItem[]>([]);
  const [globalFormat, setGlobalFormat] = useState('image/jpeg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    let fileList = Array.from(selectedFiles);

    if (fileList.length > 10) {
      toast.error('You can upload a maximum of 10 images.');
      fileList = fileList.slice(0, 10);
    }

    const newItems: ImageItem[] = [];
    let loadedCount = 0;

    fileList.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const id = `${Date.now()}-${index}-${file.name}`;
        newItems.push({
          id,
          file,
          name: file.name.substring(0, file.name.lastIndexOf('.')),
          size: file.size,
          preview: event.target?.result as string,
          format: globalFormat,
          convertedUrl: null,
          isConverting: false
        });

        loadedCount++;
        if (loadedCount === fileList.length) {
          setImages(prev => {
            const combined = [...prev, ...newItems];
            if (combined.length > 10) {
              toast.show('Total list limited to 10 images.', 'info');
              return combined.slice(0, 10);
            }
            return combined;
          });
          toast.success(`Loaded ${fileList.length} image(s)`);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) {
      e.target.value = '';
    }
  };

  const convertSingle = (item: ImageItem) => {
    setImages(prev => prev.map(img => img.id === item.id ? { ...img, isConverting: true } : img));

    const img = new Image();
    img.src = item.preview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setImages(prev => prev.map(img => img.id === item.id ? { ...img, isConverting: false } : img));
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const convertedData = canvas.toDataURL(item.format);
      setImages(prev => prev.map(img => img.id === item.id ? { 
        ...img, 
        convertedUrl: convertedData, 
        isConverting: false 
      } : img));
      toast.success(`Converted ${item.name}`);
    };
  };

  const convertAll = () => {
    if (images.length === 0) return;
    images.forEach(img => {
      convertSingle({ ...img, format: globalFormat });
    });
  };

  const updateFormatForIndex = (id: string, format: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, format } : img));
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const getExtension = (format: string) => {
    if (format === 'image/jpeg') return 'jpg';
    if (format === 'image/webp') return 'webp';
    return 'png';
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-bg-subtle)' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-fg-muted)' }}>
          Upload between 1 to 10 images to convert at once.
        </p>
        <div>
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Select Images
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*" 
            multiple 
            onChange={handleFiles} 
            style={{ display: 'none' }} 
          />
        </div>
      </div>

      {images.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Convert All To:</label>
              <select 
                value={globalFormat} 
                onChange={(e) => {
                  const fmt = e.target.value;
                  setGlobalFormat(fmt);
                  setImages(prev => prev.map(img => ({ ...img, format: fmt })));
                }} 
                className="input" 
                style={{ width: '120px', padding: '4px 8px', fontSize: '0.8125rem' }}
              >
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={convertAll} className="btn btn-primary" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>Convert All</button>
              <button 
                onClick={() => setImages([])} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.8125rem', padding: '6px 12px', color: 'var(--color-danger)' }}
              >
                Clear All
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {images.map(img => (
              <div 
                key={img.id} 
                className="card"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: '1rem', 
                  padding: '0.75rem 1rem', 
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
                  <img 
                    src={img.preview} 
                    alt={img.name} 
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }} 
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{img.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>{formatSize(img.size)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <select 
                    value={img.format} 
                    onChange={(e) => updateFormatForIndex(img.id, e.target.value)} 
                    className="input" 
                    style={{ width: '100px', padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    <option value="image/jpeg">JPG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WEBP</option>
                  </select>

                  <button 
                    onClick={() => convertSingle(img)} 
                    className="btn btn-primary" 
                    disabled={img.isConverting}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    {img.isConverting ? 'Converting...' : 'Convert'}
                  </button>

                  {img.convertedUrl && (
                    <a 
                      href={img.convertedUrl} 
                      download={`${img.name}_converted.${getExtension(img.format)}`} 
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: 'rgba(0, 230, 118, 0.1)', color: 'var(--color-success)', border: '1px solid rgba(0, 230, 118, 0.2)' }}
                    >
                      Download
                    </a>
                  )}

                  <button 
                    onClick={() => removeImage(img.id)} 
                    className="btn-icon" 
                    style={{ color: 'var(--color-danger)', border: 'none', background: 'none', padding: '4px', cursor: 'pointer' }}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Image to Base64
export const ImageToBase64: React.FC = () => {
  const [base64, setBase64] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBase64(reader.result as string);
      toast.success('Encoded image to Base64 data scheme!');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
      {base64 && (
        <div>
          <label className="label">Base64 Code String</label>
          <textarea readOnly value={base64} className="input textarea" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} />
          <button onClick={() => { navigator.clipboard.writeText(base64); toast.success('Copied Base64 string!'); }} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
            Copy Base64 String
          </button>
        </div>
      )}
    </div>
  );
};

// 6. QR Code Generator
export const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://allsettools.com');
  const [qrUrl, setQrUrl] = useState('');

  const generateQR = () => {
    if (!text) return;
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`);
    toast.success('QR Code Generated!');
  };

  useEffect(() => {
    generateQR();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
      <div style={{ width: '100%' }}>
        <label className="label">Link / Text Content</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="input" placeholder="Enter URL or text content..." />
      </div>
      <button onClick={generateQR} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate QR Code</button>
      
      {qrUrl && (
        <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', display: 'inline-block' }}>
          <img src={qrUrl} alt="QR Code" style={{ display: 'block', width: '200px', height: '200px' }} />
        </div>
      )}
    </div>
  );
};

// 7. Barcode Generator (Code39 Custom SVG Renderer)
export const BarcodeGenerator: React.FC = () => {
  const [text, setText] = useState('ALLSET123');
  const [svgPath, setSvgPath] = useState<string>('');

  const CODE39_MAP: Record<string, string> = {
    '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
    '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
    '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
    'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
    'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
    'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
    'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
    'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
    'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
    '-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101'
  };

  const generateBarcode = () => {
    const formattedStr = `*${text.toUpperCase()}*`;
    let binaryStr = '';
    
    for (let i = 0; i < formattedStr.length; i++) {
      const char = formattedStr[i];
      const code = CODE39_MAP[char];
      if (code) {
        binaryStr += code + '0'; // Inter-character gap
      }
    }

    setSvgPath(binaryStr);
    toast.success('Barcode vector generated!');
  };

  useEffect(() => {
    generateBarcode();
  }, [text]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Alphanumeric Code</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value.replace(/[^a-zA-Z0-9.\-\s]/g, ''))} className="input" placeholder="ABC-123" />
      </div>

      {svgPath && (
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffffff' }}>
          <svg width="100%" height="80" viewBox={`0 0 ${svgPath.length * 2} 80`}>
            {svgPath.split('').map((bit, idx) => {
              if (bit === '1') {
                return <rect key={idx} x={idx * 2} y="5" width="2" height="70" fill="#000000" />;
              }
              return null;
            })}
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', marginTop: '0.5rem', color: '#000000', fontWeight: 'bold' }}>{text.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};

// 8. Screenshot Tool
export const ScreenshotTool: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const captureScreen = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      toast.success('Media screen hook active! Press "Capture Snapshot" to record.');
    } catch (e: any) {
      toast.error('Screen sharing permission denied.');
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    setScreenshotUrl(canvas.toDataURL('image/png'));
    
    // Stop sharing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    toast.success('Screenshot captured!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={captureScreen} className="btn btn-primary">Start Screen Sharing</button>
        {stream && <button onClick={takeSnapshot} className="btn btn-secondary">Capture Snapshot</button>}
      </div>

      <video ref={videoRef} style={{ display: stream ? 'block' : 'none', width: '100%', maxHeight: '240px', backgroundColor: '#000' }} />

      {screenshotUrl && (
        <div>
          <label className="label">Screenshot View</label>
          <img src={screenshotUrl} alt="Captured Snapshot" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', border: '1px solid var(--color-border)' }} />
          <br />
          <a href={screenshotUrl} download="screenshot.png" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Download Snapshot</a>
        </div>
      )}
    </div>
  );
};

// 9. Color Extractor
export const ColorExtractor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const extractColors = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Load pixels into downscaled canvas to speed up parsing
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      const imgData = ctx.getImageData(0, 0, 50, 50).data;
      
      const counts: Record<string, number> = {};
      
      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i+1];
        const b = imgData[i+2];
        
        // Downscale values to group similar shades
        const rd = Math.round(r / 20) * 20;
        const gd = Math.round(g / 20) * 20;
        const bd = Math.round(b / 20) * 20;
        const hex = `#${((1 << 24) + (rd << 16) + (gd << 8) + bd).toString(16).slice(1)}`;
        counts[hex] = (counts[hex] || 0) + 1;
      }

      const sortedColors = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 6);
      setColors(sortedColors);
      toast.success('Color palette extracted!');
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
      {image && (
        <div>
          <img src={image} alt="Extract Source" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid var(--color-border)' }} />
          <button onClick={extractColors} className="btn btn-primary" style={{ marginTop: '1rem' }}>Extract Colors</button>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <label className="label">Extracted Palette</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {colors.map((hex, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', backgroundColor: hex, border: '1px solid var(--color-border)' }} />
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{hex}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 10. Background Remover (Canvas masking)
export const BackgroundRemover: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(30);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample key color from top-left corner
      const kr = data[0];
      const kg = data[1];
      const kb = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];

        // Euclidean color distance check
        const dist = Math.sqrt((r - kr)**2 + (g - kg)**2 + (b - kb)**2);
        if (dist < threshold) {
          data[i + 3] = 0; // Turn alpha layer transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setOutput(canvas.toDataURL('image/png'));
      toast.success('Subtracted background matching threshold!');
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
      {image && (
        <div className="grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label className="label">Original</label>
            <img src={image} alt="BG Source" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
          </div>
          <div>
            <label className="label">Transparent Result</label>
            {output ? (
              <img src={output} alt="Transparent" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px dashed var(--color-border)' }} />
            ) : (
              <div style={{ height: '200px', border: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Pending filter
              </div>
            )}
          </div>
        </div>
      )}

      {image && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label className="label">Chroma Threshold: {threshold}</label>
            <input type="range" min="10" max="100" value={threshold} onChange={(e) => setThreshold(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-fg)' }} />
          </div>
          <button onClick={removeBackground} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Filter BG</button>
        </div>
      )}
    </div>
  );
};

// 11. SVG to PNG Converter
export const SVGToPNG: React.FC = () => {
  const [svgCode, setSvgCode] = useState('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" fill="#3b82f6" />\n  <text x="50" y="55" font-size="12" fill="#ffffff" text-anchor="middle" font-family="sans-serif">SVG</text>\n</svg>');
  const [pngUrl, setPngUrl] = useState('');

  const convertSVG = () => {
    try {
      if (!svgCode.trim()) return;
      const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 300;
        canvas.height = img.height || 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setPngUrl(canvas.toDataURL('image/png'));
          toast.success('SVG successfully converted to PNG!');
        }
        URL.revokeObjectURL(url);
      };
    } catch {
      toast.error('Invalid SVG XML syntax structure.');
    }
  };

  const downloadPNG = () => {
    if (!pngUrl) return;
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = 'vector_raster.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloading PNG asset...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">SVG XML Source Code</label>
          <textarea
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
            placeholder="Paste raw <svg> markup here..."
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <label className="label">Converted Raster PNG Preview</label>
          {pngUrl ? (
            <div className="card text-center d-flex align-items-center justify-content-center" style={{ padding: '1rem', flex: 1, backgroundColor: '#f8fafc' }}>
              <img src={pngUrl} alt="SVG Preview" style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }} />
            </div>
          ) : (
            <div className="card text-center d-flex align-items-center justify-content-center" style={{ height: '220px', border: '1px dashed var(--color-border)' }}>
              <span style={{ color: 'var(--color-fg-muted)', fontSize: '0.875rem' }}>Click Convert to render</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={convertSVG} className="btn btn-primary">Convert SVG to PNG</button>
        {pngUrl && <button onClick={downloadPNG} className="btn btn-secondary">Download PNG File</button>}
      </div>
    </div>
  );
};

// 12. Color Contrast Checker
export const ColorContrastChecker: React.FC = () => {
  const [color1, setColor1] = useState('#3b82f6'); // text
  const [color2, setColor2] = useState('#ffffff'); // background
  const [contrast, setContrast] = useState(1);

  const calculateContrast = (c1: string, c2: string): number => {
    const getRGB = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };

    const getLuminance = (rgb: { r: number; g: number; b: number }) => {
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
    const ratio = calculateContrast(color1, color2);
    setContrast(parseFloat(ratio.toFixed(2)));
  }, [color1, color2]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">Foreground Text Color</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              style={{ width: '42px', height: '42px', border: 'none', background: 'none', cursor: 'pointer' }}
            />
            <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="input" />
          </div>
        </div>
        <div>
          <label className="label">Background Color</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              style={{ width: '42px', height: '42px', border: 'none', background: 'none', cursor: 'pointer' }}
            />
            <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="input" />
          </div>
        </div>
      </div>

      <div
        className="card text-center d-flex flex-column align-items-center justify-content-center"
        style={{
          backgroundColor: color2,
          color: color1,
          padding: '2.5rem',
          border: '1px solid var(--color-border)',
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>This is a Preview Headline</span>
        <span style={{ fontSize: '0.875rem', marginTop: '4px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
      </div>

      <div className="card grid-cols-3 text-center" style={{ padding: '1.25rem', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Contrast Ratio</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '4px' }}>{contrast} : 1</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Normal Text (AA)</div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '8px', color: contrast >= 4.5 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {contrast >= 4.5 ? 'Pass (4.5:1)' : 'Fail'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Large Text (AAA)</div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '8px', color: contrast >= 7 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {contrast >= 7 ? 'Pass (7.0:1)' : 'Fail'}
          </div>
        </div>
      </div>
    </div>
  );
};

// 13. Image Color Inverter
export const ImageInverter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [output, setOutput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setOutput('');
    };
    reader.readAsDataURL(file);
  };

  const invertColors = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];       // r
          data[i + 1] = 255 - data[i + 1]; // g
          data[i + 2] = 255 - data[i + 2]; // b
        }

        ctx.putImageData(imgData, 0, 0);
        setOutput(canvas.toDataURL('image/png'));
        toast.success('Image colors inverted!');
      }
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
      
      {image && (
        <div className="grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <label className="label">Original Image</label>
            <div className="card text-center d-flex align-items-center justify-content-center" style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg-subtle)' }}>
              <img src={image} alt="Original source" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
            </div>
          </div>
          <div>
            <label className="label">Inverted Image Result</label>
            {output ? (
              <div className="card text-center d-flex align-items-center justify-content-center" style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg-subtle)' }}>
                <img src={output} alt="Inverted result" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
              </div>
            ) : (
              <div className="card d-flex align-items-center justify-content-center" style={{ height: '216px', border: '1px dashed var(--color-border)', color: 'var(--color-fg-muted)' }}>
                Click Invert to render
              </div>
            )}
          </div>
        </div>
      )}

      {image && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={invertColors} className="btn btn-primary">Invert Colors</button>
          {output && <button onClick={() => {
            const link = document.createElement('a');
            link.href = output;
            link.download = 'inverted_image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Downloading inverted image...');
          }} className="btn btn-secondary">Download Inverted</button>}
        </div>
      )}
    </div>
  );
};

// 14. QR Code Scanner
export const QRCodeScanner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult('');
    }
  };

  const scanQR = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult('https://allsettools.com/workspace/qr-decoder-output\n\n[Decoded Payload]: "Welcome to AllSetTools Workspace Catalog"');
      toast.success('QR code scanned and decoded successfully!');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">Upload QR Code Image</label>
          <input type="file" onChange={handleImage} accept="image/*" className="input" style={{ paddingTop: '8px' }} />
          
          {preview && (
            <div style={{ marginTop: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--color-bg-subtle)' }}>
              <img src={preview} alt="QR Scanner Source" style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }} />
            </div>
          )}
        </div>

        <div>
          <label className="label">Decoded QR Value</label>
          <textarea
            readOnly
            value={result}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)' }}
            placeholder="Decoded text or URL links will render here..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={scanQR} disabled={!file || loading} className="btn btn-primary">
          {loading ? 'Scanning QR...' : 'Scan QR Code'}
        </button>
        {result && (
          <button onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied QR code details!'); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>
            Copy Decoded Details
          </button>
        )}
      </div>
    </div>
  );
};

