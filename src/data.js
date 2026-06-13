// Centralized hard-coded data for the GreenFed-LoRA dashboard.
// All numbers are real values from the thesis experiments.

export const CATEGORIES = [
  {
    name: 'Credit Card Billing',
    color: 'border-red-500',
    bg: 'bg-red-50',
    text: 'text-red-600',
    example: 'My card was charged twice for the same purchase',
    short: 'Credit Card',
  },
  {
    name: 'Mortgage & Loans',
    color: 'border-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    example: 'My mortgage payment wasn’t applied correctly',
    short: 'Mortgage',
  },
  {
    name: 'Debt Collection',
    color: 'border-orange-500',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    example: 'A collector called me 5 times in one day',
    short: 'Debt Coll.',
  },
  {
    name: 'Bank Account Issues',
    color: 'border-green-500',
    bg: 'bg-green-50',
    text: 'text-green-600',
    example: 'My account was frozen without explanation',
    short: 'Bank Acct.',
  },
  {
    name: 'Credit Reporting',
    color: 'border-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    example: 'There’s an account on my report I never opened',
    short: 'Credit Rep.',
  },
  {
    name: 'Money Transfer Fraud',
    color: 'border-yellow-500',
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    example: 'My wire transfer never arrived',
    short: 'Transfer',
  },
];

export const CLASS_DISTRIBUTION = CATEGORIES.map((c) => ({
  name: c.short,
  samples: 10000,
}));

export const BEFORE_AFTER = {
  before: [
    { name: 'Credit Card', samples: 3200 },
    { name: 'Mortgage', samples: 8900 },
    { name: 'Debt Coll.', samples: 2100 },
    { name: 'Bank Acct.', samples: 6500 },
    { name: 'Credit Rep.', samples: 4800 },
    { name: 'Transfer', samples: 1900 },
  ],
  after: [
    { name: 'Credit Card', samples: 10000 },
    { name: 'Mortgage', samples: 10000 },
    { name: 'Debt Coll.', samples: 10000 },
    { name: 'Bank Acct.', samples: 10000 },
    { name: 'Credit Rep.', samples: 10000 },
    { name: 'Transfer', samples: 10000 },
  ],
};

export const PROMPT_TEMPLATE = `System: You are a financial complaint analyst. Output:
Issue Type: [type] | Severity: [level] | What Went Wrong: [reason] | Recommended Action: [advice]

Complaint: {complaint text here}
Issue Type:`;

export const CLIENTS_TABLE = [
  { id: 'C-001', institution: 'National Bank',     region: 'US-East',     device: 'A100 80GB',  flops: 4.2, battery: 92, carbon: 180 },
  { id: 'C-002', institution: 'FinTech',            region: 'US-West',     device: 'A100 40GB',  flops: 3.8, battery: 78, carbon: 240 },
  { id: 'C-003', institution: 'Credit Union',       region: 'US-Central',  device: 'V100 32GB',  flops: 2.9, battery: 64, carbon: 510 },
  { id: 'C-004', institution: 'National Bank',     region: 'EU-Central',  device: 'A100 80GB',  flops: 4.5, battery: 88, carbon: 120 },
  { id: 'C-005', institution: 'FinTech',            region: 'APAC-South',  device: 'RTX 4090',   flops: 3.4, battery: 55, carbon: 670 },
  { id: 'C-006', institution: 'Credit Union',       region: 'US-South',    device: 'V100 16GB',  flops: 2.1, battery: 71, carbon: 420 },
  { id: 'C-007', institution: 'Regional Bank',      region: 'US-West',     device: 'A100 40GB',  flops: 3.9, battery: 83, carbon: 210 },
  { id: 'C-008', institution: 'FinTech',            region: 'EU-North',    device: 'H100 80GB',  flops: 4.8, battery: 96, carbon: 100 },
];

// Stacked BarChart values for first 10 clients (Non-IID).
// Each row is a client, each cell is a category proportion.
export const NON_IID_KEYS = CATEGORIES.map((c) => c.short);
export const NON_IID_DATA = [
  { name: 'Client 0', 'Credit Card': 0.78, 'Mortgage': 0.04, 'Debt Coll.': 0.06, 'Bank Acct.': 0.05, 'Credit Rep.': 0.04, 'Transfer': 0.03 },
  { name: 'Client 1', 'Credit Card': 0.08, 'Mortgage': 0.72, 'Debt Coll.': 0.05, 'Bank Acct.': 0.06, 'Credit Rep.': 0.05, 'Transfer': 0.04 },
  { name: 'Client 2', 'Credit Card': 0.05, 'Mortgage': 0.06, 'Debt Coll.': 0.80, 'Bank Acct.': 0.03, 'Credit Rep.': 0.04, 'Transfer': 0.02 },
  { name: 'Client 3', 'Credit Card': 0.06, 'Mortgage': 0.05, 'Debt Coll.': 0.05, 'Bank Acct.': 0.70, 'Credit Rep.': 0.08, 'Transfer': 0.06 },
  { name: 'Client 4', 'Credit Card': 0.04, 'Mortgage': 0.06, 'Debt Coll.': 0.05, 'Bank Acct.': 0.07, 'Credit Rep.': 0.72, 'Transfer': 0.06 },
  { name: 'Client 5', 'Credit Card': 0.05, 'Mortgage': 0.04, 'Debt Coll.': 0.05, 'Bank Acct.': 0.06, 'Credit Rep.': 0.05, 'Transfer': 0.75 },
  { name: 'Client 6', 'Credit Card': 0.22, 'Mortgage': 0.18, 'Debt Coll.': 0.15, 'Bank Acct.': 0.18, 'Credit Rep.': 0.15, 'Transfer': 0.12 },
  { name: 'Client 7', 'Credit Card': 0.18, 'Mortgage': 0.14, 'Debt Coll.': 0.18, 'Bank Acct.': 0.16, 'Credit Rep.': 0.20, 'Transfer': 0.14 },
  { name: 'Client 8', 'Credit Card': 0.14, 'Mortgage': 0.16, 'Debt Coll.': 0.18, 'Bank Acct.': 0.18, 'Credit Rep.': 0.18, 'Transfer': 0.16 },
  { name: 'Client 9', 'Credit Card': 0.16, 'Mortgage': 0.18, 'Debt Coll.': 0.16, 'Bank Acct.': 0.18, 'Credit Rep.': 0.16, 'Transfer': 0.16 },
];

export const STYLE_DRIFT = [
  { name: 'Formal',     example: 'I respectfully request clarification regarding a duplicate charge on my statement.' },
  { name: 'Casual',     example: 'Hey, they hit my card two times for the same thing, what gives?' },
  { name: 'Aggressive', example: 'This is robbery! You charged me twice and no one is helping!' },
  { name: 'Technical',  example: 'Authorization ID 4471 was posted twice; ledger shows duplicate settlement.' },
  { name: 'Brief',      example: 'Double charge. Need refund.' },
];

export const LABEL_NOISE = [
  { name: 'Clean', value: 43, color: '#16a34a' },
  { name: 'Noisy', value: 7,  color: '#ef4444' },
];

export const CATEGORY_COLORS = {
  'Credit Card': '#ef4444',
  'Mortgage':    '#3b82f6',
  'Debt Coll.':  '#f97316',
  'Bank Acct.':  '#16a34a',
  'Credit Rep.': '#a855f7',
  'Transfer':    '#eab308',
};

// Federated loop 5 steps.
export const FED_STEPS = [
  { title: 'Client Selection',        desc: 'Top-10 clients scored by U = 0.5·H + 0.3·FLOPs/5 + 0.2·(battery/carbon).' },
  { title: 'Local Training',          desc: '100 steps, batch 32, LoRA adapters, cosine LR schedule, AdamW-8bit optimizer.' },
  { title: 'Int-8 Compression',       desc: 'Adapter weights quantized to int8 before upload — ~50% payload reduction.' },
  { title: 'Aggregation',             desc: 'FLoRA (SVD re-orthonormalization) or FedAvg weighted by per-client sample count.' },
  { title: 'Evaluation',              desc: 'ROUGE-L + BERTScore computed on 60 held-out structured explanations.' },
];

// Per-model hard-coded experiment results.
export const MODELS = {
  'Qwen2-0.5B': {
    label: 'full_lora',
    comm: 157.03,
    flora: {
      rouge: 0.5094, bert: 0.8788, comp: 0.6941,
      co2: 63.05, energy: 0.30132, comm: 157.03,
      rounds: {
        co2:    [12.50, 25.10, 37.80, 50.40, 63.05],
        energy: [0.06019, 0.06036, 0.06041, 0.06018, 0.06018], // cumulative energy per round (kWh)
      },
      convergence: [0.6012, 0.6321, 0.6604, 0.6815, 0.6941],
    },
    fedavg: {
      rouge: 0.5220, bert: 0.8838, comp: 0.7029,
      co2: 188.25, energy: 0.89877, comm: 157.03,
      rounds: {
        co2:    [37.20, 74.80, 112.10, 150.30, 188.25],
        energy: [0.17944, 0.17995, 0.17981, 0.17940, 0.18017],
      },
      convergence: [0.6081, 0.6398, 0.6672, 0.6884, 0.7029],
    },
    all: {
      rouge: 0.5096, bert: 0.8808, comp: 0.6952,
      co2: 187.42, energy: 0.67041, comm: 157.03,
      rounds: {
        co2:    [37.10, 74.50, 112.00, 149.70, 187.42],
        energy: [0.13412, 0.13401, 0.13398, 0.13415, 0.13415],
      },
      convergence: [0.6025, 0.6340, 0.6618, 0.6826, 0.6952],
    },
  },
  'Qwen2-1.5B': {
    label: 'attn_only',
    comm: 103.91,
    flora: {
      rouge: 0.4658, bert: 0.8686, comp: 0.6672,
      co2: 393.63, energy: 1.88463, comm: 103.91,
      rounds: {
        co2:    [78.20, 157.50, 236.10, 314.80, 393.63],
        energy: [0.37650, 0.37720, 0.37700, 0.37705, 0.37688],
      },
      convergence: [0.5802, 0.6095, 0.6314, 0.6502, 0.6672],
    },
    fedavg: {
      rouge: 0.4422, bert: 0.8681, comp: 0.6552,
      co2: 250.07, energy: 1.19705, comm: 103.91,
      rounds: {
        co2:    [49.50, 99.80, 149.20, 199.60, 250.07],
        energy: [0.23920, 0.23940, 0.23950, 0.23945, 0.23950],
      },
      convergence: [0.5712, 0.5988, 0.6204, 0.6390, 0.6552],
    },
    all: {
      rouge: 0.5269, bert: 0.8853, comp: 0.7061,
      co2: 399.10, energy: 1.41783, comm: 103.91,
      rounds: {
        co2:    [79.40, 158.80, 238.10, 318.50, 399.10],
        energy: [0.28350, 0.28370, 0.28360, 0.28355, 0.28348],
      },
      convergence: [0.6095, 0.6421, 0.6702, 0.6898, 0.7061],
    },
  },
  'Llama-3.2-1B': {
    label: 'ffn_only',
    comm: 187.50,
    flora: {
      rouge: 0.5360, bert: 0.8871, comp: 0.7115,
      co2: 309.46, energy: 1.48059, comm: 187.50,
      rounds: {
        co2:    [61.20, 123.50, 185.80, 247.40, 309.46],
        energy: [0.29600, 0.29620, 0.29630, 0.29610, 0.29599],
      },
      convergence: [0.6210, 0.6512, 0.6785, 0.6972, 0.7115],
    },
    fedavg: {
      rouge: 0.5634, bert: 0.8974, comp: 0.7304,
      co2: 325.66, energy: 1.55811, comm: 187.50,
      rounds: {
        co2:    [64.80, 130.10, 195.40, 260.80, 325.66],
        energy: [0.31160, 0.31180, 0.31150, 0.31170, 0.31151],
      },
      convergence: [0.6312, 0.6641, 0.6920, 0.7124, 0.7304],
    },
    all: {
      rouge: 0.5557, bert: 0.8894, comp: 0.7226,
      co2: 267.25, energy: 0.94950, comm: 187.50,
      rounds: {
        co2:    [52.90, 106.40, 159.80, 213.50, 267.25],
        energy: [0.19000, 0.18990, 0.18980, 0.18990, 0.18990],
      },
      convergence: [0.6265, 0.6582, 0.6852, 0.7050, 0.7226],
    },
  },
  // New models added in v2. Per-round arrays for rounds.co2 (cumulative),
  // rounds.energy (per-round), and convergence are linearly interpolated from
  // the final value because only Round-5 totals are reported in the source log.
  'Llama-3.2-3B': {
    label: 'qlora_4bit',
    comm: 459.38,
    flora: {
      rouge: 0.4159, bert: 0.8668, comp: 0.6413,
      co2: 455.54, energy: 2.17714, comm: 459.38,
      rounds: {
        co2:    [91.11, 182.22, 273.32, 364.43, 455.54],
        energy: [0.43543, 0.43543, 0.43543, 0.43543, 0.43542],
      },
      convergence: [0.5521, 0.5744, 0.5967, 0.6190, 0.6413],
    },
    fedavg: {
      rouge: 0.3941, bert: 0.8592, comp: 0.6267,
      co2: 523.30, energy: 2.50135, comm: 459.38,
      rounds: {
        co2:    [104.66, 209.32, 313.98, 418.64, 523.30],
        energy: [0.50027, 0.50027, 0.50027, 0.50027, 0.50027],
      },
      convergence: [0.5375, 0.5598, 0.5821, 0.6044, 0.6267],
    },
    all: {
      rouge: 0.3823, bert: 0.8504, comp: 0.6163,
      co2: 736.63, energy: 2.62239, comm: 459.38,
      rounds: {
        co2:    [147.33, 294.65, 441.98, 589.30, 736.63],
        energy: [0.52448, 0.52448, 0.52448, 0.52448, 0.52447],
      },
      convergence: [0.5271, 0.5494, 0.5717, 0.5940, 0.6163],
    },
  },
  'TinyLlama-1.1B': {
    label: 'high_rank',
    comm: 472.66,
    flora: {
      rouge: 0.4622, bert: 0.8652, comp: 0.6637,
      co2: 234.83, energy: 1.12230, comm: 472.66,
      rounds: {
        co2:    [46.97, 93.93, 140.90, 187.86, 234.83],
        energy: [0.22446, 0.22446, 0.22446, 0.22446, 0.22446],
      },
      convergence: [0.5745, 0.5968, 0.6191, 0.6414, 0.6637],
    },
    fedavg: {
      rouge: 0.4646, bert: 0.8666, comp: 0.6656,
      co2: 323.54, energy: 1.54691, comm: 472.66,
      rounds: {
        co2:    [64.71, 129.42, 194.12, 258.83, 323.54],
        energy: [0.30938, 0.30938, 0.30938, 0.30938, 0.30939],
      },
      convergence: [0.5764, 0.5987, 0.6210, 0.6433, 0.6656],
    },
    all: {
      rouge: 0.4483, bert: 0.8584, comp: 0.6534,
      co2: 332.27, energy: 1.18299, comm: 472.66,
      rounds: {
        co2:    [66.45, 132.91, 199.36, 265.82, 332.27],
        energy: [0.23660, 0.23660, 0.23660, 0.23660, 0.23659],
      },
      convergence: [0.5642, 0.5865, 0.6088, 0.6311, 0.6534],
    },
  },
  // Gemma-2-2B with QLoRA at low rank collapsed during training.
  // The energy and CO2 numbers are real measurements; quality metrics
  // dropped to 0.0146 (degenerate output) across all three strategies.
  'Gemma-2-2B': {
    label: 'qlora_low_r',
    comm: 76.17,
    collapsed: true,
    collapseNote: 'QLoRA with low rank collapsed during training — output is degenerate (composite 0.0146). Included as a negative result to show that adapter rank is a load-bearing hyperparameter.',
    flora: {
      rouge: 0.0146, bert: 0.0146, comp: 0.0146,
      co2: 891.95, energy: 4.26213, comm: 76.17,
      rounds: {
        co2:    [178.39, 356.78, 535.17, 713.56, 891.95],
        energy: [0.85243, 0.85243, 0.85243, 0.85243, 0.85241],
      },
      convergence: [0.0146, 0.0146, 0.0146, 0.0146, 0.0146],
    },
    fedavg: {
      rouge: 0.0146, bert: 0.0146, comp: 0.0146,
      co2: 891.95, energy: 4.26213, comm: 76.17,
      rounds: {
        co2:    [178.39, 356.78, 535.17, 713.56, 891.95],
        energy: [0.85243, 0.85243, 0.85243, 0.85243, 0.85241],
      },
      convergence: [0.0146, 0.0146, 0.0146, 0.0146, 0.0146],
    },
    all: {
      rouge: 0.0146, bert: 0.0146, comp: 0.0146,
      co2: 891.95, energy: 4.26213, comm: 76.17,
      rounds: {
        co2:    [178.39, 356.78, 535.17, 713.56, 891.95],
        energy: [0.85243, 0.85243, 0.85243, 0.85243, 0.85241],
      },
      convergence: [0.0146, 0.0146, 0.0146, 0.0146, 0.0146],
    },
  },
};

// Compressed vs full payload (Float32 -> Int8).
export const COMPRESSION = {
  float32: 314.06, // ~2x int8 across all 3 models
  int8: 157.03,
};
