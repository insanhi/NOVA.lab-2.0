import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const ROWS = 5;
const COLS = 8;

function BFSVisualizer() {
  const [grid, setGrid] = useState(() => {
    const g = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        row.push({ r, c, isStart: r === 0 && c === 0, isGoal: r === 4 && c === 7, isWall: false, isVisited: false, isPath: false });
      }
      g.push(row);
    }
    // Default barriers
    g[1][2].isWall = true; g[2][2].isWall = true; g[3][2].isWall = true;
    g[2][5].isWall = true; g[3][5].isWall = true;
    return g;
  });

  const [queueList, setQueueList] = useState([]);
  const [expandedCount, setExpandedCount] = useState(0);
  const [pathSteps, setPathSteps] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleMsg, setConsoleMsg] = useState("Click on grid cells to add/remove walls, then press Launch BFS below.");

  const toggleWall = (r, c) => {
    if (isRunning || (r === 0 && c === 0) || (r === 4 && c === 7)) return;
    setGrid((prev) => prev.map((row) => row.map((cell) => cell.r === r && cell.c === c ? { ...cell, isWall: !cell.isWall } : cell)));
  };

  const resetAll = () => {
    setIsRunning(false);
    setExpandedCount(0);
    setPathSteps(null);
    setQueueList([]);
    setConsoleMsg("Grid reset. Ready for new exploration.");
    setGrid((prev) => prev.map((row) => row.map((cell) => ({ ...cell, isVisited: false, isPath: false }))));
  };

  const runBFS = async () => {
    setIsRunning(true);
    setPathSteps(null);
    setConsoleMsg("BFS expanding level-by-level using FIFO Queue...");

    const copy = grid.map((row) => row.map((c) => ({ ...c, isVisited: false, isPath: false })));
    const queue = [{ r: 0, c: 0, path: [{ r: 0, c: 0 }] }];
    const visited = new Set(['0-0']);
    let count = 0;

    while (queue.length > 0) {
      setQueueList(queue.map((q) => `(${q.r},${q.c})`));

      const curr = queue.shift();
      count++;
      setExpandedCount(count);

      // Goal Check
      if (curr.r === 4 && curr.c === 7) {
        for (const pt of curr.path) {
          copy[pt.r][pt.c].isPath = true;
        }
        setGrid([...copy]);
        setPathSteps(curr.path.length - 1);
        setConsoleMsg(`🎉 Goal reached! Shortest path: ${curr.path.length - 1} steps.`);
        setIsRunning(false);
        return;
      }

      copy[curr.r][curr.c].isVisited = true;
      setGrid([...copy]);
      await new Promise((res) => setTimeout(res, 45));

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = curr.r + dr, nc = curr.c + dc;
        const key = `${nr}-${nc}`;

        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          if (!copy[nr][nc].isWall && !visited.has(key)) {
            visited.add(key);
            queue.push({ r: nr, c: nc, path: [...curr.path, { r: nr, c: nc }] });
          }
        }
      }
    }

    setConsoleMsg("❌ Goal is completely blocked by walls! No path possible.");
    setIsRunning(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Telemetry Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>QUEUE FRONTIER</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2563eb', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {queueList.length} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>elements</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>EXPLORED NODES</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {expandedCount} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>visited</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>SHORTEST PATH</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {pathSteps !== null ? `${pathSteps} Steps` : 'Pending'}
          </div>
        </div>
      </div>

      {/* Grid Simulator */}
      <div style={{ backgroundColor: '#f8fafc', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 48px)`, gap: '5px' }}>
          {grid.map((row, r) => row.map((cell, c) => {
            let bg = '#ffffff';
            let border = '1px solid #e2e8f0';
            let label = '';
            let shadow = 'none';
            let textColor = '#94a3b8';

            if (cell.isStart) {
              bg = '#10b981'; textColor = '#ffffff';
              label = 'S';
              shadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
            } else if (cell.isGoal) {
              bg = '#f43f5e'; textColor = '#ffffff';
              label = 'G';
              shadow = '0 2px 8px rgba(244, 63, 94, 0.3)';
            } else if (cell.isPath) {
              bg = '#2563eb'; textColor = '#ffffff';
              shadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
              border = '1px solid #3b82f6';
            } else if (cell.isVisited) {
              bg = 'rgba(37, 99, 235, 0.1)';
              border = '1px solid rgba(37, 99, 235, 0.25)';
            } else if (cell.isWall) {
              bg = '#64748b'; textColor = '#ffffff';
              label = '▪';
            }

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => toggleWall(r, c)}
                style={{
                  width: '48px', height: '48px', borderRadius: '8px',
                  backgroundColor: bg, border: border, boxShadow: shadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)', fontWeight: '800',
                  color: textColor,
                  cursor: (cell.isStart || cell.isGoal) ? 'default' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {label}
              </div>
            );
          }))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px' }} /> Start
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#f43f5e', borderRadius: '3px' }} /> Goal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#64748b', borderRadius: '3px' }} /> Wall
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: 'rgba(37,99,235,0.15)', borderRadius: '3px', border: '1px solid rgba(37,99,235,0.3)' }} /> Explored
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#2563eb', borderRadius: '3px' }} /> Shortest Path
          </span>
        </div>
      </div>

      {/* Live Queue Buffer */}
      <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.35rem', fontWeight: '600' }}>
          FIFO QUEUE FRONTIER:
        </span>
        <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#2563eb', overflowX: 'auto', whiteSpace: 'nowrap', fontWeight: '600' }}>
          {queueList.length > 0 ? `[ ${queueList.slice(0, 15).join(', ')}${queueList.length > 15 ? ' ...' : ''} ]` : '[ Empty ]'}
        </div>
      </div>

      {/* Action Bar */}
      <div style={{
        backgroundColor: '#f1f5f9', padding: '1rem 1.25rem', borderRadius: '12px',
        border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: '1rem'
      }}>
        <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: '600', flex: 1 }}>
          {consoleMsg}
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={resetAll}
            disabled={isRunning}
            style={{
              padding: '0.65rem 1.1rem', backgroundColor: '#ffffff',
              color: '#475569', border: '1px solid #e2e8f0', borderRadius: '9999px',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            Clear
          </button>

          <button
            onClick={runBFS}
            disabled={isRunning}
            style={{
              padding: '0.65rem 1.5rem',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: '800',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(15,23,42,0.15)'
            }}
          >
            <Play style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
            <span>Launch BFS</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BFSVisualizer;