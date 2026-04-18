import React, { useState } from 'react';

const options = {
  registers: [
    { value: 4, label: '4 Registers', desc: 'Relies heavily on memory — slower access' },
    { value: 8, label: '8 Registers', desc: 'Good balance between speed and cost' },
    { value: 16, label: '16 Registers', desc: 'Faster data access 🔥' },
    { value: 32, label: '32 Registers', desc: 'Fewest memory trips — the strongest option' },
  ],
  cache: [
    { value: 'none', label: 'No Cache', desc: 'Slowest — depends directly on RAM' },
    { value: 'l1', label: 'L1 Cache', desc: 'Big speed improvement ⚡' },
    { value: 'l1l2', label: 'L1 + L2', desc: 'Highest performance — but higher power draw' },
  ],
  pipeline: [
    { value: 3, label: '3 Stages', desc: 'Simple — fewer pipeline hazards' },
    { value: 5, label: '5 Stages', desc: 'The classic standard in processors' },
    { value: 8, label: '8 Stages', desc: 'High throughput — more complexity ⚠️' },
  ],
  clock: [
    { value: 'low', label: 'Low Speed', desc: '~1 GHz — power-efficient 🔋' },
    { value: 'medium', label: 'Medium Speed', desc: '~2 GHz — ideal balance' },
    { value: 'high', label: 'High Speed', desc: '~3+ GHz — maximum power 🔥🌡️' },
  ],
  cores: [
    { value: 1, label: '1 Core', desc: 'Sequential tasks — simple' },
    { value: 2, label: '2 Cores', desc: 'Parallel tasks — faster' },
    { value: 4, label: '4 Cores', desc: 'Massive processing power ⚡' },
  ],
};

const defaultConfig = {
  registers: 8,
  cache: 'l1',
  pipeline: 5,
  clock: 'medium',
  cores: 1,
};

export default function CPUBuilder({ onSimulate, onBack, mission }) {
  const [config, setConfig] = useState(defaultConfig);
  const [step, setStep] = useState(0);

  const steps = ['registers', 'cache', 'pipeline', 'clock', 'cores'];
  const stepLabels = ['Registers', 'Cache', 'Pipeline', 'Clock Speed', 'Cores'];
  const stepIcons = ['🗂️', '💾', '⛓️', '⚡', '🧩'];

  const currentStep = steps[step];
  const currentOptions = options[currentStep];

  const handleSelect = (value) => {
    setConfig(prev => ({ ...prev, [currentStep]: value }));
  };

  const isSelected = (value) => config[currentStep] === value;

  return (
    <div className="builder-screen">
      {mission && (
        <div className="mission-banner">
          <span>🎯</span>
          <span>{mission.title}: {mission.goal}</span>
        </div>
      )}

      <div className="builder-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2 className="builder-title">Build Your CPU</h2>
        <div className="step-counter">{step + 1} / {steps.length}</div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`progress-step ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}
            onClick={() => i <= step && setStep(i)}
          >
            <div className="progress-dot">
              {i < step ? '✓' : stepIcons[i]}
            </div>
            <span className="progress-label">{stepLabels[i]}</span>
          </div>
        ))}
      </div>

      {/* Current step */}
      <div className="step-section">
        <div className="step-heading">
          <span className="step-icon-lg">{stepIcons[step]}</span>
          <div>
            <h3 className="step-title">{stepLabels[step]}</h3>
            <p className="step-hint">Choose the option that fits your design</p>
          </div>
        </div>

        <div className="options-grid">
          {currentOptions.map(opt => (
            <button
              key={opt.value}
              className={`option-card ${isSelected(opt.value) ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              <div className="option-check">{isSelected(opt.value) ? '✓' : ''}</div>
              <div className="option-label">{opt.label}</div>
              <div className="option-desc">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Config summary */}
      <div className="config-summary">
        {steps.map((s, i) => (
          <div key={s} className={`summary-item ${i === step ? 'current' : ''}`}>
            <span className="summary-icon">{stepIcons[i]}</span>
            <span className="summary-val">
              {config[s] !== undefined
                ? options[s].find(o => o.value === config[s])?.label || config[s]
                : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="builder-nav">
        {step > 0 && (
          <button className="nav-btn secondary" onClick={() => setStep(step - 1)}>
            ← Previous
          </button>
        )}
        {step < steps.length - 1 ? (
          <button className="nav-btn primary" onClick={() => setStep(step + 1)}>
            Next →
          </button>
        ) : (
          <button className="nav-btn run" onClick={() => onSimulate(config)}>
            🚀 Run Simulation
          </button>
        )}
      </div>
    </div>
  );
}
