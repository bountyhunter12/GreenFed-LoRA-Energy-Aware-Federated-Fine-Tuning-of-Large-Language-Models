import React from 'react';

export function SectionTitle({ title, subtitle, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 max-w-3xl">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={'bg-white border border-gray-200 rounded-lg shadow-sm ' + className}>
      {children}
    </div>
  );
}

export function SubTabs({ tabs, value, onChange }) {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-6">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={
              'px-4 py-1.5 text-sm rounded-full font-medium transition-colors ' +
              (active
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800')
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function StatCard({ value, label, accent = 'green' }) {
  const colorMap = {
    green:  'text-green-600',
    red:    'text-red-500',
    blue:   'text-blue-500',
    gray:   'text-gray-900',
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
      <div className={'text-3xl font-bold ' + (colorMap[accent] || colorMap.gray)}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-gray-500 mt-1">
        {label}
      </div>
    </div>
  );
}

export function MetricCard({ label, value, sub, highlight = false }) {
  return (
    <div
      className={
        'rounded-lg p-5 border ' +
        (highlight
          ? 'bg-green-50 border-green-500'
          : 'bg-white border-gray-200')
      }
    >
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div
        className={
          'text-2xl font-bold mt-1 ' +
          (highlight ? 'text-green-700' : 'text-gray-900')
        }
      >
        {value}
      </div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

export function StrategyBadge({ strategy }) {
  const map = {
    FLoRA:  'bg-green-100 text-green-700 border-green-300',
    FedAvg: 'bg-red-100 text-red-700 border-red-300',
    All:    'bg-blue-100 text-blue-700 border-blue-300',
  };
  return (
    <span
      className={
        'inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ' +
        (map[strategy] || 'bg-gray-100 text-gray-700 border-gray-300')
      }
    >
      {strategy}
    </span>
  );
}

export function ModelCard({ name, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        'w-full text-left rounded-lg p-4 border transition-all ' +
        (active
          ? 'border-green-600 text-green-700 bg-green-50 shadow-sm'
          : 'border-gray-200 text-gray-700 bg-white hover:border-gray-300')
      }
    >
      <div className="text-base font-semibold">{name}</div>
      <div className="text-xs text-gray-500 mt-1">LoRA scope: {label}</div>
    </button>
  );
}

export function Collapsible({ title, open, onToggle, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-base font-semibold text-gray-900">{title}</span>
        <span className="text-gray-500 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
    </div>
  );
}

export function fmt4(n) { return Number(n).toFixed(4); }
export function fmt2(n) { return Number(n).toFixed(2); }
export function fmtPct(n) { return (Number(n) * 100).toFixed(1) + '%'; }
