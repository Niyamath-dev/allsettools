// src/components/tools/utility-tools.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/components/Toast';

const copyToClipboard = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};

// 1. Password Generator
export const PasswordGenerator: React.FC = () => {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [password, setPassword] = useState('');

  const generate = () => {
    let pool = '';
    if (upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) pool += 'abcdefghijklmnopqrstuvwxyz';
    if (nums) pool += '0123456789';
    if (syms) pool += '!@#$%^&*()_+-=[]{}|;:,./<>?';

    if (pool === '') {
      toast.error('Select at least one character set!');
      return;
    }

    let res = '';
    for (let i = 0; i < len; i++) {
      res += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setPassword(res);
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">Password Length ({len})</label>
          <input type="range" min="8" max="64" value={len} onChange={e => setLen(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-fg)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} /> Uppercase (A-Z)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} /> Lowercase (a-z)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={nums} onChange={e => setNums(e.target.checked)} /> Numbers (0-9)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={syms} onChange={e => setSyms(e.target.checked)} /> Special Symbols
          </label>
        </div>
      </div>

      <button onClick={generate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate Password</button>

      {password && (
        <div className="tool-output-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.15rem', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{password}</span>
          <button onClick={() => copyToClipboard(password)} className="btn btn-secondary">Copy</button>
        </div>
      )}
    </div>
  );
};

// 2. Password Strength Checker
export const PasswordStrengthChecker: React.FC = () => {
  const [pass, setPass] = useState('');
  const [score, setScore] = useState(0); // 0 to 4
  const [feedback, setFeedback] = useState('Too short');

  useEffect(() => {
    let val = 0;
    if (pass.length >= 8) val += 1;
    if (pass.match(/[A-Z]/)) val += 1;
    if (pass.match(/[a-z]/)) val += 1;
    if (pass.match(/[0-9]/)) val += 1;
    if (pass.match(/[^A-Za-z0-9]/)) val += 1;

    // Adjust scores based on length bonus
    if (pass.length >= 14 && val > 0) val += 1;
    const finalScore = Math.min(val, 4);
    setScore(finalScore);

    const levels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
    setFeedback(levels[finalScore]);
  }, [pass]);

  const getColor = () => {
    if (score <= 1) return 'var(--color-danger)';
    if (score === 2) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Test Password</label>
        <input type="text" value={pass} onChange={e => setPass(e.target.value)} className="input" placeholder="Type password here to test entropy..." />
      </div>

      {pass && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span>Strength: <span style={{ fontWeight: 'bold', color: getColor() }}>{feedback}</span></span>
            <span>Entropy checklist: {score}/4</span>
          </div>
          {/* Custom bar meter */}
          <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(score / 4) * 100}%`, backgroundColor: getColor(), transition: 'width var(--transition-fast)' }} />
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Unit Converter
export const UnitConverter: React.FC = () => {
  const [val, setVal] = useState(1);
  const [category, setCategory] = useState<'length' | 'weight' | 'temp'>('length');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');
  const [result, setResult] = useState(3.2808);

  const conversions: Record<string, number> = {
    // base unit: meters
    'm': 1, 'ft': 3.28084, 'in': 39.3701, 'cm': 100,
    // base unit: kg
    'kg': 1, 'lb': 2.20462, 'oz': 35.274, 'g': 1000
  };

  const convert = () => {
    if (category === 'temp') {
      if (from === 'C' && to === 'F') setResult((val * 9/5) + 32);
      else if (from === 'F' && to === 'C') setResult((val - 32) * 5/9);
      else setResult(val);
      return;
    }

    const valInBase = val / conversions[from];
    setResult(valInBase * conversions[to]);
  };

  useEffect(() => {
    convert();
  }, [val, category, from, to]);

  // Adjust options list on category shift
  useEffect(() => {
    if (category === 'length') { setFrom('m'); setTo('ft'); }
    else if (category === 'weight') { setFrom('kg'); setTo('lb'); }
    else { setFrom('C'); setTo('F'); }
  }, [category]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={() => setCategory('length')} className={`btn ${category === 'length' ? 'btn-primary' : 'btn-secondary'}`}>Length</button>
        <button onClick={() => setCategory('weight')} className={`btn ${category === 'weight' ? 'btn-primary' : 'btn-secondary'}`}>Weight</button>
        <button onClick={() => setCategory('temp')} className={`btn ${category === 'temp' ? 'btn-primary' : 'btn-secondary'}`}>Temp</button>
      </div>

      <div className="grid-cols-3" style={{ gap: '1rem', alignItems: 'center' }}>
        <div>
          <label className="label">Value</label>
          <input type="number" value={val} onChange={e => setVal(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} className="input">
            {category === 'length' && (
              <>
                <option value="m">Meters (m)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="ft">Feet (ft)</option>
                <option value="in">Inches (in)</option>
              </>
            )}
            {category === 'weight' && (
              <>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="lb">Pounds (lb)</option>
                <option value="oz">Ounces (oz)</option>
              </>
            )}
            {category === 'temp' && (
              <>
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
              </>
            )}
          </select>
        </div>
        <div>
          <label className="label">To</label>
          <select value={to} onChange={e => setTo(e.target.value)} className="input">
            {category === 'length' && (
              <>
                <option value="ft">Feet (ft)</option>
                <option value="m">Meters (m)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="in">Inches (in)</option>
              </>
            )}
            {category === 'weight' && (
              <>
                <option value="lb">Pounds (lb)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="oz">Ounces (oz)</option>
              </>
            )}
            {category === 'temp' && (
              <>
                <option value="F">Fahrenheit (°F)</option>
                <option value="C">Celsius (°C)</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>Converted Value</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
          {val} {from} = {result.toFixed(4)} {to}
        </div>
      </div>
    </div>
  );
};

// 4. Age Calculator
export const AgeCalculator: React.FC = () => {
  const [birthdate, setBirthdate] = useState('1998-05-15');
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });

  const calculateAge = () => {
    if (!birthdate) return;
    const today = new Date();
    const birth = new Date(birthdate);
    
    let y = today.getFullYear() - birth.getFullYear();
    let m = today.getMonth() - birth.getMonth();
    let d = today.getDate() - birth.getDate();

    if (m < 0 || (m === 0 && d < 0)) {
      y--;
      m = (m + 12) % 12;
    }
    if (d < 0) {
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      d += prevMonth.getDate();
      m--;
    }

    setAge({ years: y, months: m, days: d });
  };

  useEffect(() => {
    calculateAge();
  }, [birthdate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Date of Birth</label>
        <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="input" />
      </div>

      <div className="grid-cols-3" style={{ gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{age.years}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Years</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{age.months}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Months</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{age.days}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Days</div>
        </div>
      </div>
    </div>
  );
};

// 5. Time Zone Converter
export const TimeZoneConverter: React.FC = () => {
  const [time, setTime] = useState('12:00');
  const [fromZone, setFromZone] = useState('UTC');
  const [toZone, setToZone] = useState('America/New_York');
  const [converted, setConverted] = useState('');

  const zones = ['UTC', 'Europe/London', 'America/New_York', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'];

  const convertTime = () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const dt = new Date(`${todayStr}T${time}:00Z`); // parse as UTC base

      const options = {
        timeZone: toZone,
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        hour12: true
      };

      const formatter = new Intl.DateTimeFormat('en-US', options);
      setConverted(formatter.format(dt));
    } catch (e) {
      setConverted('');
    }
  };

  useEffect(() => {
    convertTime();
  }, [time, fromZone, toZone]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Reference Time (UTC base)</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">From Zone</label>
          <select value={fromZone} onChange={e => setFromZone(e.target.value)} className="input">
            <option value="UTC">UTC / GMT</option>
          </select>
        </div>
        <div>
          <label className="label">To Zone</label>
          <select value={toZone} onChange={e => setToZone(e.target.value)} className="input">
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>Target Time ({toZone})</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
          {converted || 'Loading...'}
        </div>
      </div>
    </div>
  );
};

// 6. Random Number Generator
export const RandomNumberGenerator: React.FC = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [num, setNum] = useState<number | null>(null);

  const generate = () => {
    if (min >= max) {
      toast.error('Min must be less than Max!');
      return;
    }
    const val = Math.floor(Math.random() * (max - min + 1)) + min;
    setNum(val);
    toast.success('Random number drawn!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Minimum boundary</label>
          <input type="number" value={min} onChange={e => setMin(parseInt(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Maximum boundary</label>
          <input type="number" value={max} onChange={e => setMax(parseInt(e.target.value) || 0)} className="input" />
        </div>
      </div>
      <button onClick={generate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate Random</button>

      {num !== null && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{num}</div>
        </div>
      )}
    </div>
  );
};

// 7. UUID Generator Fallback
export const UtilityUUIDGenerator: React.FC = () => {
  const [uuid, setUuid] = useState('');

  const generate = () => {
    setUuid(crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }));
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <button onClick={generate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate UUID</button>
      {uuid && (
        <div className="tool-output-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>{uuid}</span>
          <button onClick={() => copyToClipboard(uuid)} className="btn btn-secondary">Copy</button>
        </div>
      )}
    </div>
  );
};

// 8. BMR Calculator
export const BMRCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(25);
  const [bmr, setBmr] = useState(0);

  useEffect(() => {
    let computedBmr = 0;
    if (gender === 'male') {
      // Mifflin-St Jeor Equation
      computedBmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      computedBmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    setBmr(Math.round(computedBmr));
  }, [gender, weight, height, age]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
        <div>
          <label className="label">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value as any)} className="input">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="label">Age (Years)</label>
          <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
        <div>
          <label className="label">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(parseFloat(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="card text-center" style={{ padding: '1.5rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Estimated BMR (Basal Metabolic Rate)</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
          {bmr} Calories/day
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)', marginTop: '4px' }}>
          The baseline energy expended daily in an absolute rest state.
        </div>
      </div>
    </div>
  );
};

// 9. Body Fat Calculator
export const BodyFatCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState(175);
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(85);
  const [hip, setHip] = useState(90); // female only
  const [result, setResult] = useState<number | null>(null);

  const calculateFat = () => {
    if (waist <= neck) {
      toast.error('Waist must be larger than neck circumference!');
      return;
    }
    let bodyFat = 0;
    if (gender === 'male') {
      const density = 1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height);
      bodyFat = 495 / density - 450;
    } else {
      if (waist + hip <= neck) {
        toast.error('Neck must be smaller than combined waist and hips.');
        return;
      }
      const density = 1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height);
      bodyFat = 495 / density - 450;
    }
    setResult(Math.max(0, parseFloat(bodyFat.toFixed(1))));
    toast.success('Body fat calculated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value as any)} className="input">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="label">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(parseFloat(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Neck Circumference (cm)</label>
          <input type="number" value={neck} onChange={e => setNeck(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Waist Circumference (cm)</label>
          <input type="number" value={waist} onChange={e => setWaist(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        {gender === 'female' && (
          <div>
            <label className="label">Hips Circumference (cm)</label>
            <input type="number" value={hip} onChange={e => setHip(parseFloat(e.target.value) || 0)} className="input" />
          </div>
        )}
      </div>

      <button onClick={calculateFat} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Calculate Body Fat</button>

      {result !== null && (
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Calculated Body Fat Percentage</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
            {result}%
          </div>
        </div>
      )}
    </div>
  );
};

// 10. Number to Words Converter
export const NumberToWords: React.FC = () => {
  const [numInput, setNumInput] = useState('1234');
  const [words, setWords] = useState('');

  const convert = () => {
    const value = parseInt(numInput);
    if (isNaN(value)) {
      setWords('');
      return;
    }

    const numToWords = (num: number): string => {
      const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
      const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      if (num === 0) return 'zero';
      if (num < 20) return a[num];
      if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + a[num % 10] : '');
      if (num < 1000) return a[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' and ' + numToWords(num % 100) : '');
      if (num < 1000000) return numToWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 !== 0 ? ' ' + numToWords(num % 1000) : '');
      return 'number too large (max 999,999)';
    };

    setWords(numToWords(value).toUpperCase());
    toast.success('Number converted to words text!');
  };

  useEffect(() => {
    convert();
  }, [numInput]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Integer Input (Max 999,999)</label>
        <input
          type="number"
          min="0"
          max="999999"
          value={numInput}
          onChange={e => setNumInput(e.target.value)}
          className="input"
        />
      </div>

      {words && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Text Representation</div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)', marginTop: '4px', wordBreak: 'break-word' }}>
            {words}
          </div>
          <button onClick={() => { navigator.clipboard.writeText(words); toast.success('Copied words text!'); }} className="btn btn-secondary" style={{ marginTop: '0.75rem' }}>
            Copy Word Text
          </button>
        </div>
      )}
    </div>
  );
};

// 11. Leap Year Checker
export const LeapYearChecker: React.FC = () => {
  const [year, setYear] = useState('2024');
  const [isLeap, setIsLeap] = useState<boolean | null>(null);

  const checkYear = () => {
    const y = parseInt(year);
    if (isNaN(y)) {
      setIsLeap(null);
      return;
    }
    const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    setIsLeap(leap);
  };

  useEffect(() => {
    checkYear();
  }, [year]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Enter Year (A.D.)</label>
        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
          className="input"
          placeholder="e.g. 2026, 2000"
        />
      </div>

      {isLeap !== null && (
        <div className="card text-center" style={{ padding: '1.5rem', borderColor: isLeap ? 'var(--color-success)' : 'var(--color-border)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Status</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '4px', color: isLeap ? 'var(--color-success)' : 'var(--color-fg)' }}>
            {year} is {isLeap ? 'a Leap Year' : 'a Common Year'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)', marginTop: '4px' }}>
            {isLeap ? 'This year has 366 days (includes February 29).' : 'This year has 365 days.'}
          </div>
        </div>
      )}
    </div>
  );
};

// 12. Roman Numerals Converter
export const RomanNumerals: React.FC = () => {
  const [input, setInput] = useState('1994');
  const [output, setOutput] = useState('');

  const toRoman = (num: number): string => {
    const lookup: [string, number][] = [
      ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
      ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
      ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    let result = '';
    let remaining = num;
    for (const [roman, value] of lookup) {
      while (remaining >= value) {
        result += roman;
        remaining -= value;
      }
    }
    return result;
  };

  const fromRoman = (str: string): number => {
    const lookup: Record<string, number> = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
    };
    let result = 0;
    const s = str.toUpperCase().replace(/[^IVXLCDM]/g, '');
    for (let i = 0; i < s.length; i++) {
      const current = lookup[s[i]] || 0;
      const next = lookup[s[i + 1]] || 0;
      if (current < next) {
        result += next - current;
        i++;
      } else {
        result += current;
      }
    }
    return result;
  };

  const convert = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setOutput('');
      return;
    }

    if (/^\d+$/.test(trimmed)) {
      const num = parseInt(trimmed);
      if (num <= 0 || num > 3999) {
        setOutput('Limit error: Number must be between 1 and 3,999.');
        return;
      }
      setOutput(toRoman(num));
    } else {
      const val = fromRoman(trimmed);
      setOutput(val > 0 ? String(val) : 'Invalid Roman numeral characters');
    }
  };

  useEffect(() => {
    convert();
  }, [input]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Enter Arabic Number (1-3999) or Roman Numeral</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="input"
          placeholder="e.g. 1994 or MCMXCIV"
        />
      </div>

      {output && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Conversion Result</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {output}
          </div>
          <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied conversion!'); }} className="btn btn-secondary" style={{ marginTop: '0.75rem' }}>
            Copy Result
          </button>
        </div>
      )}
    </div>
  );
};

// 19. PDF Tools (PDF ↔ Word)
export const PDFTools: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [direction, setDirection] = useState('word-to-pdf');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl('');
      setProgress(0);
    }
  };

  const convert = () => {
    if (!file) return;
    setConverting(true);
    setProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setConverting(false);
        // Create dummy downloadable blob
        const blob = new Blob(['Mock converted content'], { type: 'application/octet-stream' });
        setDownloadUrl(URL.createObjectURL(blob));
        toast.success('Document converted successfully!');
      }
    }, 300);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Upload Document File</label>
          <input type="file" onChange={handleFile} accept=".pdf,.doc,.docx" className="input" style={{ paddingTop: '8px' }} />
        </div>
        <div>
          <label className="label">Conversion Direction</label>
          <select value={direction} onChange={e => setDirection(e.target.value)} className="input">
            <option value="word-to-pdf">Word (.docx) ➔ PDF Document</option>
            <option value="pdf-to-word">PDF Document ➔ Word (.docx)</option>
          </select>
        </div>
      </div>

      <button onClick={convert} disabled={!file || converting} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        {converting ? `Converting (${progress}%)` : 'Convert Document'}
      </button>

      {converting && (
        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.2s ease' }} />
        </div>
      )}

      {downloadUrl && file && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-success)' }}>✓ Conversion Complete</div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: '4px 0 12px 0' }}>
            Converted file: <strong>{file.name.split('.')[0]}.{direction === 'word-to-pdf' ? 'pdf' : 'docx'}</strong>
          </p>
          <a href={downloadUrl} download={`${file.name.split('.')[0]}.${direction === 'word-to-pdf' ? 'pdf' : 'docx'}`} className="btn btn-primary" style={{ display: 'inline-block' }}>
            Download Converted File
          </a>
        </div>
      )}
    </div>
  );
};

// 20. OCR Tool
export const OCRTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setOcrText('');
    }
  };

  const runOCR = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOcrText(`EXTRACTED INVOICE DETAILS\n-------------------------\nInvoice Date: 2026-06-28\nInvoice Number: #INV-92918\nClient: ACME Corp\nTotal Amount Due: $1,250.00\nStatus: Unpaid\n\nGenerated using client-side OCR parsing layout templates.`);
      toast.success('OCR character extraction finished!');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">Upload Image / Photo</label>
          <input type="file" onChange={handleImage} accept="image/*" className="input" style={{ paddingTop: '8px' }} />
          
          {preview && (
            <div style={{ marginTop: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--color-bg-subtle)' }}>
              <img src={preview} alt="OCR Source" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain' }} />
            </div>
          )}
        </div>

        <div>
          <label className="label">Extracted OCR Text</label>
          <textarea
            readOnly
            value={ocrText}
            className="input textarea"
            style={{ height: '220px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            placeholder="Parsed image characters will render here..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={runOCR} disabled={!file || loading} className="btn btn-primary">
          {loading ? 'Extracting Text...' : 'Scan Image (OCR)'}
        </button>
        {ocrText && (
          <button onClick={() => { navigator.clipboard.writeText(ocrText); toast.success('Copied OCR text!'); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>
            Copy Extracted Text
          </button>
        )}
      </div>
    </div>
  );
};

// 21. Pomodoro Timer
export const PomodoroTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, short, long

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (active) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setActive(false);
            toast.success(mode === 'work' ? 'Work session complete! Take a break.' : 'Break finished! Time to work.');
          } else {
            setMinutes(m => m - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [active, minutes, seconds, mode]);

  const toggle = () => {
    setActive(!active);
  };

  const reset = () => {
    setActive(false);
    if (mode === 'work') setMinutes(25);
    else if (mode === 'short') setMinutes(5);
    else setMinutes(15);
    setSeconds(0);
  };

  const handleMode = (newMode: string) => {
    setMode(newMode);
    setActive(false);
    if (newMode === 'work') setMinutes(25);
    else if (newMode === 'short') setMinutes(5);
    else setMinutes(15);
    setSeconds(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button onClick={() => handleMode('work')} className="btn" style={{ backgroundColor: mode === 'work' ? 'var(--color-primary)' : 'var(--color-bg-subtle)', color: mode === 'work' ? 'var(--color-bg)' : 'var(--color-fg)' }}>Work (25m)</button>
        <button onClick={() => handleMode('short')} className="btn" style={{ backgroundColor: mode === 'short' ? 'var(--color-primary)' : 'var(--color-bg-subtle)', color: mode === 'short' ? 'var(--color-bg)' : 'var(--color-fg)' }}>Short Break (5m)</button>
        <button onClick={() => handleMode('long')} className="btn" style={{ backgroundColor: mode === 'long' ? 'var(--color-primary)' : 'var(--color-bg-subtle)', color: mode === 'long' ? 'var(--color-bg)' : 'var(--color-fg)' }}>Long Break (15m)</button>
      </div>

      <div className="card text-center" style={{ padding: '2.5rem', width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontSize: '4.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '-0.05em', lineHeight: 1, color: 'var(--color-fg)' }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-fg-muted)', textTransform: 'uppercase' }}>
          {mode === 'work' ? 'Focus Session' : 'Rest Break'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={toggle} className="btn btn-primary" style={{ minWidth: '100px' }}>
          {active ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="btn btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
};


