// src/components/tools/finance-tools.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/components/Toast';

// Currency configurations
const CURRENCIES = [
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'INR', symbol: '₹', locale: 'en-IN' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'CAD', symbol: 'CA$', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', locale: 'en-AUD' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP' }
];

// Format helper
const formatCurrency = (val: number, code: string): string => {
  const curr = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  return new Intl.NumberFormat(curr.locale, {
    style: 'currency',
    currency: curr.code,
    maximumFractionDigits: 0
  }).format(val);
};

// Reusable Selector
const CurrencySelector: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-end', marginBottom: '8px' }}>
      <label className="label" style={{ margin: 0, fontSize: '0.8rem' }}>Currency:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        style={{ width: '100px', padding: '4px 8px', fontSize: '0.8rem', height: 'auto' }}
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
        ))}
      </select>
    </div>
  );
};

// ==========================================
// 1. SIP CALCULATOR
// ==========================================
export const SIPCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  
  const [result, setResult] = useState({
    invested: 0,
    wealthGained: 0,
    futureValue: 0,
    schedule: [] as Array<{ year: number; invested: number; wealth: number; balance: number }>
  });

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  useEffect(() => {
    const P = monthlyInvestment;
    const i = returnRate / 12 / 100;
    const t = years * 12;
    
    let invested = P * t;
    let futureValue = 0;
    if (i === 0) {
      futureValue = invested;
    } else {
      futureValue = P * ((Math.pow(1 + i, t) - 1) / i) * (1 + i);
    }
    
    let wealthGained = Math.max(0, futureValue - invested);
    
    const schedule = [];
    for (let y = 1; y <= years; y++) {
      const months = y * 12;
      const inv = P * months;
      const fv = i === 0 ? inv : P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
      schedule.push({
        year: y,
        invested: inv,
        wealth: Math.max(0, fv - inv),
        balance: fv
      });
    }

    setResult({ invested, wealthGained, futureValue, schedule });
  }, [monthlyInvestment, returnRate, years]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>SIP Investment Inputs</h3>
          <div>
            <label className="label">Monthly Investment: {formatCurrency(monthlyInvestment, currency)}</label>
            <input
              type="range"
              min="10"
              max="10000"
              step="50"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label className="label">Expected Return Rate: {returnRate}%</label>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label className="label">Time Period: {years} Years</label>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Estimated Return Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Invested Amount:</span>
              <strong>{formatCurrency(result.invested, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Est. Wealth Gained:</span>
              <strong style={{ color: 'var(--color-success)' }}>{formatCurrency(result.wealthGained, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
              <span>Future Value:</span>
              <strong style={{ fontSize: '1.2rem', color: '#3b82f6' }}>{formatCurrency(result.futureValue, currency)}</strong>
            </div>
          </div>
          
          <div style={{ display: 'flex', height: '16px', borderRadius: '8px', overflow: 'hidden', marginTop: '10px' }}>
            <div style={{ width: `${(result.invested / result.futureValue) * 100}%`, backgroundColor: '#3b82f6' }} title="Invested" />
            <div style={{ width: `${(result.wealthGained / result.futureValue) * 100}%`, backgroundColor: 'var(--color-success)' }} title="Est. Wealth" />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Yearly Projection Schedule</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Year</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Invested Amount</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Interest Gained</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Total Future Value</th>
            </tr>
          </thead>
          <tbody>
            {result.schedule.map((item) => (
              <tr key={item.year} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px' }}>Year {item.year}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(item.invested, currency)}</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'var(--color-success)' }}>{formatCurrency(item.wealth, currency)}</td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.balance, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 2. COMPOUND INTEREST CALCULATOR
// ==========================================
export const CompoundInterestCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState(12); // Monthly compounding
  
  const [result, setResult] = useState({
    totalInvested: 0,
    totalInterest: 0,
    futureValue: 0,
    schedule: [] as Array<{ year: number; invested: number; interest: number; balance: number }>
  });

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  useEffect(() => {
    let balance = principal;
    let totalInvested = principal;
    const schedule = [];
    const totalMonths = years * 12;
    const compoundStep = 12 / frequency;
    
    for (let m = 1; m <= totalMonths; m++) {
      balance += monthlyContribution;
      totalInvested += monthlyContribution;
      
      if (m % compoundStep === 0) {
        const ratePerCompound = (rate / 100) / frequency;
        balance = balance * (1 + ratePerCompound);
      }
      
      if (m % 12 === 0) {
        const y = m / 12;
        schedule.push({
          year: y,
          invested: totalInvested,
          interest: Math.max(0, balance - totalInvested),
          balance
        });
      }
    }
    
    setResult({
      totalInvested,
      totalInterest: Math.max(0, balance - totalInvested),
      futureValue: balance,
      schedule
    });
  }, [principal, monthlyContribution, rate, years, frequency]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Compound Settings</h3>
          
          <div className="grid-cols-2" style={{ gap: '10px' }}>
            <div>
              <label className="label">Initial Principal ({currSymbol})</label>
              <input type="number" value={principal} onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)} className="input" />
            </div>
            <div>
              <label className="label">Monthly Deposit ({currSymbol})</label>
              <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)} className="input" />
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '10px' }}>
            <div>
              <label className="label">Interest Rate (%)</label>
              <input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="input" />
            </div>
            <div>
              <label className="label">Time Term (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(parseInt(e.target.value) || 1)} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Compounding Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} className="input">
              <option value="12">Monthly compounding (12/year)</option>
              <option value="4">Quarterly compounding (4/year)</option>
              <option value="1">Annual compounding (1/year)</option>
            </select>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Estimated Results</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
              <span>Total Deposits:</span>
              <strong>{formatCurrency(result.totalInvested, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
              <span>Total Interest Accrued:</span>
              <strong style={{ color: 'var(--color-success)' }}>{formatCurrency(result.totalInterest, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
              <span>Estimated Future Value:</span>
              <strong style={{ fontSize: '1.2rem', color: '#3b82f6' }}>{formatCurrency(result.futureValue, currency)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Yearly Compound Schedule</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Year</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Total Deposits</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Total Interest</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Ending Balance</th>
            </tr>
          </thead>
          <tbody>
            {result.schedule.map((item) => (
              <tr key={item.year} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px' }}>Year {item.year}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(item.invested, currency)}</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'var(--color-success)' }}>{formatCurrency(item.interest, currency)}</td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.balance, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 3. INFLATION CALCULATOR
// ==========================================
export const InflationCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [cost, setCost] = useState(100);
  const [inflationRate, setInflationRate] = useState(3.0);
  const [years, setYears] = useState(15);
  
  const [result, setResult] = useState({
    futureCost: 0,
    purchasingPower: 0
  });

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  useEffect(() => {
    const fCost = cost * Math.pow(1 + inflationRate / 100, years);
    const power = cost / Math.pow(1 + inflationRate / 100, years);
    setResult({ futureCost: fCost, purchasingPower: power });
  }, [cost, inflationRate, years]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Inflation Settings</h3>
          <div>
            <label className="label">Current Cost of Item / Service ({currSymbol})</label>
            <input type="number" value={cost} onChange={(e) => setCost(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Annual Inflation Rate: {inflationRate}%</label>
            <input
              type="range"
              min="0.1"
              max="25"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label className="label">Time Term: {years} Years</label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Impact Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cost in {years} Years:</span>
              <strong style={{ color: 'var(--color-danger, red)' }}>{formatCurrency(result.futureCost, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
              <span>Value of current {formatCurrency(cost, currency)} in future:</span>
              <strong>{formatCurrency(result.purchasingPower, currency)}</strong>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-fg-muted)', lineHeight: '1.4' }}>
            Due to an average {inflationRate}% annual inflation, you will need {formatCurrency(result.futureCost, currency)} in {years} years to buy what costs {formatCurrency(cost, currency)} today.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. TAX CALCULATOR
// ==========================================
export const TaxCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [income, setIncome] = useState(75000);
  const [deductions, setDeductions] = useState(13850);
  
  const [result, setResult] = useState({
    taxableIncome: 0,
    taxPayable: 0,
    effectiveRate: 0,
    slabsBreakdown: [] as Array<{ rate: number; bracket: string; amount: number }>
  });

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  useEffect(() => {
    const taxable = Math.max(0, income - deductions);
    
    const brackets = [
      { rate: 0.10, limit: 11600 },
      { rate: 0.12, limit: 47150 },
      { rate: 0.22, limit: 100525 },
      { rate: 0.24, limit: 191950 },
      { rate: 0.32, limit: 243725 },
      { rate: 0.35, limit: 609350 },
      { rate: 0.37, limit: Infinity }
    ];

    let remaining = taxable;
    let taxPayable = 0;
    let prevLimit = 0;
    const slabsBreakdown = [];

    for (const b of brackets) {
      if (remaining <= 0) break;
      const bracketRange = b.limit - prevLimit;
      const taxedInThisSlab = Math.min(remaining, bracketRange);
      
      const slabTax = taxedInThisSlab * b.rate;
      taxPayable += slabTax;
      remaining -= taxedInThisSlab;
      
      slabsBreakdown.push({
        rate: b.rate * 100,
        bracket: prevLimit === 0 ? `${currSymbol}0 - ${currSymbol}${b.limit.toLocaleString()}` : `${currSymbol}${(prevLimit + 1).toLocaleString()} - ${b.limit === Infinity ? 'Above' : currSymbol + b.limit.toLocaleString()}`,
        amount: slabTax
      });
      
      prevLimit = b.limit;
    }

    const effectiveRate = income === 0 ? 0 : (taxPayable / income) * 100;
    
    setResult({
      taxableIncome: taxable,
      taxPayable,
      effectiveRate,
      slabsBreakdown
    });
  }, [income, deductions, currency]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Income Details</h3>
          <div>
            <label className="label">Annual Gross Income ({currSymbol})</label>
            <input type="number" value={income} onChange={(e) => setIncome(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Exemptions / Standard Deductions ({currSymbol})</label>
            <input type="number" value={deductions} onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)} className="input" />
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Estimated Tax Payable</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Taxable Income:</span>
              <strong>{formatCurrency(result.taxableIncome, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Federal Tax Due:</span>
              <strong style={{ color: 'var(--color-danger, red)' }}>{formatCurrency(result.taxPayable, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
              <span>Effective Tax Rate:</span>
              <strong style={{ fontSize: '1.1rem', color: '#3b82f6' }}>{result.effectiveRate.toFixed(2)}%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Progressive Slab Breakdown</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none' }}>
          {result.slabsBreakdown.map((slab, idx) => (
            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', borderBottom: '1px solid var(--color-border)' }}>
              <span>Slab: {slab.rate}% ({slab.bracket})</span>
              <strong>{formatCurrency(slab.amount, currency)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ==========================================
// 5. NET WORTH CALCULATOR
// ==========================================
export const NetWorthCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [assets, setAssets] = useState<Array<{ id: string; name: string; val: number }>>([
    { id: '1', name: 'Cash / Bank Balance', val: 5000 },
    { id: '2', name: 'Investments / Stocks', val: 12000 },
    { id: '3', name: 'Real Estate / Property', val: 250000 }
  ]);

  const [liabilities, setLiabilities] = useState<Array<{ id: string; name: string; val: number }>>([
    { id: '1', name: 'Home Mortgage Loan', val: 180000 },
    { id: '2', name: 'Credit Cards Debt', val: 1500 }
  ]);

  const addAsset = () => {
    setAssets([...assets, { id: Math.random().toString(), name: 'New Asset Item', val: 0 }]);
  };

  const updateAsset = (id: string, field: 'name' | 'val', value: any) => {
    setAssets(assets.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'val' ? parseFloat(value) || 0 : value };
      }
      return item;
    }));
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(item => item.id !== id));
  };

  const addLiability = () => {
    setLiabilities([...liabilities, { id: Math.random().toString(), name: 'New Liability Item', val: 0 }]);
  };

  const updateLiability = (id: string, field: 'name' | 'val', value: any) => {
    setLiabilities(liabilities.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'val' ? parseFloat(value) || 0 : value };
      }
      return item;
    }));
  };

  const removeLiability = (id: string) => {
    setLiabilities(liabilities.filter(item => item.id !== id));
  };

  const totalAssets = assets.reduce((sum, item) => sum + item.val, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.val, 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>
      
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-fg-muted)' }}>Estimated Net Worth</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: netWorth >= 0 ? 'var(--color-success)' : 'var(--color-danger, red)', margin: 0 }}>
          {formatCurrency(netWorth, currency)}
        </h2>
      </div>

      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-success)' }}>Assets (+)</h3>
            <button onClick={addAsset} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>+ Add Asset</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assets.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="text" value={item.name} onChange={(e) => updateAsset(item.id, 'name', e.target.value)} className="input" style={{ flex: 2, padding: '6px' }} />
                <input type="number" value={item.val} onChange={(e) => updateAsset(item.id, 'val', e.target.value)} className="input" style={{ flex: 1, padding: '6px', textAlign: 'right' }} />
                <button onClick={() => removeAsset(item.id)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}>✕</button>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px', fontWeight: 600 }}>
              <span>Total Assets:</span>
              <span>{formatCurrency(totalAssets, currency)}</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-danger, red)' }}>Liabilities (-)</h3>
            <button onClick={addLiability} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>+ Add Liability</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {liabilities.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="text" value={item.name} onChange={(e) => updateLiability(item.id, 'name', e.target.value)} className="input" style={{ flex: 2, padding: '6px' }} />
                <input type="number" value={item.val} onChange={(e) => updateLiability(item.id, 'val', e.target.value)} className="input" style={{ flex: 1, padding: '6px', textAlign: 'right' }} />
                <button onClick={() => removeLiability(item.id)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}>✕</button>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px', fontWeight: 600 }}>
              <span>Total Liabilities:</span>
              <span>{formatCurrency(totalLiabilities, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. MORTGAGE CALCULATOR
// ==========================================
export const MortgageCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [termYears, setTermYears] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  
  const [result, setResult] = useState({
    monthlyPayment: 0,
    totalPayments: 0,
    totalInterest: 0,
    amortization: [] as Array<{ year: number; interestPaid: number; principalPaid: number; balance: number }>
  });

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  useEffect(() => {
    const loanAmount = Math.max(0, homePrice - downPayment);
    const i = interestRate / 100 / 12;
    const t = termYears * 12;
    
    let monthlyPayment = 0;
    if (i === 0) {
      monthlyPayment = loanAmount / t;
    } else {
      monthlyPayment = (loanAmount * i * Math.pow(1 + i, t)) / (Math.pow(1 + i, t) - 1);
    }

    const totalPayments = monthlyPayment * t;
    const totalInterest = Math.max(0, totalPayments - loanAmount);
    
    const amortization = [];
    let balance = loanAmount;
    
    for (let y = 1; y <= termYears; y++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let m = 1; m <= 12; m++) {
        const interestPaid = balance * i;
        const principalPaid = monthlyPayment - interestPaid;
        yearInterest += interestPaid;
        yearPrincipal += principalPaid;
        balance = Math.max(0, balance - principalPaid);
      }
      amortization.push({
        year: y,
        interestPaid: yearInterest,
        principalPaid: yearPrincipal,
        balance
      });
    }

    setResult({ monthlyPayment, totalPayments, totalInterest, amortization });
  }, [homePrice, downPayment, termYears, interestRate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Mortgage Loan Details</h3>
          
          <div className="grid-cols-2" style={{ gap: '10px' }}>
            <div>
              <label className="label">Home Price ({currSymbol})</label>
              <input type="number" value={homePrice} onChange={(e) => setHomePrice(parseFloat(e.target.value) || 0)} className="input" />
            </div>
            <div>
              <label className="label">Down Payment ({currSymbol})</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)} className="input" />
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '10px' }}>
            <div>
              <label className="label">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)} className="input" />
            </div>
            <div>
              <label className="label">Loan Term (Years)</label>
              <input type="number" value={termYears} onChange={(e) => setTermYears(parseInt(e.target.value) || 1)} className="input" />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Monthly Payments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
              <span>Monthly P&I:</span>
              <strong style={{ fontSize: '1.3rem', color: '#3b82f6' }}>{formatCurrency(result.monthlyPayment, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Loan Interest:</span>
              <strong style={{ color: 'var(--color-danger, red)' }}>{formatCurrency(result.totalInterest, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Payments:</span>
              <strong>{formatCurrency(result.totalPayments, currency)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Annual Amortization Schedule</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Year</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Interest Paid</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Principal Paid</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Remaining Balance</th>
            </tr>
          </thead>
          <tbody>
            {result.amortization.map((item) => (
              <tr key={item.year} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px' }}>Year {item.year}</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'var(--color-danger, red)' }}>{formatCurrency(item.interestPaid, currency)}</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'var(--color-success)' }}>{formatCurrency(item.principalPaid, currency)}</td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.balance, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 7. SAVINGS GOAL CALCULATOR
// ==========================================
export const SavingsGoalCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [goal, setGoal] = useState(50000);
  const [startingBalance, setStartingBalance] = useState(5000);
  const [returnRate, setReturnRate] = useState(5.0);
  const [years, setYears] = useState(5);
  
  const [result, setResult] = useState({
    monthlySavingsNeeded: 0,
    totalSaved: 0,
    interestEarned: 0
  });

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  useEffect(() => {
    const months = years * 12;
    const r = returnRate / 100 / 12;
    
    const fvStarting = startingBalance * Math.pow(1 + r, months);
    const targetLeft = Math.max(0, goal - fvStarting);
    
    let monthlySavingsNeeded = 0;
    if (targetLeft > 0) {
      if (r === 0) {
        monthlySavingsNeeded = targetLeft / months;
      } else {
        monthlySavingsNeeded = (targetLeft * r) / (Math.pow(1 + r, months) - 1);
      }
    }
    
    const totalDeposits = startingBalance + (monthlySavingsNeeded * months);
    const interestEarned = Math.max(0, goal - totalDeposits);

    setResult({
      monthlySavingsNeeded,
      totalSaved: totalDeposits,
      interestEarned
    });
  }, [goal, startingBalance, returnRate, years]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Savings Target Details</h3>
          
          <div className="grid-cols-2" style={{ gap: '10px' }}>
            <div>
              <label className="label">Target Savings Goal ({currSymbol})</label>
              <input type="number" value={goal} onChange={(e) => setGoal(parseFloat(e.target.value) || 0)} className="input" />
            </div>
            <div>
              <label className="label">Starting Balance ({currSymbol})</label>
              <input type="number" value={startingBalance} onChange={(e) => setStartingBalance(parseFloat(e.target.value) || 0)} className="input" />
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '10px' }}>
            <div>
              <label className="label">Expected Return Rate (%)</label>
              <input type="number" value={returnRate} onChange={(e) => setReturnRate(parseFloat(e.target.value) || 0)} className="input" />
            </div>
            <div>
              <label className="label">Goal Timeframe (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(parseInt(e.target.value) || 1)} className="input" />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Goal Roadmap</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
              <span>Monthly Savings Needed:</span>
              <strong style={{ fontSize: '1.3rem', color: 'var(--color-success)' }}>{formatCurrency(result.monthlySavingsNeeded, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Deposits Invested:</span>
              <strong>{formatCurrency(result.totalSaved, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Est. Interest Accrued:</span>
              <strong style={{ color: '#3b82f6' }}>{formatCurrency(result.interestEarned, currency)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. RETIREMENT CALCULATOR
// ==========================================
export const RetirementCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentSavings, setCurrentSavings] = useState(25000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [returnRate, setReturnRate] = useState(7.0);
  
  const [result, setResult] = useState({
    nestEgg: 0,
    viablePayout: 0,
    isSustained: false
  });

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  useEffect(() => {
    const yearsToRetire = Math.max(1, retirementAge - currentAge);
    const monthsToRetire = yearsToRetire * 12;
    const r = returnRate / 100 / 12;
    
    const fvSavings = currentSavings * Math.pow(1 + r, monthsToRetire);
    let fvContributions = 0;
    if (r === 0) {
      fvContributions = monthlyContribution * monthsToRetire;
    } else {
      fvContributions = monthlyContribution * ((Math.pow(1 + r, monthsToRetire) - 1) / r);
    }
    
    const nestEgg = fvSavings + fvContributions;
    
    const retirementYears = Math.max(1, lifeExpectancy - retirementAge);
    const retirementMonths = retirementYears * 12;
    
    const postReturn = 0.03 / 12;
    let viablePayout = 0;
    if (postReturn === 0) {
      viablePayout = nestEgg / retirementMonths;
    } else {
      viablePayout = (nestEgg * postReturn) / (1 - Math.pow(1 + postReturn, -retirementMonths));
    }

    setResult({
      nestEgg,
      viablePayout,
      isSustained: nestEgg > 0
    });
  }, [currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyContribution, returnRate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Retirement Forecast Details</h3>
          
          <div className="grid-cols-3" style={{ gap: '8px' }}>
            <div>
              <label className="label">Current Age</label>
              <input type="number" value={currentAge} onChange={(e) => setCurrentAge(parseInt(e.target.value) || 1)} className="input" />
            </div>
            <div>
              <label className="label">Retire Age</label>
              <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(parseInt(e.target.value) || 1)} className="input" />
            </div>
            <div>
              <label className="label">Expectancy</label>
              <input type="number" value={lifeExpectancy} onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 1)} className="input" />
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '10px' }}>
            <div>
              <label className="label">Current Savings ({currSymbol})</label>
              <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)} className="input" />
            </div>
            <div>
              <label className="label">Monthly Deposit ({currSymbol})</label>
              <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Expected Return Rate (%): {returnRate}%</label>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Retirement Projections</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Nest Egg at Age {retirementAge}:</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--color-success)' }}>{formatCurrency(result.nestEgg, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
              <span>Viable Monthly Income Payout:</span>
              <strong style={{ fontSize: '1.2rem', color: '#3b82f6' }}>{formatCurrency(result.viablePayout, currency)}</strong>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-fg-muted)', lineHeight: '1.4' }}>
            At retirement age {retirementAge}, your accumulated nest egg can pay out an estimated {formatCurrency(result.viablePayout, currency)} monthly for {lifeExpectancy - retirementAge} years (assuming conservative 3% annual capital preservation yields).
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. SALARY HIKE CALCULATOR
// ==========================================
export const SalaryHikeCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [currentSalary, setCurrentSalary] = useState(60000);
  const [hikePercentage, setHikePercentage] = useState(10);
  
  const [result, setResult] = useState({
    hikeAmount: 0,
    newSalary: 0,
    newMonthly: 0,
    monthlyHike: 0
  });

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  useEffect(() => {
    const hikeAmount = (currentSalary * hikePercentage) / 100;
    const newSalary = currentSalary + hikeAmount;
    setResult({
      hikeAmount,
      newSalary,
      newMonthly: newSalary / 12,
      monthlyHike: hikeAmount / 12
    });
  }, [currentSalary, hikePercentage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Salary Details</h3>
          <div>
            <label className="label">Current Annual Base Salary ({currSymbol})</label>
            <input type="number" value={currentSalary} onChange={(e) => setCurrentSalary(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Hike Percentage: {hikePercentage}%</label>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={hikePercentage}
              onChange={(e) => setHikePercentage(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>New Salary Outlook</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Salary Increment (Annual):</span>
              <strong style={{ color: 'var(--color-success)' }}>+{formatCurrency(result.hikeAmount, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Monthly Increment:</span>
              <strong style={{ color: 'var(--color-success)' }}>+{formatCurrency(result.monthlyHike, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
              <span>New Annual Salary:</span>
              <strong style={{ fontSize: '1.2rem', color: '#3b82f6' }}>{formatCurrency(result.newSalary, currency)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. FREELANCE RATE CALCULATOR
// ==========================================
export const FreelanceRateCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [targetIncome, setTargetIncome] = useState(80000);
  const [expenses, setExpenses] = useState(12000);
  const [weeksOff, setWeeksOff] = useState(4);
  const [billableHours, setBillableHours] = useState(30);
  
  const [result, setResult] = useState({
    hourlyRate: 0,
    dailyRate: 0,
    weeklyRate: 0
  });

  const currSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  useEffect(() => {
    const grossNeeded = targetIncome + expenses;
    const workingWeeks = Math.max(1, 52 - weeksOff);
    const weeklyBillable = billableHours;
    const totalHours = workingWeeks * weeklyBillable;
    
    const hourly = grossNeeded / totalHours;
    setResult({
      hourlyRate: hourly,
      dailyRate: hourly * (weeklyBillable / 5),
      weeklyRate: hourly * weeklyBillable
    });
  }, [targetIncome, expenses, weeksOff, billableHours]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Income & Overhead Inputs</h3>
          
          <div className="grid-cols-2" style={{ gap: '10px' }}>
            <div>
              <label className="label">Target Take-Home Pay ({currSymbol})</label>
              <input type="number" value={targetIncome} onChange={(e) => setTargetIncome(parseFloat(e.target.value) || 0)} className="input" />
            </div>
            <div>
              <label className="label">Annual Expenses ({currSymbol})</label>
              <input type="number" value={expenses} onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)} className="input" />
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '10px' }}>
            <div>
              <label className="label">Weeks Off / Vacation</label>
              <input type="number" value={weeksOff} onChange={(e) => setWeeksOff(parseInt(e.target.value) || 0)} className="input" />
            </div>
            <div>
              <label className="label">Billable Hours / Week</label>
              <input type="number" value={billableHours} onChange={(e) => setBillableHours(parseInt(e.target.value) || 1)} className="input" />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Suggested Minimum Billing Rates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
              <span>Hourly Billing Rate:</span>
              <strong style={{ fontSize: '1.3rem', color: 'var(--color-success)' }}>{formatCurrency(result.hourlyRate, currency)}/hr</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Equivalent Daily Rate:</span>
              <strong>{formatCurrency(result.dailyRate, currency)}/day</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Equivalent Weekly Rate:</span>
              <strong>{formatCurrency(result.weeklyRate, currency)}/week</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
