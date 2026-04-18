import React from 'react';

const missions = [
  {
    id: 'cooling',
    title: '❄️ Keep It Cool',
    goal: 'Build a CPU with heat below 40%',
    desc: 'Challenge: achieve acceptable performance without exceeding the safe thermal limit',
    difficulty: 'Easy',
    diffColor: '#00C9A7',
    hint: 'Avoid high clock speed and multiple cores',
  },
  {
    id: 'efficient',
    title: '⚡ Power Champion',
    goal: 'Performance above 70% with power below 50%',
    desc: 'Challenge: find the perfect balance between performance and power efficiency',
    difficulty: 'Medium',
    diffColor: '#FF9900',
    hint: 'Focus on cache and register count wisely',
  },
  {
    id: 'beast',
    title: '🔥 BEAST MODE',
    goal: 'Reach performance of 90 or higher — by any means',
    desc: 'Challenge: push every dial to its maximum for the highest possible performance — cost is irrelevant',
    difficulty: 'Hard',
    diffColor: '#FF3CAC',
    hint: 'Max out everything',
  },
  {
    id: 'eco',
    title: '🌱 Eco Mode',
    goal: 'Power consumption below 30%',
    desc: 'Challenge: design the most power-efficient CPU possible',
    difficulty: 'Medium',
    diffColor: '#FF9900',
    hint: 'Low clock + short pipeline + single core',
  },
];

export default function MissionMode({ onSelectMission, onBack }) {
  return (
    <div className="mission-screen">
      <div className="builder-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2 className="builder-title">🎯 Mission Mode</h2>
        <div />
      </div>

      <p className="mission-intro">Choose a challenge and design your CPU to meet the goal</p>

      <div className="missions-grid">
        {missions.map(m => (
          <div key={m.id} className="mission-card">
            <div className="mission-header-row">
              <h3 className="mission-title">{m.title}</h3>
              <span className="mission-diff" style={{ color: m.diffColor, borderColor: m.diffColor }}>
                {m.difficulty}
              </span>
            </div>
            <p className="mission-goal">{m.goal}</p>
            <p className="mission-desc">{m.desc}</p>
            <div className="mission-hint">
              <span>💡</span> <span>{m.hint}</span>
            </div>
            <button className="mission-start-btn" onClick={() => onSelectMission(m)}>
              Start Challenge 🚀
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
