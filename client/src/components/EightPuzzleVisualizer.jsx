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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: 'var(--bg-primary)', padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
        <span>Moves g(n): <strong style={{ color: 'var(--accent-cyan)' }}>{moves}</strong></span>
        <span>Manhattan h(n): <strong style={{ color: '#f59e0b' }}>{getManhattan(board)}</strong></span>
        <span>Total f(n): <strong style={{ color: '#4ade80' }}>{moves + getManhattan(board)}</strong></span>
      </div>
      {isWon && <div style={{ color: '#4ade80', fontWeight: 'bold' }}>🎉 Goal State Reached!</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 75px)', gridTemplateRows: 'repeat(3, 75px)', gap: '6px', backgroundColor: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        {board.map((val, idx) => (
          <div key={idx} onClick={() => handleTileClick(idx)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: val === 0 ? 'transparent' : '#1e293b', border: val === 0 ? '1px dashed var(--border-color)' : '2px solid var(--accent-cyan)', color: '#fff', fontSize: '1.4rem', fontWeight: 'bold', borderRadius: '6px', cursor: val === 0 ? 'default' : 'pointer' }}>
            {val !== 0 ? val : ''}
          </div>
        ))}
      </div>
      <button onClick={() => { setBoard([1, 2, 3, 4, 5, 6, 7, 0, 8]); setMoves(0); }} style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
        <Shuffle style={{ width: '14px', height: '14px' }} /> Reset Board
      </button>
    </div>
  );
}

export default EightPuzzleVisualizer;