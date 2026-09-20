import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

function HanoiVisualizer() {
  const [numDisks, setNumDisks] = useState(3);
  const [pegs, setPegs] = useState({ A: [3, 2, 1], B: [], C: [] });
  const [selectedPeg, setSelectedPeg] = useState(null);
  const [movesCount, setMovesCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [moveLog, setMoveLog] = useState("Select source and destination pegs or click 'Auto Solve'.");
  const [isWon, setIsWon] = useState(false);

  const autoMovesQueue = useRef([]);
  const timerRef = useRef(null);
  const diskColors = ['#f43f5e', '#38bdf8', '#4ade80', '#f59e0b', '#a855f7', '#ec4899'];

  const initPegs = (n) => {
    setIsAutoPlaying(false);
    setIsWon(false);
    setSelectedPeg(null);
    setMovesCount(0);
    setMoveLog(`Board ready for ${n} disks. Optimal steps: ${Math.pow(2, n) - 1}`);
    setPegs({
      A: Array.from({ length: n }, (_, i) => n - i),
      B: [],
      C: []
    });
  };

  useEffect(() => {
    initPegs(numDisks);
    return () => clearInterval(timerRef.current);
  }, [numDisks]);

  // Manual Move
  const handlePegClick = (peg) => {
    if (isAutoPlaying || isWon) return;
    if (!selectedPeg) {
      if (pegs[peg].length === 0) return setMoveLog(`Peg ${peg} has no disks to pick!`);
      setSelectedPeg(peg);
      setMoveLog(`Disk picked from Peg ${peg}. Click destination peg.`);
      return;
    }

    if (selectedPeg === peg) {
      setSelectedPeg(null);
      setMoveLog("Selection cancelled.");
      return;
    }

    const src = [...pegs[selectedPeg]];
    const dest = [...pegs[peg]];
    const disk = src[src.length - 1];
    const topDest = dest[dest.length - 1];

    if (topDest !== undefined && disk > topDest) {
      setMoveLog(`❌ Illegal move! Disk ${disk} cannot sit on smaller Disk ${topDest}.`);
      setSelectedPeg(null);
      return;
    }

    src.pop();
    dest.push(disk);
    const updated = { ...pegs, [selectedPeg]: src, [peg]: dest };
    setPegs(updated);
    setMovesCount((m) => m + 1);
    setSelectedPeg(null);
    setMoveLog(`Moved Disk ${disk} from ${selectedPeg} → ${peg}`);

    if (updated.C.length === numDisks) {
      setIsWon(true);
      setMoveLog(`🎉 Solved in ${movesCount + 1} moves! (Optimal was ${Math.pow(2, numDisks) - 1})`);
    }
  };

  // Auto Solver Recursive Generator
  const generateHanoiMoves = (n, src, aux, dest, moves) => {
    if (n === 1) {
      moves.push({ from: src, to: dest, disk: 1 });
      return;
    }
    generateHanoiMoves(n - 1, src, dest, aux, moves);
    moves.push({ from: src, to: dest, disk: n });
    generateHanoiMoves(n - 1, aux, src, dest, moves);
  };

  const startAutoSolve = () => {
    initPegs(numDisks);
    const moves = [];
    generateHanoiMoves(numDisks, 'A', 'B', 'C', moves);
    autoMovesQueue.current = moves;
    setIsAutoPlaying(true);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setInterval(() => {
        if (autoMovesQueue.current.length === 0) {
          setIsAutoPlaying(false);
          setIsWon(true);
          clearInterval(timerRef.current);
          setMoveLog(`🎉 Auto-Solve complete in exact optimal moves!`);
          return;
        }

        const nextMove = autoMovesQueue.current.shift();
        setPegs((prev) => {
          const src = [...prev[nextMove.from]];
          const dest = [...prev[nextMove.to]];
          const disk = src.pop();
          dest.push(disk);
          return { ...prev, [nextMove.from]: src, [nextMove.to]: dest };
        });

        setMovesCount((m) => m + 1);
        setMoveLog(`Auto-Step: Moving Disk ${nextMove.disk} from Peg ${nextMove.from} → Peg ${nextMove.to}`);
      }, 600);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Disks:</span>
          <input
            type="range" min="3" max="5"
            value={numDisks}
            disabled={isAutoPlaying}
            onChange={(e) => setNumDisks(Number(e.target.value))}
            style={{ cursor: 'pointer', accentColor: '#38bdf8' }}
          />
          <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>{numDisks}</strong>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={startAutoSolve}
            disabled={isAutoPlaying}
            style={{ padding: '0.45rem 1rem', backgroundColor: '#38bdf8', color: '#020617', border: 'none', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <FastForward style={{ width: '16px', height: '16px' }} /> Auto Solve Recursion
          </button>
          <button onClick={() => initPegs(numDisks)} style={{ padding: '0.45rem 0.8rem', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' }}>
            <RotateCcw style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>

      {/* Telemetry */}
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#020617', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '0.85rem' }}>
        <span>Step: <strong style={{ color: '#38bdf8' }}>{movesCount}</strong> / {Math.pow(2, numDisks) - 1}</span>
        <span style={{ color: isWon ? '#4ade80' : '#cbd5e1' }}>{moveLog}</span>
      </div>

      {/* Peg Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', minHeight: '230px', alignItems: 'flex-end', borderBottom: '4px solid #334155', paddingBottom: '1rem', backgroundColor: '#020617', borderRadius: '10px', padding: '1rem' }}>
        {['A', 'B', 'C'].map((peg) => (
          <div
            key={peg}
            onClick={() => handlePegClick(peg)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: isAutoPlaying ? 'default' : 'pointer',
              position: 'relative', border: selectedPeg === peg ? '1px dashed #38bdf8' : 'none', borderRadius: '8px', padding: '0.5rem'
            }}
          >
            {/* Rod stem */}
            <div style={{ width: '8px', height: '160px', backgroundColor: '#1e293b', position: 'absolute', bottom: '26px', zIndex: 1, borderRadius: '4px' }} />

            {/* Disk Stack */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', zIndex: 2, minHeight: '160px' }}>
              {pegs[peg].map((size) => (
                <div
                  key={size}
                  style={{
                    width: `${25 + (size / numDisks) * 70}%`, height: '22px',
                    backgroundColor: diskColors[size - 1], borderRadius: '6px',
                    margin: '2px 0', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.75rem', color: '#020617',
                    fontWeight: '900', boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                  }}
                >
                  {size}
                </div>
              ))}
            </div>

            <span style={{ marginTop: '8px', fontSize: '0.9rem', fontWeight: '800', color: '#38bdf8' }}>
              Peg {peg} {peg === 'C' ? '(Goal)' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HanoiVisualizer;