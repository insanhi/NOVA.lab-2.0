import React, { useState, useRef } from 'react';

const N = 8;

function isSafe(board, row, col) {
  for (let c = 0; c < col; c++) {
    if (board[c] === row) return false;
    if (Math.abs(board[c] - row) === Math.abs(c - col)) return false;
  }
  return true;
}

function solveQueens() {
  const solutions = [];
  const board = new Array(N).fill(0);
  function bt(col) {
    if (col === N) { solutions.push([...board]); return; }
    for (let row = 0; row < N; row++) {
      if (isSafe(board, row, col)) {
        board[col] = row;
        bt(col + 1);
        board[col] = 0;
      }
    }
  }
  bt(0);
  return solutions;
}

export default function EightQueensVisualizer() {
  const [solutions, setSolutions] = useState(null);
  const [currentSol, setCurrentSol] = useState(0);
  const [placing, setPlacing] = useState(null); // {col: N, row: r} for animation
  const [board, setBoard] = useState(new Array(N).fill(-1)); // -1 = no queen
  const [animStep, setAnimStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState('browse'); // 'browse' | 'manual'
  const timerRef = useRef(null);

  const solve = () => {
    const sols = solveQueens();
    setSolutions(sols);
    setCurrentSol(0);
    setBoard([...sols[0]]);
    setMode('browse');
    setAnimStep(-1);
    setRunning(false);
    clearTimeout(timerRef.current);
  };

  const prevSol = () => {
    const idx = Math.max(0, currentSol - 1);
    setCurrentSol(idx);
    setBoard([...solutions[idx]]);
  };
  const nextSol = () => {
    const idx = Math.min(solutions.length - 1, currentSol + 1);
    setCurrentSol(idx);
    setBoard([...solutions[idx]]);
  };

  // Manual placement mode
  const startManual = () => {
    setMode('manual');
    setBoard(new Array(N).fill(-1));
    setAnimStep(-1);
    setSolutions(null);
  };
  const clickCell = (row, col) => {
    if (mode !== 'manual') return;
    const newBoard = [...board];
    if (newBoard[col] === row) {
      newBoard[col] = -1; // remove
    } else {
      newBoard[col] = row; // place
    }
    setBoard(newBoard);
  };

  // Animate solution placement column by column
  const animateSolution = () => {
    if (!solutions) return;
    const sol = solutions[currentSol];
    setBoard(new Array(N).fill(-1));
    setRunning(true);
    let col = 0;
    const go = () => {
      if (col >= N) { setRunning(false); return; }
      setBoard(prev => {
        const b = [...prev];
        b[col] = sol[col];
        return b;
      });
      setAnimStep(col);
      col++;
      timerRef.current = setTimeout(go, 650);
    };
    go();
  };

  const isQueenSafe = (b, col) => {
    if (b[col] < 0) return true;
    return isSafe(b, b[col], col);
  };

  const queensPlaced = board.filter(r => r >= 0).length;
  const allSafe = board.every((r, c) => r < 0 || isSafe(board, r, c));
  const isSolved = queensPlaced === N && allSafe;

  return (
    <div style={{ fontFamily: 'var(--font-main)', color: '#0f172a' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>8-Queens CSP — Backtracking Visualizer</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
            {solutions ? `${solutions.length} solutions found · Showing #${currentSol + 1}` : 'Place queens manually or solve with backtracking'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={solve} style={btnStyle('#0f172a', '#fff')}>⚡ Solve (92 solutions)</button>
          {solutions && <button onClick={animateSolution} disabled={running} style={btnStyle('#dcfce7', '#15803d')}>▶ Animate</button>}
          {solutions && <button onClick={prevSol} disabled={currentSol <= 0} style={btnStyle('#f1f5f9', '#0f172a')}>◀</button>}
          {solutions && <button onClick={nextSol} disabled={currentSol >= solutions.length - 1} style={btnStyle('#f1f5f9', '#0f172a')}>▶</button>}
          <button onClick={startManual} style={btnStyle('#fffbeb', '#92400e')}>✏️ Manual</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Board */}
        <div>
          <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${N}, 52px)`, gap: '2px', backgroundColor: '#e2e8f0', borderRadius: '12px', padding: '6px', border: '2px solid #e2e8f0' }}>
            {Array.from({ length: N }, (_, row) =>
              Array.from({ length: N }, (_, col) => {
                const isLight = (row + col) % 2 === 0;
                const hasQueen = board[col] === row;
                const isCurrentCol = animStep === col && running;
                const attackedByAny = hasQueen && !isSafe(board, row, col);

                return (
                  <div
                    key={`${row}-${col}`}
                    onClick={() => clickCell(row, col)}
                    style={{
                      width: '52px', height: '52px',
                      borderRadius: '6px',
                      backgroundColor: attackedByAny ? '#fee2e2'
                        : hasQueen ? (isLight ? '#1e40af' : '#1d4ed8')
                        : isLight ? '#fafaf9' : '#d4d4d4',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: hasQueen ? '1.5rem' : '0',
                      cursor: mode === 'manual' ? 'pointer' : 'default',
                      transition: 'all 0.15s ease',
                      boxShadow: isCurrentCol ? '0 0 0 3px #fbbf24' : 'none',
                      border: attackedByAny ? '2px solid #f87171' : '2px solid transparent',
                    }}
                    title={`(row=${row+1}, col=${col+1})`}
                  >
                    {hasQueen ? '♛' : ''}
                  </div>
                );
              })
            )}
          </div>

          {/* Col labels */}
          <div style={{ display: 'flex', gap: '2px', paddingLeft: '6px', paddingRight: '6px', marginTop: '4px' }}>
            {Array.from({ length: N }, (_, i) => (
              <div key={i} style={{ width: '52px', textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                C{i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {[
              { label: 'Queens Placed', value: `${queensPlaced} / 8`, color: '#eff6ff', tc: '#1d4ed8' },
              { label: 'Total Solutions', value: solutions ? solutions.length : '?', color: '#f0fdf4', tc: '#15803d' },
              { label: 'Mode', value: mode === 'browse' ? '📋 Browse' : '✏️ Manual', color: '#fffbeb', tc: '#92400e' },
              { label: 'Status', value: isSolved ? '✅ Valid!' : queensPlaced === N ? '❌ Conflict!' : `${8 - queensPlaced} left`, color: isSolved ? '#f0fdf4' : '#f8fafc', tc: isSolved ? '#15803d' : '#475569' },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: s.color, borderRadius: '10px', padding: '0.7rem 0.9rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{s.label}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: s.tc, marginTop: '0.15rem' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Current solution display */}
          {solutions && (
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '0.9rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Solution #{currentSol + 1} — Queen rows per column
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {solutions[currentSol].map((row, col) => (
                  <div key={col} style={{
                    backgroundColor: '#0f172a', color: '#fff',
                    borderRadius: '6px', padding: '0.3rem 0.5rem',
                    fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: '700'
                  }}>
                    C{col+1}:R{row+1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div style={{ backgroundColor: '#fdf4ff', borderRadius: '12px', padding: '0.9rem', border: '1px solid #e9d5ff', fontSize: '0.82rem', color: '#6b21a8', lineHeight: '1.6' }}>
            <strong>CSP Constraints:</strong><br />
            ✅ One queen per column<br />
            ✅ No two queens in same row<br />
            ✅ No two queens on same diagonal<br />
            ↔ |row_i - row_j| ≠ |col_i - col_j|
          </div>

          {mode === 'manual' && (
            <div style={{ backgroundColor: '#fffbeb', borderRadius: '12px', padding: '0.9rem', border: '1px solid #fcd34d', fontSize: '0.82rem', color: '#92400e' }}>
              <strong>Manual Mode:</strong> Click any cell to place/remove a queen. Try to place all 8 without conflicts!
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
