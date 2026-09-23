import React, { useState, useRef, useEffect } from 'react';

// ─── Game Tree Data ──────────────────────────────────────────────────────────
// Fixed tree for demo: 3-level tree (Root=MAX, Level1=MIN, Level2=leaves)
const TREE = {
  nodes: [
    { id: 0, level: 0, isMax: true,  label: 'A', x: 400, y: 40,  children: [1, 2], value: null, alpha: -Infinity, beta: Infinity },
    { id: 1, level: 1, isMax: false, label: 'B', x: 200, y: 150, children: [3, 4], value: null, alpha: -Infinity, beta: Infinity },
    { id: 2, level: 1, isMax: false, label: 'C', x: 600, y: 150, children: [5, 6], value: null, alpha: -Infinity, beta: Infinity },
    { id: 3, level: 2, isMax: null,  label: '3', x: 100, y: 270, children: [], value: 3, alpha: null, beta: null },
    { id: 4, level: 2, isMax: null,  label: '5', x: 300, y: 270, children: [], value: 5, alpha: null, beta: null },
    { id: 5, level: 2, isMax: null,  label: '2', x: 500, y: 270, children: [], value: 2, alpha: null, beta: null },
    { id: 6, level: 2, isMax: null,  label: '9', x: 700, y: 270, children: [], value: 9, alpha: null, beta: null },
  ],
  edges: [
    { from: 0, to: 1 }, { from: 0, to: 2 },
    { from: 1, to: 3 }, { from: 1, to: 4 },
    { from: 2, to: 5 }, { from: 2, to: 6 },
  ]
};

const STEPS = [
  { nodeId: 3, nodeState: { value: 3 }, parentId: 1, parentState: { value: 3, beta: 3 }, pruned: [], log: 'Leaf node A→B→3: return 3. MIN node B: β = min(∞, 3) = 3', alpha: -Infinity, beta: Infinity },
  { nodeId: 4, nodeState: { value: 5 }, parentId: 1, parentState: { value: 3, beta: 3 }, pruned: [], log: 'Leaf node A→B→5: return 5. MIN node B: β = min(3, 5) = 3 (no change)', alpha: -Infinity, beta: 3 },
  { nodeId: 1, nodeState: { value: 3 }, parentId: 0, parentState: { value: 3, alpha: 3 }, pruned: [], log: 'MIN node B complete: returns 3. MAX node A: α = max(-∞, 3) = 3', alpha: -Infinity, beta: Infinity },
  { nodeId: 5, nodeState: { value: 2 }, parentId: 2, parentState: { value: 2, beta: 2 }, pruned: [], log: 'Leaf node A→C→2: return 2. MIN node C: β = min(∞, 2) = 2. Check: β(2) ≤ α(3)? YES → PRUNE!', alpha: 3, beta: Infinity },
  { nodeId: 6, nodeState: { value: 9 }, parentId: 2, parentState: { value: 2, beta: 2 }, pruned: [6], log: '🚫 Node C→9 PRUNED! α(3) ≥ β(2) → skip this branch (alpha cut-off)', alpha: 3, beta: 2 },
  { nodeId: 2, nodeState: { value: 2 }, parentId: 0, parentState: { value: 3, alpha: 3 }, pruned: [6], log: 'MIN node C: returns 2. MAX node A: α = max(3, 2) = 3. Root MAX returns 3.', alpha: 3, beta: Infinity },
  { nodeId: 0, nodeState: { value: 3 }, parentId: null, parentState: null, pruned: [6], log: '✅ DONE! Optimal value = 3 (for MAX player). Node 6 (value=9) was pruned — saved computation!', alpha: 3, beta: Infinity },
];

const inf = '∞';
const neg_inf = '-∞';

function fmtVal(v) {
  if (v === null || v === undefined) return '?';
  if (v === Infinity) return inf;
  if (v === -Infinity) return neg_inf;
  return v;
}

export default function AlphaBetaVisualizer() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const currentStep = step >= 0 ? STEPS[step] : null;

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const nextStep = () => {
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const prevStep = () => {
    setStep(s => Math.max(s - 1, -1));
  };
  const reset = () => {
    clearTimeout(timerRef.current);
    setRunning(false);
    setStep(-1);
  };
  const autoRun = () => {
    if (step >= STEPS.length - 1) { setStep(-1); }
    setRunning(true);
    const run = (s) => {
      if (s >= STEPS.length - 1) { setRunning(false); return; }
      setStep(s + 1);
      timerRef.current = setTimeout(() => run(s + 1), 1200);
    };
    run(step < 0 ? -1 : step);
  };

  // Determine node display state
  const getNodeStyle = (node) => {
    if (!currentStep) {
      if (node.level === 2) return { bg: '#f8fafc', border: '#cbd5e1', text: '#64748b' };
      return { bg: '#ffffff', border: '#e2e8f0', text: '#0f172a' };
    }
    const pruned = currentStep.pruned || [];
    if (pruned.includes(node.id)) return { bg: '#fee2e2', border: '#fca5a5', text: '#b91c1c' };
    if (node.id === currentStep.nodeId) return { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8' };
    if (node.id === currentStep.parentId) return { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' };
    if (node.level === 2) return { bg: '#f8fafc', border: '#cbd5e1', text: '#64748b' };
    return { bg: '#ffffff', border: '#e2e8f0', text: '#0f172a' };
  };

  const getNodeValue = (node) => {
    if (!currentStep) return node.level === 2 ? node.value : '?';
    if (currentStep.pruned?.includes(node.id)) return node.value;
    if (node.id === currentStep.nodeId) return currentStep.nodeState.value ?? (node.level === 2 ? node.value : '?');
    if (node.id === currentStep.parentId) return currentStep.parentState?.value ?? '?';
    if (node.level === 2) return node.value;
    return '?';
  };

  return (
    <div style={{ fontFamily: 'var(--font-main)', color: '#0f172a' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Alpha-Beta Pruning Visualizer</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Game tree with MAX (root) and MIN nodes. Leaf values: 3, 5, 2, 9</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={prevStep} disabled={step <= -1} style={btnStyle('#f1f5f9', '#0f172a')}>◀ Prev</button>
          <button onClick={nextStep} disabled={step >= STEPS.length - 1} style={btnStyle('#0f172a', '#ffffff')}>Next ▶</button>
          <button onClick={running ? reset : autoRun} style={btnStyle(running ? '#fee2e2' : '#dcfce7', running ? '#b91c1c' : '#15803d')}>
            {running ? '⏸ Pause' : '▶ Auto Run'}
          </button>
          <button onClick={reset} style={btnStyle('#f1f5f9', '#64748b')}>↺ Reset</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {[
          { color: '#eff6ff', border: '#3b82f6', label: 'Current Node' },
          { color: '#f0fdf4', border: '#22c55e', label: 'Parent Node' },
          { color: '#fee2e2', border: '#fca5a5', label: 'Pruned (skipped)' },
          { color: '#fff7ed', border: '#fb923c', label: 'MAX node' },
          { color: '#f0f9ff', border: '#38bdf8', label: 'MIN node' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: l.color, border: `2px solid ${l.border}` }} />
            <span style={{ color: '#64748b' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Game Tree */}
      <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1rem', overflowX: 'auto' }}>
        <svg width="800" height="320" viewBox="0 0 800 320" style={{ width: '100%', minWidth: '500px' }}>
          {/* Edges */}
          {TREE.edges.map((edge, i) => {
            const from = TREE.nodes[edge.from];
            const to = TREE.nodes[edge.to];
            const pruned = currentStep?.pruned?.includes(edge.to);
            return (
              <line
                key={i}
                x1={from.x} y1={from.y + 22}
                x2={to.x} y2={to.y - 22}
                stroke={pruned ? '#fca5a5' : '#e2e8f0'}
                strokeWidth={pruned ? 2 : 1.5}
                strokeDasharray={pruned ? '5,3' : 'none'}
              />
            );
          })}

          {/* Nodes */}
          {TREE.nodes.map((node) => {
            const s = getNodeStyle(node);
            const val = getNodeValue(node);
            const isMax = node.isMax === true;
            const isMin = node.isMax === false;
            const nodeBg = currentStep?.pruned?.includes(node.id) ? '#fee2e2'
              : node.id === currentStep?.nodeId ? '#eff6ff'
              : node.id === currentStep?.parentId ? '#f0fdf4'
              : isMax ? '#fff7ed'
              : isMin ? '#f0f9ff'
              : '#f8fafc';
            const nodeBorder = currentStep?.pruned?.includes(node.id) ? '#fca5a5'
              : node.id === currentStep?.nodeId ? '#3b82f6'
              : node.id === currentStep?.parentId ? '#22c55e'
              : isMax ? '#fb923c'
              : isMin ? '#38bdf8'
              : '#cbd5e1';

            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={22}
                  fill={nodeBg} stroke={nodeBorder} strokeWidth={2} />
                {/* Node label */}
                <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={s.text}>
                  {node.level === 2 ? '' : (isMax ? 'MAX' : 'MIN')}
                </text>
                <text x={node.x} y={node.y + 8} textAnchor="middle" fontSize="13" fontWeight="800" fill={s.text}>
                  {val ?? '?'}
                </text>
                {/* Node id label below */}
                <text x={node.x} y={node.y + 38} textAnchor="middle" fontSize="10" fill="#94a3b8">
                  {node.label}
                </text>
                {/* Alpha/Beta labels for internal nodes */}
                {node.level < 2 && currentStep && node.id === currentStep.parentId && currentStep.parentState && (
                  <text x={node.x + 28} y={node.y - 8} fontSize="9" fill="#2563eb">
                    α={fmtVal(currentStep.alpha)} β={fmtVal(currentStep.beta)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step Log */}
      <div style={{ marginTop: '1rem', backgroundColor: currentStep?.pruned?.length ? '#fff1f2' : '#f8fafc', borderRadius: '12px', padding: '1rem 1.25rem', border: `1px solid ${currentStep?.pruned?.length ? '#fecdd3' : '#e2e8f0'}`, minHeight: '60px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Step {step < 0 ? '0' : step + 1} of {STEPS.length}
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#0f172a', lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
          {step < 0 ? 'Click "Next ▶" or "Auto Run" to start the Alpha-Beta Pruning walkthrough.' : currentStep?.log}
        </p>
      </div>

      {/* α/β Status */}
      {currentStep && (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, backgroundColor: '#eff6ff', borderRadius: '10px', padding: '0.75rem 1rem', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1d4ed8', marginBottom: '0.2rem' }}>α (ALPHA — MAX best)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e40af', fontFamily: 'var(--font-mono)' }}>
              {fmtVal(currentStep.alpha)}
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#fdf4ff', borderRadius: '10px', padding: '0.75rem 1rem', border: '1px solid #e9d5ff' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7e22ce', marginBottom: '0.2rem' }}>β (BETA — MIN best)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#6b21a8', fontFamily: 'var(--font-mono)' }}>
              {fmtVal(currentStep.beta)}
            </div>
          </div>
          {currentStep.pruned?.length > 0 && (
            <div style={{ flex: 1, backgroundColor: '#fff1f2', borderRadius: '10px', padding: '0.75rem 1rem', border: '1px solid #fecdd3' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#b91c1c', marginBottom: '0.2rem' }}>✂️ Pruned Nodes</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#b91c1c', fontFamily: 'var(--font-mono)' }}>
                {currentStep.pruned.map(id => TREE.nodes[id].label).join(', ')}
              </div>
            </div>
          )}
        </div>
      )}
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
