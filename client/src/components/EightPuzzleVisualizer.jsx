import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function EightPuzzleVisualizer() {
  const [board, setBoard] = useState([1, 2, 3, 4, 0, 5, 7, 8, 6]);
  const [moves, setMoves] = useState(0);

  const getManhattan = (b) => {
    return b.reduce((sum, val, idx) => {
      if (val === 0) return sum;
      const target = val - 1;
      return sum + Math.abs(Math.floor(idx / 3) - Math.floor(target / 3)) + Math.abs((idx % 3) - (target % 3));
    }, 0);
  };

  const handleTileClick = (idx) => {
    const blank = board.indexOf(0);
    const r1 = Math.floor(idx / 3), c1 = idx % 3;
    const r2 = Math.floor(blank / 3), c2 = blank % 3;
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
      const next = [...board];
      next[blank] = next[idx];
      next[idx] = 0;
      setBoard(next);
      setMoves((m) => m + 1);
    }
  };

  const isWon = board.every((v, i) => v === GOAL[i]);
  const manhattan = getManhattan(board);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
      {/* Heuristic Telemetry */}
      <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: '#f1f5f9', padding: '0.75rem 1.25rem', borderRadius: '12px', fontSize: '0.88rem', border: '1px solid #e2e8f0', color: '#334155' }}>
        <span>Moves g(n): <strong style={{ color: '#2563eb' }}>{moves}</strong></span>
        <span>Manhattan h(n): <strong style={{ color: '#f59e0b' }}>{manhattan}</strong></span>
        <span>Total f(n): <strong style={{ color: '#10b981' }}>{moves + manhattan}</strong></span>
      </div>

      {isWon && <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.05rem' }}>🎉 Goal State Reached!</div>}

      {/* Puzzle Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gridTemplateRows: 'repeat(3, 80px)', gap: '6px', backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
        {board.map((val, idx) => (
          <div
            key={idx}
            onClick={() => handleTileClick(idx)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: val === 0 ? '#f1f5f9' : '#ffffff',
              border: val === 0 ? '2px dashed #cbd5e1' : '2px solid #e2e8f0',
              color: '#0f172a', fontSize: '1.5rem', fontWeight: '800',
              borderRadius: '10px', cursor: val === 0 ? 'default' : 'pointer',
              boxShadow: val !== 0 ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
              fontFamily: 'var(--font-mono)'
            }}
            onMouseEnter={(e) => { if (val !== 0) e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {val !== 0 ? val : ''}
          </div>
        ))}
      </div>

      {/* Reset Button */}
      <button
        onClick={() => { setBoard([1, 2, 3, 4, 5, 6, 7, 0, 8]); setMoves(0); }}
        style={{
          padding: '0.55rem 1.1rem', backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0', color: '#64748b',
          borderRadius: '9999px', cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600'
        }}
      >
        <Shuffle style={{ width: '14px', height: '14px' }} /> Reset Board
      </button>
    </div>
  );
}

export default EightPuzzleVisualizer;