import React, { useState, useRef, useEffect } from 'react';

// ────────────────────────────────────────────────────────────────────────────
// Game Tree Definition
// Tree: Root A (MAX) → B (MIN), C (MIN)
//       B → D(3), E(5)     C → F(2), G(9) ← G is pruned!
// ────────────────────────────────────────────────────────────────────────────
const NODES = [
  { id: 0, label: 'A', level: 0, type: 'MAX', x: 400, y: 40,  children: [1, 2], leafValue: null },
  { id: 1, label: 'B', level: 1, type: 'MIN', x: 190, y: 155, children: [3, 4], leafValue: null },
  { id: 2, label: 'C', level: 1, type: 'MIN', x: 610, y: 155, children: [5, 6], leafValue: null },
  { id: 3, label: 'D', level: 2, type: 'LEAF', x: 90,  y: 280, children: [], leafValue: 3 },
  { id: 4, label: 'E', level: 2, type: 'LEAF', x: 290, y: 280, children: [], leafValue: 5 },
  { id: 5, label: 'F', level: 2, type: 'LEAF', x: 510, y: 280, children: [], leafValue: 2 },
  { id: 6, label: 'G', level: 2, type: 'LEAF', x: 710, y: 280, children: [], leafValue: 9 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 1, to: 4 },
  { from: 2, to: 5 }, { from: 2, to: 6 },
];

// ────────────────────────────────────────────────────────────────────────────
// Steps — each step describes what's happening, which node is "active",
// and the FINAL committed value of every node after this step completes.
// Values start as null and fill in as the algorithm computes them.
// ────────────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    active: 3,          // D(3) — first leaf visited
    pruned: [],
    values: { 3: 3 },  // D returns 3
    alpha: -Infinity, beta: Infinity,
    currentNode: 1,     // currently inside MIN node B
    log: 'Visit leaf D → value = 3. Return 3 to MIN node B. Update β = min(∞, 3) = 3.',
  },
  {
    active: 4,          // E(5) — second leaf
    pruned: [],
    values: { 3: 3, 4: 5 },
    alpha: -Infinity, beta: 3,
    currentNode: 1,
    log: 'Visit leaf E → value = 5. MIN node B: β = min(3, 5) = 3 (no update — 5 > 3). B still returns 3.',
  },
  {
    active: 1,          // MIN node B finalized
    pruned: [],
    values: { 3: 3, 4: 5, 1: 3 },
    alpha: 3, beta: Infinity,
    currentNode: 0,
    log: 'MIN node B complete → returns 3 (minimum of children). MAX root A: α = max(-∞, 3) = 3.',
  },
  {
    active: 5,          // F(2) — leaf under C
    pruned: [],
    values: { 3: 3, 4: 5, 1: 3, 5: 2 },
    alpha: 3, beta: 2,
    currentNode: 2,
    log: 'Visit leaf F → value = 2. MIN node C: β = min(∞, 2) = 2. Now check: β(2) ≤ α(3)? YES! → PRUNE! Skip G.',
  },
  {
    active: 6,          // G(9) — PRUNED
    pruned: [6],
    values: { 3: 3, 4: 5, 1: 3, 5: 2, 6: 9 },
    alpha: 3, beta: 2,
    currentNode: 2,
    log: '🚫 Node G (value=9) PRUNED! Since α(3) ≥ β(2), MIN node C would NEVER choose a value ≥ 3. MAX already has α=3 guaranteed. No need to explore G.',
  },
  {
    active: 2,          // MIN node C finalized
    pruned: [6],
    values: { 3: 3, 4: 5, 1: 3, 5: 2, 6: 9, 2: 2 },
    alpha: 3, beta: Infinity,
    currentNode: 0,
    log: 'MIN node C returns 2 (only F evaluated). MAX root A: α = max(3, 2) = 3. Root sticks with 3 — already better!',
  },
  {
    active: 0,          // Root A finalized
    pruned: [6],
    values: { 3: 3, 4: 5, 1: 3, 5: 2, 6: 9, 2: 2, 0: 3 },
    alpha: 3, beta: Infinity,
    currentNode: null,
    log: '✅ DONE! Optimal value for MAX player = 3 (from subtree B→D). Node G(9) was pruned — saved 1 node evaluation! Without pruning: 4 leaf nodes. With pruning: 3 leaf nodes evaluated.',
  },
];

const fmt = (v) => {
  if (v === null || v === undefined) return '?';
  if (v === Infinity)  return '+∞';
  if (v === -Infinity) return '-∞';
  return String(v);
};

export default function AlphaBetaVisualizer() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const cur = step >= 0 ? STEPS[step] : null;
  const isDone = step === STEPS.length - 1;

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, -1));
  const reset = () => { clearTimeout(timerRef.current); setRunning(false); setStep(-1); };

  const autoRun = () => {
    if (isDone) { setStep(-1); return; }
    setRunning(true);
    const startFrom = step < 0 ? -1 : step;
    const go = (s) => {
      if (s >= STEPS.length - 1) { setRunning(false); return; }
      setStep(s + 1);
      timerRef.current = setTimeout(() => go(s + 1), 1600); // 1.6s per step — clear!
    };
    go(startFrom);
  };

  // Get display value for a node at current step
  const getDisplayValue = (nodeId) => {
    if (!cur) {
      const node = NODES.find(n => n.id === nodeId);
      return node?.leafValue !== null ? node.leafValue : '?';
    }
    return cur.values[nodeId] !== undefined ? cur.values[nodeId] : '?';
  };

  const getNodeStyle = (node) => {
    if (!cur) {
      // Default appearance
      const isLeaf = node.type === 'LEAF';
      return { bg: isLeaf ? '#f8fafc' : '#fff', border: isLeaf ? '#cbd5e1' : '#e2e8f0', textColor: '#475569', glow: false };
    }

    const isPruned = cur.pruned.includes(node.id);
    const isActive = node.id === cur.active;
    const hasValue = cur.values[node.id] !== undefined;

    if (isPruned && isActive) {
      // Node that's being pruned right now
      return { bg: '#fee2e2', border: '#fca5a5', textColor: '#b91c1c', glow: true };
    }
    if (isPruned && !isActive) {
      // Previously pruned
      return { bg: '#fee2e2', border: '#fca5a5', textColor: '#b91c1c', glow: false };
    }
    if (isActive) {
      // Currently being evaluated
      return { bg: '#eff6ff', border: '#3b82f6', textColor: '#1d4ed8', glow: true };
    }
    if (hasValue) {
      // Already computed
      return { bg: node.type === 'MAX' ? '#fff7ed' : node.type === 'MIN' ? '#f0f9ff' : '#f0fdf4',
               border: node.type === 'MAX' ? '#fb923c' : node.type === 'MIN' ? '#38bdf8' : '#86efac',
               textColor: '#0f172a', glow: false };
    }
    // Not yet reached
    return { bg: '#f8fafc', border: '#e2e8f0', textColor: '#94a3b8', glow: false };
  };

  const getEdgeColor = (from, to) => {
    if (!cur) return '#e2e8f0';
    if (cur.pruned.includes(to)) return '#fca5a5';
    if (cur.values[to] !== undefined) return '#94a3b8';
    return '#e2e8f0';
  };

  return (
    <div style={{ fontFamily: 'var(--font-main)', color: '#0f172a' }}>
      {/* Header + Controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Alpha-Beta Pruning — Step-by-Step</h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
            Tree: A(MAX) → B(MIN)[D=3, E=5], C(MIN)[F=2, G=9] · G gets pruned!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={prev} disabled={step <= -1 || running} style={btn('#f1f5f9', '#0f172a')}>◀ Prev</button>
          <button onClick={next} disabled={step >= STEPS.length - 1 || running} style={btn('#0f172a', '#fff')}>Next ▶</button>
          <button onClick={running ? reset : autoRun} style={btn(running ? '#fee2e2' : '#dcfce7', running ? '#b91c1c' : '#15803d')}>
            {running ? '⏸ Stop' : isDone ? '↺ Restart' : '▶ Auto (1.6s)'}
          </button>
          <button onClick={reset} disabled={running} style={btn('#f1f5f9', '#64748b')}>↺ Reset</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
        {[
          { bg: '#eff6ff', border: '#3b82f6', label: '⬤ Active node' },
          { bg: '#fff7ed', border: '#fb923c', label: 'MAX node' },
          { bg: '#f0f9ff', border: '#38bdf8', label: 'MIN node' },
          { bg: '#f0fdf4', border: '#86efac', label: 'Computed leaf' },
          { bg: '#fee2e2', border: '#fca5a5', label: '✂ Pruned' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: l.bg, border: `2px solid ${l.border}` }} />
            <span style={{ color: '#64748b' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Tree */}
      <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '0.5rem', overflowX: 'auto' }}>
        <svg width="800" height="340" viewBox="0 0 800 340" style={{ width: '100%', minWidth: '500px' }}>
          {/* Edges */}
          {EDGES.map((edge, i) => {
            const from = NODES.find(n => n.id === edge.from);
            const to   = NODES.find(n => n.id === edge.to);
            const isPruned = cur?.pruned?.includes(edge.to);
            return (
              <line key={i}
                x1={from.x} y1={from.y + 24} x2={to.x} y2={to.y - 24}
                stroke={getEdgeColor(edge.from, edge.to)}
                strokeWidth={isPruned ? 2 : 1.5}
                strokeDasharray={isPruned ? '6,4' : 'none'}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const s = getNodeStyle(node);
            const val = getDisplayValue(node.id);
            const isLeaf = node.type === 'LEAF';
            const r = isLeaf ? 22 : 28;
            const isPruned = cur?.pruned?.includes(node.id);
            const isActive = cur?.active === node.id;

            return (
              <g key={node.id}>
                {/* Glow ring for active node */}
                {s.glow && (
                  <circle cx={node.x} cy={node.y} r={r + 7}
                    fill="none" stroke={isPruned ? '#fca5a5' : '#93c5fd'} strokeWidth={2} opacity={0.5} />
                )}

                {/* Node circle */}
                <circle cx={node.x} cy={node.y} r={r}
                  fill={s.bg} stroke={s.border} strokeWidth={isActive ? 2.5 : 1.5} />

                {/* Type label (inside, top of circle) */}
                {!isLeaf && (
                  <text x={node.x} y={node.y - 6} textAnchor="middle"
                    fontSize="9" fontWeight="800" fill={s.textColor} opacity={0.7}>
                    {node.type}
                  </text>
                )}

                {/* Value (big, center) */}
                <text x={node.x} y={node.y + (isLeaf ? 6 : 10)} textAnchor="middle"
                  fontSize={isLeaf ? 15 : 13} fontWeight="900" fill={isPruned ? '#b91c1c' : s.textColor}>
                  {isPruned && isActive ? '✂' : val}
                </text>

                {/* Node letter label below circle */}
                <text x={node.x} y={node.y + r + 15} textAnchor="middle"
                  fontSize="11" fontWeight="700" fill="#94a3b8">
                  {node.label}
                </text>

                {/* α/β annotation on active internal node */}
                {cur && node.id === cur.currentNode && node.type !== 'LEAF' && (
                  <text x={node.x + r + 5} y={node.y - 10} fontSize="9" fill="#6b21a8" fontWeight="700">
                    α={fmt(cur.alpha)} β={fmt(cur.beta)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step Log */}
      <div style={{
        marginTop: '0.85rem',
        backgroundColor: cur?.pruned?.length > 0 && cur?.active === 6 ? '#fff1f2' : '#f8fafc',
        borderRadius: '12px', padding: '1rem 1.25rem',
        border: `1px solid ${cur?.pruned?.length > 0 && cur?.active === 6 ? '#fecdd3' : '#e2e8f0'}`,
        minHeight: '64px'
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
          {step < 0 ? 'Ready' : `Step ${step + 1} of ${STEPS.length}`}
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#0f172a', lineHeight: '1.6' }}>
          {step < 0
            ? 'Press "Next ▶" or "Auto (1.6s)" to walk through Alpha-Beta Pruning step by step.'
            : cur?.log}
        </p>
      </div>

      {/* α / β / Pruned Status */}
      {cur && (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '130px', backgroundColor: '#eff6ff', borderRadius: '10px', padding: '0.7rem 1rem', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#1d4ed8', marginBottom: '0.15rem' }}>α — MAX best guarantee</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1e40af', fontFamily: 'var(--font-mono)' }}>{fmt(cur.alpha)}</div>
          </div>
          <div style={{ flex: 1, minWidth: '130px', backgroundColor: '#fdf4ff', borderRadius: '10px', padding: '0.7rem 1rem', border: '1px solid #e9d5ff' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#7e22ce', marginBottom: '0.15rem' }}>β — MIN best guarantee</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#6b21a8', fontFamily: 'var(--font-mono)' }}>{fmt(cur.beta)}</div>
          </div>
          {cur.pruned.length > 0 && (
            <div style={{ flex: 1, minWidth: '130px', backgroundColor: '#fff1f2', borderRadius: '10px', padding: '0.7rem 1rem', border: '1px solid #fecdd3' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#b91c1c', marginBottom: '0.15rem' }}>✂ Pruned Nodes</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#b91c1c', fontFamily: 'var(--font-mono)' }}>
                G (val=9)
              </div>
            </div>
          )}
          {isDone && (
            <div style={{ flex: 1, minWidth: '130px', backgroundColor: '#f0fdf4', borderRadius: '10px', padding: '0.7rem 1rem', border: '1px solid #86efac' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#15803d', marginBottom: '0.15rem' }}>✅ Optimal Value</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#166534', fontFamily: 'var(--font-mono)' }}>3 (MAX wins)</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function btn(bg, color) {
  return {
    padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none',
    backgroundColor: bg, color, fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem',
  };
}
