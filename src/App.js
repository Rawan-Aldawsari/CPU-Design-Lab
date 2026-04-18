import React, { useState } from 'react';
import './App.css';
import CPUBuilder from './components/CPUBuilder';
import Dashboard from './components/Dashboard';
import MissionMode from './components/MissionMode';

function App() {
  const [screen, setScreen] = useState('home'); // home | build | result | mission
  const [cpuConfig, setCpuConfig] = useState(null);
  const [results, setResults] = useState(null);
  const [activeMission, setActiveMission] = useState(null);

  const handleSimulate = (config) => {
    setCpuConfig(config);
    const calc = calculateResults(config);
    setResults(calc);
    setScreen('result');
  };

  const calculateResults = (config) => {
    // --- Performance ---
    const clockMap = { low: 1, medium: 2, high: 3 };
    const pipelineMap = { 3: 1, 5: 1.6, 8: 2.2 };
    const cacheMap = { none: 0.5, l1: 1, l1l2: 1.4 };
    const registerMap = { 4: 0.7, 8: 1, 16: 1.3, 32: 1.5 };
    const coreMap = { 1: 1, 2: 1.6, 4: 2.5 };

    const clockVal = clockMap[config.clock];
    const pipelineEff = pipelineMap[config.pipeline];
    const cacheEff = cacheMap[config.cache];
    const regEff = registerMap[config.registers];
    const coreEff = coreMap[config.cores];

    const rawPerf = clockVal * pipelineEff * cacheEff * regEff * coreEff;
    const performance = Math.min(100, Math.round((rawPerf / 7.5) * 100));

    // --- Power ---
    const rawPower = (clockVal ** 2) * (1 + (config.pipeline / 8) + (config.registers / 32) + (config.cores - 1) * 0.5 + (config.cache === 'l1l2' ? 0.6 : config.cache === 'l1' ? 0.3 : 0));
    const power = Math.min(100, Math.round((rawPower / 15) * 100));

    // --- Heat ---
    const heat = Math.min(100, Math.round(power * 0.85 + (clockVal === 3 ? 10 : 0)));

    // --- Efficiency Score ---
    const efficiency = Math.round((performance * 0.6) - (power * 0.4));

    // --- Analysis messages ---
    const insights = [];

    if (config.clock === 'high' && config.cache === 'none') {
      insights.push({ type: 'warning', msg: 'High clock speed without cache — the CPU wastes cycles waiting on memory ⚠️' });
    }
    if (config.pipeline === 8 && config.clock === 'low') {
      insights.push({ type: 'info', msg: 'Long pipeline with slow clock — parallelism is underutilized' });
    }
    if (config.cache === 'l1l2' && config.registers >= 16) {
      insights.push({ type: 'success', msg: 'Strong cache + many registers — data access is blazing fast 🔥' });
    }
    if (config.cores === 4 && config.clock === 'high') {
      insights.push({ type: 'warning', msg: '4 Cores + high clock — massive throughput but power and heat are at their peak 🌡️' });
    }
    if (config.pipeline === 3 && config.registers === 32) {
      insights.push({ type: 'info', msg: 'Short pipeline + many registers — simple design but data-optimized' });
    }
    if (insights.length === 0) {
      insights.push({ type: 'info', msg: 'Balanced design — no obvious performance bottleneck' });
    }

    return { performance, power, heat, efficiency, insights };
  };

  const handleMission = (mission) => {
    setActiveMission(mission);
    setScreen('build');
  };

  return (
    <div className="app">
      {/* Background grid */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      {screen === 'home' && (
        <HomeScreen onBuild={() => setScreen('build')} onMission={() => setScreen('mission')} />
      )}
      {screen === 'mission' && (
        <MissionMode onSelectMission={handleMission} onBack={() => setScreen('home')} />
      )}
      {screen === 'build' && (
        <CPUBuilder
          onSimulate={handleSimulate}
          onBack={() => setScreen('home')}
          mission={activeMission}
        />
      )}
      {screen === 'result' && results && (
        <Dashboard
          results={results}
          config={cpuConfig}
          mission={activeMission}
          onReset={() => { setScreen('build'); setResults(null); }}
          onHome={() => { setScreen('home'); setActiveMission(null); setResults(null); }}
        />
      )}
    </div>
  );
}

function HomeScreen({ onBuild, onMission }) {
  return (
    <div className="home-screen">
      <div className="home-content">
        <div className="logo-badge">CPU DESIGN LAB</div>
        <h1 className="home-title">
          <span className="title-main">Design</span>
          <span className="title-accent">Your CPU</span>
        </h1>
        <p className="home-subtitle">
          An interactive simulator that models CPU design decisions and shows
          their real impact on performance, power, and heat.
        </p>

        <div className="home-stats">
          <div className="stat-item">
            <span className="stat-num">5</span>
            <span className="stat-label">Design Options</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">3</span>
            <span className="stat-label">Score Metrics</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">∞</span>
            <span className="stat-label">Combinations</span>
          </div>
        </div>

        <div className="home-buttons">
          <button className="btn-primary" onClick={onBuild}>
            <span className="btn-icon">⚙️</span>
            Free Build Mode
          </button>
          <button className="btn-secondary" onClick={onMission}>
            <span className="btn-icon">🎯</span>
            Mission Mode
          </button>
        </div>

        <div className="tradeoff-hint">
          <span>⚖️</span>
          <span>Every decision has a cost — there is no "perfect" CPU</span>
        </div>
      </div>

      <div className="cpu-visual">
        <div className="cpu-chip">
          <div className="chip-core">
            <div className="chip-inner">
              <div className="chip-pulse" />
              <span className="chip-label">CPU</span>
            </div>
          </div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`chip-pin pin-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
