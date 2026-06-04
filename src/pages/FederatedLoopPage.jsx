import React from 'react';
import { SectionTitle, Card } from '../components/Shared.jsx';
import { FED_STEPS } from '../data.js';

const STRATEGIES = [
  { name: 'GreenFed-LoRA (FLoRA)', selection: 'Top-10 by utility',         aggregation: 'FLoRA + SVD',          role: 'Proposed method',     badge: 'green' },
  { name: 'FedAvg Baseline',       selection: 'Top-10 by utility',         aggregation: 'FedAvg weighted avg',  role: 'Aggregation ablation',badge: 'red' },
  { name: 'All Clients (FLoRA)',   selection: 'Random 10',                 aggregation: 'FLoRA + SVD',          role: 'Selection ablation',  badge: 'blue' },
];

const badgeColor = {
  green: 'bg-green-100 text-green-700 border-green-300',
  red:   'bg-red-100 text-red-700 border-red-300',
  blue:  'bg-blue-100 text-blue-700 border-blue-300',
};

export default function FederatedLoopPage() {
  return (
    <div>
      <SectionTitle
        title="Federated Learning Loop"
        subtitle="Five-stage round, executed 5 times for every (model, strategy) configuration."
      />

      {/* Vertical 5-step stepper */}
      <Card className="p-6 mb-8">
        <div className="relative">
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-green-100 hidden sm:block" />
          <div className="space-y-6">
            {FED_STEPS.map((step, i) => (
              <div key={i} className="relative flex items-start gap-4">
                <div className="relative z-10 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow">
                  {i + 1}
                </div>
                <div className="pt-1">
                  <div className="text-base font-semibold text-gray-900">{step.title}</div>
                  <div className="text-sm text-gray-600 mt-0.5 max-w-2xl">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Utility formula card */}
      <Card className="p-5 mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Utility Formula</h3>
        <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm font-mono text-gray-800 leading-relaxed whitespace-pre">
{`U = 0.5 × H_norm        (data diversity — Shannon entropy)
  + 0.3 × FLOPs / 5      (compute capacity)
  + 0.2 × min(battery / carbon, 1)   (energy efficiency)`}
        </pre>
        <p className="text-xs text-gray-500 mt-3">
          Higher U = more attractive client. Energy term is clipped at 1.0 to avoid degenerate solutions.
        </p>
      </Card>

      {/* 3-column strategy comparison table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Strategy Comparison</h3>
          <p className="text-xs text-gray-500">Ablation matrix used in the experiments.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Strategy</th>
                <th className="text-left px-4 py-3 font-medium">Selection</th>
                <th className="text-left px-4 py-3 font-medium">Aggregation</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {STRATEGIES.map((s, i) => (
                <tr key={s.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3">
                    <span
                      className={
                        'inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ' +
                        (badgeColor[s.badge])
                      }
                    >
                      {s.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{s.selection}</td>
                  <td className="px-4 py-3 text-gray-700">{s.aggregation}</td>
                  <td className="px-4 py-3 text-gray-700">{s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
