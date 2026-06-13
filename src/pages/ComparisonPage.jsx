import React, { useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, LabelList, ZAxis,
} from 'recharts';
import { SectionTitle, Card, Collapsible, fmt4, fmt2 } from '../components/Shared.jsx';
import { MODELS } from '../data.js';

const MODEL_KEYS = Object.keys(MODELS);
const STRATEGIES = ['FLoRA', 'FedAvg', 'All'];

const STRAT_COLORS = {
  FLoRA:  '#16a34a',
  FedAvg: '#ef4444',
  All:    '#3b82f6',
};

const MODEL_SHORT = {
  'Qwen2-0.5B':   'Q05',
  'Qwen2-1.5B':   'Q15',
  'Llama-3.2-1B': 'L1B',
  'Llama-3.2-3B': 'L3B',
  'TinyLlama-1.1B': 'TL1',
  'Gemma-2-2B':   'G2B',
};

// Build the 9 scatter points
function buildScatterData() {
  const out = [];
  MODEL_KEYS.forEach((mk) => {
    STRATEGIES.forEach((s) => {
      const v = MODELS[mk][s.toLowerCase()];
      out.push({
        x: v.co2,
        y: v.comp,
        z: 200,
        name: `${MODEL_SHORT[mk]}-${s}`,
        strategy: s,
        model: mk,
      });
    });
  });
  return out;
}

// Build the grouped bar data for all models
function buildAllModelsGrouped() {
  return MODEL_KEYS.map((mk) => ({
    model: mk,
    FLoRA:  Number((MODELS[mk].flora.comp * 100).toFixed(2)),
    FedAvg: Number((MODELS[mk].fedavg.comp * 100).toFixed(2)),
    All:    Number((MODELS[mk].all.comp * 100).toFixed(2)),
  }));
}

// 3x3 heatmap data: rows = models, cols = strategies, value = CO2
function buildHeatmap() {
  return MODEL_KEYS.map((mk) => ({
    model: mk,
    cells: STRATEGIES.map((s) => ({
      strategy: s,
      co2: MODELS[mk][s.toLowerCase()].co2,
    })),
  }));
}

const FILE_TREE = `/kaggle/working/
├── greenfed_output/
│   ├── qwen2_05b/
│   │   ├── flora/
│   │   │   ├── metrics.csv           ← round-by-round ROUGE-L, BERTScore, CO₂
│   │   │   ├── energy_ledger.csv     ← per-round energy breakdown (train + agg)
│   │   │   ├── energy_ledger_clients.csv  ← per-client energy per round
│   │   │   └── checkpoint.pkl        ← resumable state
│   │   ├── fedavg/  (same structure)
│   │   └── all/     (same structure)
│   ├── qwen2_15b/   (same structure)
│   ├── llama32_1b/  (same structure)
│   ├── thesis_fig1_convergence.png
│   ├── thesis_fig3_heatmap.png
│   ├── thesis_fig4_client_analysis.png
│   └── thesis_fig5_lora_privacy.png
├── cfpb_train.csv
├── cfpb_val.csv
├── cfpb_test.csv
├── client_stats.csv
└── results_optionC.csv               ← main results table (all models × strategies)`;

function colorForCO2(co2, min, max) {
  // green (low) -> red (high)
  const t = (co2 - min) / (max - min || 1);
  const r = Math.round(22  + t * (220 - 22));
  const g = Math.round(163 - t * (130));
  const b = Math.round(74  - t * (50));
  return `rgb(${r}, ${g}, ${b})`;
}

function HeatmapGrid() {
  const grid = buildHeatmap();
  const allCo2 = grid.flatMap((r) => r.cells.map((c) => c.co2));
  const min = Math.min(...allCo2);
  const max = Math.max(...allCo2);
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-gray-500 font-medium"></th>
              {STRATEGIES.map((s) => (
                <th
                  key={s}
                  className="px-3 py-2 text-center text-xs uppercase tracking-wide text-gray-600 font-medium"
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, ri) => (
              <tr key={row.model}>
                <td className="px-3 py-2 text-sm font-medium text-gray-800">{row.model}</td>
                {row.cells.map((cell) => (
                  <td
                    key={cell.strategy}
                    className="px-3 py-4 text-center text-white font-mono text-sm font-semibold border border-white/40"
                    style={{ background: colorForCO2(cell.co2, min, max) }}
                  >
                    {cell.co2.toFixed(2)} g
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend strip */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs text-gray-500">Lowest CO₂</span>
        <div className="flex-1 h-3 rounded" style={{
          background: 'linear-gradient(to right, rgb(22, 163, 74), rgb(220, 38, 38))',
        }} />
        <span className="text-xs text-gray-500">Highest CO₂</span>
      </div>
    </div>
  );
}

const FINDINGS = [
  {
    title: 'FLoRA achieves the lowest CO₂',
    body: 'Qwen2-0.5B with FLoRA produced only 63.05g CO₂ while maintaining competitive quality (composite 0.6941).',
  },
  {
    title: 'Llama-3.2-1B is the strongest performer',
    body: 'FedAvg achieved composite 0.7304, the highest across all non-collapsed models and strategies.',
  },
  {
    title: 'Int-8 compression saves ~50% bandwidth',
    body: 'All models benefit equally from quantized adapter uploads, reducing payload from ~314 MB to ~157 MB.',
  },
  {
    title: 'Energy-aware selection works',
    body: 'FLoRA consistently selects lower carbon-intensity clients (≈280 vs ≈410 g/kWh), validating the utility function design.',
  },
  {
    title: 'Gemma-2-2B with QLoRA low rank collapsed',
    body: 'Across all three strategies, the model produced degenerate output (composite 0.0146) while consuming 891.95g CO₂ — adapter rank is a load-bearing hyperparameter even with 4-bit quantization.',
  },
  {
    title: 'TinyLlama punches above its weight',
    body: 'At only 1.1B parameters and 234.83g CO₂ (FLoRA), TinyLlama-1.1B hit composite 0.6637 — the lowest carbon footprint of any 1B+ model on the board.',
  },
];

export default function ComparisonPage() {
  const scatterData = buildScatterData();
  const groupedBar = buildAllModelsGrouped();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <SectionTitle
        title="Cross-Model & Cross-Strategy Comparison"
        subtitle="All 9 (model × strategy) results compared in quality, energy, and structure."
      />

      {/* Section 1 — Quality vs CO2 scatter */}
      <Card className="p-5 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Section 1 · Quality vs CO₂
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Top-left quadrant = best (high quality, low carbon).
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 24, left: 0, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                dataKey="x"
                name="CO₂"
                unit="g"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                label={{ value: 'Total CO₂ (g)', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#6b7280' } }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Composite"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                label={{ value: 'Composite Score', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
              />
              <ZAxis type="number" dataKey="z" range={[120, 120]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }}
                formatter={(v, n, p) => {
                  if (n === 'x') return [`${v.toFixed(2)} g`, 'CO₂'];
                  if (n === 'y') return [v.toFixed(4), 'Composite'];
                  return v;
                }}
                labelFormatter={() => ''}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {STRATEGIES.map((s) => (
                <Scatter
                  key={s}
                  name={s}
                  data={scatterData.filter((d) => d.strategy === s)}
                  fill={STRAT_COLORS[s]}
                  shape="circle"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-xs text-gray-500 grid grid-cols-3 gap-2 text-center">
          {scatterData.map((d) => (
            <div key={d.name} className="font-mono text-gray-600">
              <span
                className="inline-block w-2 h-2 rounded-full mr-1 align-middle"
                style={{ background: STRAT_COLORS[d.strategy] }}
              />
              {d.name}
            </div>
          ))}
        </div>
      </Card>

      <div className="border-t border-gray-200 my-6" />

      {/* Section 2 — All-models grouped bar */}
      <Card className="p-5 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Section 2 · Composite Score by Model &amp; Strategy
        </h3>
        <p className="text-xs text-gray-500 mb-3">Composite score ×100, grouped per model.</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={groupedBar} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="model" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }}
                formatter={(v) => v.toFixed(2)}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="FLoRA"  fill="#16a34a" radius={[3, 3, 0, 0]}>
                <LabelList dataKey="FLoRA" position="top" style={{ fontSize: 10, fill: '#374151' }} formatter={(v) => v.toFixed(2)} />
              </Bar>
              <Bar dataKey="FedAvg" fill="#ef4444" radius={[3, 3, 0, 0]}>
                <LabelList dataKey="FedAvg" position="top" style={{ fontSize: 10, fill: '#374151' }} formatter={(v) => v.toFixed(2)} />
              </Bar>
              <Bar dataKey="All"    fill="#3b82f6" radius={[3, 3, 0, 0]}>
                <LabelList dataKey="All" position="top" style={{ fontSize: 10, fill: '#374151' }} formatter={(v) => v.toFixed(2)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="border-t border-gray-200 my-6" />

      {/* Section 3 — Energy heatmap (HTML grid) */}
      <Card className="p-5 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Section 3 · Energy Heatmap (CO₂ in g)
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Darker green = lower carbon, darker red = higher carbon.
        </p>
        <HeatmapGrid />
      </Card>

      <div className="border-t border-gray-200 my-6" />

      {/* Section 4 — Key findings */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Section 4 · Key Findings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FINDINGS.map((f) => (
            <Card key={f.title} className="p-5">
              <div className="flex items-start gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">"{f.title}"</div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{f.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 my-6" />

      {/* Appendix — collapsible file tree */}
      <Collapsible
        title="Output File Structure"
        open={open}
        onToggle={() => setOpen((o) => !o)}
      >
        <p className="text-sm text-gray-600 mt-3 mb-3">
          Full directory layout produced by the GreenFed-LoRA experiment runner on Kaggle.
        </p>
        <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 text-xs font-mono text-gray-800 whitespace-pre leading-relaxed">
{FILE_TREE}
        </pre>
      </Collapsible>
    </div>
  );
}
