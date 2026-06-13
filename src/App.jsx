import React, { useState } from 'react';
import DatasetPage from './pages/DatasetPage.jsx';
import AugmentationPage from './pages/AugmentationPage.jsx';
import ClientSimPage from './pages/ClientSimPage.jsx';
import FederatedLoopPage from './pages/FederatedLoopPage.jsx';
import ModelResultsPage from './pages/ModelResultsPage.jsx';
import EnergyTrackingPage from './pages/EnergyTrackingPage.jsx';
import ComparisonPage from './pages/ComparisonPage.jsx';
import ProcessPage from './pages/ProcessPage.jsx';

const TABS = [
  { id: 'dataset',   label: 'Dataset' },
  { id: 'augment',   label: 'Augmentation' },
  { id: 'clients',   label: 'Client Simulation' },
  { id: 'loop',      label: 'Federated Loop' },
  { id: 'results',   label: 'Model Results' },
  { id: 'energy',    label: 'Energy Tracking' },
  { id: 'compare',   label: 'Comparison' },
  { id: 'process',   label: 'Process' },
];

export default function App() {
  const [tab, setTab] = useState('dataset');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Fixed top nav */}
      <header className="fixed top-0 inset-x-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-green-600 text-white flex items-center justify-center font-bold">
              G
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-gray-900">
                GreenFed-LoRA
              </div>
              <div className="text-[11px] text-gray-500">
                Energy-Aware Federated Fine-Tuning of LLMs
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={
                    'relative px-3 py-2 text-sm font-medium transition-colors ' +
                    (active
                      ? 'text-green-600'
                      : 'text-gray-500 hover:text-gray-800')
                  }
                >
                  {t.label}
                  <span
                    className={
                      'absolute left-2 right-2 -bottom-[1px] h-[2px] rounded-full ' +
                      (active ? 'bg-green-600' : 'bg-transparent')
                    }
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page body */}
      <main className="pt-20 pb-16 max-w-7xl mx-auto px-6">
        {tab === 'dataset' && <DatasetPage />}
        {tab === 'augment' && <AugmentationPage />}
        {tab === 'clients' && <ClientSimPage />}
        {tab === 'loop'    && <FederatedLoopPage />}
        {tab === 'results' && <ModelResultsPage />}
        {tab === 'energy'  && <EnergyTrackingPage />}
        {tab === 'compare' && <ComparisonPage />}
        {tab === 'process' && <ProcessPage />}
      </main>

      <footer className="text-center text-xs text-gray-400 pb-6">
        Thesis Dashboard · GreenFed-LoRA · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
