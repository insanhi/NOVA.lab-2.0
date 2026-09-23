import React, { useState, useRef, useEffect } from 'react';

// ─── 5×5 Grid Config ────────────────────────────────────────────────────────
const DEFAULT_GRID = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0],
];

const START = [0, 0];
const GOAL  = [4, 4];
const DIRS  = [[-1,0,'UP'],[1,0,'DOWN'],[0,-1,'LEFT'],[0,1,'RIGHT']];

function bfs(grid, start, goal) {
  const rows = grid.length, cols = grid[0].length;
  const queue = [start];
  const visited = new Set([`${start[0]},${start[1]}`]);
  const parent = { [`${start[0]},${start[1]}`]: null };
  const order = [];

  while (queue.length) {
    const [r, c] = queue.shift();
    const key = `${r},${c}`;
    order.push([r, c]);

    if (r === goal[0] && c === goal[1]) {
      // Reconstruct path
      const path = [];
      let cur = key;
      while (cur) {
        path.unshift(cur.split(',').map(Number));
        cur = parent[cur];
      }
      return { order, path };
    }

    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      const nk = `${nr},${nc}`;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0 && !visited.has(nk)) {
        visited.add(nk);
        parent[nk] = key;
        queue.push([nr, nc]);
      }
    }
  }
  return { order, path: [] };
}

export default function BFSRobotVisualizer() {
  const [grid, setGrid] = useState(DEFAULT_GRID.map(r => [...r]));
  const [step, setStep] = useState(-1);
  const [bfsData, setBfsData] = useState(null);
  const [running, setRunning] = useState(false);
  const [computed, setComputed] = useState(false);
  const timerRef = useRef(null);

  const getCellState = (r, c) => {
    const isStart = r === START[0] && c === START[1];
    const isGoal  = r === GOAL[0]  && c === GOAL[1];
    if (isStart) return 'start';
    if (isGoal)  return 'goal';
    if (grid[r][c] === 1) return 'obstacle';

    if (!computed || step < 0 || !bfsData) return 'free';
    const pathSet = new Set(bfsData.path.map(([pr,pc]) => `${pr},${pc}`));
    const visitedUpToStep = new Set(bfsData.order.slice(0, step + 1).map(([pr,pc]) => `${pr},${pc}`));

    if (pathSet.has(`${r},${c}`) && visitedUpToStep.has(`${r},${c}`)) return 'path';
    if (visitedUpToStep.has(`${r},${c}`)) return 'visited';
    return 'free';
  };

  const CELL_COLORS = {
    start:    { bg: '#10b981', border: '#059669', text: '#fff' },
    goal:     { bg: '#f43f5e', border: '#e11d48', text: '#fff' },
    obstacle: { bg: '#475569', border: '#334155', text: '#fff' },
    path:     { bg: '#2563eb', border: '#1d4ed8', text: '#fff' },
    visited:  { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
    free:     { bg: '#f1f5f9', border: '#e2e8f0', text: '#94a3b8' },
  };

  const computeBFS = () => {
    const result = bfs(grid, START, GOAL);
    setBfsData(result);
    setComputed(true);
    setStep(0);
    setRunning(false);
    clearTimeout(timerRef.current);
  };

  const runAnimation = () => {
    if (!computed) return;
    const total = bfsData.order.length;
    if (step >= total - 1) setStep(0);
    setRunning(true);
    const go = (s) => {
      if (s >= total - 1) { setRunning(false); return; }
      setStep(s + 1);
      timerRef.current = setTimeout(() => go(s + 1), 500);
    };
    go(step);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const toggleCell = (r, c) => {
    if ((r === START[0] && c === START[1]) || (r === GOAL[0] && c === GOAL[1])) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = newGrid[r][c] === 1 ? 0 : 1;
    setGrid(newGrid);
    setComputed(false);
    setBfsData(null);
    setStep(-1);
    setRunning(false);
    clearTimeout(timerRef.current);
  };

  const resetGrid = () => {
    setGrid(DEFAULT_GRID.map(r => [...r]));
    setComputed(false);
    setBfsData(null);
    setStep(-1);
    setRunning(false);
    clearTimeout(timerRef.current);
  };

  const currentCell = bfsData ? bfsData.order[step] : null;
  const pathLen = bfsData?.path?.length ? bfsData.path.length - 1 : 0;
  const stepsExplored = step >= 0 ? step + 1 : 0;

  return (
    <div style={{ fontFamily: 'var(--font-main)', color: '#0f172a' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>BFS Robot Path Planner</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>5×5 grid · Click cells to toggle obstacles · BFS guarantees shortest path</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={computeBFS} style={btnStyle('#0f172a', '#fff')}>🔍 Run BFS</button>
          <button onClick={runAnimation} disabled={!computed} style={btnStyle(running ? '#fee2e2' : '#dcfce7', running ? '#b91c1c' : '#15803d')}>
            {running ? '⏸ Pause' : '▶ Animate'}
          </button>
          <button onClick={resetGrid} style={btnStyle('#f1f5f9', '#64748b')}>↺ Reset</button>
        </div>
      </div>

      {/* Grid + Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', alignItems: 'start', flexWrap: 'wrap' }}>
        {/* Grid */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 56px)', gap: '6px' }}>
            {grid.map((row, r) =>
              row.map((_, c) => {
                const state = getCellState(r, c);
                const col = CELL_COLORS[state];
                const label = r === START[0] && c === START[1] ? '🤖' : r === GOAL[0] && c === GOAL[1] ? '🏁' : grid[r][c] === 1 ? '■' : '';
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => toggleCell(r, c)}
                    title={`(${r},${c})`}
                    style={{
                      width: '56px', height: '56px',
                      borderRadius: '10px',
                      backgroundColor: col.bg,
                      border: `2px solid ${col.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: label ? '1.3rem' : '0.75rem',
                      color: col.text,
                      cursor: 'pointer',
                      fontWeight: '700',
                      transition: 'all 0.12s ease',
                      boxShadow: state === 'path' ? '0 0 0 3px #bfdbfe' : 'none'
                    }}
                  >
                    {label || `(${r},${c})`}
                  </div>
                );
              })
            )}
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
            Click cells to add/remove obstacles
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {[
              { label: 'Cells Explored', value: stepsExplored, color: '#dbeafe', textColor: '#1d4ed8' },
              { label: 'Shortest Path', value: pathLen ? `${pathLen} steps` : '?', color: '#dcfce7', textColor: '#15803d' },
              { label: 'Current Cell', value: currentCell ? `(${currentCell[0]},${currentCell[1]})` : '—', color: '#eff6ff', textColor: '#1e40af' },
              { label: 'Status', value: computed ? (bfsData?.path?.length ? '✅ Path found' : '❌ No path') : 'Click Run BFS', color: '#f8fafc', textColor: '#475569' },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: s.color, borderRadius: '10px', padding: '0.7rem 0.9rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: s.textColor, marginTop: '0.15rem' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '0.9rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Legend</div>
            {[
              { color: '#10b981', label: '🤖 Robot Start (0,0)' },
              { color: '#f43f5e', label: '🏁 Goal (4,4)' },
              { color: '#475569', label: '■ Obstacle' },
              { color: '#dbeafe', label: 'BFS Visited frontier' },
              { color: '#2563eb', label: 'Shortest path' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: '#334155' }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Path display */}
          {bfsData?.path?.length > 0 && (
            <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '0.9rem', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Shortest Path</div>
              <div style={{ fontSize: '0.8rem', color: '#166534', fontFamily: 'var(--font-mono)', lineHeight: '1.8', wordBreak: 'break-all' }}>
                {bfsData.path.map(([r,c]) => `(${r},${c})`).join(' → ')}
              </div>
            </div>
          )}
        </div>
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
