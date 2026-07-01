// src/components/tools/business-tools.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/components/Toast';

const copyToClipboard = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};

// 1. Invoice Generator
interface InvoiceItem {
  desc: string;
  qty: number;
  rate: number;
}

export const InvoiceGenerator: React.FC = () => {
  const [vendor, setVendor] = useState('AllSetTools Services Ltd\n120 SaaS Lane, San Francisco');
  const [client, setClient] = useState('Acme Corporation\n404 Server Road, New York');
  const [invNum, setInvNum] = useState('INV-2026-001');
  const [date, setDate] = useState('2026-06-27');
  const [items, setItems] = useState<InvoiceItem[]>([{ desc: 'Consulting services', qty: 10, rate: 80 }]);
  const [taxRate, setTaxRate] = useState(10); // 10% VAT/GST

  const addItem = () => {
    setItems([...items, { desc: 'New Item', qty: 1, rate: 0 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, key: keyof InvoiceItem, val: any) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: val };
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const printInvoice = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="print-section">
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div>
          <label className="label">Your Information (Sender)</label>
          <textarea value={vendor} onChange={e => setVendor(e.target.value)} className="input" style={{ height: '80px' }} />
        </div>
        <div>
          <label className="label">Client Information (Recipient)</label>
          <textarea value={client} onChange={e => setClient(e.target.value)} className="input" style={{ height: '80px' }} />
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Invoice Number</label>
          <input type="text" value={invNum} onChange={e => setInvNum(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Invoice Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input" />
        </div>
      </div>

      {/* Item List Editor */}
      <div>
        <label className="label">Line Items</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={item.desc}
                onChange={e => updateItem(idx, 'desc', e.target.value)}
                className="input"
                style={{ flex: 3 }}
                placeholder="Description"
              />
              <input
                type="number"
                value={item.qty}
                onChange={e => updateItem(idx, 'qty', parseFloat(e.target.value) || 0)}
                className="input"
                style={{ flex: 1 }}
                placeholder="Qty"
              />
              <input
                type="number"
                value={item.rate}
                onChange={e => updateItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                className="input"
                style={{ flex: 1.5 }}
                placeholder="Rate"
              />
              <button onClick={() => removeItem(idx)} className="btn btn-secondary" style={{ padding: '8px' }}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="btn btn-secondary" style={{ marginTop: '10px', fontSize: '0.8125rem' }}>+ Add Item</button>
      </div>

      {/* Summary calculation card */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-fg-muted)' }}>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-fg-muted)' }}>Tax Rate (%):</span>
            <input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="input" style={{ width: '60px', padding: '2px 6px', fontSize: '0.8rem', textAlign: 'right' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-fg-muted)' }}>Tax Amount:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <hr style={{ borderColor: 'var(--color-border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.05rem' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div>
        <button onClick={printInvoice} className="btn btn-primary">Print / Save as PDF</button>
      </div>
    </div>
  );
};

// 2. GST Calculator
export const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18); // 18% standard GST
  const [type, setType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [results, setResults] = useState({ net: 0, gst: 0, total: 0 });

  useEffect(() => {
    let net = 0;
    let gst = 0;
    let total = 0;

    if (type === 'exclusive') {
      net = amount;
      gst = amount * (rate / 100);
      total = amount + gst;
    } else {
      total = amount;
      net = amount / (1 + (rate / 100));
      gst = total - net;
    }

    setResults({ net, gst, total });
  }, [amount, rate, type]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Base Amount ($)</label>
          <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Tax Rate (%)</label>
          <select value={rate} onChange={e => setRate(parseInt(e.target.value))} className="input">
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18% (Standard)</option>
            <option value="28">28%</option>
          </select>
        </div>
        <div>
          <label className="label">Tax Method</label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setType('exclusive')} className={`btn ${type === 'exclusive' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>Exclusive</button>
            <button onClick={() => setType('inclusive')} className={`btn ${type === 'inclusive' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>Inclusive</button>
          </div>
        </div>
      </div>

      <div className="grid-cols-3" style={{ gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${results.net.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Net Price (Excl. Tax)</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${results.gst.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Tax Amount (CGST+SGST)</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${results.total.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Total Price (Incl. Tax)</div>
        </div>
      </div>
    </div>
  );
};

// 3. Profit Margin Calculator
export const ProfitMarginCalculator: React.FC = () => {
  const [cost, setCost] = useState(80);
  const [revenue, setRevenue] = useState(100);
  const [metrics, setMetrics] = useState({ profit: 0, margin: 0, markup: 0 });

  useEffect(() => {
    if (revenue === 0) return;
    const profit = revenue - cost;
    const margin = (profit / revenue) * 100;
    const markup = cost === 0 ? 0 : (profit / cost) * 100;
    setMetrics({ profit, margin, markup });
  }, [cost, revenue]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Item Cost Price ($)</label>
          <input type="number" value={cost} onChange={e => setCost(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Selling Price / Revenue ($)</label>
          <input type="number" value={revenue} onChange={e => setRevenue(parseFloat(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="grid-cols-3" style={{ gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${metrics.profit.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Gross Profit</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{metrics.margin.toFixed(1)}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Gross Profit Margin</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{metrics.markup.toFixed(1)}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Markup Rate</div>
        </div>
      </div>
    </div>
  );
};

// 4. EMI Calculator
export const EMICalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(24); // months
  const [results, setResults] = useState({ emi: 0, interest: 0, total: 0 });

  const calculateEMI = () => {
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const total = emi * tenure;
    const interest = total - principal;
    setResults({ emi, interest, total });
  };

  useEffect(() => {
    calculateEMI();
  }, [principal, rate, tenure]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Principal Loan ($)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Interest Rate (% p.a.)</label>
          <input type="number" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Tenure (Months)</label>
          <input type="number" value={tenure} onChange={e => setTenure(parseInt(e.target.value) || 12)} className="input" />
        </div>
      </div>

      <div className="grid-cols-3" style={{ gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${results.emi.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Monthly EMI Payment</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${results.interest.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Total Interest Payable</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${results.total.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Total Repayment Amount</div>
        </div>
      </div>
    </div>
  );
};

// 5. Loan Calculator (Includes Amortization Schedule Table)
export const LoanCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(5000);
  const [rate, setRate] = useState(6.0);
  const [years, setYears] = useState(3);
  const [schedule, setSchedule] = useState<{ month: number; interest: number; principalPayed: number; balance: number }[]>([]);

  useEffect(() => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    let balance = principal;
    const list = [];
    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principalPayed = emi - interest;
      balance = Math.max(balance - principalPayed, 0);
      list.push({
        month: i,
        interest,
        principalPayed,
        balance
      });
    }
    setSchedule(list.slice(0, 12)); // Output first 12 months for compactness
  }, [principal, rate, years]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Loan Amount ($)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Interest Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Duration (Years)</label>
          <input type="number" value={years} onChange={e => setYears(parseInt(e.target.value) || 1)} className="input" />
        </div>
      </div>

      <div>
        <label className="label">Amortization Schedule (First 12 Months)</label>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '6px' }}>Month</th>
                <th style={{ padding: '6px' }}>Interest Paid</th>
                <th style={{ padding: '6px' }}>Principal Repaid</th>
                <th style={{ padding: '6px' }}>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.month} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '6px' }}>{row.month}</td>
                  <td style={{ padding: '6px' }}>${row.interest.toFixed(2)}</td>
                  <td style={{ padding: '6px' }}>${row.principalPayed.toFixed(2)}</td>
                  <td style={{ padding: '6px' }}>${row.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6. Currency Converter
export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>({
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 160.0,
    INR: 83.50,
    CAD: 1.37,
    AUD: 1.50,
    CHF: 0.90,
    CNY: 7.25,
    NZD: 1.63,
    SGD: 1.35,
    ZAR: 18.20,
    AED: 3.67,
    SAR: 3.75,
    MXN: 18.10,
    BRL: 5.45,
    RUB: 88.00,
    KRW: 1380.00
  });
  const [converted, setConverted] = useState(0.92);

  const fetchRates = async () => {
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const data = await res.json();
      if (data.rates) {
        setRates(data.rates);
        toast.success('Live currency rates updated!');
      }
    } catch (e) {
      toast.show('Offline fallbacks active.', 'info');
    }
  };

  useEffect(() => {
    fetchRates();
  }, [from]);

  useEffect(() => {
    const rate = rates[to] || 1;
    setConverted(amount * rate);
  }, [amount, from, to, rates]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} className="input">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="INR">INR (₹)</option>
            <option value="CAD">CAD (CA$)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="CHF">CHF (CHF)</option>
            <option value="CNY">CNY (¥)</option>
            <option value="NZD">NZD (NZ$)</option>
            <option value="SGD">SGD (SG$)</option>
            <option value="ZAR">ZAR (R)</option>
            <option value="AED">AED (AED)</option>
            <option value="SAR">SAR (SR)</option>
            <option value="MXN">MXN ($)</option>
            <option value="BRL">BRL (R$)</option>
            <option value="RUB">RUB (₽)</option>
            <option value="KRW">KRW (₩)</option>
          </select>
        </div>
        <div>
          <label className="label">To</label>
          <select value={to} onChange={e => setTo(e.target.value)} className="input">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="INR">INR (₹)</option>
            <option value="CAD">CAD (CA$)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="CHF">CHF (CHF)</option>
            <option value="CNY">CNY (¥)</option>
            <option value="NZD">NZD (NZ$)</option>
            <option value="SGD">SGD (SG$)</option>
            <option value="ZAR">ZAR (R)</option>
            <option value="AED">AED (AED)</option>
            <option value="SAR">SAR (SR)</option>
            <option value="MXN">MXN ($)</option>
            <option value="BRL">BRL (R$)</option>
            <option value="RUB">RUB (₽)</option>
            <option value="KRW">KRW (₩)</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>Converted Value</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
          {amount} {from} = {converted.toFixed(4)} {to}
        </div>
      </div>
    </div>
  );
};

// 7. Percentage Calculator
export const PercentageCalculator: React.FC = () => {
  const [valA, setValA] = useState(20);
  const [valB, setValB] = useState(150);
  const [resultA, setResultA] = useState(30);

  const [valC, setValC] = useState(50);
  const [valD, setValD] = useState(200);
  const [resultB, setResultB] = useState(25);

  useEffect(() => {
    setResultA((valA / 100) * valB);
  }, [valA, valB]);

  useEffect(() => {
    if (valD === 0) return;
    setResultB((valC / valD) * 100);
  }, [valC, valD]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label className="label">What is X% of Y?</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>What is</span>
          <input type="number" value={valA} onChange={e => setValA(parseFloat(e.target.value) || 0)} className="input" style={{ width: '80px' }} />
          <span>% of</span>
          <input type="number" value={valB} onChange={e => setValB(parseFloat(e.target.value) || 0)} className="input" style={{ width: '100px' }} />
          <span>=</span>
          <div className="tool-output-panel" style={{ flex: 1, minHeight: 'auto', padding: '8px 12px' }}>
            {resultA.toFixed(2)}
          </div>
        </div>
      </div>

      <div>
        <label className="label">X is what percent of Y?</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="number" value={valC} onChange={e => setValC(parseFloat(e.target.value) || 0)} className="input" style={{ width: '80px' }} />
          <span>is what % of</span>
          <input type="number" value={valD} onChange={e => setValD(parseFloat(e.target.value) || 0)} className="input" style={{ width: '100px' }} />
          <span>=</span>
          <div className="tool-output-panel" style={{ flex: 1, minHeight: 'auto', padding: '8px 12px' }}>
            {resultB.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. ROI Calculator
export const ROICalculator: React.FC = () => {
  const [amount, setAmount] = useState(10000);
  const [revenue, setRevenue] = useState(15000);
  const [duration, setDuration] = useState(1);
  const [netProfit, setNetProfit] = useState(0);
  const [roi, setRoi] = useState(0);
  const [annualRoi, setAnnualRoi] = useState(0);

  useEffect(() => {
    const profit = revenue - amount;
    setNetProfit(profit);

    if (amount > 0) {
      const computedRoi = (profit / amount) * 100;
      setRoi(computedRoi);

      if (duration > 0) {
        // Annualized ROI = ((Revenue / Amount) ^ (1 / duration) - 1) * 100
        const annRoi = (Math.pow((revenue / amount), (1 / duration)) - 1) * 100;
        setAnnualRoi(isNaN(annRoi) ? 0 : annRoi);
      }
    }
  }, [amount, revenue, duration]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Amount Invested ($)</label>
          <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Total Amount Returned ($)</label>
          <input type="number" value={revenue} onChange={e => setRevenue(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Duration (Years)</label>
          <input type="number" value={duration} onChange={e => setDuration(parseFloat(e.target.value) || 1)} className="input" step="0.1" />
        </div>
      </div>

      <div className="grid-cols-3" style={{ gap: '1rem', marginTop: '1rem' }}>
        <div className="card text-center" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Net Profit</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px', color: netProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="card text-center" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Return on Investment (ROI)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px', color: roi >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {roi.toFixed(2)}%
          </div>
        </div>

        <div className="card text-center" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Annualized ROI</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px', color: annualRoi >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {annualRoi.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. CPC & CPM Calculator
export const CPCCPMCalculator: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'cpc' | 'cpm'>('cpc');
  const [cost, setCost] = useState(500);
  const [clicks, setClicks] = useState(250);
  const [impressions, setImpressions] = useState(10000);
  const [conversions, setConversions] = useState(10);

  // outputs
  const [cpcResult, setCpcResult] = useState(0);
  const [cpmResult, setCpmResult] = useState(0);
  const [ctr, setCtr] = useState(0);
  const [convRate, setConvRate] = useState(0);
  const [costPerConv, setCostPerConv] = useState(0);

  useEffect(() => {
    // Basic conversion rate
    if (clicks > 0) {
      setConvRate((conversions / clicks) * 100);
      setCostPerConv(cost / conversions);
    } else {
      setConvRate(0);
      setCostPerConv(0);
    }

    // CTR
    if (impressions > 0) {
      setCtr((clicks / impressions) * 100);
    } else {
      setCtr(0);
    }

    // Calculators
    if (calcMode === 'cpc') {
      setCpcResult(clicks > 0 ? cost / clicks : 0);
    } else {
      setCpmResult(impressions > 0 ? (cost / impressions) * 1000 : 0);
    }
  }, [calcMode, cost, clicks, impressions, conversions]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={() => setCalcMode('cpc')}
          className={`btn ${calcMode === 'cpc' ? 'btn-primary' : 'btn-secondary'}`}
        >
          CPC (Cost Per Click) Mode
        </button>
        <button
          type="button"
          onClick={() => setCalcMode('cpm')}
          className={`btn ${calcMode === 'cpm' ? 'btn-primary' : 'btn-secondary'}`}
        >
          CPM (Cost Per Mille) Mode
        </button>
      </div>

      <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="label">Total Campaign Budget ($)</label>
            <input type="number" value={cost} onChange={e => setCost(parseFloat(e.target.value) || 0)} className="input" />
          </div>

          {calcMode === 'cpc' ? (
            <div>
              <label className="label">Total Clicks</label>
              <input type="number" value={clicks} onChange={e => setClicks(parseInt(e.target.value) || 0)} className="input" />
            </div>
          ) : (
            <div>
              <label className="label">Total Impressions</label>
              <input type="number" value={impressions} onChange={e => setImpressions(parseInt(e.target.value) || 0)} className="input" />
            </div>
          )}

          <div>
            <label className="label">Conversions (Optional)</label>
            <input type="number" value={conversions} onChange={e => setConversions(parseInt(e.target.value) || 0)} className="input" />
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', margin: 0, border: 'none', padding: 0 }}>Campaign Outcomes</h4>
          
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>
              {calcMode === 'cpc' ? 'Calculated Cost Per Click (CPC)' : 'Calculated Cost Per Thousand (CPM)'}
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              ${calcMode === 'cpc' ? cpcResult.toFixed(2) : cpmResult.toFixed(2)}
            </div>
          </div>

          <div className="d-flex flex-column gap-2" style={{ fontSize: '0.8125rem' }}>
            {calcMode === 'cpm' && (
              <div className="d-flex justify-content-between">
                <span>Clicks (used for CTR):</span>
                <input
                  type="number"
                  value={clicks}
                  onChange={e => setClicks(parseInt(e.target.value) || 0)}
                  className="input"
                  style={{ width: '80px', padding: '2px 6px', height: '24px', textAlign: 'right' }}
                />
              </div>
            )}
            {calcMode === 'cpc' && (
              <div className="d-flex justify-content-between">
                <span>Impressions (used for CTR):</span>
                <input
                  type="number"
                  value={impressions}
                  onChange={e => setImpressions(parseInt(e.target.value) || 0)}
                  className="input"
                  style={{ width: '100px', padding: '2px 6px', height: '24px', textAlign: 'right' }}
                />
              </div>
            )}
            <div className="d-flex justify-content-between" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
              <span>Click-Through Rate (CTR):</span>
              <span className="fw-bold">{ctr.toFixed(2)}%</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Conversion Rate:</span>
              <span className="fw-bold">{convRate.toFixed(2)}%</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Cost Per Conversion (CPA):</span>
              <span className="fw-bold">${costPerConv.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 10. Brand Name Generator
export const BrandNameGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('cloud');
  const [theme, setTheme] = useState('tech');
  const [names, setNames] = useState<string[]>([]);

  const generateNames = () => {
    if (!keyword.trim()) {
      setNames([]);
      return;
    }

    const kw = keyword.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    // Curated combinations
    const prefixes: Record<string, string[]> = {
      tech: ['get', 'try', 'hyper', 'smart', 'core', 'meta', 'apex', 'nexus', 'alpha', 'nova'],
      lifestyle: ['pure', 'vida', 'sol', 'fresh', 'bloom', 'casa', 'vibe', 'urban', 'luxe', 'kind'],
      modern: ['zen', 'flow', 'wave', 'shift', 'sync', 'loop', 'next', 'snap', 'link', 'go']
    };

    const suffixes: Record<string, string[]> = {
      tech: ['ify', 'lab', 'hub', 'base', 'io', 'hq', 'stack', 'node', 'grid', 'ly'],
      lifestyle: ['life', 'co', 'box', 'well', 'bay', 'nest', 'line', 'farm', 'good', 'feed'],
      modern: ['space', 'app', 'run', 'vault', 'deck', 'wise', 'way', 'port', 'line', 'ly']
    };

    const currentPrefs = prefixes[theme] || prefixes.modern;
    const currentSuffs = suffixes[theme] || suffixes.modern;

    const list: string[] = [];

    // Prefix + Keyword
    currentPrefs.forEach(p => {
      list.push(p + kw);
    });

    // Keyword + Suffix
    currentSuffs.forEach(s => {
      list.push(kw + s);
    });

    // Blends
    list.push(`${kw}ly`);
    list.push(`the${kw}`);
    list.push(`${kw}ify`);

    setNames(Array.from(new Set(list)));
    toast.success('Brand combinations generated!');
  };

  useEffect(() => {
    generateNames();
  }, [keyword, theme]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Root Concept Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="input"
            placeholder="e.g. cloud, task, food"
          />
        </div>
        <div>
          <label className="label">Industry Naming Vibe</label>
          <select value={theme} onChange={e => setTheme(e.target.value)} className="input">
            <option value="tech">Tech / Software Startup</option>
            <option value="lifestyle">Lifestyle / Physical Brand</option>
            <option value="modern">Modern / Abstract Utility</option>
          </select>
        </div>
      </div>

      {names.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <label className="label">Generated Name Ideas ({names.length}) - Click to Copy</label>
          <div className="grid-cols-3" style={{ gap: '8px', maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
            {names.map((name, idx) => (
              <div
                key={idx}
                onClick={() => {
                  navigator.clipboard.writeText(name);
                  toast.success(`Copied "${name}"!`);
                }}
                className="card card-hover text-center"
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  transition: 'transform var(--transition-fast)'
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 11. CPM Calculator
export const CPMCalculator: React.FC = () => {
  const [cost, setCost] = useState(150);
  const [impressions, setImpressions] = useState(50000);
  const [cpm, setCpm] = useState(0);

  useEffect(() => {
    if (impressions > 0) {
      setCpm((cost / impressions) * 1000);
    } else {
      setCpm(0);
    }
  }, [cost, impressions]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
        <div>
          <label className="label">Total Campaign Budget / Cost ($)</label>
          <input type="number" value={cost} onChange={e => setCost(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Total Ad Impressions</label>
          <input type="number" value={impressions} onChange={e => setImpressions(parseInt(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="card text-center" style={{ padding: '1.5rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Calculated CPM (Cost Per Mille)</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
          ${cpm.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)', marginTop: '4px' }}>
          Average cost per 1,000 visual impressions.
        </div>
      </div>
    </div>
  );
};

// 12. CPC Calculator
export const CPCCalculator: React.FC = () => {
  const [cost, setCost] = useState(250);
  const [clicks, setClicks] = useState(500);
  const [cpc, setCpc] = useState(0);

  useEffect(() => {
    if (clicks > 0) {
      setCpc(cost / clicks);
    } else {
      setCpc(0);
    }
  }, [cost, clicks]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
        <div>
          <label className="label">Total Campaign Cost ($)</label>
          <input type="number" value={cost} onChange={e => setCost(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Total Clicks Received</label>
          <input type="number" value={clicks} onChange={e => setClicks(parseInt(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="card text-center" style={{ padding: '1.5rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Calculated CPC (Cost Per Click)</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
          ${cpc.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)', marginTop: '4px' }}>
          Average spend per link click attribution.
        </div>
      </div>
    </div>
  );
};

// 13. Marketing Budget Calculator
export const MarketingBudgetCalculator: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState(10000);
  const [searchPct, setSearchPct] = useState(40);
  const [socialPct, setSocialPct] = useState(30);
  const [contentPct, setContentPct] = useState(20);
  const [toolPct, setToolPct] = useState(10);

  // remaining percentage to verify sum = 100%
  const totalPct = searchPct + socialPct + contentPct + toolPct;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Total Marketing Budget ($)</label>
        <input type="number" value={totalBudget} onChange={e => setTotalBudget(parseFloat(e.target.value) || 0)} className="input" />
      </div>

      <div className="grid-cols-2" style={{ gap: '1.5rem', marginTop: '0.5rem' }}>
        {/* Pct inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', border: 'none', padding: 0, margin: 0 }}>Allocation Breakdown (%)</h4>
          
          <div>
            <label className="label">Paid Search Ads (Google/Bing): {searchPct}%</label>
            <input type="range" min="0" max="100" value={searchPct} onChange={e => setSearchPct(parseInt(e.target.value) || 0)} style={{ width: '100%', accentColor: 'var(--color-fg)' }} />
          </div>

          <div>
            <label className="label">Social Media Ads (Meta/LinkedIn): {socialPct}%</label>
            <input type="range" min="0" max="100" value={socialPct} onChange={e => setSocialPct(parseInt(e.target.value) || 0)} style={{ width: '100%', accentColor: 'var(--color-fg)' }} />
          </div>

          <div>
            <label className="label">Content Marketing & Design: {contentPct}%</label>
            <input type="range" min="0" max="100" value={contentPct} onChange={e => setContentPct(parseInt(e.target.value) || 0)} style={{ width: '100%', accentColor: 'var(--color-fg)' }} />
          </div>

          <div>
            <label className="label">Software & Analytics Tools: {toolPct}%</label>
            <input type="range" min="0" max="100" value={toolPct} onChange={e => setToolPct(parseInt(e.target.value) || 0)} style={{ width: '100%', accentColor: 'var(--color-fg)' }} />
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: totalPct === 100 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {totalPct === 100 ? '✓ Sum equals 100%' : `⚠ Sum equals ${totalPct}% (adjust sliders to hit 100%)`}
          </div>
        </div>

        {/* Cash outputs */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', border: 'none', padding: 0, margin: 0 }}>Allocated Funds ($)</h4>
          
          <div className="d-flex flex-column gap-2" style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>
            <div className="d-flex justify-content-between">
              <span>Paid Search Ads:</span>
              <span className="fw-bold">${((searchPct / 100) * totalBudget).toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Social Media Ads:</span>
              <span className="fw-bold">${((socialPct / 100) * totalBudget).toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Content Creation:</span>
              <span className="fw-bold">${((contentPct / 100) * totalBudget).toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Software & Tools:</span>
              <span className="fw-bold">${((toolPct / 100) * totalBudget).toLocaleString()}</span>
            </div>
            
            <div className="d-flex justify-content-between" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '6px', fontSize: '0.9rem' }}>
              <span className="fw-bold">Total Budget Accounted:</span>
              <span className="fw-bold" style={{ color: 'var(--color-primary)' }}>
                ${((totalPct / 100) * totalBudget).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 14. Resume Builder
export const ResumeBuilder: React.FC = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  const [phone, setPhone] = useState('(555) 019-2834');
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [summary, setSummary] = useState('Experienced engineer specializing in React, Next.js, Node, and client-side systems design.');
  
  const [company, setCompany] = useState('Tech Solutions Inc.');
  const [duration, setDuration] = useState('2022 - Present');
  const [expDesc, setExpDesc] = useState('Lead development of responsive workspaces and optimized client web dashboards.');
  
  const [school, setSchool] = useState('State University');
  const [degree, setDegree] = useState('B.S. Computer Science');
  const [eduYear, setEduYear] = useState('2018 - 2022');

  const printResume = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem', margin: 0 }}>Resume Details</h4>
          
          <div className="grid-cols-2" style={{ gap: '0.75rem' }}>
            <div>
              <label className="label">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Professional Title</label>
              <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="input" />
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '0.75rem' }}>
            <div>
              <label className="label">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Professional Summary</label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} className="input textarea" style={{ height: '80px' }} />
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem', margin: 0, marginTop: '0.5rem' }}>Work Experience</h4>
          <div className="grid-cols-2" style={{ gap: '0.75rem' }}>
            <div>
              <label className="label">Company / Org</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Dates Employed</label>
              <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Role Description</label>
            <textarea value={expDesc} onChange={e => setExpDesc(e.target.value)} className="input textarea" style={{ height: '70px' }} />
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem', margin: 0, marginTop: '0.5rem' }}>Education</h4>
          <div className="grid-cols-3" style={{ gap: '0.75rem' }}>
            <div>
              <label className="label">School</label>
              <input type="text" value={school} onChange={e => setSchool(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Degree Program</label>
              <input type="text" value={degree} onChange={e => setDegree(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Graduation Year</label>
              <input type="text" value={eduYear} onChange={e => setEduYear(e.target.value)} className="input" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem', margin: 0 }}>Print Preview</h4>
          
          <div className="card" style={{ padding: '2rem', backgroundColor: '#fff', color: '#000', fontFamily: 'var(--font-sans)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '480px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ borderBottom: '2px solid #000', paddingBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{name}</div>
              <div style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: 500, marginTop: '2px' }}>{jobTitle}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>{email} • {phone}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000', marginBottom: '4px' }}>Professional Summary</div>
              <p style={{ fontSize: '0.8rem', color: '#374151', margin: 0, lineHeight: '1.5' }}>{summary}</p>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000', marginBottom: '6px' }}>Professional Experience</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>{company}</span>
                <span style={{ color: '#4b5563' }}>{duration}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#374151', margin: 0, marginTop: '4px', lineHeight: '1.5' }}>{expDesc}</p>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000', marginBottom: '6px' }}>Education</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>{school} • {degree}</span>
                <span style={{ color: '#4b5563' }}>{eduYear}</span>
              </div>
            </div>
          </div>

          <button onClick={printResume} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// 15. Business Name Generator
export const BusinessNameGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [industry, setIndustry] = useState('tech');
  const [names, setNames] = useState<string[]>([]);

  const generate = () => {
    if (!keyword.trim()) return;
    const kw = keyword.trim().charAt(0).toUpperCase() + keyword.trim().slice(1).toLowerCase();
    
    let suffixes = ['ify', 'ly', 'io', 'hub', 'flow', 'grid', 'lab', 'works', 'base', 'core'];
    if (industry === 'finance') suffixes = ['capital', 'invest', 'ledger', 'pay', 'vault', 'coin'];
    if (industry === 'creative') suffixes = ['studio', 'craft', 'pixel', 'design', 'wave', 'canvas'];

    const generated = suffixes.map(s => {
      const suff = s.charAt(0).toUpperCase() + s.slice(1);
      return `${kw}${s.length <= 3 ? s.toLowerCase() : suff}`;
    });

    setNames(generated);
    toast.success('Generated business names!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Root Keyword</label>
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} className="input" placeholder="e.g. Swift, Peak, Cloud" />
        </div>
        <div>
          <label className="label">Industry Niche</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)} className="input">
            <option value="tech">Tech & SaaS Software</option>
            <option value="finance">Finance & FinTech</option>
            <option value="creative">Creative Studio & Agency</option>
          </select>
        </div>
      </div>

      <button onClick={generate} disabled={!keyword.trim()} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Generate Names
      </button>

      {names.length > 0 && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <label className="label">Suggested Brand Entities</label>
          <div className="grid-cols-3" style={{ gap: '8px', marginTop: '0.5rem' }}>
            {names.map((n, idx) => (
              <div key={idx} style={{
                padding: '8px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-subtle)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'center',
                cursor: 'pointer'
              }} onClick={() => { navigator.clipboard.writeText(n); toast.success(`Copied "${n}"!`); }}>
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 16. Domain Name Generator
export const DomainNameGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [domains, setDomains] = useState<string[]>([]);

  const generate = () => {
    if (!keyword.trim()) return;
    const kw = keyword.toLowerCase().replace(/\s+/g, '');
    
    const prefixes = ['get', 'try', 'go', 'use', 'join'];
    const extensions = ['.com', '.net', '.io', '.co', '.app'];

    const results = [
      `${kw}.com`,
      `${kw}.io`,
      ...prefixes.map(p => `${p}${kw}.com`),
      ...extensions.map(ext => `${kw}${ext}`)
    ].slice(0, 8);

    setDomains(results);
    toast.success('Generated domains!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Domain Keyword</label>
        <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} className="input" placeholder="e.g. allsettools, tasky" />
      </div>

      <button onClick={generate} disabled={!keyword.trim()} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Generate Domains
      </button>

      {domains.length > 0 && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <label className="label">Recommended Domain Matches</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.5rem' }}>
            {domains.map((d, idx) => (
              <div key={idx} className="d-flex justify-content-between align-items-center" style={{
                padding: '8px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-subtle)',
                fontSize: '0.875rem'
              }}>
                <span className="fw-bold" style={{ fontFamily: 'var(--font-mono)' }}>{d}</span>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => { navigator.clipboard.writeText(d); toast.success(`Copied domain!`); }}>
                  Copy Domain
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 17. Marketing Funnel Calculator
export const MarketingFunnelCalculator: React.FC = () => {
  const [visitors, setVisitors] = useState(10000);
  const [leads, setLeads] = useState(1000);
  const [customers, setCustomers] = useState(100);

  const visitorToLead = visitors > 0 ? (leads / visitors) * 100 : 0;
  const leadToCustomer = leads > 0 ? (customers / leads) * 100 : 0;
  const totalConversion = visitors > 0 ? (customers / visitors) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-3" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Website Visitors</label>
          <input type="number" value={visitors} onChange={e => setVisitors(parseInt(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Leads Acquired</label>
          <input type="number" value={leads} onChange={e => setLeads(parseInt(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Paying Customers</label>
          <input type="number" value={customers} onChange={e => setCustomers(parseInt(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="grid-cols-3" style={{ gap: '1rem', marginTop: '0.5rem' }}>
        <div className="card text-center" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Visitor ➔ Lead</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
            {visitorToLead.toFixed(1)}%
          </div>
        </div>
        <div className="card text-center" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Lead ➔ Customer</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
            {leadToCustomer.toFixed(1)}%
          </div>
        </div>
        <div className="card text-center" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Total Conversion Rate</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-success)', marginTop: '4px' }}>
            {totalConversion.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

// 18. ROAS Calculator
export const ROASCalculator: React.FC = () => {
  const [revenue, setRevenue] = useState(5000);
  const [adSpend, setAdSpend] = useState(1000);
  const [roas, setRoas] = useState(0);

  useEffect(() => {
    if (adSpend > 0) {
      setRoas(revenue / adSpend);
    } else {
      setRoas(0);
    }
  }, [revenue, adSpend]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
        <div>
          <label className="label">Campaign Revenue ($)</label>
          <input type="number" value={revenue} onChange={e => setRevenue(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Ad Spend Budget ($)</label>
          <input type="number" value={adSpend} onChange={e => setAdSpend(parseFloat(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="card text-center" style={{ padding: '1.5rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Return on Ad Spend (ROAS)</div>
        <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
          {roas.toFixed(2)}x
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)', marginTop: '4px' }}>
          For every dollar spent, you generated ${roas.toFixed(2)} in revenue.
        </div>
      </div>
    </div>
  );
};

// 19. CAC Calculator
export const CACCalculator: React.FC = () => {
  const [expenses, setExpenses] = useState(5000);
  const [acquired, setAcquired] = useState(250);
  const [cac, setCac] = useState(0);

  useEffect(() => {
    if (acquired > 0) {
      setCac(expenses / acquired);
    } else {
      setCac(0);
    }
  }, [expenses, acquired]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
        <div>
          <label className="label">Acquisition Spend ($)</label>
          <input type="number" value={expenses} onChange={e => setExpenses(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">New Customers Acquired</label>
          <input type="number" value={acquired} onChange={e => setAcquired(parseInt(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="card text-center" style={{ padding: '1.5rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Customer Acquisition Cost (CAC)</div>
        <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
          ${cac.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)', marginTop: '4px' }}>
          Average marketing and sales cost required to acquire a single paying client.
        </div>
      </div>
    </div>
  );
};

// 20. CLV Calculator
export const CLVCalculator: React.FC = () => {
  const [arpu, setArpu] = useState(50);
  const [lifespan, setLifespan] = useState(24);
  const [clv, setClv] = useState(0);

  useEffect(() => {
    setClv(arpu * lifespan);
  }, [arpu, lifespan]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
        <div>
          <label className="label">Monthly ARPU ($)</label>
          <input type="number" value={arpu} onChange={e => setArpu(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Customer Lifespan (Months)</label>
          <input type="number" value={lifespan} onChange={e => setLifespan(parseInt(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="card text-center" style={{ padding: '1.5rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)' }}>Customer Lifetime Value (CLV)</div>
        <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'var(--color-success)', marginTop: '4px' }}>
          ${clv.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)', marginTop: '4px' }}>
          Projected aggregate revenue generated by a single user across their lifetime.
        </div>
      </div>
    </div>
  );
};

// 21. Startup Idea Generator
export const StartupIdeaGenerator: React.FC = () => {
  const [idea, setIdea] = useState('');
  
  const generate = () => {
    const niches = ['Dentists', 'Pet Owners', 'Indie Hackers', 'SaaS Founders', 'Real Estate Agents', 'UI Designers'];
    const models = ['SaaS Automation Platform', 'Marketplace Ecosystem', 'AI Copywriter Suite', 'Micro-Learning Portal', 'Analytics Dashboard'];
    const hooks = ['increases productivity', 'automates tedious billing tasks', 'optimizes organic lead generation', 'simplifies document conversion'];

    const n = niches[Math.floor(Math.random() * niches.length)];
    const m = models[Math.floor(Math.random() * models.length)];
    const h = hooks[Math.floor(Math.random() * hooks.length)];

    setIdea(`💡 A ${m} specifically tailored for ${n} that ${h}.`);
    toast.success('Generated startup concept!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <button onClick={generate} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Generate Startup Idea
      </button>

      {idea && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg-subtle)' }}>
          <label className="label">Startup Pitch Concept</label>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, lineHeight: '1.5' }}>{idea}</p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => { navigator.clipboard.writeText(idea); toast.success('Copied startup pitch!'); }}>
            Copy Concept
          </button>
        </div>
      )}
    </div>
  );
};

// 22. Payroll Salary Calculator
export const PayrollCalculator: React.FC = () => {
  const [salary, setSalary] = useState(85000);
  const [taxRate, setTaxRate] = useState(25);
  
  const annualTax = (salary * taxRate) / 100;
  const netAnnual = salary - annualTax;
  const monthly = netAnnual / 12;
  const weekly = netAnnual / 52;
  const hourly = netAnnual / 2080;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
        <div>
          <label className="label">Gross Annual Salary ($)</label>
          <input type="number" value={salary} onChange={e => setSalary(parseFloat(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label">Estimated Tax Rate (%)</label>
          <input type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="input" />
        </div>
      </div>

      <div className="grid-cols-4" style={{ gap: '1rem', marginTop: '0.5rem' }}>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Net Annual</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
            ${netAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Monthly Income</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
            ${monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Weekly Pay</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
            ${weekly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)' }}>Hourly Rate</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-success)', marginTop: '4px' }}>
            ${hourly.toFixed(2)}/hr
          </div>
        </div>
      </div>
    </div>
  );
};


