// src/components/tools/video-tools.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/Toast';

// Helper: Convert AudioBuffer to WAV blob
const bufferToWav = (buffer: AudioBuffer): Blob => {
  const numOfChan = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  let result;
  if (numOfChan === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }
  
  const bufferArr = new ArrayBuffer(44 + result.length * 2);
  const view = new DataView(bufferArr);
  
  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + result.length * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, format, true);
  // channel count
  view.setUint16(22, numOfChan, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numOfChan * (bitDepth / 8), true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numOfChan * (bitDepth / 8), true);
  // bits per sample
  view.setUint16(34, bitDepth, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // chunk length
  view.setUint32(40, result.length * 2, true);
  
  // write PCM audio samples
  floatTo16BitPCM(view, 44, result);
  
  return new Blob([bufferArr], { type: 'audio/wav' });
};

const interleave = (inputL: Float32Array, inputR: Float32Array): Float32Array => {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);
  let index = 0;
  let inputIndex = 0;
  
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
};

const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

// Canvas Video Recorder utility class
class CanvasVideoRecorder {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private video: HTMLVideoElement;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private fps = 30;
  private animationId = 0;
  private isProcessing = false;
  
  constructor(video: HTMLVideoElement) {
    this.video = video;
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Could not create canvas context');
    this.ctx = context;
  }
  
  public start(
    options: {
      width: number;
      height: number;
      bitrate: number;
      rotation?: number; // 90, 180, 270
      crop?: { x: number; y: number; w: number; h: number };
      speed?: number;
      startTime?: number;
      endTime?: number;
      onProgress?: (progress: number) => void;
      onComplete?: (blob: Blob) => void;
    }
  ) {
    const { width, height, bitrate, rotation = 0, crop, speed = 1.0, startTime = 0, endTime = this.video.duration, onProgress, onComplete } = options;
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    const stream = this.canvas.captureStream(this.fps);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: bitrate
    });
    
    this.recordedChunks = [];
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    };
    
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      if (onComplete) onComplete(blob);
    };
    
    this.video.currentTime = startTime;
    this.video.playbackRate = speed;
    this.isProcessing = true;
    
    this.mediaRecorder.start();
    this.video.play();
    
    const renderLoop = () => {
      if (!this.isProcessing) return;
      
      const currentTime = this.video.currentTime;
      if (currentTime >= endTime || this.video.paused || this.video.ended) {
        this.stop();
        return;
      }
      
      if (onProgress) {
        const total = endTime - startTime;
        const current = currentTime - startTime;
        onProgress(Math.min(100, Math.floor((current / total) * 100)));
      }
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      
      if (rotation !== 0) {
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate((rotation * Math.PI) / 180);
        this.ctx.drawImage(
          this.video,
          -this.canvas.height / 2,
          -this.canvas.width / 2,
          this.canvas.height,
          this.canvas.width
        );
      } else if (crop) {
        this.ctx.drawImage(
          this.video,
          crop.x,
          crop.y,
          crop.w,
          crop.h,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      } else {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      }
      
      this.ctx.restore();
      this.animationId = requestAnimationFrame(renderLoop);
    };
    
    renderLoop();
  }
  
  public stop() {
    if (!this.isProcessing) return;
    this.isProcessing = false;
    cancelAnimationFrame(this.animationId);
    this.video.pause();
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
}

// Common file picker styling
const FilePicker: React.FC<{
  accept: string;
  onChange: (file: File) => void;
  label: string;
}> = ({ accept, onChange, label }) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: '2px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: 'var(--color-bg-subtle)'
      }}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.onchange = (e: any) => {
          if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
          }
        };
        input.click();
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📁</div>
      <p style={{ fontWeight: 500, margin: 0 }}>{label}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', marginTop: '4px' }}>Drag & drop or click to upload</p>
    </div>
  );
};

// ==========================================
// 1. VIDEO COMPRESSOR
// ==========================================
export const VideoCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(0.75); // 75% size
  const [bitrate, setBitrate] = useState(1000000); // 1 Mbps
  const [progress, setProgress] = useState(-1);
  const [outputUrl, setOutputUrl] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<CanvasVideoRecorder | null>(null);

  const startCompression = () => {
    if (!videoRef.current || !file) return;
    
    const video = videoRef.current;
    setProgress(0);
    
    const targetW = video.videoWidth * scale;
    const targetH = video.videoHeight * scale;
    
    const recorder = new CanvasVideoRecorder(video);
    recorderRef.current = recorder;
    
    recorder.start({
      width: targetW,
      height: targetH,
      bitrate,
      onProgress: (p) => setProgress(p),
      onComplete: (blob) => {
        setOutputUrl(URL.createObjectURL(blob));
        setProgress(-1);
        toast.success('Compression completed!');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="video/*" label="Select video to compress" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                controls
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Compression Settings</h3>
              
              <div>
                <label className="label">Resolution Scale ({Math.round(scale * 100)}%)</label>
                <input
                  type="range"
                  min="0.25"
                  max="1.0"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="label">Target Bitrate</label>
                <select value={bitrate} onChange={(e) => setBitrate(parseInt(e.target.value))} className="input">
                  <option value="500000">500 Kbps (Very Small Size / Low Quality)</option>
                  <option value="1000000">1 Mbps (Standard Web / Medium Quality)</option>
                  <option value="2000000">2 Mbps (High Quality)</option>
                  <option value="4000000">4 Mbps (HD Quality)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                {progress === -1 ? (
                  <button onClick={startCompression} className="btn btn-primary">Compress Video</button>
                ) : (
                  <button onClick={() => { recorderRef.current?.stop(); setProgress(-1); }} className="btn btn-secondary" style={{ color: 'var(--color-danger, red)' }}>
                    Stop Compression ({progress}%)
                  </button>
                )}
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Compressed Output</h4>
              <video src={outputUrl} controls style={{ maxWidth: '400px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="compressed_video.webm" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download WebM Video
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. VIDEO CONVERTER
// ==========================================
export const VideoConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('webm'); // WebM is the main client format recorder
  const [progress, setProgress] = useState(-1);
  const [outputUrl, setOutputUrl] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<CanvasVideoRecorder | null>(null);

  const convert = () => {
    if (!videoRef.current || !file) return;
    setProgress(0);
    const video = videoRef.current;
    const recorder = new CanvasVideoRecorder(video);
    recorderRef.current = recorder;
    
    recorder.start({
      width: video.videoWidth,
      height: video.videoHeight,
      bitrate: 2000000,
      onProgress: (p) => setProgress(p),
      onComplete: (blob) => {
        setOutputUrl(URL.createObjectURL(blob));
        setProgress(-1);
        toast.success('Conversion completed!');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="video/*" label="Select video to convert" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                controls
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Convert Format</h3>
              
              <div>
                <label className="label">Export Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="input">
                  <option value="webm">WebM (Highly Optimized for Web Platforms)</option>
                  <option value="mp4">MP4 (Saves as WebM stream container extension)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                {progress === -1 ? (
                  <button onClick={convert} className="btn btn-primary">Convert Video</button>
                ) : (
                  <button onClick={() => { recorderRef.current?.stop(); setProgress(-1); }} className="btn btn-secondary" style={{ color: 'var(--color-danger, red)' }}>
                    Stop Conversion ({progress}%)
                  </button>
                )}
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Converted Video Preview</h4>
              <video src={outputUrl} controls style={{ maxWidth: '400px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download={`converted_video.${format}`} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Converted Video
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. VIDEO TRIMMER
// ==========================================
export const VideoTrimmer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(-1);
  const [outputUrl, setOutputUrl] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<CanvasVideoRecorder | null>(null);

  useEffect(() => {
    if (file) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        setDuration(video.duration);
        setEndTime(Math.min(10, video.duration));
      };
    }
  }, [file]);

  const trim = () => {
    if (!videoRef.current || !file) return;
    setProgress(0);
    const video = videoRef.current;
    const recorder = new CanvasVideoRecorder(video);
    recorderRef.current = recorder;
    
    recorder.start({
      width: video.videoWidth,
      height: video.videoHeight,
      bitrate: 2000000,
      startTime,
      endTime,
      onProgress: (p) => setProgress(p),
      onComplete: (blob) => {
        setOutputUrl(URL.createObjectURL(blob));
        setProgress(-1);
        toast.success('Trim completed!');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="video/*" label="Select video to trim" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                controls
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Set Trim Range (Seconds)</h3>
              
              <div>
                <label className="label">Start Time: {startTime.toFixed(1)}s</label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => setStartTime(Math.min(parseFloat(e.target.value), endTime - 0.5))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="label">End Time: {endTime.toFixed(1)}s</label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => setEndTime(Math.max(parseFloat(e.target.value), startTime + 0.5))}
                  style={{ width: '100%' }}
                />
              </div>

              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-fg-muted)' }}>
                Trim duration: {(endTime - startTime).toFixed(1)}s
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                {progress === -1 ? (
                  <button onClick={trim} className="btn btn-primary">Trim Video</button>
                ) : (
                  <button onClick={() => { recorderRef.current?.stop(); setProgress(-1); }} className="btn btn-secondary" style={{ color: 'var(--color-danger, red)' }}>
                    Stop Trim ({progress}%)
                  </button>
                )}
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Trimmed Segment Preview</h4>
              <video src={outputUrl} controls style={{ maxWidth: '400px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="trimmed_video.webm" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Trimmed Clip
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. VIDEO MERGER
// ==========================================
export const VideoMerger: React.FC = () => {
  const [videoList, setVideoList] = useState<{ id: string; file: File; name: string }[]>([]);
  const [progress, setProgress] = useState(-1);
  const [outputUrl, setOutputUrl] = useState('');
  
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<CanvasVideoRecorder | null>(null);

  const addVideo = (file: File) => {
    setVideoList([...videoList, { id: Math.random().toString(), file, name: file.name }]);
  };

  const removeVideo = (id: string) => {
    setVideoList(videoList.filter((item) => item.id !== id));
  };

  const startMerge = async () => {
    if (videoList.length < 2) {
      toast.error('Please upload at least 2 videos to merge!');
      return;
    }
    
    setProgress(0);
    
    // Process sequential merging by recording canvas frames
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Use sizing dimensions from the first video
    const sampleVideo = document.createElement('video');
    sampleVideo.src = URL.createObjectURL(videoList[0].file);
    await new Promise((r) => { sampleVideo.onloadedmetadata = r; });
    
    canvas.width = sampleVideo.videoWidth || 640;
    canvas.height = sampleVideo.videoHeight || 480;
    
    const stream = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2000000 });
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    
    recorder.onstop = () => {
      const mergedBlob = new Blob(chunks, { type: 'video/webm' });
      setOutputUrl(URL.createObjectURL(mergedBlob));
      setProgress(-1);
      toast.success('Videos merged successfully!');
    };
    
    recorder.start();
    
    const playVideoSeq = async (idx: number) => {
      if (idx >= videoList.length) {
        recorder.stop();
        return;
      }
      
      setProgress(Math.floor((idx / videoList.length) * 100));
      
      const v = document.createElement('video');
      v.src = URL.createObjectURL(videoList[idx].file);
      v.muted = true;
      v.playsInline = true;
      
      await new Promise((r) => { v.onloadeddata = r; });
      v.play();
      
      const render = () => {
        if (v.paused || v.ended) {
          URL.revokeObjectURL(v.src);
          playVideoSeq(idx + 1);
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(render);
      };
      render();
    };
    
    playVideoSeq(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FilePicker accept="video/*" label="Add video to merge list" onChange={addVideo} />
      
      {videoList.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Merge Queue</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none' }}>
            {videoList.map((item, idx) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <span>{idx + 1}. {item.name}</span>
                <button
                  onClick={() => removeVideo(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-danger, red)',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            {progress === -1 ? (
              <button onClick={startMerge} className="btn btn-primary">Merge Videos</button>
            ) : (
              <button disabled className="btn btn-secondary">Merging ({progress}%)</button>
            )}
            <button onClick={() => { setVideoList([]); setOutputUrl(''); }} className="btn btn-secondary">Clear Queue</button>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Merged Output Preview</h4>
              <video src={outputUrl} controls style={{ maxWidth: '400px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="merged_video.webm" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Merged Video
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. VIDEO CROPPER
// ==========================================
export const VideoCropper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cropRatio, setCropRatio] = useState('1:1');
  const [progress, setProgress] = useState(-1);
  const [outputUrl, setOutputUrl] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<CanvasVideoRecorder | null>(null);

  const startCrop = () => {
    if (!videoRef.current || !file) return;
    
    setProgress(0);
    const video = videoRef.current;
    const recorder = new CanvasVideoRecorder(video);
    recorderRef.current = recorder;
    
    // Set crop boundaries based on aspect ratio
    let cropW = video.videoWidth;
    let cropH = video.videoHeight;
    let cropX = 0;
    let cropY = 0;
    
    if (cropRatio === '1:1') {
      const min = Math.min(video.videoWidth, video.videoHeight);
      cropW = min;
      cropH = min;
      cropX = (video.videoWidth - min) / 2;
      cropY = (video.videoHeight - min) / 2;
    } else if (cropRatio === '16:9') {
      cropH = (video.videoWidth * 9) / 16;
      if (cropH > video.videoHeight) {
        cropH = video.videoHeight;
        cropW = (video.videoHeight * 16) / 9;
      }
      cropX = (video.videoWidth - cropW) / 2;
      cropY = (video.videoHeight - cropH) / 2;
    } else if (cropRatio === '4:3') {
      cropH = (video.videoWidth * 3) / 4;
      if (cropH > video.videoHeight) {
        cropH = video.videoHeight;
        cropW = (video.videoHeight * 4) / 3;
      }
      cropX = (video.videoWidth - cropW) / 2;
      cropY = (video.videoHeight - cropH) / 2;
    }

    recorder.start({
      width: cropW,
      height: cropH,
      bitrate: 2000000,
      crop: { x: cropX, y: cropY, w: cropW, h: cropH },
      onProgress: (p) => setProgress(p),
      onComplete: (blob) => {
        setOutputUrl(URL.createObjectURL(blob));
        setProgress(-1);
        toast.success('Crop completed!');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="video/*" label="Select video to crop" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                controls
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Select Crop Preset</h3>
              
              <div>
                <label className="label">Aspect Ratio</label>
                <select value={cropRatio} onChange={(e) => setCropRatio(e.target.value)} className="input">
                  <option value="1:1">Square (1:1)</option>
                  <option value="16:9">Widescreen (16:9)</option>
                  <option value="4:3">Standard (4:3)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                {progress === -1 ? (
                  <button onClick={startCrop} className="btn btn-primary">Crop Video</button>
                ) : (
                  <button onClick={() => { recorderRef.current?.stop(); setProgress(-1); }} className="btn btn-secondary" style={{ color: 'var(--color-danger, red)' }}>
                    Stop Crop ({progress}%)
                  </button>
                )}
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Cropped Segment Output</h4>
              <video src={outputUrl} controls style={{ maxWidth: '400px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="cropped_video.webm" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Cropped Video
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. VIDEO ROTATOR
// ==========================================
export const VideoRotator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90); // 90 deg default
  const [progress, setProgress] = useState(-1);
  const [outputUrl, setOutputUrl] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<CanvasVideoRecorder | null>(null);

  const rotate = () => {
    if (!videoRef.current || !file) return;
    setProgress(0);
    const video = videoRef.current;
    const recorder = new CanvasVideoRecorder(video);
    recorderRef.current = recorder;
    
    // Swap width and height for 90 or 270 deg rotations
    const is90or270 = rotation === 90 || rotation === 270;
    const w = is90or270 ? video.videoHeight : video.videoWidth;
    const h = is90or270 ? video.videoWidth : video.videoHeight;
    
    recorder.start({
      width: w,
      height: h,
      bitrate: 2000000,
      rotation,
      onProgress: (p) => setProgress(p),
      onComplete: (blob) => {
        setOutputUrl(URL.createObjectURL(blob));
        setProgress(-1);
        toast.success('Rotation completed!');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="video/*" label="Select video to rotate" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                controls
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Rotation Angle</h3>
              
              <div>
                <label className="label">Rotate Clockwise</label>
                <select value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="input">
                  <option value="90">90° (Quarter Turn)</option>
                  <option value="180">180° (Half Turn)</option>
                  <option value="270">270° (Three-Quarter Turn)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                {progress === -1 ? (
                  <button onClick={rotate} className="btn btn-primary">Rotate Video</button>
                ) : (
                  <button onClick={() => { recorderRef.current?.stop(); setProgress(-1); }} className="btn btn-secondary" style={{ color: 'var(--color-danger, red)' }}>
                    Stop Rotation ({progress}%)
                  </button>
                )}
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Rotated Video Preview</h4>
              <video src={outputUrl} controls style={{ maxWidth: '400px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="rotated_video.webm" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Rotated Video
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 7. VIDEO SPEED CONTROLLER
// ==========================================
export const VideoSpeedController: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [speed, setSpeed] = useState(1.5); // 1.5x speed default
  const [progress, setProgress] = useState(-1);
  const [outputUrl, setOutputUrl] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<CanvasVideoRecorder | null>(null);

  const applySpeed = () => {
    if (!videoRef.current || !file) return;
    setProgress(0);
    const video = videoRef.current;
    const recorder = new CanvasVideoRecorder(video);
    recorderRef.current = recorder;
    
    recorder.start({
      width: video.videoWidth,
      height: video.videoHeight,
      bitrate: 2000000,
      speed,
      onProgress: (p) => setProgress(p),
      onComplete: (blob) => {
        setOutputUrl(URL.createObjectURL(blob));
        setProgress(-1);
        toast.success('Speed modification completed!');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="video/*" label="Select video to change speed" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                controls
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Adjust Playback Speed</h3>
              
              <div>
                <label className="label">Speed Factor</label>
                <select value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="input">
                  <option value="0.5">0.5x (Slow Motion)</option>
                  <option value="0.75">0.75x (Slightly Slower)</option>
                  <option value="1.0">1.0x (Normal)</option>
                  <option value="1.25">1.25x (Slightly Faster)</option>
                  <option value="1.5">1.5x (Fast Motion)</option>
                  <option value="2.0">2.0x (Double Speed)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                {progress === -1 ? (
                  <button onClick={applySpeed} className="btn btn-primary">Process Speed</button>
                ) : (
                  <button onClick={() => { recorderRef.current?.stop(); setProgress(-1); }} className="btn btn-secondary" style={{ color: 'var(--color-danger, red)' }}>
                    Stop Processing ({progress}%)
                  </button>
                )}
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Output Preview</h4>
              <video src={outputUrl} controls style={{ maxWidth: '400px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="speed_adjusted_video.webm" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Output Video
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 8. GIF MAKER
// ==========================================
export const GIFMaker: React.FC = () => {
  const [imageList, setImageList] = useState<{ id: string; url: string }[]>([]);
  const [delay, setDelay] = useState(0.2); // 0.2s delay between frames
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(),
        url: URL.createObjectURL(file)
      }));
      setImageList([...imageList, ...newImages]);
    }
  };

  const removeImage = (id: string, url: string) => {
    setImageList(imageList.filter(img => img.id !== id));
    URL.revokeObjectURL(url);
  };

  const buildGIF = async () => {
    if (imageList.length < 2) {
      toast.error('Upload at least 2 images!');
      return;
    }
    setIsProcessing(true);
    
    // Dynamic client-side import for gifshot
    // @ts-ignore
    const gifshot = (await import('gifshot')).default;
    
    gifshot.createGIF({
      images: imageList.map(img => img.url),
      interval: delay,
      gifWidth: 350,
      gifHeight: 350
    }, (obj: any) => {
      setIsProcessing(false);
      if (!obj.error) {
        setOutputUrl(obj.image);
        toast.success('GIF compilation successful!');
      } else {
        toast.error('Compilation failed: ' + obj.error);
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label className="label">Upload Images for GIF Frames</label>
        <input type="file" multiple accept="image/*" onChange={addImages} className="input" />
      </div>

      {imageList.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
            {imageList.map((img) => (
              <div key={img.id} style={{ position: 'relative', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <img src={img.url} alt="Frame" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <button
                  onClick={() => removeImage(img.id, img.url)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(255,0,0,0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: '0.65rem'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="label">Frame Delay (Seconds): {delay}s</label>
            <input type="range" min="0.05" max="1.5" step="0.05" value={delay} onChange={(e) => setDelay(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={buildGIF} disabled={isProcessing} className="btn btn-primary">
              {isProcessing ? 'Compiling GIF...' : 'Generate GIF'}
            </button>
            <button onClick={() => { setImageList([]); setOutputUrl(''); }} className="btn btn-secondary">Clear All</button>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Output GIF Preview</h4>
              <img src={outputUrl} alt="Output GIF" style={{ maxWidth: '300px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="animated.gif" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download GIF File
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 9. GIF COMPRESSOR
// ==========================================
export const GIFCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(0.7); // 70% scale compression
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const compressGIF = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    // Read the GIF, decode frames visually via canvas, compile at lower scale
    const gifUrl = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = gifUrl;
    
    img.onload = async () => {
      // @ts-ignore
      const gifshot = (await import('gifshot')).default;
      
      gifshot.createGIF({
        images: [gifUrl], // Re-sample the gif itself to scale
        gifWidth: img.width * scale,
        gifHeight: img.height * scale
      }, (obj: any) => {
        setIsProcessing(false);
        URL.revokeObjectURL(gifUrl);
        if (!obj.error) {
          setOutputUrl(obj.image);
          toast.success('GIF Compressed successfully!');
        } else {
          toast.error('Compression failed.');
        }
      });
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="image/gif" label="Select GIF to compress" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <img src={URL.createObjectURL(file)} alt="Original GIF" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Compression Rate</h3>
              
              <div>
                <label className="label">Dimension Scaling ({Math.round(scale * 100)}%)</label>
                <input
                  type="range"
                  min="0.3"
                  max="0.9"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button onClick={compressGIF} disabled={isProcessing} className="btn btn-primary">
                  {isProcessing ? 'Compressing...' : 'Compress GIF'}
                </button>
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Compressed GIF Preview</h4>
              <img src={outputUrl} alt="Compressed Output" style={{ maxWidth: '300px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="compressed.gif" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Compressed GIF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 10. VIDEO TO GIF
// ==========================================
export const VideoToGIF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const convertToGIF = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    
    video.onloadeddata = async () => {
      const duration = video.duration;
      // Extract 15 frames from the video timeline for GIF compilation
      const frameCount = 15;
      const interval = duration / frameCount;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = Math.min(400, video.videoWidth);
      canvas.height = Math.min(300, video.videoHeight);
      
      const images: string[] = [];
      
      for (let i = 0; i < frameCount; i++) {
        video.currentTime = i * interval;
        await new Promise((r) => { video.onseeked = r; });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          images.push(canvas.toDataURL('image/jpeg', 0.8));
        }
      }
      
      // Compile using gifshot
      // @ts-ignore
      const gifshot = (await import('gifshot')).default;
      gifshot.createGIF({
        images,
        interval: 0.15,
        gifWidth: canvas.width,
        gifHeight: canvas.height
      }, (obj: any) => {
        setIsProcessing(false);
        URL.revokeObjectURL(videoUrl);
        if (!obj.error) {
          setOutputUrl(obj.image);
          toast.success('Converted to animated GIF!');
        } else {
          toast.error('Conversion failed.');
        }
      });
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="video/*" label="Select video to convert to GIF" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                controls
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Video to GIF Conversion</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', margin: 0 }}>
                This tool extracts consecutive frames along the video timeline and compiles them into a loop GIF animation.
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button onClick={convertToGIF} disabled={isProcessing} className="btn btn-primary">
                  {isProcessing ? 'Converting frames...' : 'Convert to GIF'}
                </button>
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Animated GIF Output</h4>
              <img src={outputUrl} alt="Output GIF" style={{ maxWidth: '300px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="video_loop.gif" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download GIF File
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 11. GIF TO MP4
// ==========================================
export const GIFToMP4: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(-1);
  const [outputUrl, setOutputUrl] = useState('');

  const convertToMP4 = async () => {
    if (!file) return;
    setProgress(0);
    
    // Draw the GIF on a canvas sequentially and compile as WebM/MP4
    const gifUrl = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.src = gifUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = img.width || 400;
      canvas.height = img.height || 400;
      
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2000000 });
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        setOutputUrl(URL.createObjectURL(videoBlob));
        setProgress(-1);
        URL.revokeObjectURL(gifUrl);
        toast.success('Converted GIF to Video successfully!');
      };
      
      recorder.start();
      
      let durationCounter = 0;
      const intervalId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        durationCounter += 100;
        
        // Emulate 4 seconds video capture of the animated loop
        if (durationCounter >= 4000) {
          clearInterval(intervalId);
          recorder.stop();
        }
      }, 100);
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="image/gif" label="Select GIF file to convert to Video" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <img src={URL.createObjectURL(file)} alt="Source GIF" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>GIF to MP4 conversion</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', margin: 0 }}>
                This tool captures the animated GIF loop sequences client-side and compiles them into a standard WebM/MP4 video file.
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button onClick={convertToMP4} disabled={progress !== -1} className="btn btn-primary">
                  {progress !== -1 ? 'Converting...' : 'Convert to MP4'}
                </button>
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Converted Video Preview</h4>
              <video src={outputUrl} controls style={{ maxWidth: '400px', borderRadius: 'var(--radius-md)' }} />
              <a href={outputUrl} download="converted_gif.mp4" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download MP4 Video
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 12. AUDIO EXTRACTOR
// ==========================================
export const AudioExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const extract = async () => {
    if (!file) return;
    setIsProcessing(true);
    toast.info('Decoding video audio track... please wait.');
    
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      
      // Decodes audio data client-side using native browser core codecs
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      
      // Convert to WAV
      const wavBlob = bufferToWav(audioBuffer);
      setOutputUrl(URL.createObjectURL(wavBlob));
      setIsProcessing(false);
      toast.success('Audio extracted successfully!');
    } catch (e: any) {
      console.error(e);
      setIsProcessing(false);
      toast.error('Failed to extract audio track. Ensure the video contains a valid audio stream.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="video/*" label="Select video to extract audio track" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <video src={URL.createObjectURL(file)} controls style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Audio Track Extractor</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', margin: 0 }}>
                This tool reads your video stream client-side, extracts the underlying audio channels, and exports them as a high-quality 16-bit PCM WAV file.
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button onClick={extract} disabled={isProcessing} className="btn btn-primary">
                  {isProcessing ? 'Extracting audio...' : 'Extract Audio'}
                </button>
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Extracted Audio Track</h4>
              <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
              <a href={outputUrl} download="extracted_audio.wav" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download WAV Audio
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 13. VIDEO THUMBNAIL EXTRACTOR
// ==========================================
export const VideoThumbnailExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (file) {
      const v = document.createElement('video');
      v.src = URL.createObjectURL(file);
      v.onloadedmetadata = () => {
        setDuration(v.duration);
      };
    }
  }, [file]);

  const seekFrame = (seconds: number) => {
    setCurrentTime(seconds);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnailUrl(canvas.toDataURL('image/jpeg', 0.9));
        toast.success('Frame captured successfully!');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <FilePicker accept="video/*" label="Select video to extract thumbnails" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                controls
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Thumbnail Extractor</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', margin: 0 }}>
                Play, pause, or scrub through the video timeline to find the frame you want to extract, then click "Capture Frame".
              </p>

              <div>
                <label className="label">Timeline Scrubber: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s</label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={currentTime}
                  onChange={(e) => seekFrame(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button onClick={captureFrame} className="btn btn-primary">Capture Frame</button>
                <button onClick={() => { setFile(null); setThumbnailUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {thumbnailUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Captured Frame Preview</h4>
              <img src={thumbnailUrl} alt="Thumbnail Preview" style={{ maxWidth: '300px', borderRadius: 'var(--radius-md)' }} />
              <a href={thumbnailUrl} download={`frame_${currentTime.toFixed(2)}.jpg`} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download High-Quality JPG
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
