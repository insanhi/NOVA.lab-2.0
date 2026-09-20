import React, { useState } from 'react';
import { Play, RotateCcw, FastForward, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [consoleMsg, setConsoleMsg] = useState("Click on grid cells to add/remove walls (🧱), then press the glowing Launch button below!");

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
    setConsoleMsg("🚀 BFS Wave Expanding level-by-level using FIFO Queue...");

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
        setConsoleMsg(`🎉 GOAL REACHED! Shortest path guaranteed: ${curr.path.length - 1} steps.`);
        setIsRunning(false);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        return;
      }

      copy[curr.r][curr.c].isVisited = true;
      setGrid([...copy]);
      await new Promise((res) => setTimeout(res, 45));

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Telemetry Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ backgroundColor: '#040711', padding: '1rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>QUEUE FRONTIER</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#00f0ff', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {queueList.length} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>elements</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#040711', padding: '1rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>EXPLORED NODES</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {expandedCount} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>visited</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#040711', padding: '1rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>SHORTEST PATH</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {pathSteps !== null ? `${pathSteps} Steps` : 'Computing...'}
          </div>
        </div>
      </div>

      {/* Grid Simulator Area */}
      <div style={{ backgroundColor: '#040711', padding: '2rem', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 48px)`, gap: '6px' }}>
          {grid.map((row, r) => row.map((cell, c) => {
            let bg = '#0f172a';
            let border = '1px solid #1e293b';
            let label = '';
            let shadow = 'none';

            if (cell.isStart) {
              bg = '#10b981';
              label = 'START';
              shadow = '0 0 12px rgba(16, 185, 129, 0.6)';
            } else if (cell.isGoal) {
              bg = '#f43f5e';
              label = 'GOAL';
              shadow = '0 0 12px rgba(244, 63, 94, 0.6)';
            } else if (cell.isPath) {
              bg = '#00f0ff';
              shadow = '0 0 10px rgba(0, 240, 255, 0.8)';
              border = '1px solid #ffffff';
            } else if (cell.isVisited) {
              bg = 'rgba(0, 240, 255, 0.2)';
              border = '1px solid rgba(0, 240, 255, 0.4)';
            } else if (cell.isWall) {
              bg = '#f59e0b';
              label = '🧱';
              shadow = '0 0 8px rgba(245, 158, 11, 0.3)';
            }

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => toggleWall(r, c)}
                style={{
                  width: '48px', height: '48px', borderRadius: '8px',
                  backgroundColor: bg, border: border, boxShadow: shadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: cell.isWall ? '1.2rem' : '0.65rem',
                  fontFamily: 'var(--font-mono)', fontWeight: '900',
                  color: (cell.isStart || cell.isGoal || cell.isPath) ? '#040711' : '#cbd5e1',
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px' }} /> Start (0,0)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#f43f5e', borderRadius: '3px' }} /> Goal (4,7)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '3px' }} /> Wall Barrier (🧱)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: 'rgba(0, 240, 255, 0.3)', borderRadius: '3px' }} /> Explored Set
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#00f0ff', borderRadius: '3px' }} /> Shortest Path
          </span>
        </div>
      </div>

      {/* Live Queue Memory Buffer */}
      <div style={{ backgroundColor: '#040711', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
        <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
          LIVE FIFO QUEUE FRONTIER MEMORY:
        </span>
        <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#00f0ff', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {queueList.length > 0 ? `[ ${queueList.slice(0, 15).join(', ')}${queueList.length > 15 ? ' ...' : ''} ]` : '[ Queue Frontier Empty ]'}
        </div>
      </div>

      {/* HIGH CONTRAST ACTION BAR (Solid Glowing Button) */}
      <div style={{
        backgroundColor: '#0a0f1d', padding: '1.25rem 1.5rem', borderRadius: '12px',
        border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: '1.5rem'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: '600' }}>
          {consoleMsg}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={resetAll}
            disabled={isRunning}
            style={{
              padding: '0.75rem 1.25rem', backgroundColor: '#1e293b',
              color: '#ffffff', border: '1px solid #334155', borderRadius: '8px',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            Clear Obstacles
          </button>

          {/* BRIGHT GLOWING PLAY BUTTON */}
          <button
            onClick={runBFS}
            disabled={isRunning}
            style={{
              padding: '0.75rem 1.75rem',
              background: 'linear-gradient(135deg, #00f0ff 0%, #38bdf8 100%)',
              color: '#040711',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '900',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)',
              transition: 'all 0.2s ease'
            }}
          >
            <Play style={{ width: '18px', height: '18px', fill: '#040711' }} />
            <span>LAUNCH BFS PATHFINDER</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BFSVisualizer;