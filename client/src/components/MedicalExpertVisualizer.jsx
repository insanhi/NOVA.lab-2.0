import React, { useState } from 'react';
import { Activity, Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

const SYMPTOM_LIST = [
  { id: 'fever', label: 'High Fever (>101°F)' },
  { id: 'chills', label: 'Severe Chills & Shivering' },
  { id: 'sweating', label: 'Profuse Sweating' },
  { id: 'headache', label: 'Intense Headache' },
  { id: 'rash', label: 'Skin Rash' },
  { id: 'joint_pain', label: 'Severe Joint & Muscle Ache' },
  { id: 'cough', label: 'Dry Persistent Cough' },
  { id: 'fatigue', label: 'Acute Fatigue' },
  { id: 'loss_of_smell', label: 'Loss of Smell / Taste' },
  { id: 'abdominal_pain', label: 'Abdominal Cramps' },
  { id: 'weakness', label: 'Extreme Weakness' },
  { id: 'sneezing', label: 'Frequent Sneezing' },
  { id: 'runny_nose', label: 'Rhinorrhea (Runny Nose)' },
];

const KNOWLEDGE_BASE = [
  {
    id: 'R1',
    disease: 'Malaria',
    severity: 'Critical',
    required: ['fever', 'chills', 'sweating'],
    desc: 'Plasmodium infection profile: Cyclic rigors with diaphoresis.'
  },
  {
    id: 'R2',
    disease: 'Dengue Hemorrhagic Fever',
    severity: 'Severe',
    required: ['fever', 'headache', 'rash', 'joint_pain'],
    desc: 'Breakbone viral profile: Retro-orbital headache and thrombocytopenia risk.'
  },
  {
    id: 'R3',
    disease: 'COVID-19 Syndrome',
    severity: 'High',
    required: ['fever', 'cough', 'fatigue', 'loss_of_smell'],
    desc: 'Respiratory coronavirus profile: Anosmia with pulmonary inflammation.'
  },
  {
    id: 'R4',
    disease: 'Typhoid Enteric Fever',
    severity: 'Moderate to High',
    required: ['fever', 'abdominal_pain', 'weakness'],
    desc: 'Salmonella typhi profile: Step-ladder pyrexia and gastrointestinal distress.'
  },
  {
    id: 'R5',
    disease: 'Acute Upper Respiratory Infection (Common Cold)',
    severity: 'Mild',
    required: ['sneezing', 'runny_nose'],
    desc: 'Rhinovirus profile: Upper airway mucosal irritation.'
  },
  {
    id: 'R6',
    disease: 'Viral Exhaustion Syndrome',
    severity: 'Mild to Moderate',
    required: ['fever', 'fatigue', 'weakness'],
    desc: 'Systemic post-viral fatigue state.'
  }
];

function MedicalExpertVisualizer() {
  const [selected, setSelected] = useState([]);
  const [targetGoal, setTargetGoal] = useState('Dengue Hemorrhagic Fever');
  const [mode, setMode] = useState('forward'); // 'forward' | 'backward'
  const [backwardTrace, setBackwardTrace] = useState(null);

  const toggleSymptom = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setBackwardTrace(null);
  };

  const selectAllFlu = () => {
    setSelected(['fever', 'fatigue', 'weakness', 'abdominal_pain']);
    setBackwardTrace(null);
  };

  // Real-time confidence calculations
  const evaluation = KNOWLEDGE_BASE.map((rule) => {
    const satisfied = rule.required.filter((s) => selected.includes(s));
    const missing = rule.required.filter((s) => !selected.includes(s));
    const confidence = Math.round((satisfied.length / rule.required.length) * 100);
    const isConfirmed = satisfied.length === rule.required.length;
    return { ...rule, satisfied, missing, confidence, isConfirmed };
  }).sort((a, b) => b.confidence - a.confidence);

  const handleBackwardRun = () => {
    const item = evaluation.find((r) => r.disease === targetGoal);
    setBackwardTrace(item);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setMode('forward')}
            style={{
              padding: '0.45rem 0.9rem', borderRadius: '6px', border: 'none',
              backgroundColor: mode === 'forward' ? '#38bdf8' : '#1e293b',
              color: mode === 'forward' ? '#020617' : '#94a3b8',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            Forward Chaining (Telemetry & Match %)
          </button>
          <button
            onClick={() => setMode('backward')}
            style={{
              padding: '0.45rem 0.9rem', borderRadius: '6px', border: 'none',
              backgroundColor: mode === 'backward' ? '#38bdf8' : '#1e293b',
              color: mode === 'backward' ? '#020617' : '#94a3b8',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            Backward Chaining (Goal Validation)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={selectAllFlu} style={{ padding: '0.45rem 0.8rem', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
            Preset: Systemic Fever
          </button>
          <button onClick={() => { setSelected([]); setBackwardTrace(null); }} style={{ padding: '0.45rem 0.8rem', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <RotateCcw style={{ width: '14px', height: '14px' }} /> Reset
          </button>
        </div>
      </div>

      {/* Symptom Selector */}
      <div style={{ backgroundColor: '#020617', padding: '1.25rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '0.75rem' }}>
          Patient Percept Vector (Working Memory Facts: {selected.length} Active):
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SYMPTOM_LIST.map((sym) => {
            const active = selected.includes(sym.id);
            return (
              <button
                key={sym.id}
                onClick={() => toggleSymptom(sym.id)}
                style={{
                  padding: '0.45rem 0.85rem', borderRadius: '24px',
                  border: active ? '1px solid #38bdf8' : '1px solid #1e293b',
                  backgroundColor: active ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
                  color: active ? '#38bdf8' : '#cbd5e1',
                  fontWeight: active ? '700' : '500',
                  cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.15s ease'
                }}
              >
                {active ? '✓ ' : '+ '}{sym.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FORWARD CHAINING VIEW */}
      {mode === 'forward' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp style={{ width: '16px', height: '16px', color: '#38bdf8' }} /> Diagnostic Probability Ranking
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Dynamic Rule Confidence</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {evaluation.map((rule) => {
              let barColor = '#4ade80';
              if (rule.confidence < 40) barColor = '#64748b';
              else if (rule.confidence < 100) barColor = '#f59e0b';

              return (
                <div
                  key={rule.id}
                  style={{
                    backgroundColor: '#020617', padding: '1rem 1.25rem', borderRadius: '8px',
                    border: rule.isConfirmed ? '1px solid #4ade80' : '1px solid #1e293b',
                    display: 'flex', flexDirection: 'column', gap: '0.6rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: rule.isConfirmed ? '#4ade80' : '#f8fafc' }}>
                        {rule.disease}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.75rem' }}>[{rule.severity}]</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 'bold', color: barColor }}>
                      {rule.confidence}% {rule.isConfirmed && '★ CONFIRMED'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${rule.confidence}%`, height: '100%', backgroundColor: barColor, transition: 'width 0.3s ease' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <span>Satisfied: <strong style={{ color: '#38bdf8' }}>{rule.satisfied.join(', ') || 'None'}</strong></span>
                    {rule.missing.length > 0 && (
                      <span>Missing Criteria: <strong style={{ color: '#f43f5e' }}>{rule.missing.join(', ')}</strong></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BACKWARD CHAINING VIEW */}
      {mode === 'backward' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select
              value={targetGoal}
              onChange={(e) => { setTargetGoal(e.target.value); setBackwardTrace(null); }}
              style={{ flex: 1, backgroundColor: '#020617', color: '#38bdf8', border: '1px solid #334155', padding: '0.65rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}
            >
              {KNOWLEDGE_BASE.map((k) => (
                <option key={k.id} value={k.disease}>{k.disease} (Target Goal)</option>
              ))}
            </select>

            <button
              onClick={handleBackwardRun}
              style={{ padding: '0.65rem 1.5rem', backgroundColor: '#38bdf8', color: '#020617', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
            >
              Deduce Goal
            </button>
          </div>

          {backwardTrace && (
            <div
              style={{
                backgroundColor: '#020617', padding: '1.5rem', borderRadius: '10px',
                border: backwardTrace.isConfirmed ? '1px solid #4ade80' : '1px solid #f59e0b',
                display: 'flex', flexDirection: 'column', gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {backwardTrace.isConfirmed ? <CheckCircle2 style={{ color: '#4ade80' }} /> : <AlertTriangle style={{ color: '#f59e0b' }} />}
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: backwardTrace.isConfirmed ? '#4ade80' : '#f59e0b' }}>
                  {backwardTrace.isConfirmed ? `Hypothesis Proven for ${backwardTrace.disease}` : `Hypothesis Inconclusive (${backwardTrace.confidence}% Evidence Satisfied)`}
                </h3>
              </div>

              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>{backwardTrace.desc}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>EVIDENCE PRESENT:</span>
                  <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{backwardTrace.satisfied.join(', ') || 'No matching criteria in memory'}</span>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>EVIDENCE REQUIRED (MISSING):</span>
                  <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{backwardTrace.missing.join(', ') || 'None (All criteria met)'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalExpertVisualizer;