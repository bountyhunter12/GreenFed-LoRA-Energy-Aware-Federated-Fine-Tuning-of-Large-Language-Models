# GreenFed-LoRA — Research Dashboard

A 7-page interactive dashboard for the thesis
**"GreenFed-LoRA: Energy-Aware Federated Fine-Tuning of LLMs"**.

The dashboard summarizes a federated fine-tuning experiment in which several
LLMs (Qwen2-0.5B, Qwen2-1.5B, Llama-3.2-1B) are fine-tuned on a financial
complaint dataset across multiple simulated clients, using three different
aggregation strategies (FLoRA, FedAvg, All-Clients). It tracks **both model
quality and energy/CO₂**, side by side.

All numbers are hard-coded from the thesis experiments and live in
[`src/data.js`](./src/data.js). The dashboard itself is a static React app —
no backend, no API calls, no real federation happening at runtime.

Demo - https://green-fed-lo-ra-energy-aware-federated-fine-tuning-hczv9e2yn.vercel.app/
---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

The dev server is already running in the background on
<http://localhost:5173/>.

---

## What does each page show?

The seven tabs across the top walk you through the experiment in the same
order as the thesis chapters.

### 1. Dataset
**What it is:** the source data the models are fine-tuned on.

- Six complaint categories (Credit Card, Mortgage, Debt Collection, Bank
  Account, Credit Reporting, Money Transfer) — each shown as a card with a
  color, and a real example sentence.
- Three summary stats: **60,000** total complaints, balanced across
  **50** clients, into **6** classes.
- A bar chart of the **balanced class distribution** — every category ends
  up at exactly 10,000 samples after augmentation.

**What the result shows:** the dataset is small enough to be tractable on
Kaggle GPUs, large enough to be meaningful, and the augmentation pipeline
brings it to a perfectly balanced 10k-per-class split.
### User Interface
<img width="1284" height="891" alt="image" src="https://github.com/user-attachments/assets/f23b236b-37a6-452b-95e6-50b27e6d41ec" />

---

### 2. Augmentation
**What it is:** how the raw imbalanced CFPB data is turned into a balanced
training set with structured outputs.

- A 4-step horizontal pipeline (Clean → Balance → Augment → Structure).
- Side-by-side bar charts: **before** (Mortgage dominant at 8,900, Transfer
  at 1,900) vs **after** (10,000 each).
- The exact prompt template the models are trained against — a 4-field
  structured output: Issue Type / Severity / What Went Wrong / Recommended
  Action.

**What the result shows:** the augmentation fixes the ~4.7× class skew in
the CFPB dataset and forces the model into a consistent answer format that
can be auto-evaluated.
### User Interface
<img width="1330" height="912" alt="image" src="https://github.com/user-attachments/assets/342bd569-9b62-498f-9f9f-a2faa99817fc" />

---

### 3. Client Simulation
**What it is:** the 50 simulated financial-institution clients the
federated loop runs across. Has 4 sub-tabs.

- **Client Profiles** — a table of 8 representative clients. Columns: id,
  institution, region, GPU device, peak FLOPs, battery level, and **carbon
  intensity** (g CO₂/kWh, color-coded green/yellow/red).
- **Non-IID Distribution** — stacked bar chart for 10 clients showing the
  Dirichlet-distributed class skew. Clients 0–5 are highly specialized
  (≈75% one category), clients 6–9 are mixed.
- **Style Drift** — 5 example writing styles (Formal / Casual / Aggressive /
  Technical / Brief) to make the model robust to real-world complaint tone.
- **Label Noise** — donut chart: **43 clean vs 7 noisy** samples, i.e.
  a 2–6% label noise rate.

**What the result shows:** the simulated federation is **heterogeneous** in
two ways — different data (Non-IID) and different hardware/energy
footprints (carbon intensity varies ~6× from 100 to 670 g/kWh). That's the
realistic condition FLoRA is designed for.

### User Interface
<img width="1639" height="898" alt="image" src="https://github.com/user-attachments/assets/36f3ad11-3ed5-43c1-8514-0a8bf7bf0367" />
<img width="1636" height="842" alt="image" src="https://github.com/user-attachments/assets/d8d60182-0285-4ca5-b7ae-386dc203fcfe" />
<img width="1722" height="644" alt="image" src="https://github.com/user-attachments/assets/9f15f264-4a6f-4d72-b313-66289c754c5a" />
<img width="1673" height="772" alt="image" src="https://github.com/user-attachments/assets/169d4f8c-2b8b-4c71-985c-b0c42b4eda9b" />




---

### 4. Federated Loop
**What it is:** the training loop itself, one round at a time.

- A vertical 5-step stepper:
  1. **Client Selection** — top-10 scored by utility
     `U = 0.5·H + 0.3·FLOPs/5 + 0.2·(battery/carbon)`.
  2. **Local Training** — 100 steps, batch 32, LoRA adapters, cosine LR,
     AdamW-8bit.
  3. **Int-8 Compression** — adapter weights quantized before upload
     (~50% payload reduction).
  4. **Aggregation** — FLoRA (SVD re-orthonormalization) or FedAvg weighted
     by per-client sample count.
  5. **Evaluation** — ROUGE-L + BERTScore on 60 held-out structured
     explanations.
- The exact utility formula in a code block.
- A 3-row strategy comparison table: FLoRA, FedAvg, All.

**What the result shows:** the loop runs for **5 rounds**. The energy-aware
client-selection step is the key novelty — it picks clients with
high entropy, high FLOPs, and a good battery/carbon ratio.

### User Interface
<img width="1108" height="908" alt="image" src="https://github.com/user-attachments/assets/5515d448-b45e-4309-a9fb-79fb7df60f8b" />

---

### 5. Model Results
**What it is:** per-model quality metrics and convergence.

- A 3-card model selector (Qwen2-0.5B / Qwen2-1.5B / Llama-3.2-1B).
- Three highlight metric cards — ROUGE-L, BERTScore, and the normalized
  Composite — each auto-marked with the **best** strategy for that model.
- A grouped bar chart of ROUGE-L / BERTScore / Composite ×100 by strategy.
- A convergence line chart across Rounds 1–5.
- Three per-round energy tables (one per strategy) showing Train kWh,
  Aggregate kWh, Total kWh, CO₂ in grams, and Communication in MB.
- A sample structured output the model produced.

**What the result shows:**
- **Llama-3.2-1B** is the strongest model — best composite in every
  strategy (FLoRA 0.7115, FedAvg 0.7304, All 0.7226).
- Composite score improves steadily across rounds, then plateaus by R5.
- Best composite per model:
  - Qwen2-0.5B → **FedAvg** (0.7029)
  - Qwen2-1.5B → **All** (0.7061)
  - Llama-3.2-1B → **FedAvg** (0.7304)

### User Interface
<img width="1444" height="900" alt="image" src="https://github.com/user-attachments/assets/acb32c1e-60c2-417e-bde3-2f8ce6dcf138" />


---

### 6. Energy Tracking
**What it is:** per-round and total energy + CO₂ for the selected model.

- 3-card model selector (mirrors the Model Results page).
- Four stat cards: total CO₂ (FLoRA), total energy (FLoRA), communication
  payload, and the ~50% int-8 saving.
- A cumulative CO₂ line chart across the 5 rounds, one line per strategy.
- A per-round energy table with a totals row.
- A "Carbon Intensity Insight" callout: FLoRA picks clients around
  **280 g CO₂/kWh** vs the unselected pool at **≈410 g/kWh**.
- An int-8 vs Float32 visual: two horizontal bars showing the payload
  drop from 314.06 MB to 157.03 MB.

**What the result shows:** the headline number is the **CO₂ reduction
FLoRA achieves** for the same or better quality:

| Model         | FLoRA CO₂ | FedAvg CO₂ | All CO₂  | FLoRA saves vs FedAvg |
|---------------|-----------|------------|----------|------------------------|
| Qwen2-0.5B    | **63.05 g** | 188.25 g   | 187.42 g | **−66%**               |
| Qwen2-1.5B    | 393.63 g  | **250.07 g** | 399.10 g | +57% (worse)           |
| Llama-3.2-1B  | **309.46 g** | 325.66 g   | 267.25 g | **−5%**                |

FLoRA wins on the smallest model (Qwen2-0.5B) and is roughly tied on
Llama-3.2-1B; FedAvg wins on Qwen2-1.5B because FLoRA happened to select
higher-carbon clients for that particular run.

### User Interface
<img width="1485" height="880" alt="image" src="https://github.com/user-attachments/assets/27e1ed24-2295-41c8-a684-dcafc9e3cc5b" />

---

### 7. Comparison
**What it is:** the headline cross-model, cross-strategy view.

Four sections:

1. **Quality vs CO₂ scatter** — all 9 (model × strategy) points on one
   chart. Top-left quadrant = best (high quality, low carbon).
2. **Composite score by model & strategy** — grouped bar chart with value
   labels on top of every bar.
3. **Energy heatmap** — 3×3 grid of CO₂ values, color-graded green → red,
   with a gradient legend strip.
4. **Key findings** — four takeaway cards.

A collapsible appendix at the bottom shows the full **output file tree**
that the experiment runner produces on Kaggle
(`/kaggle/working/greenfed_output/...`).

**What the result shows:** the four headline findings are

- FLoRA achieves the lowest CO₂ (Qwen2-0.5B: 63.05 g at composite 0.6941).
- Llama-3.2-1B is the strongest performer (FedAvg composite 0.7304).
- Int-8 compression saves ~50% bandwidth on every model.
- Energy-aware client selection works — FLoRA clients average
  ~280 g/kWh vs ~410 g/kWh for the unselected pool.
  
### User Interface
  <img width="1576" height="761" alt="image" src="https://github.com/user-attachments/assets/cc9e1298-1f82-4846-a172-a70b17f64482" />
  <img width="1313" height="899" alt="image" src="https://github.com/user-attachments/assets/732e237e-b26b-486f-8cdd-0dbc92b377ae" />


---

## How the code is organized

```
e:\thesis\
├── package.json              react 18, vite 5, tailwind 3, recharts 2
├── vite.config.js            host:true, port 5173
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── README.md                 ← this file
└── src\
    ├── main.jsx              React 18 createRoot
    ├── App.jsx               7-tab top nav
    ├── index.css             @tailwind directives only
    ├── data.js               ← all hard-coded numbers live here
    ├── components\
    │   └── Shared.jsx        SectionTitle, Card, SubTabs, StatCard,
    │                         MetricCard, ModelCard, Collapsible, …
    └── pages\
        ├── DatasetPage.jsx
        ├── AugmentationPage.jsx
        ├── ClientSimPage.jsx
        ├── FederatedLoopPage.jsx
        ├── ModelResultsPage.jsx
        ├── EnergyTrackingPage.jsx
        └── ComparisonPage.jsx
```

- `src/data.js` is the **single source of truth** for every number on
  every page. Change a value there and it propagates everywhere.
- `src/components/Shared.jsx` is the only shared UI module — every page
  imports `Card`, `SectionTitle`, and the formatting helpers from it.
- Pages are independent: each one is a self-contained React component
  that consumes `data.js` and renders its own Recharts visualizations.

---

## Methodology in one paragraph

A 60k CFPB complaint dataset is balanced to 10k per class, formatted into
4-field structured outputs, and distributed across 50 simulated clients
using Dirichlet (Non-IID) proportions and style/label noise. Each round
the server picks the top-10 clients by an energy-aware utility function,
sends them the current LoRA adapter, the clients fine-tune locally for
100 steps, quantize their adapter to int-8, and upload. The server
aggregates with FLoRA (SVD re-orthonormalization), FedAvg, or All-Clients,
evaluates on 60 held-out examples, and records ROUGE-L, BERTScore, kWh,
and g CO₂. We compare 3 models × 3 strategies × 5 rounds.

---

## Notes

- Recharts v2 is used (v3 still has a few breaking changes; the v2 API is
  stable and renders cleanly).
- The dev server is currently running in the background terminal
  `007c1389-5926-4d04-ab58-96f67ee94ecd` on port 5173.
- A production build has been verified — 838 modules transformed in
  ~4.3s, no compile or lint errors, only a bundle-size advisory
  (~614 kB JS, ~170 kB gzipped).
