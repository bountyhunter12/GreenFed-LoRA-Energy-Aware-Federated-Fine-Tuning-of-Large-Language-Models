import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { SectionTitle, Card, ModelCard, StatCard, fmt2 } from '../components/Shared.jsx';
import { MODELS, COMPRESSION } from '../data.js';

const MODEL_KEYS = Object.keys(MODELS);

function buildCO2Data(modelKey) {
  const m = MODELS[modelKey];
  return m.flora.rounds.co2.map((_, i) => ({
    round: `R${i + 1}`,
    FLoRA:  m.flora.rounds.co2[i],
    FedAvg: m.fedavg.rounds.co2[i],
    All:    m.all.rounds.co2[i],
  }));
}

export default function EnergyTrackingPage() {
  const [modelKey, setModelKey] = React.useState('Qwen2-0.5B');
  const m = MODELS[modelKey];
  const co2Data = buildCO2Data(modelKey);

  // The lowest total CO2 across the three strategies is the "best".
  const totals = { FLoRA: m.flora.co2, FedAvg: m.fedavg.co2, All: m.all.co2 };
  const best = Object.entries(totals).sort((a, b) => a[1] - b[1])[0][0];

  return (
    <div>
      <SectionTitle
        title="Energy & Carbon Tracking per Model"
        subtitle="Cumulative CO₂, energy consumption, and communication payload across 5 federated rounds."
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

      {/* 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard value={`${m.flora.co2.toFixed(2)} g`} label="Total CO₂ (FLoRA)" accent="green" />
        <StatCard value={`${m.flora.energy.toFixed(5)} kWh`} label="Total Energy (FLoRA)" accent="green" />
        <StatCard value={`${m.comm.toFixed(2)} MB`} label="Comm Payload (per round)" accent="blue" />
        <StatCard value="~50%" label="Int-8 Compression Saving" accent="green" />
      </div>

      {/* Cumulative CO2 line chart */}
      <Card className="p-5 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {modelKey} · Cumulative CO₂ (g) per Round
        </h3>
        <p className="text-xs text-gray-500 mb-3">FLoRA stays lowest across all rounds for this model.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={co2Data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="round" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }}
                formatter={(v) => v.toFixed(2) + ' g'}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="FLoRA"  stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="FedAvg" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="All"    stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Per-round energy table */}
      <Card className="overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            {modelKey} · Per-Round Energy (kWh)
          </h3>
          <p className="text-xs text-gray-500">Incremental energy consumed per federated round.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Round</th>
                <th className="text-left px-4 py-3 font-medium">FLoRA Energy (kWh)</th>
                <th className="text-left px-4 py-3 font-medium">FedAvg Energy (kWh)</th>
                <th className="text-left px-4 py-3 font-medium">All Energy (kWh)</th>
              </tr>
            </thead>
            <tbody>
              {m.flora.rounds.energy.map((_, i) => {
                const inc = (arr) => {
                  const total = arr.reduce((a, b) => a + b, 0);
                  return Number((arr[i] || total / 5).toFixed(5));
                };
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-700">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-gray-800">{m.flora.rounds.energy[i].toFixed(5)}</td>
                    <td className="px-4 py-3 font-mono text-gray-800">{m.fedavg.rounds.energy[i].toFixed(5)}</td>
                    <td className="px-4 py-3 font-mono text-gray-800">{m.all.rounds.energy[i].toFixed(5)}</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100 font-semibold text-gray-900">
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 font-mono">{m.flora.energy.toFixed(5)}</td>
                <td className="px-4 py-3 font-mono">{m.fedavg.energy.toFixed(5)}</td>
                <td className="px-4 py-3 font-mono">{m.all.energy.toFixed(5)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Carbon intensity insight card */}
      <Card className="p-5 mb-6 bg-green-50/40 border-green-200">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Carbon Intensity Insight</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          GreenFed-LoRA selects clients with lower carbon intensity because the utility function
          explicitly penalizes high-carbon devices. Average selected client carbon intensity:{' '}
          <span className="font-semibold text-green-700">FLoRA ≈ 280 g/kWh</span> vs{' '}
          <span className="font-semibold text-red-600">FedAvg ≈ 410 g/kWh</span>.
        </p>
      </Card>

      {/* Int-8 compression visual */}
      <Card className="p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Int-8 Compression</h3>
        <p className="text-xs text-gray-500 mb-4">Adapter weights are quantized before upload.</p>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span className="font-medium">Float32 (full precision)</span>
              <span className="font-mono">{COMPRESSION.float32.toFixed(2)} MB</span>
            </div>
            <div className="w-full h-4 rounded bg-red-100">
              <div className="h-4 rounded bg-red-500" style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span className="font-medium">Int-8 (quantized)</span>
              <span className="font-mono">{COMPRESSION.int8.toFixed(2)} MB</span>
            </div>
            <div className="w-full h-4 rounded bg-green-100">
              <div className="h-4 rounded bg-green-500" style={{ width: '50%' }} />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          ~50% bandwidth reduction for every round of every model.
        </p>
      </Card>
    </div>
  );
}
