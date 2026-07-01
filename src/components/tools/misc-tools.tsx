// src/components/tools/misc-tools.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/components/Toast';

// ==========================================
// 1. CALENDAR GENERATOR
// ==========================================
export const CalendarGenerator: React.FC = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [startDay, setStartDay] = useState(0); // 0 = Sunday, 1 = Monday

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const getDays = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjusted = (firstDay - startDay + 7) % 7;
    const cells: (number | null)[] = Array(adjusted).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const cells = getDays();
  const orderedDays = [...dayShort.slice(startDay), ...dayShort.slice(0, startDay)];

  const handlePrint = () => window.print();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Month:</label>
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="input" style={{ width: '130px', height: 'auto', padding: '4px 8px' }}>
            {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Year:</label>
          <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value) || today.getFullYear())} className="input" style={{ width: '90px', height: 'auto', padding: '4px 8px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Week starts:</label>
          <select value={startDay} onChange={e => setStartDay(parseInt(e.target.value))} className="input" style={{ width: '110px', height: 'auto', padding: '4px 8px' }}>
            <option value={0}>Sunday</option>
            <option value={1}>Monday</option>
          </select>
        </div>
        <button onClick={() => { setMonth(p => (p === 0 ? 11 : p - 1)); if (month === 0) setYear(y => y - 1); }} className="btn btn-secondary" style={{ padding: '4px 12px' }}>‹ Prev</button>
        <button onClick={() => { setMonth(p => (p === 11 ? 0 : p + 1)); if (month === 11) setYear(y => y + 1); }} className="btn btn-secondary" style={{ padding: '4px 12px' }}>Next ›</button>
        <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '4px 14px' }}>Print</button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', textAlign: 'center', fontSize: '1.3rem', fontWeight: 700 }}>{monthNames[month]} {year}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              {orderedDays.map(d => (
                <th key={d} style={{ padding: '8px 4px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-fg-muted)', fontWeight: 600 }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cells.length / 7 }, (_, r) => (
              <tr key={r}>
                {cells.slice(r * 7, r * 7 + 7).map((d, c) => {
                  const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  return (
                    <td key={c} style={{
                      padding: '10px 4px',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      borderRadius: '6px',
                      background: isToday ? 'var(--color-primary)' : 'transparent',
                      color: isToday ? '#fff' : d ? 'inherit' : 'transparent',
                      fontWeight: isToday ? 700 : 400
                    }}>{d ?? '·'}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 2. HOLIDAY CALENDAR
// ==========================================
interface Holiday { date: string; name: string; type: string; }

export const HolidayCalendar: React.FC = () => {
  const [country, setCountry] = useState('US');
  const [year, setYear] = useState(new Date().getFullYear());

  const holidays: Record<string, Holiday[]> = {
    US: [
      { date: `${year}-01-01`, name: "New Year's Day", type: 'Public' },
      { date: `${year}-01-15`, name: 'Martin Luther King Jr. Day', type: 'Federal' },
      { date: `${year}-02-19`, name: "Presidents' Day", type: 'Federal' },
      { date: `${year}-05-27`, name: 'Memorial Day', type: 'Federal' },
      { date: `${year}-06-19`, name: 'Juneteenth', type: 'Federal' },
      { date: `${year}-07-04`, name: 'Independence Day', type: 'Public' },
      { date: `${year}-09-02`, name: 'Labor Day', type: 'Federal' },
      { date: `${year}-10-14`, name: 'Columbus Day', type: 'Federal' },
      { date: `${year}-11-11`, name: 'Veterans Day', type: 'Public' },
      { date: `${year}-11-28`, name: 'Thanksgiving Day', type: 'Federal' },
      { date: `${year}-12-25`, name: 'Christmas Day', type: 'Public' }
    ],
    UK: [
      { date: `${year}-01-01`, name: "New Year's Day", type: 'Public' },
      { date: `${year}-03-29`, name: 'Good Friday', type: 'Public' },
      { date: `${year}-04-01`, name: 'Easter Monday', type: 'Public' },
      { date: `${year}-05-06`, name: 'Early May Bank Holiday', type: 'Public' },
      { date: `${year}-05-27`, name: 'Spring Bank Holiday', type: 'Public' },
      { date: `${year}-08-26`, name: 'Summer Bank Holiday', type: 'Public' },
      { date: `${year}-12-25`, name: 'Christmas Day', type: 'Public' },
      { date: `${year}-12-26`, name: 'Boxing Day', type: 'Public' }
    ],
    IN: [
      { date: `${year}-01-26`, name: 'Republic Day', type: 'National' },
      { date: `${year}-03-25`, name: 'Holi', type: 'Public' },
      { date: `${year}-04-14`, name: 'Ambedkar Jayanti', type: 'Public' },
      { date: `${year}-05-23`, name: 'Buddha Purnima', type: 'Public' },
      { date: `${year}-08-15`, name: 'Independence Day', type: 'National' },
      { date: `${year}-10-02`, name: 'Gandhi Jayanti', type: 'National' },
      { date: `${year}-10-12`, name: 'Dussehra', type: 'Public' },
      { date: `${year}-11-01`, name: 'Diwali', type: 'Public' },
      { date: `${year}-12-25`, name: 'Christmas Day', type: 'Public' }
    ]
  };

  const list = holidays[country] || [];

  const typeColor: Record<string, string> = {
    National: '#6366f1',
    Federal: '#6366f1',
    Public: '#22c55e'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Country:</label>
          <select value={country} onChange={e => setCountry(e.target.value)} className="input" style={{ width: '90px', height: 'auto', padding: '4px 8px' }}>
            <option value="US">🇺🇸 USA</option>
            <option value="UK">🇬🇧 UK</option>
            <option value="IN">🇮🇳 India</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Year:</label>
          <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value) || 2025)} className="input" style={{ width: '90px', height: 'auto', padding: '4px 8px' }} />
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Holiday</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Day</th>
            </tr>
          </thead>
          <tbody>
            {list.map((h, i) => {
              const d = new Date(h.date);
              const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
              const formatted = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 8px' }}>{formatted}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>{h.name}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{
                      background: typeColor[h.type] + '22',
                      color: typeColor[h.type],
                      padding: '2px 8px',
                      borderRadius: '99px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>{h.type}</span>
                  </td>
                  <td style={{ padding: '10px 8px', color: 'var(--color-fg-muted)' }}>{dayName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 3. RANDOM PICKER
// ==========================================
export const RandomPicker: React.FC = () => {
  const [rawList, setRawList] = useState('Alice\nBob\nCharlie\nDiana\nEvan\nFiona');
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [history, setHistory] = useState<string[][]>([]);

  const items = rawList.split('\n').map(s => s.trim()).filter(Boolean);

  const pick = () => {
    if (items.length === 0) { toast.error('Add at least one item to the list.'); return; }
    const n = Math.min(count, items.length);
    setPicking(true);
    let frame = 0;
    const interval = setInterval(() => {
      const shuffled = [...items].sort(() => Math.random() - 0.5).slice(0, n);
      setResults(shuffled);
      frame++;
      if (frame >= 15) {
        clearInterval(interval);
        const final = [...items].sort(() => Math.random() - 0.5).slice(0, n);
        setResults(final);
        setHistory(h => [[...final], ...h].slice(0, 5));
        setPicking(false);
      }
    }, 60);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Your Items (one per line)</h3>
        <textarea value={rawList} onChange={e => setRawList(e.target.value)} className="input" style={{ minHeight: '180px', fontFamily: 'inherit', resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Pick:</label>
          <input type="number" min={1} max={items.length || 1} value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} className="input" style={{ width: '70px', height: 'auto', padding: '4px 8px' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)' }}>of {items.length} items</span>
        </div>
        <button onClick={pick} disabled={picking} className="btn btn-primary">
          {picking ? 'Picking…' : '🎲 Pick Random'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {results.length > 0 && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.05rem', fontWeight: 600 }}>🏆 Result</h3>
            {results.map((r, i) => (
              <div key={i} style={{
                padding: '10px 14px',
                background: 'var(--color-primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                marginBottom: '6px',
                fontWeight: 700,
                fontSize: '1.1rem',
                transition: 'all 0.1s'
              }}>{r}</div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 600 }}>History</h3>
            {history.map((round, i) => (
              <div key={i} style={{ fontSize: '0.85rem', borderBottom: '1px solid var(--color-border)', padding: '4px 0', color: i === 0 ? 'inherit' : 'var(--color-fg-muted)' }}>
                {i + 1}. {round.join(', ')}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. DICE ROLLER
// ==========================================
const DICE_FACES: Record<number, number[]> = {
  4: [1,2,3,4],
  6: [1,2,3,4,5,6],
  8: [1,2,3,4,5,6,7,8],
  10: [1,2,3,4,5,6,7,8,9,10],
  12: [1,2,3,4,5,6,7,8,9,10,11,12],
  20: Array.from({ length: 20 }, (_, i) => i + 1)
};

export const DiceRoller: React.FC = () => {
  const [diceType, setDiceType] = useState(6);
  const [diceCount, setDiceCount] = useState(2);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const faces = DICE_FACES[diceType];

  const roll = () => {
    setRolling(true);
    let frame = 0;
    const interval = setInterval(() => {
      setResults(Array.from({ length: diceCount }, () => faces[Math.floor(Math.random() * faces.length)]));
      frame++;
      if (frame >= 12) { clearInterval(interval); setRolling(false); }
    }, 60);
  };

  const total = results.reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Dice type:</label>
          {Object.keys(DICE_FACES).map(d => (
            <button key={d} onClick={() => { setDiceType(parseInt(d)); setResults([]); }}
              className={diceType === parseInt(d) ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
              d{d}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label className="label" style={{ margin: 0 }}>Count:</label>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => { setDiceCount(n); setResults([]); }}
              className={diceCount === n ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
              {n}
            </button>
          ))}
        </div>
        <button onClick={roll} disabled={rolling} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          {rolling ? '🎲 Rolling…' : '🎲 Roll!'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {results.map((val, i) => (
              <div key={i} style={{
                width: '80px', height: '80px',
                border: '3px solid var(--color-primary)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                background: 'var(--color-bg-subtle)',
                transition: 'all 0.1s',
                animation: rolling ? 'none' : undefined
              }}>{val}</div>
            ))}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            Total: <span style={{ color: 'var(--color-primary)', fontSize: '1.8rem', fontWeight: 800 }}>{total}</span>
            <span style={{ marginLeft: '12px', color: 'var(--color-fg-muted)', fontSize: '0.9rem' }}>
              (avg {(total / results.length).toFixed(1)}, max {diceType})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. COIN FLIP
// ==========================================
export const CoinFlip: React.FC = () => {
  const [side, setSide] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState<('heads' | 'tails')[]>([]);
  const headsCount = history.filter(h => h === 'heads').length;
  const tailsCount = history.filter(h => h === 'tails').length;

  const flip = () => {
    setFlipping(true);
    let frame = 0;
    const interval = setInterval(() => {
      setSide(Math.random() < 0.5 ? 'heads' : 'tails');
      frame++;
      if (frame >= 14) {
        clearInterval(interval);
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        setSide(result);
        setHistory(h => ([result, ...h] as ('heads' | 'tails')[]).slice(0, 20));
        setFlipping(false);
      }
    }, 60);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Coin */}
        <div onClick={!flipping ? flip : undefined} style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: side === 'heads'
            ? 'radial-gradient(circle at 35% 35%, #fcd34d, #d97706)'
            : 'radial-gradient(circle at 35% 35%, #e2e8f0, #94a3b8)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3), inset 0 -4px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: flipping ? 'default' : 'pointer',
          transition: 'transform 0.05s',
          transform: flipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
          fontSize: '4rem',
          userSelect: 'none'
        }}>
          {side === null ? '🪙' : side === 'heads' ? '👑' : '🌟'}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {side ? side.toUpperCase() : '?'}
          </div>
          <button onClick={flip} disabled={flipping} className="btn btn-primary" style={{ marginTop: '12px', padding: '10px 28px', fontSize: '1rem' }}>
            {flipping ? 'Flipping…' : '🪙 Flip Coin'}
          </button>
          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-fg-muted)' }}>Click coin or button to flip</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', marginBottom: '8px' }}>Statistics ({history.length} flips)</div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#d97706' }}>{headsCount}</div>
              <div style={{ fontSize: '0.8rem' }}>Heads</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#64748b' }}>{tailsCount}</div>
              <div style={{ fontSize: '0.8rem' }}>Tails</div>
            </div>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '600px' }}>
          {history.map((h, i) => (
            <span key={i} style={{
              width: '32px', height: '32px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: h === 'heads' ? '#fcd34d' : '#e2e8f0',
              color: h === 'heads' ? '#92400e' : '#475569',
              fontSize: '0.7rem',
              fontWeight: 700
            }}>{h === 'heads' ? 'H' : 'T'}</span>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. WHEEL SPINNER
// ==========================================
export const WheelSpinner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [items, setItems] = useState(['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5', 'Prize 6']);
  const [newItem, setNewItem] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const angleRef = useRef(0);
  const spinRef = useRef<number | null>(null);

  const COLORS = ['#6366f1','#f59e0b','#22c55e','#ef4444','#ec4899','#14b8a6','#8b5cf6','#f97316'];

  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 10;
    const arc = (2 * Math.PI) / items.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach((item, i) => {
      const startAngle = angle + i * arc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + arc);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px system-ui';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 3;
      ctx.fillText(item.length > 12 ? item.slice(0, 12) + '…' : item, r - 12, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Pointer
    ctx.beginPath();
    ctx.moveTo(canvas.width - 4, cy);
    ctx.lineTo(canvas.width - 24, cy - 12);
    ctx.lineTo(canvas.width - 24, cy + 12);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();
  }, [items, COLORS]);

  useEffect(() => { drawWheel(angleRef.current); }, [drawWheel]);

  const spin = () => {
    if (spinning || items.length === 0) return;
    setSpinning(true);
    setWinner(null);
    const arc = (2 * Math.PI) / items.length;
    const extraSpins = (Math.random() * 5 + 5) * 2 * Math.PI;
    const targetAngle = angleRef.current + extraSpins;
    const duration = 4000;
    const startAngle = angleRef.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      const current = startAngle + (targetAngle - startAngle) * eased;
      angleRef.current = current;
      drawWheel(current);

      if (t < 1) {
        spinRef.current = requestAnimationFrame(animate);
      } else {
        // Determine winner: pointer is at right (angle 0), find which segment is there
        const normalised = ((current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointer = (2 * Math.PI - normalised) % (2 * Math.PI);
        const winIdx = Math.floor(pointer / arc) % items.length;
        setWinner(items[winIdx]);
        setSpinning(false);
      }
    };
    spinRef.current = requestAnimationFrame(animate);
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems(prev => [...prev, newItem.trim()]);
    setNewItem('');
    setWinner(null);
  };

  const removeItem = (i: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== i));
    setWinner(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }} className="grid-cols-1">
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <canvas ref={canvasRef} width={360} height={360} style={{ maxWidth: '100%', cursor: spinning ? 'default' : 'pointer', borderRadius: '50%' }} onClick={spin} />
        {winner && (
          <div style={{
            padding: '10px 24px',
            background: 'var(--color-primary)',
            color: '#fff',
            borderRadius: '99px',
            fontWeight: 700,
            fontSize: '1.15rem'
          }}>🏆 {winner}</div>
        )}
        <button onClick={spin} disabled={spinning} className="btn btn-primary" style={{ padding: '10px 28px' }}>
          {spinning ? 'Spinning…' : '🎡 Spin the Wheel!'}
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Wheel Items ({items.length})</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} className="input" placeholder="Add item…" style={{ flex: 1, height: 'auto', padding: '6px 10px' }} />
          <button onClick={addItem} className="btn btn-secondary" style={{ padding: '6px 12px' }}>+</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.875rem' }}>{item}</span>
              <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', fontSize: '1rem', lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>
        <button onClick={() => { setItems([]); setWinner(null); }} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>Clear All</button>
      </div>
    </div>
  );
};

// ==========================================
// 7. HABIT TRACKER
// ==========================================
interface Habit { id: number; name: string; completedDates: string[]; color: string; }

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: '💧 Drink 8 glasses of water', completedDates: [], color: '#3b82f6' },
    { id: 2, name: '🏃 Exercise 30 minutes', completedDates: [], color: '#22c55e' },
    { id: 3, name: '📚 Read 20 pages', completedDates: [], color: '#f59e0b' }
  ]);
  const [newHabit, setNewHabit] = useState('');

  const today = new Date();
  const getLast7Days = () => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  const days = getLast7Days();

  const toggle = (habitId: number, date: string) => {
    setHabits(h => h.map(hab => {
      if (hab.id !== habitId) return hab;
      const has = hab.completedDates.includes(date);
      return { ...hab, completedDates: has ? hab.completedDates.filter(d => d !== date) : [...hab.completedDates, date] };
    }));
  };

  const getStreak = (habit: Habit) => {
    let streak = 0;
    const d = new Date(today);
    while (habit.completedDates.includes(d.toISOString().split('T')[0])) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const colors = ['#6366f1', '#ec4899', '#14b8a6', '#8b5cf6', '#ef4444'];
    setHabits(h => [...h, { id: Date.now(), name: newHabit.trim(), completedDates: [], color: colors[h.length % colors.length] }]);
    setNewHabit('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '10px' }}>
        <input type="text" value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()} placeholder="Add new habit… (e.g. 🧘 Meditate 10 min)" className="input" style={{ flex: 1, height: 'auto', padding: '8px 12px' }} />
        <button onClick={addHabit} className="btn btn-primary">Add Habit</button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px', minWidth: '200px' }}>Habit</th>
              {days.map(d => (
                <th key={d} style={{ textAlign: 'center', padding: '8px', fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>
                  {new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                  <br />
                  {new Date(d + 'T12:00:00').getDate()}
                </th>
              ))}
              <th style={{ textAlign: 'center', padding: '8px', fontSize: '0.75rem' }}>Streak</th>
            </tr>
          </thead>
          <tbody>
            {habits.map(hab => (
              <tr key={hab.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '10px 8px', fontWeight: 500, fontSize: '0.9rem' }}>
                  <span style={{ borderLeft: `3px solid ${hab.color}`, paddingLeft: '8px' }}>{hab.name}</span>
                </td>
                {days.map(d => {
                  const done = hab.completedDates.includes(d);
                  const isToday = d === today.toISOString().split('T')[0];
                  return (
                    <td key={d} style={{ textAlign: 'center', padding: '10px 8px' }}>
                      <button onClick={() => toggle(hab.id, d)}
                        style={{
                          width: '30px', height: '30px',
                          borderRadius: '50%',
                          border: `2px solid ${done ? hab.color : isToday ? hab.color + '60' : 'var(--color-border)'}`,
                          background: done ? hab.color : 'transparent',
                          cursor: 'pointer',
                          color: done ? '#fff' : 'var(--color-fg-muted)',
                          fontSize: '0.85rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: 'auto',
                          transition: 'all 0.15s'
                        }}>
                        {done ? '✓' : ''}
                      </button>
                    </td>
                  );
                })}
                <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                  <span style={{ fontWeight: 700, color: getStreak(hab) > 0 ? '#f59e0b' : 'var(--color-fg-muted)' }}>
                    {getStreak(hab) > 0 ? `🔥 ${getStreak(hab)}` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 8. DAILY PLANNER
// ==========================================
interface PlanTask { id: number; time: string; task: string; priority: 'high' | 'medium' | 'low'; done: boolean; }

export const DailyPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<PlanTask[]>([
    { id: 1, time: '09:00', task: 'Morning standup', priority: 'high', done: false },
    { id: 2, time: '10:00', task: 'Deep work block', priority: 'high', done: false },
    { id: 3, time: '12:30', task: 'Lunch break', priority: 'low', done: false },
    { id: 4, time: '14:00', task: 'Code review', priority: 'medium', done: false }
  ]);
  const [newTime, setNewTime] = useState('');
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const addTask = () => {
    if (!newTask.trim() || !newTime) return;
    setTasks(prev => [...prev, { id: Date.now(), time: newTime, task: newTask.trim(), priority: newPriority, done: false }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTask('');
  };

  const toggleDone = (id: number) => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id: number) => setTasks(p => p.filter(t => t.id !== id));

  const priorityColors: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

  const doneCount = tasks.filter(t => t.done).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="input" style={{ width: '100px', height: 'auto', padding: '6px 8px' }} />
        <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Task description…" className="input" style={{ flex: 1, minWidth: '180px', height: 'auto', padding: '6px 10px' }} />
        <select value={newPriority} onChange={e => setNewPriority(e.target.value as 'high' | 'medium' | 'low')} className="input" style={{ width: '110px', height: 'auto', padding: '6px 8px' }}>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <button onClick={addTask} className="btn btn-primary">Add Task</button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Today's Schedule</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)' }}>{doneCount}/{tasks.length} completed</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasks.sort((a, b) => a.time.localeCompare(b.time)).map(t => (
            <div key={t.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: t.done ? 'var(--color-bg-subtle)' : 'transparent',
              border: '1px solid var(--color-border)',
              opacity: t.done ? 0.6 : 1,
              transition: 'all 0.2s'
            }}>
              <button onClick={() => toggleDone(t.id)} style={{
                width: '22px', height: '22px',
                borderRadius: '50%',
                border: `2px solid ${t.done ? '#22c55e' : 'var(--color-border)'}`,
                background: t.done ? '#22c55e' : 'transparent',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '0.75rem',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{t.done ? '✓' : ''}</button>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', minWidth: '42px', fontVariantNumeric: 'tabular-nums' }}>{t.time}</span>
              <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none' }}>{t.task}</span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '99px', background: priorityColors[t.priority] + '22', color: priorityColors[t.priority], fontWeight: 600 }}>{t.priority}</span>
              <button onClick={() => removeTask(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', fontSize: '1rem' }}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. CHECKLIST GENERATOR
// ==========================================
interface CheckItem { id: number; text: string; checked: boolean; indent: number; }

export const ChecklistGenerator: React.FC = () => {
  const [title, setTitle] = useState('My Checklist');
  const [items, setItems] = useState<CheckItem[]>([
    { id: 1, text: 'First item', checked: false, indent: 0 },
    { id: 2, text: 'Sub-item', checked: false, indent: 1 },
    { id: 3, text: 'Second item', checked: false, indent: 0 }
  ]);
  const [newText, setNewText] = useState('');

  const addItem = () => {
    if (!newText.trim()) return;
    setItems(prev => [...prev, { id: Date.now(), text: newText.trim(), checked: false, indent: 0 }]);
    setNewText('');
  };

  const toggle = (id: number) => setItems(p => p.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const remove = (id: number) => setItems(p => p.filter(i => i.id !== id));
  const indent = (id: number, dir: 1 | -1) => setItems(p => p.map(i => i.id === id ? { ...i, indent: Math.max(0, Math.min(2, i.indent + dir)) } : i));

  const handleDownload = () => {
    const lines = [`# ${title}\n`];
    items.forEach(i => {
      lines.push(`${'  '.repeat(i.indent)}- [${i.checked ? 'x' : ' '}] ${i.text}`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'checklist.md'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Checklist downloaded as Markdown!');
  };

  const done = items.filter(i => i.checked).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input" style={{ fontWeight: 700, fontSize: '1.1rem', height: 'auto', padding: '8px 12px' }} placeholder="Checklist title…" />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="New item…" className="input" style={{ flex: 1, height: 'auto', padding: '6px 10px' }} />
          <button onClick={addItem} className="btn btn-primary" style={{ padding: '6px 14px' }}>Add</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingLeft: `${item.indent * 24}px`,
              padding: `6px ${item.indent * 24 + 6}px 6px`,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-subtle)',
              transition: 'all 0.15s'
            }}>
              <input type="checkbox" checked={item.checked} onChange={() => toggle(item.id)} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
              <span style={{ flex: 1, textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--color-fg-muted)' : 'inherit' }}>{item.text}</span>
              <button onClick={() => indent(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', fontSize: '0.85rem' }}>←</button>
              <button onClick={() => indent(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', fontSize: '0.85rem' }}>→</button>
              <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', fontSize: '1rem' }}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 600 }}>Progress</h3>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{done}/{items.length}</div>
          <div style={{ marginTop: '8px', height: '8px', borderRadius: '99px', background: 'var(--color-border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${items.length ? (done / items.length) * 100 : 0}%`, background: 'var(--color-primary)', borderRadius: '99px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--color-fg-muted)' }}>{items.length ? Math.round((done / items.length) * 100) : 0}% complete</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Export</h3>
          <button onClick={handleDownload} className="btn btn-primary">Download as Markdown</button>
          <button onClick={() => { setItems([]); setTitle('My Checklist'); }} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>Clear All</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. MIND MAP GENERATOR
// ==========================================
interface MindNode { id: number; text: string; parentId: number | null; children: number[]; x?: number; y?: number; }

export const MindMapGenerator: React.FC = () => {
  const [nodes, setNodes] = useState<MindNode[]>([
    { id: 1, text: 'Central Idea', parentId: null, children: [2, 3, 4] },
    { id: 2, text: 'Branch A', parentId: 1, children: [5, 6] },
    { id: 3, text: 'Branch B', parentId: 1, children: [7] },
    { id: 4, text: 'Branch C', parentId: 1, children: [] },
    { id: 5, text: 'Sub A1', parentId: 2, children: [] },
    { id: 6, text: 'Sub A2', parentId: 2, children: [] },
    { id: 7, text: 'Sub B1', parentId: 3, children: [] }
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#ef4444'];

  const addChild = (parentId: number) => {
    const newId = Date.now();
    setNodes(prev => [
      ...prev.map(n => n.id === parentId ? { ...n, children: [...n.children, newId] } : n),
      { id: newId, text: 'New Node', parentId, children: [] }
    ]);
  };

  const removeNode = (id: number) => {
    if (id === 1) { toast.error('Cannot remove the root node.'); return; }
    const toRemove = new Set<number>();
    const collect = (nid: number) => {
      toRemove.add(nid);
      nodes.find(n => n.id === nid)?.children.forEach(collect);
    };
    collect(id);
    const parent = nodes.find(n => n.children.includes(id));
    setNodes(prev => prev.filter(n => !toRemove.has(n.id)).map(n => n.id === parent?.id ? { ...n, children: n.children.filter(c => c !== id) } : n));
  };

  const startEdit = (node: MindNode) => {
    setEditingId(node.id);
    setEditText(node.text);
  };

  const saveEdit = (id: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, text: editText } : n));
    setEditingId(null);
  };

  const getDepth = (node: MindNode): number => {
    if (!node.parentId) return 0;
    const parent = nodes.find(n => n.id === node.parentId);
    return parent ? getDepth(parent) + 1 : 0;
  };

  const renderNode = (node: MindNode): React.ReactNode => {
    const depth = getDepth(node);
    const color = depth === 0 ? 'var(--color-primary)' : COLORS[(node.parentId || 0) % COLORS.length];
    const childNodes = node.children.map(cid => nodes.find(n => n.id === cid)).filter(Boolean) as MindNode[];

    return (
      <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
        <div style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{
            padding: depth === 0 ? '10px 20px' : '6px 14px',
            background: color + (depth === 0 ? '' : '22'),
            color: depth === 0 ? '#fff' : color,
            border: `2px solid ${color}`,
            borderRadius: depth === 0 ? '50px' : '8px',
            fontWeight: depth === 0 ? 700 : 600,
            fontSize: depth === 0 ? '1rem' : '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            minWidth: '80px',
            justifyContent: 'center',
            boxShadow: depth === 0 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
          }}>
            {editingId === node.id ? (
              <input
                autoFocus
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onBlur={() => saveEdit(node.id)}
                onKeyDown={e => e.key === 'Enter' && saveEdit(node.id)}
                style={{ border: 'none', background: 'transparent', outline: 'none', color: 'inherit', font: 'inherit', width: `${Math.max(editText.length, 8)}ch` }}
              />
            ) : (
              <span onDoubleClick={() => startEdit(node)}>{node.text}</span>
            )}
            <button onClick={() => addChild(node.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: depth === 0 ? '#fff' : color, fontSize: '1rem', lineHeight: 1, padding: 0 }} title="Add child">+</button>
            {depth > 0 && <button onClick={() => removeNode(node.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: depth === 0 ? '#fff' : color, fontSize: '0.85rem', lineHeight: 1, padding: 0 }} title="Remove">×</button>}
          </div>
          {childNodes.length > 0 && (
            <div style={{ width: '2px', height: '20px', background: color + '60', margin: '0 auto' }} />
          )}
        </div>
        {childNodes.length > 0 && (
          <div style={{ display: 'flex', gap: '16px', position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}>
            {childNodes.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  const root = nodes.find(n => n.parentId === null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)' }}>Double-click any node to rename it. Click + to add children. Click × to delete.</span>
      </div>

      <div className="card" style={{ padding: '2rem', overflowX: 'auto', minHeight: '300px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        {root && renderNode(root)}
      </div>
    </div>
  );
};
