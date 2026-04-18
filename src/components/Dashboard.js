import React, { useEffect, useState } from 'react';

function GaugeMeter({ value, label, color, icon }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  const getLevel = (v) => {
    if (v < 35) return 'low';
    if (v < 70) return 'medium';
    return 'high';
  };

  const level = getLevel(value);
  const levelLabel = { low: 'Low', medium: 'Medium', high: 'High' };

  // SVG arc
  const radius = 54;
  const cx = 70;
  const cy = 70;
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle;
  const valueAngle = startAngle + (value / 100) * totalAngle;

  const polarToCartesian = (angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const describeArc = (startA, endA) => {
    const s = polarToCartesian(startA);
    const e = polarToCartesian(endA);
    const large = endA - startA > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  return (
    <div className={`gauge-card gauge-${level}`}>
      <div className="gauge-icon">{icon}</div>
      <svg viewBox="0 0 140 100" className="gauge-svg">
        {/* Track */}
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="rgba(26,10,0,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Value arc */}
        {value > 0 && (
          <path
            d={describeArc(startAngle, valueAngle)}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        )}
        {/* Value text */}
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#1A0A00" fontSize="22" fontWeight="bold" fontFamily="Unbounded">
          {displayed}
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" fill="rgba(26,10,0,0.4)" fontSize="8" fontFamily="DM Sans">
          / 100
        </text>
      </svg>
      <div className="gauge-label">{label}</div>
      <div className={`gauge-level level-${level}`}>{levelLabel[level]}</div>
    </div>
  );
}

function TradeoffTable({ config }) {
  const labels = {
    registers: { 4: '4 Registers', 8: '8 Registers', 16: '16 Registers', 32: '32 Registers' },
    cache: { none: 'No Cache', l1: 'L1 Cache', l1l2: 'L1 + L2' },
    pipeline: { 3: '3 Stages', 5: '5 Stages', 8: '8 Stages' },
    clock: { low: 'Low Speed', medium: 'Medium Speed', high: 'High Speed' },
    cores: { 1: '1 Core', 2: '2 Cores', 4: '4 Cores' },
  };

  const icons = { registers: '🗂️', cache: '💾', pipeline: '⛓️', clock: '⚡', cores: '🧩' };
  const names = { registers: 'Registers', cache: 'Cache', pipeline: 'Pipeline', clock: 'Clock Speed', cores: 'Cores' };

  return (
    <div className="tradeoff-table">
      <h3 className="table-title">⚙️ Design Details</h3>
      <div className="table-grid">
        {Object.keys(config).map(key => (
          <div key={key} className="table-row">
            <span className="table-icon">{icons[key]}</span>
            <span className="table-key">{names[key]}</span>
            <span className="table-val">{labels[key][config[key]]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ results, config, mission, onReset, onHome }) {
  const { performance, power, heat, efficiency, insights } = results;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setTimeout(() => setShown(true), 100);
  }, []);

  const missionPass = mission && checkMission(mission, results);

  return (
    <div className={`dashboard-screen ${shown ? 'visible' : ''}`}>
      <div className="dash-header">
        <button className="back-btn" onClick={onHome}>🏠 Home</button>
        <h2 className="dash-title">Simulation Results</h2>
        <button className="back-btn" onClick={onReset}>🔄 New Build</button>
      </div>

      {mission && (
        <div className={`mission-result ${missionPass ? 'pass' : 'fail'}`}>
          {missionPass
            ? `🏆 Mission Complete! "${mission.title}"`
            : `❌ Mission Failed — "${mission.goal}"`}
        </div>
      )}

      {/* Efficiency score */}
      <div className="efficiency-banner">
        <div className="eff-label">Efficiency Score</div>
        <div className={`eff-score ${efficiency > 50 ? 'good' : efficiency > 20 ? 'ok' : 'bad'}`}>
          {efficiency > 0 ? '+' : ''}{efficiency}
        </div>
        <div className="eff-hint">Performance vs. power consumption</div>
      </div>

      {/* Gauges */}
      <div className="gauges-row">
        <GaugeMeter value={performance} label="Performance" color="#6C3FFF" icon="⚡" />
        <GaugeMeter value={power} label="Power Draw" color="#FF9900" icon="🔋" />
        <GaugeMeter value={heat} label="Heat" color="#FF3CAC" icon="🌡️" />
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h3 className="insights-title">🧠 Smart Analysis</h3>
        <div className="insights-list">
          {insights.map((ins, i) => (
            <div key={i} className={`insight-item insight-${ins.type}`}>
              <span className="insight-icon">
                {ins.type === 'warning' ? '⚠️' : ins.type === 'success' ? '✅' : 'ℹ️'}
              </span>
              <span>{ins.msg}</span>
            </div>
          ))}
        </div>
      </div>

      <TradeoffTable config={config} />

      {/* Trade-off reminder */}
      <div className="tradeoff-reminder">
        <h3>⚖️ Core Trade-offs</h3>
        <div className="tradeoff-grid">
          <div className="tradeoff-item">
            <span>More Cache</span>
            <span>Speed ↑ / Power ↑</span>
          </div>
          <div className="tradeoff-item">
            <span>Longer Pipeline</span>
            <span>Speed ↑ / Complexity ↑</span>
          </div>
          <div className="tradeoff-item">
            <span>Higher Clock</span>
            <span>Perf ↑ / Heat ↑</span>
          </div>
          <div className="tradeoff-item">
            <span>More Cores</span>
            <span>Parallel ↑ / Power ↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function checkMission(mission, results) {
  const { id } = mission;
  if (id === 'cooling') return results.heat < 40;
  if (id === 'efficient') return results.performance > 70 && results.power < 50;
  if (id === 'beast') return results.performance >= 90;
  if (id === 'eco') return results.power < 30;
  return false;
}
