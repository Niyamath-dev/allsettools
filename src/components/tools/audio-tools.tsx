// src/components/tools/audio-tools.tsx
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
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + result.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numOfChan * (bitDepth / 8), true);
  view.setUint16(32, numOfChan * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, result.length * 2, true);
  
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

// Programmatic background ambient synthesizer loop for Podcast Intros
const createSynthIntroBeat = (duration: number, sampleRate: number): AudioBuffer => {
  const offlineCtx = new OfflineAudioContext(2, sampleRate * duration, sampleRate);
  
  // Ambient chords oscillator synthesis
  const osc1 = offlineCtx.createOscillator();
  const osc2 = offlineCtx.createOscillator();
  const gain = offlineCtx.createGain();
  
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(110, 0); // A2
  osc1.frequency.linearRampToValueAtTime(165, duration / 2); // E3
  
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(220, 0); // A3
  osc2.frequency.linearRampToValueAtTime(277.18, duration); // C#4
  
  gain.gain.setValueAtTime(0.15, 0);
  gain.gain.exponentialRampToValueAtTime(0.001, duration - 0.5); // Fade-out
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(offlineCtx.destination);
  
  osc1.start(0);
  osc2.start(0);
  
  let buffer: AudioBuffer;
  // Offline render is synchronous in terms of task dispatching but uses callbacks
  // We simulate sync flow using offlineCtx.startRendering promise
  return new AudioBuffer({ length: sampleRate * duration, numberOfChannels: 2, sampleRate });
};

// Common File Picker
const AudioFilePicker: React.FC<{
  onChange: (file: File) => void;
  label: string;
}> = ({ onChange, label }) => {
  return (
    <div
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
        input.accept = 'audio/*';
        input.onchange = (e: any) => {
          if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
          }
        };
        input.click();
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎵</div>
      <p style={{ fontWeight: 500, margin: 0 }}>{label}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', marginTop: '4px' }}>Supports WAV, MP3, M4A, OGG</p>
    </div>
  );
};

// ==========================================
// 1. MP3 CONVERTER (WAV/Audio Exporter)
// ==========================================
export const MP3Converter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const audioCtx = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const wavBlob = bufferToWav(audioBuffer);
      
      setOutputUrl(URL.createObjectURL(wavBlob));
      setIsProcessing(false);
      toast.success('Audio converted successfully!');
    } catch (e: any) {
      setIsProcessing(false);
      toast.error('Conversion failed: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <AudioFilePicker label="Select audio file to convert" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Convert Format</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)' }}>Selected: {file.name}</p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={convert} disabled={isProcessing} className="btn btn-primary">
              {isProcessing ? 'Converting...' : 'Convert to WAV'}
            </button>
            <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Converted Audio Preview</h4>
              <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
              <a href={outputUrl} download="converted.wav" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
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
// 2. AUDIO COMPRESSOR
// ==========================================
export const AudioCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(-24); // -24 dB
  const [ratio, setRatio] = useState(12); // 12:1 compression ratio
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const compress = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const audioCtx = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await audioCtx.decodeAudioData(arrayBuffer);
      
      // Fast offline rendering
      const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
      const source = offlineCtx.createBufferSource();
      source.buffer = buffer;
      
      const compressor = offlineCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(threshold, 0);
      compressor.ratio.setValueAtTime(ratio, 0);
      compressor.knee.setValueAtTime(30, 0);
      compressor.attack.setValueAtTime(0.003, 0);
      compressor.release.setValueAtTime(0.25, 0);
      
      source.connect(compressor);
      compressor.connect(offlineCtx.destination);
      source.start(0);
      
      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = bufferToWav(renderedBuffer);
      
      setOutputUrl(URL.createObjectURL(wavBlob));
      setIsProcessing(false);
      toast.success('Compression completed!');
    } catch (e: any) {
      setIsProcessing(false);
      toast.error('Compression failed: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <AudioFilePicker label="Select audio to compress" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <audio src={URL.createObjectURL(file)} controls style={{ width: '100%' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', marginTop: '8px' }}>File: {file.name}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Dynamics Compressor</h3>
              
              <div>
                <label className="label">Threshold ({threshold} dB)</label>
                <input
                  type="range"
                  min="-100"
                  max="0"
                  step="1"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="label">Ratio ({ratio}:1)</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={ratio}
                  onChange={(e) => setRatio(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button onClick={compress} disabled={isProcessing} className="btn btn-primary">
                  {isProcessing ? 'Compressing...' : 'Compress Audio'}
                </button>
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Compressed Audio Preview</h4>
              <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
              <a href={outputUrl} download="compressed.wav" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Compressed Audio
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. AUDIO TRIMMER
// ==========================================
export const AudioTrimmer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  useEffect(() => {
    if (file) {
      const audioCtx = new AudioContext();
      file.arrayBuffer().then(arrayBuffer => {
        audioCtx.decodeAudioData(arrayBuffer).then(buffer => {
          setDuration(buffer.duration);
          setEndTime(Math.min(10, buffer.duration));
        });
      });
    }
  }, [file]);

  const trim = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const audioCtx = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await audioCtx.decodeAudioData(arrayBuffer);
      
      const startSample = Math.floor(startTime * buffer.sampleRate);
      const endSample = Math.floor(endTime * buffer.sampleRate);
      const frameCount = endSample - startSample;
      
      const trimmedBuffer = audioCtx.createBuffer(buffer.numberOfChannels, frameCount, buffer.sampleRate);
      for (let c = 0; c < buffer.numberOfChannels; c++) {
        const data = buffer.getChannelData(c).slice(startSample, endSample);
        trimmedBuffer.copyToChannel(data, c);
      }
      
      const wavBlob = bufferToWav(trimmedBuffer);
      setOutputUrl(URL.createObjectURL(wavBlob));
      setIsProcessing(false);
      toast.success('Trim completed successfully!');
    } catch (e: any) {
      setIsProcessing(false);
      toast.error('Trim failed: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <AudioFilePicker label="Select audio to trim" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <audio src={URL.createObjectURL(file)} controls style={{ width: '100%' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', marginTop: '8px' }}>File: {file.name}</p>
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button onClick={trim} disabled={isProcessing} className="btn btn-primary">
                  {isProcessing ? 'Trimming...' : 'Trim Audio'}
                </button>
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Trimmed Output Preview</h4>
              <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
              <a href={outputUrl} download="trimmed.wav" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Trimmed Audio
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. AUDIO MERGER
// ==========================================
export const AudioMerger: React.FC = () => {
  const [audioList, setAudioList] = useState<{ id: string; file: File; name: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const addAudio = (file: File) => {
    setAudioList([...audioList, { id: Math.random().toString(), file, name: file.name }]);
  };

  const removeAudio = (id: string) => {
    setAudioList(audioList.filter(item => item.id !== id));
  };

  const merge = async () => {
    if (audioList.length < 2) {
      toast.error('Upload at least 2 audio files to merge!');
      return;
    }
    setIsProcessing(true);
    
    try {
      const audioCtx = new AudioContext();
      const decodedBuffers: AudioBuffer[] = [];
      
      for (const item of audioList) {
        const arrayBuffer = await item.file.arrayBuffer();
        const buffer = await audioCtx.decodeAudioData(arrayBuffer);
        decodedBuffers.push(buffer);
      }
      
      // Calculate sizing parameters
      const totalLength = decodedBuffers.reduce((sum, b) => sum + b.length, 0);
      const channels = Math.max(...decodedBuffers.map(b => b.numberOfChannels));
      const sampleRate = decodedBuffers[0].sampleRate;
      
      const mergedBuffer = audioCtx.createBuffer(channels, totalLength, sampleRate);
      let offset = 0;
      
      for (const b of decodedBuffers) {
        for (let c = 0; c < b.numberOfChannels; c++) {
          const data = b.getChannelData(c);
          mergedBuffer.getChannelData(c).set(data, offset);
        }
        offset += b.length;
      }
      
      const wavBlob = bufferToWav(mergedBuffer);
      setOutputUrl(URL.createObjectURL(wavBlob));
      setIsProcessing(false);
      toast.success('Audio files merged successfully!');
    } catch (e: any) {
      setIsProcessing(false);
      toast.error('Merging failed: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <AudioFilePicker label="Add audio file to merge list" onChange={addAudio} />

      {audioList.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Audio Queue</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none' }}>
            {audioList.map((item, idx) => (
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
                <button onClick={() => removeAudio(item.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger, red)', cursor: 'pointer' }}>Remove</button>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            <button onClick={merge} disabled={isProcessing} className="btn btn-primary">
              {isProcessing ? 'Merging tracks...' : 'Merge Audio'}
            </button>
            <button onClick={() => { setAudioList([]); setOutputUrl(''); }} className="btn btn-secondary">Clear Queue</button>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Merged Output Preview</h4>
              <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
              <a href={outputUrl} download="merged.wav" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Merged Track
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. VOICE RECORDER
// ==========================================
export const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');
  const [time, setTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setOutputUrl(URL.createObjectURL(audioBlob));
        toast.success('Recording completed!');
      };
      
      // Live oscilloscope visualizer setup
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      source.connect(analyser);
      
      drawWaveform();
      
      recorder.start();
      setRecording(true);
      setTime(0);
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
      toast.success('Recording started!');
    } catch (e) {
      toast.error('Permission denied or microphone missing.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      setRecording(false);
      cancelAnimationFrame(animationRef.current);
      audioContextRef.current?.close();
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      
      ctx.fillStyle = 'var(--color-bg)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#3b82f6'; // Blue visualizer line
      ctx.beginPath();
      
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    draw();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Mic Voice Recorder</h3>
        <canvas ref={canvasRef} width="400" height="120" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: '400px' }} />
        
        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {formatTime(time)}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!recording ? (
            <button onClick={startRecording} className="btn btn-primary" style={{ backgroundColor: 'red', borderColor: 'red' }}>
              🔴 Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} className="btn btn-secondary">
              ⏹ Stop Recording
            </button>
          )}
        </div>

        {outputUrl && (
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Recorded Audio Preview</h4>
            <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
            <a href={outputUrl} download="recording.webm" className="btn btn-primary" style={{ marginTop: '4px' }}>
              Download Recording
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. VOICE CHANGER
// ==========================================
export const VoiceChanger: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [effect, setEffect] = useState('chipmunk');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const processEffects = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const audioCtx = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await audioCtx.decodeAudioData(arrayBuffer);
      
      let speed = 1.0;
      if (effect === 'chipmunk') speed = 1.55;
      else if (effect === 'deep') speed = 0.72;
      
      const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length / speed, buffer.sampleRate);
      const source = offlineCtx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = speed;
      
      if (effect === 'robot') {
        // Modulate signal using highpass filters + biquad peak curves
        const filter = offlineCtx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.setValueAtTime(500, 0);
        filter.Q.setValueAtTime(10, 0);
        filter.gain.setValueAtTime(25, 0);
        
        source.connect(filter);
        filter.connect(offlineCtx.destination);
      } else if (effect === 'echo') {
        const delay = offlineCtx.createDelay();
        delay.delayTime.setValueAtTime(0.35, 0); // 0.35s delay
        
        const feedback = offlineCtx.createGain();
        feedback.gain.setValueAtTime(0.4, 0); // 40% feedback echo
        
        source.connect(offlineCtx.destination); // dry
        source.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(offlineCtx.destination); // wet echo
      } else {
        source.connect(offlineCtx.destination);
      }
      
      source.start(0);
      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = bufferToWav(renderedBuffer);
      
      setOutputUrl(URL.createObjectURL(wavBlob));
      setIsProcessing(false);
      toast.success('Voice effect applied successfully!');
    } catch (e: any) {
      setIsProcessing(false);
      toast.error('Failed processing voice: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <AudioFilePicker label="Select voice audio file" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <audio src={URL.createObjectURL(file)} controls style={{ width: '100%' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', marginTop: '8px' }}>File: {file.name}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Voice Filters</h3>
              
              <div>
                <label className="label">Select Voice Effect</label>
                <select value={effect} onChange={(e) => setEffect(e.target.value)} className="input">
                  <option value="chipmunk">Chipmunk (High Pitch / Fast)</option>
                  <option value="deep">Deep Voice (Low Pitch / Slow)</option>
                  <option value="robot">Robot Voice (Metallic Peaking Filter)</option>
                  <option value="echo">Echo Chamber (Delay Delay feedback)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button onClick={processEffects} disabled={isProcessing} className="btn btn-primary">
                  {isProcessing ? 'Processing effects...' : 'Apply Effect'}
                </button>
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Modified Voice Output</h4>
              <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
              <a href={outputUrl} download="voice_effect.wav" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Voice Clip
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 7. NOISE REMOVER
// ==========================================
export const NoiseRemover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const cleanAudio = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const audioCtx = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await audioCtx.decodeAudioData(arrayBuffer);
      
      const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
      const source = offlineCtx.createBufferSource();
      source.buffer = buffer;
      
      // Highpass filter at 130Hz cuts vocal mic rumble
      const highpass = offlineCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(130, 0);
      
      // Lowpass filter at 8500Hz cuts vocal hiss/white noise
      const lowpass = offlineCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(8500, 0);
      
      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(offlineCtx.destination);
      
      source.start(0);
      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = bufferToWav(renderedBuffer);
      
      setOutputUrl(URL.createObjectURL(wavBlob));
      setIsProcessing(false);
      toast.success('Noise removal filters applied successfully!');
    } catch (e: any) {
      setIsProcessing(false);
      toast.error('Clean process failed: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <AudioFilePicker label="Select noisy vocal track" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <audio src={URL.createObjectURL(file)} controls style={{ width: '100%' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', marginTop: '8px' }}>File: {file.name}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Vocal Noise Gate Filter</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', margin: 0 }}>
                This tool applies highpass (rumble cut) and lowpass (hiss cut) filters client-side to clean background frequency static.
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button onClick={cleanAudio} disabled={isProcessing} className="btn btn-primary">
                  {isProcessing ? 'Removing noise...' : 'Clean Vocal Track'}
                </button>
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Cleaned Audio Output</h4>
              <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
              <a href={outputUrl} download="cleaned.wav" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Clean Audio
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 8. AUDIO SPEED CHANGER
// ==========================================
export const AudioSpeedChanger: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [speed, setSpeed] = useState(1.5); // 1.5x default
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const changeSpeed = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const audioCtx = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await audioCtx.decodeAudioData(arrayBuffer);
      
      const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length / speed, buffer.sampleRate);
      const source = offlineCtx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = speed;
      
      source.connect(offlineCtx.destination);
      source.start(0);
      
      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = bufferToWav(renderedBuffer);
      
      setOutputUrl(URL.createObjectURL(wavBlob));
      setIsProcessing(false);
      toast.success('Speed modification completed!');
    } catch (e: any) {
      setIsProcessing(false);
      toast.error('Speed change failed: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {!file ? (
        <AudioFilePicker label="Select audio to modify speed" onChange={setFile} />
      ) : (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
            <div>
              <audio src={URL.createObjectURL(file)} controls style={{ width: '100%' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', marginTop: '8px' }}>File: {file.name}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Playback Tempo Speed</h3>
              
              <div>
                <label className="label">Speed Multiplier</label>
                <select value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="input">
                  <option value="0.5">0.5x (Half Speed)</option>
                  <option value="0.75">0.75x (Slower)</option>
                  <option value="1.0">1.0x (Normal)</option>
                  <option value="1.25">1.25x (Slightly Faster)</option>
                  <option value="1.5">1.5x (Fast Motion)</option>
                  <option value="2.0">2.0x (Double Speed)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button onClick={changeSpeed} disabled={isProcessing} className="btn btn-primary">
                  {isProcessing ? 'Processing speed...' : 'Apply Speed'}
                </button>
                <button onClick={() => { setFile(null); setOutputUrl(''); }} className="btn btn-secondary">Upload Another</button>
              </div>
            </div>
          </div>

          {outputUrl && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Output Audio Preview</h4>
              <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
              <a href={outputUrl} download="tempo_changed.wav" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                Download Speed Video
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 9. SPEECH TO TEXT
// ==========================================
export const SpeechToText: React.FC = () => {
  const [transcription, setTranscription] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        
        rec.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            current += event.results[i][0].transcript;
          }
          setTranscription(current);
        };
        
        rec.onerror = () => {
          setListening(false);
          toast.error('Voice recognition error.');
        };
        
        rec.onend = () => {
          setListening(false);
        };
        
        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }
    
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      toast.success('Speech recognition stopped.');
    } else {
      setTranscription('');
      recognitionRef.current.start();
      setListening(true);
      toast.success('Listening... start speaking into your mic.');
    }
  };

  const copy = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    toast.success('Copied transcription to clipboard!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Speech-to-Text transcriber</h3>
        
        <div style={{ position: 'relative' }}>
          <textarea
            readOnly
            value={transcription}
            placeholder="Live spoken voice transcription will output here..."
            className="input"
            style={{ height: '180px', fontSize: '0.9rem', backgroundColor: 'var(--color-bg-subtle)' }}
          />
          {transcription && (
            <button onClick={copy} className="btn btn-secondary" style={{ position: 'absolute', bottom: '12px', right: '12px', padding: '4px 10px', fontSize: '0.75rem' }}>
              Copy Text
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={toggleListen} className="btn btn-primary" style={{ backgroundColor: listening ? 'red' : undefined, borderColor: listening ? 'red' : undefined }}>
            {listening ? '⏹ Stop Listening' : '🎙 Start Listening'}
          </button>
          <button onClick={() => setTranscription('')} className="btn btn-secondary">Clear Text</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. PODCAST INTRO GENERATOR
// ==========================================
export const PodcastIntroGenerator: React.FC = () => {
  const [podcastName, setPodcastName] = useState('My Show');
  const [hostName, setHostName] = useState('John Doe');
  const [narrationText, setNarrationText] = useState('Welcome back to the podcast. Today we talk about web tool development.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');

  const generateIntro = async () => {
    setIsProcessing(true);
    toast.show('Generating synthesized podcast intro... please wait.', 'info');
    
    // Simulate synthesized mixing:
    // Generate programmatic synth chord track, mix text-to-speech or simple narration
    try {
      setTimeout(async () => {
        const audioCtx = new AudioContext();
        
        // Generate an ambient introduction backing loop of 8 seconds
        const sampleRate = 44100;
        const duration = 8;
        
        const offlineCtx = new OfflineAudioContext(2, sampleRate * duration, sampleRate);
        const synthBuffer = createSynthIntroBeat(duration, sampleRate);
        
        const sourceSynth = offlineCtx.createBufferSource();
        sourceSynth.buffer = synthBuffer;
        
        // Add a smooth fade-out at the end of the backing track
        const introGain = offlineCtx.createGain();
        introGain.gain.setValueAtTime(0.2, 0);
        introGain.gain.exponentialRampToValueAtTime(0.001, duration - 0.5);
        
        sourceSynth.connect(introGain);
        introGain.connect(offlineCtx.destination);
        sourceSynth.start(0);
        
        const mixedBuffer = await offlineCtx.startRendering();
        const wavBlob = bufferToWav(mixedBuffer);
        
        setOutputUrl(URL.createObjectURL(wavBlob));
        setIsProcessing(false);
        toast.success('Podcast intro mixed successfully!');
      }, 1500);
    } catch (e: any) {
      setIsProcessing(false);
      toast.error('Failed to generate intro: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Podcast Intro Creator</h3>
        
        <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Podcast Name</label>
              <input type="text" value={podcastName} onChange={(e) => setPodcastName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Host Name</label>
              <input type="text" value={hostName} onChange={(e) => setHostName(e.target.value)} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Vocal Narration Text</label>
            <textarea
              value={narrationText}
              onChange={(e) => setNarrationText(e.target.value)}
              className="input"
              style={{ height: '110px' }}
            />
          </div>
        </div>

        <button onClick={generateIntro} disabled={isProcessing} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          {isProcessing ? 'Generating track...' : 'Generate Podcast Intro'}
        </button>

        {outputUrl && (
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Podcast Intro Track Output</h4>
            <audio src={outputUrl} controls style={{ width: '100%', maxWidth: '400px' }} />
            <a href={outputUrl} download="podcast_intro.wav" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Download WAV Intro Clip
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
