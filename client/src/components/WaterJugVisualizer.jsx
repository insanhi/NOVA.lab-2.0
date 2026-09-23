import React, { useState, useRef } from 'react';

const JUG_X_CAP = 4;
const JUG_Y_CAP = 3;
const GOAL_X = 2;

function getSuccessors(x, y) {
  const ops = [];
  if (x < JUG_X_CAP) ops.push({ nx: JUG_X_CAP, ny: y, op: 'Fill Jug X (4L)' });
  if (y < JUG_Y_CAP) ops.push({ nx: x, ny: JUG_Y_CAP, op: 'Fill Jug Y (3L)' });
  if (x > 0) ops.push({ nx: 0, ny: y, op: 'Empty Jug X' });
  if (y > 0) ops.push({ nx: x, ny: 0, op: 'Empty Jug Y' });
  if (x > 0 && y < JUG_Y_CAP) {
    const pour = Math.min(x, JUG_Y_CAP - y);
    ops.push({ nx: x - pour, ny: y + pour, op: `Pour X→Y (${pour}L)` });
  }
  if (y > 0 && x < JUG_X_CAP) {
    const pour = Math.min(y, JUG_X_CAP - x);
    ops.push({ nx: x + pour, ny: y - pour, op: `Pour Y→X (${pour}L)` });
  }
  return ops;
}

function solveDFS() {
  const stack = [{ x: 0, y: 0, path: [{ x: 0, y: 0, op: 'Start' }] }];
  const visited = new Set(['0,0']);
  while (stack.length) {
    const { x, y, path } = stack.pop();
    if (x === GOAL_X) return path;
    for (const { nx, ny, op } of getSuccessors(x, y)) {
      const key = `${nx},${ny}`;
      if (!visited.has(key)) {
        visited.add(key);
        stack.push({ x: nx, y: ny, path: [...path, { x: nx, y: ny, op }] });
      }
    }
  }
  return [];
}

function JugSVG({ capacity, current, label, color }) {
  const h = 100;
  const w = 60;
  const fillH = (current / capacity) * h;
  return (
    <svg width={w + 20} height={h + 50} viewBox={`0 0 ${w + 20} ${h + 50}`}>
      {/* Jug body */}
      <rect x={10} y={10} width={w} height={h} rx={6} ry={6}
        fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={2} />
      {/* Water fill */}
      <rect x={10} y={10 + (h - fillH)} width={w} height={fillH} rx={4} ry={4}
        fill={color} opacity={0.8} />
      {/* Capacity marks */}
      {Array.from({ length: capacity + 1 }, (_, i) => {
        const lineY = 10 + h - (i / capacity) * h;
        return (
          <g key={i}>
            <line x1={7} y1={lineY} x2={14} y2={lineY} stroke="#94a3b8" strokeWidth={1} />
            <text x={5} y={lineY + 4} fontSize="7" fill="#94a3b8" textAnchor="end">{i}L</text>
          </g>
        );
      })}
      {/* Current value label */}
      <text x={w / 2 + 10} y={10 + h / 2 + 5} textAnchor="middle" fontSize="18" fontWeight="800" fill={current > 0 ? '#1e40af' : '#94a3b8'}>
        {current}L
      </text>
      {/* Label */}
      <text x={w / 2 + 10} y={h + 35} textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569">
        {label}
      </text>
      <text x={w / 2 + 10} y={h + 48} textAnchor="middle" fontSize="10" fill="#94a3b8">
        ({capacity}L cap)
      </text>
    </svg>
  );
}

export default function WaterJugVisualizer() {
  const [solution, setSolution] = useState(null);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const solve = () => {
    const path = solveDFS();
    setSolution(path);
    setStep(0);
    setRunning(false);
    clearTimeout(timerRef.current);
  };

  const animate = () => {
    if (!solution) return;
    const total = solution.length;
    if (step >= total - 1) setStep(0);
    setRunning(true);
    const go = (s) => {
      if (s >= total - 1) { setRunning(false); return; }
      setStep(s + 1);
      timerRef.current = setTimeout(() => go(s + 1), 700);
    };
    go(step >= total - 1 ? 0 : step);
  };

  const reset = () => {
    setSolution(null);
    setStep(0);
    setRunning(false);
    clearTimeout(timerRef.current);
  };

  const current = solution ? solution[step] : { x: 0, y: 0, op: 'Initial State' };
  const isGoal = current?.x === GOAL_X;

  return (
    <div style={{ fontFamily: 'var(--font-main)', color: '#0f172a' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Water Jug Problem — DFS Solver</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>4L Jug X + 3L Jug Y → Goal: exactly 2L in Jug X</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={solve} style={btnStyle('#0f172a', '#fff')}>🔍 Solve DFS</button>
          <button onClick={animate} disabled={!solution} style={btnStyle(running ? '#fee2e2' : '#dcfce7', running ? '#b91c1c' : '#15803d')}>
            {running ? '⏸ Pause' : '▶ Animate'}
          </button>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={!solution || step <= 0} style={btnStyle('#f1f5f9', '#0f172a')}>◀ Prev</button>
          <button onClick={() => setStep(s => Math.min(solution.length - 1, s + 1))} disabled={!solution || step >= (solution?.length ?? 1) - 1} style={btnStyle('#0f172a', '#fff')}>Next ▶</button>
          <button onClick={reset} style={btnStyle('#f1f5f9', '#64748b')}>↺ Reset</button>
        </div>
      </div>

      {/* Main visualization */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Jugs */}
        <div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', backgroundColor: '#f8fafc', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
            <JugSVG capacity={4} current={current?.x ?? 0} label="Jug X" color="#3b82f6" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', paddingBottom: '2rem' }}>
              <div style={{ fontSize: '1.2rem' }}>↔</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', maxWidth: '60px' }}>pour both ways</div>
            </div>
            <JugSVG capacity={3} current={current?.y ?? 0} label="Jug Y" color="#10b981" />
          </div>

          {/* Current op */}
          <div style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            backgroundColor: isGoal ? '#dcfce7' : '#f0f9ff',
            border: `1px solid ${isGoal ? '#86efac' : '#bae6fd'}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Step {step + 1} of {solution?.length ?? 1}
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: isGoal ? '#15803d' : '#0369a1', marginTop: '0.2rem' }}>
              {isGoal ? '🎉 GOAL REACHED!' : current?.op}
            </div>
            {isGoal && (
              <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '0.2rem' }}>
                Jug X = 2L ✅ (target achieved)
              </div>
            )}
          </div>
        </div>

        {/* Solution path table */}
        {solution && (
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '1rem', border: '1px solid #e2e8f0', maxHeight: '380px', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              DFS Solution Path ({solution.length - 1} operations)
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#e2e8f0' }}>
                  <th style={{ padding: '0.5rem 0.6rem', textAlign: 'left', fontWeight: '700', color: '#475569', borderRadius: '6px 0 0 0' }}>#</th>
                  <th style={{ padding: '0.5rem 0.6rem', textAlign: 'left', fontWeight: '700', color: '#475569' }}>Operation</th>
                  <th style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontWeight: '700', color: '#3b82f6' }}>X (4L)</th>
                  <th style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontWeight: '700', color: '#10b981', borderRadius: '0 6px 0 0' }}>Y (3L)</th>
                </tr>
              </thead>
              <tbody>
                {solution.map((s, i) => (
                  <tr key={i} style={{
                    backgroundColor: i === step ? '#eff6ff' : s.x === GOAL_X ? '#f0fdf4' : 'transparent',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <td style={{ padding: '0.45rem 0.6rem', fontWeight: i === step ? '800' : '500', color: '#64748b' }}>{i}</td>
                    <td style={{ padding: '0.45rem 0.6rem', color: '#334155', fontWeight: i === step ? '700' : '500' }}>{s.op}</td>
                    <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center', fontWeight: '700', color: '#1d4ed8', fontFamily: 'var(--font-mono)' }}>{s.x}</td>
                    <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center', fontWeight: '700', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                      {s.y} {s.x === GOAL_X ? '🎯' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!solution && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#fffbeb', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fcd34d' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#92400e', marginBottom: '0.5rem' }}>🧪 Problem Setup</div>
              <div style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: '1.7' }}>
                <strong>Jugs:</strong> 4L (Jug X) + 3L (Jug Y)<br/>
                <strong>Goal:</strong> Exactly 2L in Jug X<br/>
                <strong>Operations:</strong> Fill, Empty, Pour (6 total)<br/>
                <strong>Algorithm:</strong> DFS with visited set<br/>
                <strong>State space:</strong> 5×4 = 20 distinct states
              </div>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', borderRadius: '12px', padding: '1rem', border: '1px solid #bae6fd', fontSize: '0.82rem', color: '#0369a1', lineHeight: '1.6' }}>
              Click <strong>"Solve DFS"</strong> to find the solution path using Depth-First Search, then <strong>"Animate"</strong> to watch the jugs fill step by step!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg, text) {
  return {
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    border: 'none',
    backgroundColor: bg,
    color: text,
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.83rem',
  };
}
