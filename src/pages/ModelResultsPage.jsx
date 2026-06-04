import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { SectionTitle, Card, ModelCard, MetricCard, StrategyBadge, fmt4, fmt2 } from '../components/Shared.jsx';
import { MODELS } from '../data.js';

const MODEL_KEYS = Object.keys(MODELS);
const STRATEGIES = ['FLoRA', 'FedAvg', 'All'];

function pickBest(values) {
  // returns the strategy name with the highest value
  let best = STRATEGIES[0];
  STRATEGIES.forEach((s) => { if (values[s] > values[best]) best = s; });
  return best;
}

// Build grouped bar data for the selected model.
function buildGroupedData(modelKey) {
  const m = MODELS[modelKey];
  return STRATEGIES.map((s) => {
    const v = m[s.toLowerCase()];
    return {
      strategy: s,
      'ROUGE-L':    Number((v.rouge * 100).toFixed(2)),
      'BERTScore':  Number((v.bert  * 100).toFixed(2)),
      'Composite':  Number((v.comp  * 100).toFixed(2)),
    };
  });
}

// Build convergence line data.
function buildConvergenceData(modelKey) {
  const m = MODELS[modelKey];
  return m.flora.convergence.map((_, i) => ({
    round: `R${i + 1}`,
    FLoRA:  m.flora.convergence[i],
    FedAvg: m.fedavg.convergence[i],
    All:    m.all.convergence[i],
  }));
}

const STRAT_HEADER_COLOR = {
  FLoRA:  'bg-green-600',
  FedAvg: 'bg-red-500',
  All:    'bg-blue-500',
};

function RoundTable({ modelKey, strat }) {
  const m = MODELS[modelKey];
  const s = m[strat.toLowerCase()];
  const cumulativeEnergy = s.rounds.energy.reduce((acc, _, i, arr) => {
    acc.push(arr.slice(0, i + 1).reduce((a, b) => a + b, 0));
    return acc;
  }, []);
  // Per-round total = cumulative CO2 / rounds, split 80% train / 20% agg as approximation
  return (
    <Card className="overflow-hidden">
      <div className={'px-4 py-2 text-white text-sm font-semibold ' + STRAT_HEADER_COLOR[strat]}>
        {strat} · {modelKey}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide">
            <tr>
              {['Round', 'Strategy', 'Train (kWh)', 'Agg (kWh)', 'Total (kWh)', 'CO₂ (g)', 'Comm (MB)'].map((h) => (
                <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.rounds.co2.map((co2, i) => {
              const totalEnergy = cumulativeEnergy[i] - (i > 0 ? cumulativeEnergy[i - 1] : 0);
              const trainEnergy = totalEnergy * 0.8;
              const aggEnergy   = totalEnergy * 0.2;
              const totalUpTo   = cumulativeEnergy[i];
              return (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-gray-700">{i + 1}</td>
                  <td className="px-3 py-2"><StrategyBadge strategy={strat} /></td>
                  <td className="px-3 py-2 text-gray-700 font-mono">{trainEnergy.toFixed(5)}</td>
                  <td className="px-3 py-2 text-gray-700 font-mono">{aggEnergy.toFixed(5)}</td>
                  <td className="px-3 py-2 text-gray-900 font-mono font-semibold">{totalUpTo.toFixed(5)}</td>
                  <td className="px-3 py-2 text-gray-700 font-mono">{co2.toFixed(2)}</td>
                  <td className="px-3 py-2 text-gray-700 font-mono">{s.comm.toFixed(2)}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-100 font-semibold text-gray-900">
              <td className="px-3 py-2" colSpan={2}>Total</td>
              <td className="px-3 py-2 font-mono">{(s.energy * 0.8).toFixed(5)}</td>
              <td className="px-3 py-2 font-mono">{(s.energy * 0.2).toFixed(5)}</td>
              <td className="px-3 py-2 font-mono">{s.energy.toFixed(5)}</td>
              <td className="px-3 py-2 font-mono">{s.co2.toFixed(2)}</td>
              <td className="px-3 py-2 font-mono">{(s.comm * 5).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default function ModelResultsPage() {
  const [modelKey, setModelKey] = useState('Qwen2-0.5B');
  const m = MODELS[modelKey];
  const grouped = buildGroupedData(modelKey);
  const convergence = buildConvergenceData(modelKey);

  // Best (max) values across the three strategies for this model.
  const rougeVals  = { FLoRA: m.flora.rouge,  FedAvg: m.fedavg.rouge,  All: m.all.rouge  };
  const bertVals   = { FLoRA: m.flora.bert,   FedAvg: m.fedavg.bert,   All: m.all.bert   };
  const compVals   = { FLoRA: m.flora.comp,   FedAvg: m.fedavg.comp,   All: m.all.comp   };
  const bestRouge  = pickBest(rougeVals);
  const bestBert   = pickBest(bertVals);
  const bestComp   = pickBest(compVals);

  return (
    <div>
      <SectionTitle
        title="Model Performance by Strategy"
        subtitle="Per-model comparison of FLoRA, FedAvg, and All-Clients baselines across ROUGE-L, BERTScore, and a normalized composite."
      />

      {/* Model selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {MODEL_KEYS.map((k) => (
          <ModelCard
            key={k}
            name={k}
            label={MODELS[k].label}
            active={modelKey === k}
            onClick={() => setModelKey(k)}
          />
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="ROUGE-L (best)"
          value={fmt4(rougeVals[bestRouge])}
          sub={`via ${bestRouge}`}
          highlight
        />
        <MetricCard
          label="BERTScore (best)"
          value={fmt4(bertVals[bestBert])}
          sub={`via ${bestBert}`}
          highlight
        />
        <MetricCard
          label="Composite (best)"
          value={fmt4(compVals[bestComp])}
          sub={`via ${bestComp}`}
          highlight
        />
      </div>

      {/* Grouped bar chart */}
      <Card className="p-5 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {modelKey} · Strategy Comparison
        </h3>
        <p className="text-xs text-gray-500 mb-3">ROUGE-L, BERTScore, and Composite scaled ×100.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grouped} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="strategy" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }}
                formatter={(v) => v.toFixed(2)}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="ROUGE-L"   fill="#16a34a" />
              <Bar dataKey="BERTScore" fill="#3b82f6" />
              <Bar dataKey="Composite" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Convergence line chart */}
      <Card className="p-5 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Composite Convergence (Rounds 1–5)
        </h3>
        <p className="text-xs text-gray-500 mb-3">All three strategies improve steadily across rounds.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={convergence} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="round" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis domain={[0.55, 0.75]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }}
                formatter={(v) => v.toFixed(4)}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="FLoRA"  stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="FedAvg" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="All"    stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Per-round energy tables (stacked, one per strategy) */}
      <h3 className="text-base font-semibold text-gray-900 mb-3">Per-Round Energy Tracking</h3>
      <div className="space-y-4 mb-6">
        <RoundTable modelKey={modelKey} strat="FLoRA" />
        <RoundTable modelKey={modelKey} strat="FedAvg" />
        <RoundTable modelKey={modelKey} strat="All" />
      </div>

      {/* Sample output card */}
      <Card className="p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Sample Output</h3>
        <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">
{`Complaint: "I was charged twice for the same transaction and the bank refused to help."
Generated: Issue Type: Credit Card Billing Dispute | Severity: High |
           What Went Wrong: Duplicate charge, bank unresponsive. |
           Recommended Action: Dispute charge with issuer, request chargeback.`}
        </pre>
      </Card>
    </div>
  );
}
