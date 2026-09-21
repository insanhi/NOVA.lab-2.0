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
  { id: 'R1', disease: 'Malaria', severity: 'Critical', required: ['fever', 'chills', 'sweating'], desc: 'Plasmodium infection profile: Cyclic rigors with diaphoresis.' },
  { id: 'R2', disease: 'Dengue Hemorrhagic Fever', severity: 'Severe', required: ['fever', 'headache', 'rash', 'joint_pain'], desc: 'Breakbone viral profile: Retro-orbital headache and thrombocytopenia risk.' },
  { id: 'R3', disease: 'COVID-19 Syndrome', severity: 'High', required: ['fever', 'cough', 'fatigue', 'loss_of_smell'], desc: 'Respiratory coronavirus profile: Anosmia with pulmonary inflammation.' },
  { id: 'R4', disease: 'Typhoid Enteric Fever', severity: 'Moderate to High', required: ['fever', 'abdominal_pain', 'weakness'], desc: 'Salmonella typhi profile: Step-ladder pyrexia and gastrointestinal distress.' },
  { id: 'R5', disease: 'Acute Upper Respiratory Infection (Common Cold)', severity: 'Mild', required: ['sneezing', 'runny_nose'], desc: 'Rhinovirus profile: Upper airway mucosal irritation.' },
  { id: 'R6', disease: 'Viral Exhaustion Syndrome', severity: 'Mild to Moderate', required: ['fever', 'fatigue', 'weakness'], desc: 'Systemic post-viral fatigue state.' }
];

function MedicalExpertVisualizer() {
  const [selected, setSelected] = useState([]);
  const [targetGoal, setTargetGoal] = useState('Dengue Hemorrhagic Fever');
  const [mode, setMode] = useState('forward');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setMode('forward')}
            style={{
              padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none',
              backgroundColor: mode === 'forward' ? '#0f172a' : '#ffffff',
              color: mode === 'forward' ? '#ffffff' : '#64748b',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem',
              boxShadow: mode === 'forward' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              border: mode === 'forward' ? 'none' : '1px solid #e2e8f0'
            }}
          >
            Forward Chaining
          </button>
          <button
            onClick={() => setMode('backward')}
            style={{
              padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none',
              backgroundColor: mode === 'backward' ? '#0f172a' : '#ffffff',
              color: mode === 'backward' ? '#ffffff' : '#64748b',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem',
              boxShadow: mode === 'backward' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              border: mode === 'backward' ? 'none' : '1px solid #e2e8f0'
            }}
          >
            Backward Chaining
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={selectAllFlu} style={{ padding: '0.5rem 0.85rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#2563eb', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
            Preset: Systemic Fever
          </button>
          <button onClick={() => { setSelected([]); setBackwardTrace(null); }} style={{ padding: '0.5rem 0.85rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
            <RotateCcw style={{ width: '13px', height: '13px' }} /> Reset
          </button>
        </div>
      </div>

      {/* Symptom Selector */}
      <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '0.75rem' }}>
          Patient Symptom Vector (Working Memory: {selected.length} Active Facts):
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SYMPTOM_LIST.map((sym) => {
            const active = selected.includes(sym.id);
            return (
              <button
                key={sym.id}
                onClick={() => toggleSymptom(sym.id)}
                style={{
                  padding: '0.45rem 0.85rem', borderRadius: '9999px',
                  border: active ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: active ? 'rgba(37, 99, 235, 0.08)' : '#ffffff',
                  color: active ? '#2563eb' : '#475569',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp style={{ width: '16px', height: '16px', color: '#2563eb' }} /> Diagnostic Probability Ranking
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Dynamic Rule Confidence</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {evaluation.map((rule) => {
              let barColor = '#10b981';
              if (rule.confidence < 40) barColor = '#cbd5e1';
              else if (rule.confidence < 100) barColor = '#f59e0b';

              return (
                <div
                  key={rule.id}
                  style={{
                    backgroundColor: '#ffffff', padding: '1rem 1.25rem', borderRadius: '14px',
                    border: rule.isConfirmed ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    boxShadow: rule.isConfirmed ? '0 2px 12px rgba(16,185,129,0.1)' : '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: rule.isConfirmed ? '#10b981' : '#0f172a' }}>
                        {rule.disease}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.75rem' }}>[{rule.severity}]</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 'bold', color: barColor }}>
                      {rule.confidence}% {rule.isConfirmed && '★ CONFIRMED'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '5px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${rule.confidence}%`, height: '100%', backgroundColor: barColor, transition: 'width 0.3s ease', borderRadius: '4px' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                    <span>Satisfied: <strong style={{ color: '#2563eb' }}>{rule.satisfied.join(', ') || 'None'}</strong></span>
                    {rule.missing.length > 0 && (
                      <span>Missing: <strong style={{ color: '#f43f5e' }}>{rule.missing.join(', ')}</strong></span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select
              value={targetGoal}
              onChange={(e) => { setTargetGoal(e.target.value); setBackwardTrace(null); }}
              style={{ flex: 1, backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '0.65rem 1rem', borderRadius: '12px', fontWeight: '600', fontSize: '0.9rem', fontFamily: 'var(--font-main)' }}
            >
              {KNOWLEDGE_BASE.map((k) => (
                <option key={k.id} value={k.disease}>{k.disease} (Target Goal)</option>
              ))}
            </select>

            <button
              onClick={handleBackwardRun}
              style={{ padding: '0.65rem 1.5rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem' }}
            >
              Deduce Goal
            </button>
          </div>

          {backwardTrace && (
            <div
              style={{
                backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px',
                border: backwardTrace.isConfirmed ? '1.5px solid #10b981' : '1.5px solid #f59e0b',
                display: 'flex', flexDirection: 'column', gap: '0.85rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {backwardTrace.isConfirmed ? <CheckCircle2 style={{ color: '#10b981', width: '20px', height: '20px' }} /> : <AlertTriangle style={{ color: '#f59e0b', width: '20px', height: '20px' }} />}
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: backwardTrace.isConfirmed ? '#10b981' : '#f59e0b' }}>
                  {backwardTrace.isConfirmed ? `Hypothesis Proven: ${backwardTrace.disease}` : `Inconclusive (${backwardTrace.confidence}% Evidence)`}
                </h3>
              </div>

              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>{backwardTrace.desc}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#f0fdf4', padding: '0.85rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700', display: 'block', marginBottom: '0.25rem' }}>EVIDENCE PRESENT:</span>
                  <span style={{ fontSize: '0.85rem', color: '#0f172a' }}>{backwardTrace.satisfied.join(', ') || 'No matching criteria'}</span>
                </div>
                <div style={{ backgroundColor: '#fef2f2', padding: '0.85rem', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  <span style={{ fontSize: '0.72rem', color: '#f43f5e', fontWeight: '700', display: 'block', marginBottom: '0.25rem' }}>EVIDENCE REQUIRED (MISSING):</span>
                  <span style={{ fontSize: '0.85rem', color: '#0f172a' }}>{backwardTrace.missing.join(', ') || 'None (All criteria met)'}</span>
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