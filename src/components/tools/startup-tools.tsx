// src/components/tools/startup-tools.tsx
"use client";

import React, { useState } from 'react';
import { toast } from '@/components/Toast';

// Helper: Formats currency dynamically with regional formatting
const formatCurrency = (val: number, symbol: string) => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  };
  
  const locale = symbol === '₹' ? 'en-IN' : symbol === '¥' ? 'ja-JP' : 'en-US';
  const prefix = symbol;
  
  return prefix + val.toLocaleString(locale, options);
};

// Global Currency Selection Dropdown Component for Startup calculators
const CurrencySelector: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const currencies = [
    { symbol: '$', label: 'USD ($)' },
    { symbol: '₹', label: 'INR (₹)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
    { symbol: 'C$', label: 'CAD (C$)' },
    { symbol: 'A$', label: 'AUD (A$)' },
    { symbol: '¥', label: 'JPY (¥)' }
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <span className="label" style={{ margin: 0, fontSize: '0.8rem' }}>Currency:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        style={{ width: '90px', height: 'auto', padding: '2px 6px', fontSize: '0.8rem' }}
      >
        {currencies.map(c => <option key={c.symbol} value={c.symbol}>{c.label}</option>)}
      </select>
    </div>
  );
};

// ==========================================
// 1. SAAS PRICING CALCULATOR
// ==========================================
export const SaaSPricingCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('$');
  const [arpu, setArpu] = useState(49);
  const [conversionRate, setConversionRate] = useState(2.5); // %
  const [cac, setCac] = useState(150);
  const [costPerAcq, setCostPerAcq] = useState(10); // monthly service cost

  const grossMargin = ((arpu - costPerAcq) / arpu) * 100;
  const paybackMonths = arpu > costPerAcq ? (cac / (arpu - costPerAcq)) : 0;
  const recommendedLtv = arpu * 24; // assuming 24-month lifespan

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>SaaS Model Parameters</h3>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Target Average ARPU (Per Month)</label>
            <input type="number" value={arpu} onChange={(e) => setArpu(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Customer Acquisition Cost (CAC)</label>
            <input type="number" value={cac} onChange={(e) => setCac(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Hosting & Support Cost / User / Month</label>
            <input type="number" value={costPerAcq} onChange={(e) => setCostPerAcq(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Traffic-to-Paid Conversion Rate (%)</label>
            <input type="number" step="0.1" value={conversionRate} onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)} className="input" />
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Economics & CAC Recoup</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Gross Margin (%):</span>
              <strong style={{ color: grossMargin > 70 ? 'var(--color-success)' : 'inherit' }}>{grossMargin.toFixed(1)}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>CAC Payback Period:</span>
              <strong>{paybackMonths.toFixed(1)} Months</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Estimated LTV (2-year average):</span>
              <strong>{formatCurrency(recommendedLtv, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span>LTV:CAC Ratio:</span>
              <strong style={{ color: (recommendedLtv / cac) >= 3 ? 'var(--color-success)' : 'inherit' }}>
                {(recommendedLtv / cac).toFixed(1)}x {(recommendedLtv / cac) >= 3 ? '(Healthy)' : '(Low)'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. REVENUE PROJECTION CALCULATOR
// ==========================================
export const RevenueProjectionCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('$');
  const [startMrr, setStartMrr] = useState(5000);
  const [monthlyGrowth, setMonthlyGrowth] = useState(8); // %
  const [churnRate, setChurnRate] = useState(3); // %

  const calculateMonths = () => {
    const months = [];
    let mrr = startMrr;
    for (let i = 1; i <= 12; i++) {
      const growth = mrr * (monthlyGrowth / 100);
      const loss = mrr * (churnRate / 100);
      const net = growth - loss;
      mrr += net;
      months.push({
        month: i,
        mrr,
        arr: mrr * 12
      });
    }
    return months;
  };

  const schedule = calculateMonths();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Forecast Settings</h3>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }} className="grid-cols-1">
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Starting MRR</label>
            <input type="number" value={startMrr} onChange={(e) => setStartMrr(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Monthly Growth Rate (%)</label>
            <input type="number" value={monthlyGrowth} onChange={(e) => setMonthlyGrowth(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Monthly Churn Rate (%)</label>
            <input type="number" value={churnRate} onChange={(e) => setChurnRate(parseFloat(e.target.value) || 0)} className="input" />
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 600 }}>12-Month Expansion Roadmap</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Month</th>
                  <th style={{ textAlign: 'right', padding: '6px' }}>Projected MRR</th>
                  <th style={{ textAlign: 'right', padding: '6px' }}>Projected ARR</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map(s => (
                  <tr key={s.month} style={{ borderBottom: '1px solid var(--color-border)', opacity: 0.9 }}>
                    <td style={{ padding: '6px' }}>Month {s.month}</td>
                    <td style={{ textAlign: 'right', padding: '6px' }}>{formatCurrency(s.mrr, currency)}</td>
                    <td style={{ textAlign: 'right', padding: '6px', fontWeight: 600 }}>{formatCurrency(s.arr, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. BURN RATE CALCULATOR
// ==========================================
export const BurnRateCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('$');
  const [salaries, setSalaries] = useState(8000);
  const [rent, setRent] = useState(1200);
  const [hosting, setHosting] = useState(800);
  const [marketing, setMarketing] = useState(1500);
  const [customExpense, setCustomExpense] = useState(500);
  const [mrr, setMrr] = useState(4000);

  const grossBurn = salaries + rent + hosting + marketing + customExpense;
  const netBurn = Math.max(0, grossBurn - mrr);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Monthly Expenses</h3>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Monthly Salaries & Contractors</label>
            <input type="number" value={salaries} onChange={(e) => setSalaries(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Office Rent & Utilities</label>
            <input type="number" value={rent} onChange={(e) => setRent(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">SaaS & Server Subscriptions</label>
            <input type="number" value={hosting} onChange={(e) => setHosting(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Marketing & Advertising</label>
            <input type="number" value={marketing} onChange={(e) => setMarketing(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Other Miscellaneous Expenses</label>
            <input type="number" value={customExpense} onChange={(e) => setCustomExpense(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Total Monthly Revenue (MRR)</label>
            <input type="number" value={mrr} onChange={(e) => setMrr(parseFloat(e.target.value) || 0)} className="input" />
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Burn Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              <span>Gross Burn (Total Expenses):</span>
              <strong style={{ fontSize: '1.1rem' }}>{formatCurrency(grossBurn, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              <span>Monthly Revenue offsetting:</span>
              <strong>{formatCurrency(mrr, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span>Net Burn (Net Cash Drain):</span>
              <strong style={{ fontSize: '1.3rem', color: netBurn > 0 ? 'var(--color-danger, red)' : 'inherit' }}>{formatCurrency(netBurn, currency)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. RUNWAY CALCULATOR
// ==========================================
export const RunwayCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('$');
  const [cashBalance, setCashBalance] = useState(100000);
  const [netBurn, setNetBurn] = useState(8000);

  const runwayMonths = netBurn > 0 ? (cashBalance / netBurn) : 999;
  
  // Status check
  const getSecurityState = () => {
    if (runwayMonths >= 18) return { label: 'Extremely Secure Runway', color: '#22c55e' };
    if (runwayMonths >= 9) return { label: 'Healthy Runway Balance', color: '#f59e0b' };
    return { label: 'Critical Funding Required', color: '#ef4444' };
  };

  const security = getSecurityState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Runway Parameters</h3>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Current Cash Reserves Balance</label>
            <input type="number" value={cashBalance} onChange={(e) => setCashBalance(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Net Monthly Burn Rate</label>
            <input type="number" value={netBurn} onChange={(e) => setNetBurn(parseFloat(e.target.value) || 1)} className="input" />
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-fg-muted)', fontWeight: 600 }}>ESTIMATED STARTUP RUNWAY</span>
          <div style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            border: `10px solid ${security.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 700
          }}>
            {runwayMonths === 999 ? '∞' : runwayMonths.toFixed(1)} Mo.
          </div>
          <span style={{ fontWeight: 600, color: security.color, fontSize: '0.95rem' }}>{security.label}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. STARTUP VALUATION CALCULATOR
// ==========================================
export const StartupValuationCalculator: React.FC = () => {
  const [currency, setCurrency] = useState('$');
  const [arr, setArr] = useState(150000);
  const [growthMultiple, setGrowthMultiple] = useState(8);
  const [ipPremium, setIpPremium] = useState(250000);
  const [newFunding, setNewFunding] = useState(500000);

  const preMoneyValuation = (arr * growthMultiple) + ipPremium;
  const postMoneyValuation = preMoneyValuation + newFunding;
  const equityDilution = (newFunding / postMoneyValuation) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Valuation Multiples Model</h3>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Annual Recurring Revenue (ARR)</label>
            <input type="number" value={arr} onChange={(e) => setArr(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Sector Growth Multiple (e.g. 5x - 15x)</label>
            <input type="number" value={growthMultiple} onChange={(e) => setGrowthMultiple(parseFloat(e.target.value) || 1)} className="input" />
          </div>
          <div>
            <label className="label">Technology IP Premium Valuation</label>
            <input type="number" value={ipPremium} onChange={(e) => setIpPremium(parseFloat(e.target.value) || 0)} className="input" />
          </div>
          <div>
            <label className="label">Series Target Investment Size</label>
            <input type="number" value={newFunding} onChange={(e) => setNewFunding(parseFloat(e.target.value) || 0)} className="input" />
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Equity & Dilution Horizon</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Pre-Money Valuation:</span>
              <strong>{formatCurrency(preMoneyValuation, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Series Investment:</span>
              <strong>{formatCurrency(newFunding, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>Post-Money Valuation:</span>
              <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(postMoneyValuation, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span>Investor Share Ownership:</span>
              <strong>{equityDilution.toFixed(1)}% Dilution</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. EQUITY SPLIT CALCULATOR
// ==========================================
interface FounderRow {
  name: string;
  idea: number; // 1-5
  capital: number; // 1-5
  commitment: number; // 1-5
  role: number; // 1-5
}

export const EquitySplitCalculator: React.FC = () => {
  const [founders, setFounders] = useState<FounderRow[]>([
    { name: 'Founder A (CEO)', idea: 5, capital: 3, commitment: 5, role: 4 },
    { name: 'Founder B (CTO)', idea: 2, capital: 4, commitment: 5, role: 5 }
  ]);

  const updateFounderField = (idx: number, field: keyof FounderRow, val: string | number) => {
    const updated = [...founders];
    updated[idx] = { ...updated[idx], [field]: val };
    setFounders(updated);
  };

  const addFounder = () => {
    if (founders.length >= 4) {
      toast.error('Maximum 4 co-founders supported.');
      return;
    }
    setFounders([...founders, {
      name: `Founder ${String.fromCharCode(67 + (founders.length - 2))}`,
      idea: 2,
      capital: 2,
      commitment: 4,
      role: 3
    }]);
  };

  const calculateSplits = () => {
    const weights = founders.map(f => {
      // Calculate weighted points
      return (f.idea * 1.5) + (f.capital * 2.0) + (f.commitment * 2.5) + (f.role * 2.0);
    });
    const totalPoints = weights.reduce((a, b) => a + b, 0);
    return founders.map((f, i) => {
      const percentage = totalPoints > 0 ? (weights[i] / totalPoints) * 100 : 0;
      return {
        name: f.name,
        percentage
      };
    });
  };

  const splitsResult = calculateSplits();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Co-founder Contributions</h3>
          <button onClick={addFounder} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Add Founder</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {founders.map((f, idx) => (
            <div key={idx} style={{
              padding: '12px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={f.name}
                  onChange={(e) => updateFounderField(idx, 'name', e.target.value)}
                  className="input"
                  style={{ fontWeight: 600, fontSize: '0.9rem', width: '160px', height: 'auto', padding: '2px 6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }} className="grid-cols-2">
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', display: 'block' }}>Idea & IP (1-5)</label>
                  <input type="number" min="1" max="5" value={f.idea} onChange={(e) => updateFounderField(idx, 'idea', parseInt(e.target.value) || 1)} className="input" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', display: 'block' }}>Cash Capital (1-5)</label>
                  <input type="number" min="1" max="5" value={f.capital} onChange={(e) => updateFounderField(idx, 'capital', parseInt(e.target.value) || 1)} className="input" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', display: 'block' }}>Commitment (1-5)</label>
                  <input type="number" min="1" max="5" value={f.commitment} onChange={(e) => updateFounderField(idx, 'commitment', parseInt(e.target.value) || 1)} className="input" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', display: 'block' }}>Work Role (1-5)</label>
                  <input type="number" min="1" max="5" value={f.role} onChange={(e) => updateFounderField(idx, 'role', parseInt(e.target.value) || 1)} className="input" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Suggested Share splits</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {splitsResult.map((res, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              <span>{res.name}</span>
              <strong style={{ color: 'var(--color-primary)' }}>{res.percentage.toFixed(1)}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. CAP TABLE GENERATOR
// ==========================================
interface Shareholder {
  name: string;
  shares: number;
}

export const CapTableGenerator: React.FC = () => {
  const [currency, setCurrency] = useState('$');
  const [shareholders, setShareholders] = useState<Shareholder[]>([
    { name: 'Common Founders Pool', shares: 8000000 },
    { name: 'Option Pool Reserved', shares: 1000000 },
    { name: 'Angel Backer Round', shares: 1000000 }
  ]);
  const [sharePrice, setSharePrice] = useState(0.25); // price per share
  const [newName, setNewName] = useState('');
  const [newShares, setNewShares] = useState(250000);

  const addShareholder = () => {
    if (!newName.trim()) return;
    setShareholders([...shareholders, { name: newName, shares: newShares }]);
    setNewName('');
    toast.success('Shareholder added to registry!');
  };

  const totalShares = shareholders.reduce((sum, s) => sum + s.shares, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Cap Table Builder</h3>
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem' }}>Share Valuation:</span>
          <input type="number" step="0.05" value={sharePrice} onChange={(e) => setSharePrice(parseFloat(e.target.value) || 0.1)} className="input" style={{ width: '80px', height: 'auto', padding: '2px' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Shareholdings List</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Shareholder Name</th>
                  <th style={{ textAlign: 'right', padding: '6px' }}>Shares</th>
                  <th style={{ textAlign: 'right', padding: '6px' }}>Percentage</th>
                  <th style={{ textAlign: 'right', padding: '6px' }}>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {shareholders.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)', opacity: 0.9 }}>
                    <td style={{ padding: '6px' }}>{s.name}</td>
                    <td style={{ textAlign: 'right', padding: '6px' }}>{s.shares.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', padding: '6px', fontWeight: 600 }}>{totalShares > 0 ? ((s.shares / totalShares) * 100).toFixed(1) : 0}%</td>
                    <td style={{ textAlign: 'right', padding: '6px' }}>{formatCurrency(s.shares * sharePrice, currency)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 700, borderTop: '2px solid var(--color-border)' }}>
                  <td style={{ padding: '6px' }}>Grand Total</td>
                  <td style={{ textAlign: 'right', padding: '6px' }}>{totalShares.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', padding: '6px' }}>100.0%</td>
                  <td style={{ textAlign: 'right', padding: '6px' }}>{formatCurrency(totalShares * sharePrice, currency)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Add Shareholder</h3>
          <div>
            <label className="label">Name / Entity</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Shares Issued</label>
            <input type="number" value={newShares} onChange={(e) => setNewShares(parseInt(e.target.value) || 0)} className="input" />
          </div>
          <button onClick={addShareholder} className="btn btn-primary" style={{ marginTop: '10px' }}>Issue Shares</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. INVESTOR PITCH OUTLINE GENERATOR
// ==========================================
interface PitchSlide {
  title: string;
  focus: string;
  defaultBullet: string;
}

export const InvestorPitchOutlineGenerator: React.FC = () => {
  const slides: PitchSlide[] = [
    { title: '1. Slide: Cover & Vision', focus: 'Company Name, tag-line description, and overall mission vision statement.', defaultBullet: 'To build the premium client-side toolkit category leader.' },
    { title: '2. Slide: Problem Definition', focus: 'Identify the structural pain point target customers encounter daily.', defaultBullet: 'SaaS platforms charge heavy recurring fees for basic file converters and tools.' },
    { title: '3. Slide: Product Solution', focus: 'Detailed solution layout proving features address the target problems.', defaultBullet: 'A collection of 150+ free, completely client-side local browser sandbox tools.' },
    { title: '4. Slide: Market Size (TAM)', focus: 'TAM, SAM, SOM metrics demonstrating business scalability limits.', defaultBullet: 'Targeting the global 14M software development team landscape.' },
    { title: '5. Slide: Business Model', focus: 'Explain fee metrics, subscriptions, and recurring revenue generation.', defaultBullet: 'Free entry-tier, premium enterprise-scale features.' },
    { title: '6. Slide: Competitive Moat', focus: 'Identify current key players and highlight unique advantages.', defaultBullet: 'Zero server upload latencies, completely secure in-browser sandboxing.' },
    { title: '7. Slide: Execution Team', focus: 'Introduce founders, credentials, and technical engineering leads.', defaultBullet: 'Experienced web engineers and full-stack software architects.' },
    { title: '8. Slide: Financial Ask', focus: 'Detail required Series funding sizes and general allocation plans.', defaultBullet: 'Seeking $1M seed funding to expand tool utility templates.' }
  ];

  const [slideContent, setSlideContent] = useState<string[]>(slides.map(s => s.defaultBullet));

  const handleTextChange = (idx: number, val: string) => {
    const updated = [...slideContent];
    updated[idx] = val;
    setSlideContent(updated);
  };

  const handleDownload = () => {
    const outlineDump = slides.map((s, idx) => {
      return `### ${s.title}\n- **Focus**: ${s.focus}\n- **Your Slides Deck Details**: ${slideContent[idx]}\n\n`;
    }).join('');
    
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(`# Investor Pitch Deck Outline Framework\n\n${outlineDump}`);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "pitch_deck_outline.txt");
    dlAnchor.click();
    toast.success('Pitch outline TXT download complete!');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="grid-cols-1">
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Investor Pitch Slide Planner</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {slides.map((s, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>{s.title}</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', margin: '0 0 8px 0' }}>{s.focus}</p>
              <textarea
                value={slideContent[idx]}
                onChange={(e) => handleTextChange(idx, e.target.value)}
                className="input"
                style={{ minHeight: '60px', fontFamily: 'inherit' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Pitch Summary Checklist</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-fg-muted)', margin: 0 }}>
            Ensure your outline satisfies core venture capital expectations before downloading:
          </p>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>Clarity on problem size metrics.</li>
            <li>Simple unit economics details.</li>
            <li>Scalability and market projections.</li>
            <li>Clear funding ask milestones.</li>
          </ul>
          <button onClick={handleDownload} className="btn btn-primary" style={{ marginTop: '10px' }}>Download Outline TXT</button>
        </div>
      </div>
    </div>
  );
};
