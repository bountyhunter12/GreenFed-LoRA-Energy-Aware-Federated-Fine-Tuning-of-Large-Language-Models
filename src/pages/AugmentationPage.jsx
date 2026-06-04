import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { SectionTitle, Card } from '../components/Shared.jsx';
import { BEFORE_AFTER, PROMPT_TEMPLATE, CATEGORY_COLORS } from '../data.js';

const STEPS = [
  { num: 1, title: 'Load Raw Data',              desc: 'CFPB complaints with product category labels' },
  { num: 2, title: 'Clean Text',                 desc: 'Remove XXXX tokens, filter < 20 words, normalize whitespace' },
  { num: 3, title: 'Augment Under-represented',  desc: 'Word shuffle, prefix injection, truncation to reach 10k/class' },
  { num: 4, title: 'Stratified Split',           desc: '80% train / 10% val / 10% test' },
];

export default function AugmentationPage() {
  return (
    <div>
      <SectionTitle
        title="Data Augmentation Pipeline"
        subtitle="Pre-processing and balancing steps applied to the CFPB corpus before federated fine-tuning."
      />

      {/* 4-step horizontal stepper */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2">
          {STEPS.map((s, i) => (
            <div key={s.num} className="relative flex md:flex-col items-start md:items-center text-left md:text-center">
              <div className="flex items-center md:flex-col md:items-center w-full">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block w-full h-0.5 bg-green-200 mt-5" />
                )}
                {i < STEPS.length - 1 && (
                  <div className="md:hidden flex-1 h-0.5 bg-green-200 ml-3" />
                )}
              </div>
              <div className="mt-2 md:mt-3 ml-3 md:ml-0">
                <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                <div className="text-xs text-gray-500 mt-1 max-w-[180px] md:mx-auto">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Before / After bar charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="p-5">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-gray-900">Before Augmentation</h3>
            <p className="text-xs text-gray-500">Raw CFPB class counts are highly skewed.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BEFORE_AFTER.before} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }} />
                <Bar dataKey="samples" radius={[0, 4, 4, 0]}>
                  {BEFORE_AFTER.before.map((entry, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-gray-900">After Augmentation</h3>
            <p className="text-xs text-gray-500">All classes balanced to 10,000 samples.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BEFORE_AFTER.after} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} domain={[0, 11000]} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12 }} />
                <Bar dataKey="samples" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Prompt format card */}
      <Card className="p-5">
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900">Prompt Format</h3>
          <p className="text-xs text-gray-500">
            Structured 4-field explanation template used for all training and evaluation samples.
          </p>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">
{PROMPT_TEMPLATE}
        </pre>
      </Card>
    </div>
  );
}
