import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

// All 8 preset puzzles for variety when resetting
const PRESETS = [
  [1, 2, 3, 4, 0, 5, 7, 8, 6],   // 1 move from goal
  [1, 2, 3, 0, 4, 5, 7, 8, 6],   // 2 moves
  [1, 2, 3, 4, 8, 5, 7, 0, 6],   // 3 moves
  [1, 2, 0, 4, 5, 3, 7, 8, 6],   // 4 moves
  [4, 1, 2, 0, 5, 3, 7, 8, 6],   // medium
  [1, 3, 2, 4, 5, 0, 7, 8, 6],   // medium
  [0, 1, 2, 4, 5, 3, 7, 8, 6],   // medium
  [4, 2, 3, 1, 5, 0, 7, 8, 6],   // harder
  [5, 1, 3, 4, 2, 6, 7, 8, 0],   // harder
  [1, 8, 2, 0, 4, 3, 7, 6, 5],   // hard
];

function getManhattan(b) {
  return b.reduce((sum, val, idx) => {
    if (val === 0) return sum;
    const target = val - 1;
    return sum + Math.abs(Math.floor(idx / 3) - Math.floor(target / 3)) + Math.abs((idx % 3) - (target % 3));
  }, 0);
}

// A* solver — returns array of board states (solution path)
function aStarSolve(startBoard) {
  const goalStr = GOAL.join(',');
  const startStr = startBoard.join(',');
  if (startStr === goalStr) return [startBoard];

  const key = (b) => b.join(',');
  const h = (b) => getManhattan(b);

  // Priority queue as sorted array (small for demo boards)
  let open = [{ board: startBoard, g: 0, f: h(startBoard), path: [startBoard] }];
  const visited = new Set([startStr]);

  while (open.length > 0) {
    // sort by f ascending
    open.sort((a, b) => a.f - b.f);
    const curr = open.shift();
    const { board, g, path } = curr;

    if (key(board) === goalStr) return path;

    const blank = board.indexOf(0);
    const r = Math.floor(blank / 3), c = blank % 3;
    const moves = [];
    if (r > 0) moves.push(blank - 3);
    if (r < 2) moves.push(blank + 3);
    if (c > 0) moves.push(blank - 1);
    if (c < 2) moves.push(blank + 1);

    for (const swap of moves) {
      const next = [...board];
      [next[blank], next[swap]] = [next[swap], next[blank]];
      const nk = key(next);
      if (!visited.has(nk)) {
        visited.add(nk);
        const ng = g + 1;
        open.push({ board: next, g: ng, f: ng + h(next), path: [...path, next] });
      }
    }
  }
  return [startBoard]; // no solution (shouldn't happen for valid states)
}

function EightPuzzleVisualizer() {
  const [board, setBoard] = useState([1, 2, 3, 4, 0, 5, 7, 8, 6]);
  const [moves, setMoves] = useState(0);
  const [presetIdx, setPresetIdx] = useState(0);
  const [solvePath, setSolvePath] = useState(null);
  const [solveStep, setSolveStep] = useState(0);
  const [solving, setSolving] = useState(false);

  const manhattan = getManhattan(board);
  const isWon = board.every((v, i) => v === GOAL[i]);

  const handleTileClick = (idx) => {
    if (solving) return;
    const blank = board.indexOf(0);
    const r1 = Math.floor(idx / 3), c1 = idx % 3;
    const r2 = Math.floor(blank / 3), c2 = blank % 3;
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
      const next = [...board];
      next[blank] = next[idx];
      next[idx] = 0;
      setBoard(next);
      setMoves(m => m + 1);
      setSolvePath(null);
    }
  };

  // Shuffle to next preset
  const shuffleBoard = () => {
    const nextIdx = (presetIdx + 1) % PRESETS.length;
    setPresetIdx(nextIdx);
    setBoard([...PRESETS[nextIdx]]);
    setMoves(0);
    setSolvePath(null);
    setSolveStep(0);
    setSolving(false);
  };

  // Run A* and animate solution
  const handleSolve = () => {
    if (isWon) return;
    const path = aStarSolve(board);
    setSolvePath(path);
    setSolveStep(0);
    setSolving(true);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= path.length) {
        clearInterval(interval);
        setSolving(false);
        setMoves(m => m + path.length - 1);
        return;
      }
      setSolveStep(step);
      setBoard([...path[step]]);
    }, 600); // 600ms per step — slow enough to follow
  };

  const TILE_COLORS = {
    correct: { bg: '#dcfce7', border: '#86efac', text: '#15803d' }, // tile is in correct position
    wrong:   { bg: '#ffffff', border: '#e2e8f0', text: '#0f172a' },
    blank:   { bg: '#f1f5f9', border: '#e2e8f0', text: 'transparent' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
      {/* f(n) = g(n) + h(n) display */}
      <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: '#f1f5f9', padding: '0.75rem 1.75rem', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid #e2e8f0', color: '#334155', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span>Moves <strong style={{ fontFamily: 'var(--font-mono)' }}>g(n)</strong>: <strong style={{ color: '#2563eb', fontSize: '1.05rem' }}>{moves}</strong></span>
        <span>Manhattan <strong style={{ fontFamily: 'var(--font-mono)' }}>h(n)</strong>: <strong style={{ color: '#f59e0b', fontSize: '1.05rem' }}>{manhattan}</strong></span>
        <span>Total <strong style={{ fontFamily: 'var(--font-mono)' }}>f(n) = g+h</strong>: <strong style={{ color: '#10b981', fontSize: '1.05rem' }}>{moves + manhattan}</strong></span>
      </div>

      {/* Status message */}
      {isWon && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', fontWeight: '800', fontSize: '1.05rem', padding: '0.6rem 1.5rem', borderRadius: '10px', border: '1px solid #86efac' }}>
          🎉 Goal State Reached in {moves} moves!
        </div>
      )}
      {solving && solvePath && (
        <div style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: '700', fontSize: '0.9rem', padding: '0.5rem 1.25rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
          ⭐ A* solving... Step {solveStep} of {solvePath.length - 1}
        </div>
      )}

      {/* Puzzle Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 84px)', gridTemplateRows: 'repeat(3, 84px)', gap: '8px', backgroundColor: '#e2e8f0', padding: '12px', borderRadius: '18px', border: '2px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        {board.map((val, idx) => {
          const isBlank = val === 0;
          const isCorrect = !isBlank && val === GOAL[idx];
          const style = isBlank ? TILE_COLORS.blank : isCorrect ? TILE_COLORS.correct : TILE_COLORS.wrong;
          return (
            <div
              key={idx}
              onClick={() => handleTileClick(idx)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: style.bg,
                border: `2px solid ${style.border}`,
                color: style.text,
                fontSize: '1.65rem', fontWeight: '800',
                borderRadius: '12px',
                cursor: isBlank ? 'default' : 'pointer',
                boxShadow: !isBlank ? '0 3px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
                fontFamily: 'var(--font-mono)',
                userSelect: 'none',
              }}
              onMouseEnter={e => { if (!isBlank) e.currentTarget.style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {!isBlank ? val : ''}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '3px' }} />
          Correct position (contributes 0 to h)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '3px' }} />
          Wrong position (adds to Manhattan h)
        </span>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={shuffleBoard}
          disabled={solving}
          style={{ padding: '0.6rem 1.25rem', backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', color: '#334155', borderRadius: '9999px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700' }}
        >
          <Shuffle style={{ width: '14px', height: '14px' }} /> Shuffle Board
        </button>
        <button
          onClick={handleSolve}
          disabled={isWon || solving}
          style={{ padding: '0.6rem 1.35rem', backgroundColor: '#2563eb', border: 'none', color: '#fff', borderRadius: '9999px', cursor: isWon || solving ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: '700', opacity: isWon || solving ? 0.6 : 1 }}
        >
          ⭐ Auto Solve with A*
        </button>
      </div>

      {/* Info box */}
      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center', maxWidth: '380px', lineHeight: '1.5' }}>
        Click tiles adjacent to blank to move them · Green tiles are in their correct position · A* finds optimal solution automatically
      </div>
    </div>
  );
}

export default EightPuzzleVisualizer;