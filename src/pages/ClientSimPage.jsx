import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { SectionTitle, SubTabs, Card } from '../components/Shared.jsx';
import { CLIENTS_TABLE, NON_IID_DATA, STYLE_DRIFT, LABEL_NOISE, CATEGORY_COLORS } from '../data.js';

const SUBTABS = [
  { id: 'profiles', label: 'Client Profiles' },
  { id: 'iid',      label: 'Non-IID Split' },
  { id: 'style',    label: 'Style Drift' },
  { id: 'noise',    label: 'Label Noise' },
];

export default function ClientSimPage() {
  const [sub, setSub] = useState('profiles');

  return (
    <div>
      <SectionTitle
        title="50 Simulated Edge Clients"
        subtitle="Heterogeneous federation participants: diverse institutions, regions, devices, and energy profiles."
      />

      <SubTabs tabs={SUBTABS} value={sub} onChange={setSub} />

      {sub === 'profiles' && (
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Example Client Profiles</h3>
            <p className="text-xs text-gray-500">8 of 50 simulated clients shown.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  {['ID', 'Institution Type', 'Region', 'Device', 'FLOPs', 'Battery %', 'Carbon Intensity (g/kWh)'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLIENTS_TABLE.map((c, i) => (
                  <tr
                    key={c.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-3 font-mono text-gray-700">{c.id}</td>
                    <td className="px-4 py-3 text-gray-800">{c.institution}</td>
                    <td className="px-4 py-3 text-gray-700">{c.region}</td>
                    <td className="px-4 py-3 text-gray-700">{c.device}</td>
                    <td className="px-4 py-3 text-gray-700">{c.flops.toFixed(1)} T</td>
                    <td className="px-4 py-3 text-gray-700">{c.battery}%</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          'inline-block px-2 py-0.5 rounded text-xs font-medium ' +
                          (c.carbon < 200
                            ? 'bg-green-100 text-green-700'
                            : c.carbon < 400
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700')
                        }
                      >
                        {c.carbon}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {sub === 'iid' && (
        <Card className="p-5">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-gray-900">Dirichlet(α=0.5) Non-IID Split</h3>
            <p className="text-sm text-gray-600">
              We sample per-client class proportions from a symmetric Dirichlet with α=0.5, producing
              strong skew: some clients are dominated by a single category, while others see a more
              balanced mix. This mirrors the real-world heterogeneity of complaint distributions across
              institutions.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={NON_IID_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  label={{ value: 'Proportion', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
                />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {Object.keys(CATEGORY_COLORS).map((k) => (
                  <Bar key={k} dataKey={k} stackId="a" fill={CATEGORY_COLORS[k]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {sub === 'style' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {STYLE_DRIFT.map((s) => (
            <Card key={s.name} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{s.name}</span>
                <h4 className="text-sm font-semibold text-gray-900">{s.name}</h4>
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">"{s.example}"</p>
            </Card>
          ))}
        </div>
      )}

      {sub === 'noise' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Client Label Quality</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LABEL_NOISE}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {LABEL_NOISE.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }}
                    formatter={(v, n) => [`${v} clients`, n]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
                <span className="text-gray-700">Clean: 43</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="text-gray-700">Noisy: 7</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-base font-semibold text-gray-900">Noise Injection</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Noise rate: <span className="font-semibold text-gray-900">2–6% of labels</span> randomly
              flipped per noisy client.
            </p>
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Example</div>
              <div className="text-sm text-gray-800">
                <span className="text-red-600 font-medium">Debt Collection</span> complaint
                <span className="mx-2 text-gray-400">→</span>
                mislabeled as
                <span className="ml-2 text-red-600 font-medium">Credit Reporting</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Noise is applied only to the 7 noisy clients to stress-test robustness against
              heterogeneous annotation quality.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
