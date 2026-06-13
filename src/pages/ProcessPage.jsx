import React from 'react';
import { SectionTitle } from '../components/Shared.jsx';
import {
  CATEGORIES, CATEGORY_COLORS, CLIENTS_TABLE, NON_IID_DATA,
  COMPRESSION,
} from '../data.js';

// ============================================================
// Small visual helpers (NO labels baked into the artwork)
// Labels live in the Station's legend row, not inside the SVG.
// ============================================================

const FLOW_W = 640;
const FLOW_H = 260;

// 01 - Seed: 1 brown core, 6 colored petals around it
function SeedBloom() {
  const colors = Object.values(CATEGORY_COLORS);
  const cx0 = FLOW_W / 2;
  const cy0 = FLOW_H / 2;
  return (
    <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
         preserveAspectRatio="xMidYMid meet"
         className="block w-full h-full">
      <defs>
        <radialGradient id="seedCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
      </defs>
      {colors.map((c, i) => {
        const angle = (i / colors.length) * Math.PI * 2 - Math.PI / 2;
        const cx = cx0 + Math.cos(angle) * 90;
        const cy = cy0 + Math.sin(angle) * 70;
        return <circle key={i} cx={cx} cy={cy} r="26" fill={c} opacity="0.9" />;
      })}
      <circle cx={cx0} cy={cy0} r="40" fill="url(#seedCore)" />
    </svg>
  );
}

// 02 - 8 client bars stacked, each is a Non-IID mix
function SimulatedClients() {
  const cats = CATEGORIES.map((c) => c.short);
  const rows = NON_IID_DATA.slice(0, 8);
  const barH = 20;
  const gap = 8;
  const startY = (FLOW_H - (rows.length * (barH + gap) - gap)) / 2;
  return (
    <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
         preserveAspectRatio="xMidYMid meet"
         className="block w-full h-full">
      {rows.map((row, idx) => {
        const y = startY + idx * (barH + gap);
        let xCursor = 0;
        const segs = cats.map((cat) => {
          const w = (row[cat] || 0) * 480;
          const seg = (
            <rect key={cat} x={xCursor} y={y} width={w} height={barH}
                  fill={CATEGORY_COLORS[cat]} />
          );
          xCursor += w;
          return seg;
        });
        return (
          <g key={idx}>
            <text x="0" y={y + barH - 5} fontSize="11" fontWeight="600" fill="#6b7280">
              {String(idx).padStart(2, '0')}
            </text>
            <g transform="translate(40, 0)">{segs}</g>
          </g>
        );
      })}
    </svg>
  );
}

// 03 - 50 dots in a 10x5 grid, 10 picked
function SelectionGrid() {
  const total = 50;
  const selected = new Set([1, 4, 7, 12, 18, 23, 28, 33, 39, 44]);
  const cols = 10;
  const rows = 5;
  const dotR = 12;
  const sx = 50;
  const sy = 20;
  const dx = (FLOW_W - 2 * sx) / (cols - 1);
  const dy = (FLOW_H - 2 * sy) / (rows - 1);
  return (
    <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
         preserveAspectRatio="xMidYMid meet"
         className="block w-full h-full">
      {Array.from({ length: total }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = sx + col * dx;
        const cy = sy + row * dy;
        const on = selected.has(i);
        return (
          <circle key={i} cx={cx} cy={cy} r={dotR}
                  fill={on ? '#16a34a' : '#e5e7eb'}
                  stroke={on ? '#14532d' : '#9ca3af'}
                  strokeWidth={on ? 2 : 1} />
        );
      })}
    </svg>
  );
}

// 04 - Base LLM + LoRA, 5 growing training rings
function LocalTrainLoop() {
  const rounds = [0, 1, 2, 3, 4];
  const startX = 70;
  const endX = FLOW_W - 70;
  const cy = FLOW_H / 2;
  return (
    <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
         preserveAspectRatio="xMidYMid meet"
         className="block w-full h-full">
      <defs>
        <marker id="arrT" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
        <marker id="arrT2" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1e3a8a" />
        </marker>
      </defs>
      {/* Base + LoRA boxes */}
      <rect x="20" y="40" width="120" height="50" rx="8" fill="#1e3a8a" />
      <rect x="500" y="40" width="120" height="50" rx="8" fill="#0d9488" />
      <line x1="140" y1="65" x2="500" y2="65" stroke="#0d9488" strokeWidth="2"
            markerEnd="url(#arrT)" />
      <line x1="560" y1="90" x2="560" y2="170" stroke="#0d9488" strokeWidth="2"
            markerEnd="url(#arrT)" />
      {/* Rings + R labels */}
      {rounds.map((r) => {
        const cx = startX + (r / 4) * (endX - startX);
        const rr = 14 + r * 4;
        return (
          <g key={r}>
            <circle cx={cx} cy={cy + 50} r={rr}
                    fill="none" stroke="#16a34a" strokeWidth="2"
                    opacity={0.35 + r * 0.15} />
            <text x={cx} y={cy + 54} textAnchor="middle" fontSize="10"
                  fontWeight="700" fill="#14532d">R{r + 1}</text>
          </g>
        );
      })}
      {/* Return arrow */}
      <line x1="60" y1="170" x2="60" y2="90" stroke="#1e3a8a" strokeWidth="2"
            markerEnd="url(#arrT2)" />
    </svg>
  );
}

// 05 - FP32 vs INT8 payload bars
function CompressionVisual() {
  const ratio = COMPRESSION.int8 / COMPRESSION.float32;
  return (
    <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
         preserveAspectRatio="xMidYMid meet"
         className="block w-full h-full">
      {/* Track */}
      <rect x="80" y="60" width="480" height="32" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" rx="3" />
      <rect x="80" y="160" width="480" height="32" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" rx="3" />
      {/* Fill */}
      <rect x="80" y="60" width="480" height="32" fill="#ef4444" opacity="0.55" rx="3" />
      <rect x="80" y="160" width={480 * ratio} height="32" fill="#16a34a" opacity="0.6" rx="3" />
    </svg>
  );
}

// 06 - 10 client adapters fan into a Σ node, then global ΔW
function Aggregator() {
  const inputX = 40;
  const inputW = 90;
  const center = { x: 320, y: FLOW_H / 2 };
  const inputCount = 10;
  const outX = 480;
  const outW = 120;
  return (
    <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
         preserveAspectRatio="xMidYMid meet"
         className="block w-full h-full">
      <defs>
        <marker id="arrA" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#7c3aed" />
        </marker>
        <marker id="arrAi" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0d9488" />
        </marker>
      </defs>
      {Array.from({ length: inputCount }).map((_, i) => {
        const y = 30 + i * 20;
        return (
          <g key={i}>
            <rect x={inputX} y={y} width={inputW} height="14" rx="2"
                  fill="#0d9488" opacity="0.85" />
            <line x1={inputX + inputW} y1={y + 7}
                  x2={center.x - 38} y2={center.y}
                  stroke="#0d9488" strokeWidth="1" opacity="0.5"
                  markerEnd="url(#arrAi)" />
          </g>
        );
      })}
      <circle cx={center.x} cy={center.y} r="38" fill="#7c3aed" />
      <rect x={outX} y={center.y - 20} width={outW} height={40} rx="6" fill="#7c3aed" />
      <line x1={center.x + 38} y1={center.y}
            x2={outX} y2={center.y}
            stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrA)" />
    </svg>
  );
}

// 07 - 5 round-bars showing cumulative CO2
function CarbonMeter() {
  const grams = [12.5, 25.1, 37.8, 50.4, 63.05];
  const max = Math.max(...grams);
  const baseY = 220;
  const maxH = 150;
  const bw = 80;
  const sx = 80;
  const gap = (FLOW_W - 2 * sx - bw * grams.length) / (grams.length - 1);
  return (
    <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
         preserveAspectRatio="xMidYMid meet"
         className="block w-full h-full">
      <line x1="40" y1={baseY} x2={FLOW_W - 40} y2={baseY}
            stroke="#9ca3af" strokeWidth="1" />
      {grams.map((g, i) => {
        const h = (g / max) * maxH;
        const x = sx + i * (bw + gap);
        return (
          <rect key={i} x={x} y={baseY - h} width={bw} height={h}
                fill="#16a34a" />
        );
      })}
    </svg>
  );
}

// 08 - 8 clients with region carbon intensity
function CarbonRegion() {
  const max = 700;
  const bw = 460;
  const sx = 130;
  const baseY = 30;
  const rh = 20;
  const gap = 8;
  return (
    <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
         preserveAspectRatio="xMidYMid meet"
         className="block w-full h-full">
      {CLIENTS_TABLE.map((c, i) => {
        const y = baseY + i * (rh + gap);
        const w = (c.carbon / max) * bw;
        const color = c.carbon < 200 ? '#16a34a' :
                      c.carbon < 400 ? '#eab308' : '#ef4444';
        return (
          <g key={c.id}>
            <text x="0" y={y + 14} fontSize="11" fontWeight="600" fill="#374151">
              {c.id}
            </text>
            <rect x={sx} y={y} width={w} height={rh} fill={color} opacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// Station wrapper: visual on top, legend on bottom
// ============================================================

function Legend({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-700 pt-2 border-t border-gray-200">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm"
                style={{ background: it.color }} />
          <span className="font-medium">{it.label}</span>
          {it.value && <span className="text-gray-500">· {it.value}</span>}
        </div>
      ))}
    </div>
  );
}

function Station({ color, title, subtitle, children, legend }) {
  const colorMap = {
    green:  'border-green-400 bg-green-50',
    blue:   'border-blue-400 bg-blue-50',
    orange: 'border-orange-400 bg-orange-50',
    purple: 'border-purple-400 bg-purple-50',
    red:    'border-red-400 bg-red-50',
  };
  return (
    <div className={'rounded-2xl border-2 p-5 ' + (colorMap[color] || colorMap.green)}>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-base font-bold text-gray-800">{title}</span>
        {subtitle && (
          <span className="text-xs uppercase tracking-widest text-gray-500">
            {subtitle}
          </span>
        )}
      </div>
      <div className="w-full" style={{ height: 280 }}>
        {children}
      </div>
      {legend && <Legend items={legend} />}
    </div>
  );
}

// Arrow between stations
function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center my-3">
      <svg width="60" height="40" viewBox="0 0 60 40">
        <line x1="30" y1="0" x2="30" y2="30"
              stroke="#9ca3af" strokeWidth="2" strokeDasharray="5 4" />
        <polygon points="22,28 38,28 30,38" fill="#9ca3af" />
      </svg>
      {label && (
        <span className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">
          {label}
        </span>
      )}
    </div>
  );
}

// ============================================================
// Page
// ============================================================

export default function ProcessPage() {
  const catLegend = CATEGORIES.map((c) => ({
    color: CATEGORY_COLORS[c.short],
    label: c.name,
  }));

  return (
    <div>
      <SectionTitle
        title="Process"
        subtitle="Top to bottom: how the dataset becomes a federated model with energy tracking."
      />

      <div className="space-y-1">
        {/* 01 - Seed */}
        <Station
          color="blue"
          title="01 · Seed"
          subtitle="CFPB dataset, 6 categories"
        >
          <SeedBloom />
        </Station>
        <Legend items={[{ color: '#451a03', label: 'Dataset core' }, ...catLegend]} />

        <Arrow label="partition + dirichlet" />

        {/* 02 - Simulated Clients */}
        <Station
          color="orange"
          title="02 · Simulated Clients"
          subtitle="50 federated clients, Non-IID mix"
        >
          <SimulatedClients />
        </Station>
        <Legend items={catLegend} />

        <Arrow label="score: U = 0.5H + 0.3FLOPs + 0.2(battery / carbon)" />

        {/* 03 - Selection */}
        <Station
          color="green"
          title="03 · Selection"
          subtitle="top-10 of 50 each round"
        >
          <SelectionGrid />
        </Station>
        <Legend
          items={[
            { color: '#16a34a', label: 'Selected (×10)' },
            { color: '#e5e7eb', label: 'Idle (×40)' },
          ]}
        />

        <Arrow label="ΔW init" />

        {/* 04 - Local training loop */}
        <Station
          color="purple"
          title="04 · Local Train"
          subtitle="5 rounds, base LLM + LoRA"
        >
          <LocalTrainLoop />
        </Station>
        <Legend
          items={[
            { color: '#1e3a8a', label: 'Base LLM' },
            { color: '#0d9488', label: 'LoRA ΔW' },
            { color: '#16a34a', label: 'R1 → R5' },
          ]}
        />

        <Arrow label="int-8 quantize" />

        {/* 05 - Compression */}
        <Station
          color="purple"
          title="05 · Adapter Payload"
          subtitle="FP32 → INT8"
        >
          <CompressionVisual />
        </Station>
        <Legend
          items={[
            { color: '#ef4444', label: 'FP32', value: `${COMPRESSION.float32.toFixed(2)} MB` },
            { color: '#16a34a', label: 'INT8', value: `${COMPRESSION.int8.toFixed(2)} MB` },
          ]}
        />

        <Arrow label="upload ΔW" />

        {/* 06 - Aggregation */}
        <Station
          color="red"
          title="06 · Aggregation"
          subtitle="FLoRA / FedAvg Σ"
        >
          <Aggregator />
        </Station>
        <Legend
          items={[
            { color: '#0d9488', label: '10 × ΔW (client adapters)' },
            { color: '#7c3aed', label: 'FLoRA Σ → Global ΔW' },
          ]}
        />

        <Arrow label="codecarbon × grid" />

        {/* 07 - Carbon meter */}
        <Station
          color="green"
          title="07 · Carbon"
          subtitle="cumulative g CO₂ per round"
        >
          <CarbonMeter />
        </Station>
        <Legend
          items={[
            { color: '#16a34a', label: 'R1–R5' },
            { color: '#16a34a', label: '63.05 g total', value: 'best-case' },
          ]}
        />

        <Arrow label="region carbon intensity" />

        {/* 08 - Region intensity */}
        <Station
          color="orange"
          title="08 · Region Intensity"
          subtitle="g CO₂ / kWh per client region"
        >
          <CarbonRegion />
        </Station>
        <Legend
          items={[
            { color: '#16a34a', label: '< 200 green' },
            { color: '#eab308', label: '200–400 yellow' },
            { color: '#ef4444', label: '> 400 red' },
          ]}
        />
      </div>
    </div>
  );
}

