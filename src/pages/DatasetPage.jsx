import React from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { SectionTitle, Card, StatCard } from '../components/Shared.jsx';
import { CATEGORIES, CLASS_DISTRIBUTION, CATEGORY_COLORS } from '../data.js';

export default function DatasetPage() {
  return (
    <div>
      <SectionTitle
        title="CFPB Consumer Complaints Dataset"
        subtitle="Real US financial complaint narratives from the Consumer Financial Protection Bureau. Used here to train models for structured explanation generation, not classification."
      />

      {/* Category cards 3x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((c) => (
          <div
            key={c.name}
            className={'bg-white border-l-4 ' + c.color + ' border border-gray-200 border-l-4 rounded-lg shadow-sm p-5'}
          >
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-base font-semibold text-gray-900">{c.name}</h3>
            </div>
            <p className="text-sm text-gray-600 italic">"{c.example}"</p>
          </div>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <StatCard value="60,000" label="Complaint Pool" accent="green" />
        <StatCard value="50"     label="Simulated Clients" accent="green" />
        <StatCard value="6"      label="Categories" accent="green" />
      </div>

      {/* Class distribution chart */}
      <div className="mt-8">
        <Card className="p-5">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-gray-900">
              Class Distribution (After Balancing)
            </h3>
            <p className="text-xs text-gray-500">
              All categories balanced to ~10,000 samples via targeted augmentation.
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLASS_DISTRIBUTION} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis
                  label={{ value: 'Samples', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }}
                  formatter={(v) => v.toLocaleString()}
                />
                <Bar dataKey="samples" radius={[4, 4, 0, 0]}>
                  {CLASS_DISTRIBUTION.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#16a34a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
