import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

function VacuumVisualizer() {
  const [agentPos, setAgentPos] = useState('A');
  const [dustParticles, setDustParticles] = useState({
    A: [{ id: 1, top: '35%', left: '30%' }, { id: 2, top: '65%', left: '60%' }],
    B: [{ id: 3, top: '30%', left: '70%' }, { id: 4, top: '60%', left: '25%' }],
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [actionLog, setActionLog] = useState("Click 'Run Reflex Agent' or click inside rooms to drop dust.");
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef(null);

  const getNextAction = (pos, particles) => {
    if (particles.A.length === 0 && particles.B.length === 0) return 'NoOp';
    if (particles[pos].length > 0) return 'Suck';
    return pos === 'A' ? 'Right' : 'Left';
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setDustParticles((currDust) => {
          setAgentPos((currPos) => {
            const action = getNextAction(currPos, currDust);
            if (action === 'NoOp') {
              setIsDone(true);
              setIsPlaying(false);
              setActionLog("Goal Reached: All rooms clean. Agent issued NoOp.");
              clearInterval(timerRef.current);
              return currPos;
            }
            if (action === 'Suck') {
              setActionLog(`Action: 'Suck' executed at Room ${currPos}`);
              setDustParticles((p) => ({ ...p, [currPos]: [] }));
            } else if (action === 'Right') {
              setActionLog("Moving Right to Room B...");
              return 'B';
            } else if (action === 'Left') {
              setActionLog("Moving Left to Room A...");
              return 'A';
            }
            return currPos;
          });
          return currDust;
        });
      }, 900);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const addDust = (room, e) => {
    if (isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDustParticles((prev) => ({
      ...prev,
      [room]: [...prev[room], { id: Date.now(), top: `${y}%`, left: `${x}%` }]
    }));
    setIsDone(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 2-Room Interactive Canvas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', minHeight: '240px', backgroundColor: '#f1f5f9', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        {['A', 'B'].map((room) => (
          <div
            key={room}
            onClick={(e) => addDust(room, e)}
            style={{
              border: '2px dashed #cbd5e1', borderRadius: '12px', position: 'relative',
              backgroundColor: '#ffffff', cursor: 'crosshair', minHeight: '200px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <span style={{ position: 'absolute', top: '10px', left: '12px', color: '#64748b', fontWeight: '700', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              ROOM {room} ({dustParticles[room].length} Dust)
            </span>

            {dustParticles[room].map((d) => (
              <div key={d.id} style={{ position: 'absolute', top: d.top, left: d.left, width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }} />
            ))}

            {agentPos === room && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transition: 'all 0.3s' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#0f172a', border: '3px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', boxShadow: '0 4px 12px rgba(15,23,42,0.2)' }}>
                  🤖
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Telemetry Log */}
      <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.88rem', color: '#0f172a', fontWeight: '600' }}>
        {actionLog}
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            flex: 1, padding: '0.75rem', borderRadius: '9999px', border: 'none',
            backgroundColor: '#0f172a', color: '#ffffff', fontWeight: '700',
            fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Play style={{ width: '15px', height: '15px', fill: 'currentColor' }} />
          <span>{isPlaying ? 'Pause Agent' : isDone ? 'Re-Run Reflex Agent' : 'Run Reflex Agent'}</span>
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            setIsDone(false);
            setAgentPos('A');
            setDustParticles({ A: [{ id: 1, top: '35%', left: '30%' }], B: [{ id: 2, top: '50%', left: '60%' }] });
          }}
          style={{
            padding: '0.75rem 1.25rem', borderRadius: '9999px',
            border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
            color: '#475569', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <RotateCcw style={{ width: '14px', height: '14px' }} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

export default VacuumVisualizer;