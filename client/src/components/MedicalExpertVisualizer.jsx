import React, { useState, useEffect } from 'react';
import {
  Activity, Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert,
  Sparkles, TrendingUp, Plus, FileText, Heart, Thermometer, Stethoscope,
  ChevronRight, Brain, Info, Check, Search, Download, Printer, UserCheck
} from 'lucide-react';

const INITIAL_SYMPTOMS = [
  // Systemic
  { id: 'fever', label: 'High Fever (>101°F)', category: 'Systemic', icon: Thermometer },
  { id: 'chills', label: 'Severe Chills & Shivering', category: 'Systemic', icon: Activity },
  { id: 'sweating', label: 'Profuse Diaphoresis (Sweating)', category: 'Systemic', icon: Activity },
  { id: 'fatigue', label: 'Acute Systemic Fatigue', category: 'Systemic', icon: Activity },
  { id: 'weakness', label: 'Extreme Physical Weakness', category: 'Systemic', icon: Activity },

  // Respiratory
  { id: 'cough', label: 'Dry Persistent Cough', category: 'Respiratory', icon: Stethoscope },
  { id: 'loss_of_smell', label: 'Anosmia (Loss of Smell/Taste)', category: 'Respiratory', icon: Activity },
  { id: 'sneezing', label: 'Frequent Sneezing', category: 'Respiratory', icon: Activity },
  { id: 'runny_nose', label: 'Rhinorrhea (Runny Nose)', category: 'Respiratory', icon: Activity },
  { id: 'shortness_of_breath', label: 'Dyspnea (Shortness of Breath)', category: 'Respiratory', icon: Activity },

  // Gastrointestinal
  { id: 'abdominal_pain', label: 'Abdominal Cramps / Pain', category: 'Gastrointestinal', icon: Activity },
  { id: 'nausea', label: 'Nausea & Vomiting', category: 'Gastrointestinal', icon: Activity },

  // Neuro & Muscular
  { id: 'headache', label: 'Intense Retro-orbital Headache', category: 'Neuro & Muscular', icon: Activity },
  { id: 'joint_pain', label: 'Severe Joint & Muscle Ache (Breakbone)', category: 'Neuro & Muscular', icon: Activity },
  { id: 'rash', label: 'Petechial Skin Rash', category: 'Neuro & Muscular', icon: Activity },
];

const INITIAL_KNOWLEDGE_BASE = [
  {
    id: 'R1',
    disease: 'Malaria (Plasmodium Infection)',
    severity: 'Critical Triage',
    triage: 'Emergency',
    required: ['fever', 'chills', 'sweating'],
    desc: 'Cyclic pyrexia with rigors & diaphoresis caused by Plasmodium parasite.',
    tests: ['Peripheral Blood Smear (Malaria Antigen)', 'Complete Blood Count (Platelet count)', 'Rapid Diagnostic Test (RDT)'],
    precautions: ['Administer Artemisinin-based Combination Therapy (ACT)', 'Maintain strict oral rehydration', 'Monitor for hemolytic anemia'],
    icd: 'B54'
  },
  {
    id: 'R2',
    disease: 'Dengue Hemorrhagic Fever',
    severity: 'Severe Risk',
    triage: 'High Risk',
    required: ['fever', 'headache', 'rash', 'joint_pain'],
    desc: 'Flavivirus infection presenting retro-orbital pain, severe arthralgia, and risk of plasma leakage.',
    tests: ['Dengue NS1 Antigen ELISA', 'IgM / IgG Serology', 'Daily Hematocrit & Platelet Monitoring'],
    precautions: ['Intravenous fluid therapy (Normal Saline)', 'Avoid NSAIDs/Aspirin (Bleeding Risk)', 'Bed rest & hematocrit monitoring'],
    icd: 'A97.1'
  },
  {
    id: 'R3',
    disease: 'COVID-19 Severe Respiratory Syndrome',
    severity: 'High Infection',
    triage: 'High Risk',
    required: ['fever', 'cough', 'fatigue', 'loss_of_smell'],
    desc: 'SARS-CoV-2 viral pneumonia characterized by anosmia, cough, and systemic fatigue.',
    tests: ['RT-PCR Assay for SARS-CoV-2', 'HRCT Thorax (Lung involvement score)', 'D-Dimer & Inflammatory Markers (CRP, IL-6)'],
    precautions: ['Home isolation / Oxygen therapy if SpO2 < 94%', 'Proning position guidance', 'Monitor pulse oximetry Q4H'],
    icd: 'U07.1'
  },
  {
    id: 'R4',
    disease: 'Typhoid Enteric Fever',
    severity: 'Moderate-High',
    triage: 'Urgent Outpatient',
    required: ['fever', 'abdominal_pain', 'weakness'],
    desc: 'Salmonella Typhi bacterial infection causing step-ladder fever and gastrointestinal lesions.',
    tests: ['Blood Culture (Gold Standard)', 'Widal Reaction Test', 'Stool Culture'],
    precautions: ['Fluoroquinolone / Azithromycin antibiotic course', 'Boiled water & soft dietary intake', 'Monitor abdominal tenderness'],
    icd: 'A01.0'
  },
  {
    id: 'R5',
    disease: 'Acute Upper Respiratory Infection (Common Cold)',
    severity: 'Mild Self-Limiting',
    triage: 'Routine Care',
    required: ['sneezing', 'runny_nose'],
    desc: 'Rhinovirus / Adenovirus mucosal inflammation of upper respiratory tract.',
    tests: ['Clinical Examination', 'Symptomatic Evaluation'],
    precautions: ['Steam inhalation & saline nasal spray', 'Adequate fluid hydration & Vitamin C', 'Antihistamine for rhinorrhea'],
    icd: 'J00'
  },
  {
    id: 'R6',
    disease: 'Viral Exhaustion Syndrome',
    severity: 'Moderate',
    triage: 'Routine Care',
    required: ['fever', 'fatigue', 'weakness'],
    desc: 'Post-viral inflammatory immune response causing acute lethargy.',
    tests: ['Routine Hematology Profile', 'Serum Electrolytes'],
    precautions: ['Multivitamin supplementation', 'Adequate sleep (8+ hours)', 'Gradual physical pacing'],
    icd: 'R53.83'
  }
];

function MedicalExpertVisualizer() {
  const [knowledgeBase, setKnowledgeBase] = useState(INITIAL_KNOWLEDGE_BASE);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['fever', 'chills', 'sweating']);
  const [activeTab, setActiveTab] = useState('forward'); // 'forward' | 'backward' | 'vitals' | 'custom_rule' | 'ehr'
  const [symptomCategory, setSymptomCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Patient Vitals State
  const [patientVitals, setPatientVitals] = useState({
    name: 'Ansh Devkate (Sample Patient)',
    id: 'PAT-2026-894',
    age: 21,
    gender: 'Male',
    temp: 102.4, // °F
    hr: 108,     // bpm
    spO2: 97,    // %
    bp: '120/80'
  });

  // Custom Rule Form State
  const [newRule, setNewRule] = useState({
    disease: '',
    severity: 'Moderate',
    required: [],
    desc: ''
  });

  // Backward chaining target state
  const [targetGoal, setTargetGoal] = useState('Malaria (Plasmodium Infection)');
  const [backwardTrace, setBackwardTrace] = useState(null);

  // Auto-sync vitals with working memory
  useEffect(() => {
    let updated = [...selectedSymptoms];
    if (patientVitals.temp > 100.4 && !updated.includes('fever')) {
      updated.push('fever');
    }
    setSelectedSymptoms(updated);
  }, [patientVitals.temp]);

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setBackwardTrace(null);
  };

  // Preset Clinical Loaders
  const loadPreset = (presetName) => {
    if (presetName === 'malaria') {
      setSelectedSymptoms(['fever', 'chills', 'sweating']);
      setPatientVitals(v => ({ ...v, temp: 103.1, hr: 112 }));
    } else if (presetName === 'dengue') {
      setSelectedSymptoms(['fever', 'headache', 'rash', 'joint_pain']);
      setPatientVitals(v => ({ ...v, temp: 102.8, hr: 105 }));
    } else if (presetName === 'covid') {
      setSelectedSymptoms(['fever', 'cough', 'fatigue', 'loss_of_smell', 'shortness_of_breath']);
      setPatientVitals(v => ({ ...v, temp: 101.5, spO2: 93 }));
    } else if (presetName === 'typhoid') {
      setSelectedSymptoms(['fever', 'abdominal_pain', 'weakness']);
      setPatientVitals(v => ({ ...v, temp: 102.0, hr: 98 }));
    } else if (presetName === 'cold') {
      setSelectedSymptoms(['sneezing', 'runny_nose']);
      setPatientVitals(v => ({ ...v, temp: 98.6, hr: 75 }));
    }
  };

  // Inference Engine Engine Evaluation
  const evaluation = knowledgeBase.map((rule) => {
    const satisfied = rule.required.filter((s) => selectedSymptoms.includes(s));
    const missing = rule.required.filter((s) => !selectedSymptoms.includes(s));
    const confidence = Math.round((satisfied.length / rule.required.length) * 100);
    const isConfirmed = satisfied.length === rule.required.length;
    return { ...rule, satisfied, missing, confidence, isConfirmed };
  }).sort((a, b) => b.confidence - a.confidence);

  const topDiagnosis = evaluation.find(e => e.isConfirmed) || evaluation[0];

  // Handle Add Custom Rule
  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRule.disease || newRule.required.length === 0) return;
    const ruleObj = {
      id: `R${knowledgeBase.length + 1}`,
      disease: newRule.disease,
      severity: newRule.severity,
      triage: newRule.severity === 'Critical' ? 'Emergency' : 'Routine Care',
      required: newRule.required,
      desc: newRule.desc || 'Custom clinical production rule defined by domain expert.',
      tests: ['Clinical Evaluation', 'Custom Laboratory Profile'],
      precautions: ['Follow standard medical advice'],
      icd: 'R69'
    };
    setKnowledgeBase([...knowledgeBase, ruleObj]);
    setNewRule({ disease: '', severity: 'Moderate', required: [], desc: '' });
    setActiveTab('forward');
  };

  // Filtered Symptoms
  const filteredSymptoms = INITIAL_SYMPTOMS.filter(s => {
    const matchesCategory = symptomCategory === 'All' || s.category === symptomCategory;
    const matchesSearch = s.label.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-main)' }}>
      {/* WEB APP HEADER BANNER */}
      <div style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '1.5rem 1.75rem',
        borderRadius: '20px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 20px rgba(15,23,42,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
            <Brain style={{ width: '28px', height: '28px', color: '#ffffff' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>MediMind Clinical AI Suite</h2>
              <span style={{ backgroundColor: '#1e293b', color: '#38bdf8', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '800', border: '1px solid #334155' }}>v2.4 SPPU Pattern</span>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Rule-Based Forward/Backward Chaining Expert Diagnostic Engine</span>
          </div>
        </div>

        {/* Patient Vitals Quick Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', backgroundColor: '#1e293b', padding: '0.6rem 1rem', borderRadius: '14px', border: '1px solid #334155', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <Thermometer style={{ width: '15px', height: '15px', color: patientVitals.temp > 100.4 ? '#f43f5e' : '#10b981' }} />
            <span style={{ color: '#94a3b8' }}>Temp:</span>
            <strong style={{ color: patientVitals.temp > 100.4 ? '#f43f5e' : '#ffffff' }}>{patientVitals.temp}°F</strong>
          </div>
          <div style={{ width: '1px', backgroundColor: '#334155' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <Heart style={{ width: '15px', height: '15px', color: '#f59e0b' }} />
            <span style={{ color: '#94a3b8' }}>HR:</span>
            <strong style={{ color: '#ffffff' }}>{patientVitals.hr} bpm</strong>
          </div>
          <div style={{ width: '1px', backgroundColor: '#334155' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <Activity style={{ width: '15px', height: '15px', color: patientVitals.spO2 < 95 ? '#f43f5e' : '#10b981' }} />
            <span style={{ color: '#94a3b8' }}>SpO2:</span>
            <strong style={{ color: patientVitals.spO2 < 95 ? '#f43f5e' : '#ffffff' }}>{patientVitals.spO2}%</strong>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS WITHIN THE MINI APP */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', overflowX: 'auto' }}>
        {[
          { id: 'forward', label: '1. Forward Chaining Engine', icon: TrendingUp },
          { id: 'backward', label: '2. Goal Backward Deductor', icon: Brain },
          { id: 'vitals', label: '3. Patient Vitals & EHR Input', icon: Stethoscope },
          { id: 'custom_rule', label: '4. Knowledge Base Editor (+Add Rule)', icon: Plus },
          { id: 'ehr', label: '5. Clinical Diagnosis Report', icon: FileText }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: isActive ? '#0f172a' : '#f1f5f9',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.82rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon style={{ width: '14px', height: '14px' }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* QUICK PRESETS STRIP */}
      <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles style={{ width: '16px', height: '16px', color: '#2563eb' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>Load Clinical Outbreak Presets:</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'malaria', label: 'Plasmodium Malaria', color: '#ef4444' },
            { id: 'dengue', label: 'Dengue Hemorrhagic', color: '#f59e0b' },
            { id: 'covid', label: 'COVID-19 Severe', color: '#3b82f6' },
            { id: 'typhoid', label: 'Typhoid Fever', color: '#8b5cf6' },
            { id: 'cold', label: 'Common Cold', color: '#10b981' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => loadPreset(p.id)}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = p.color}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              {p.label}
            </button>
          ))}

          <button
            onClick={() => setSelectedSymptoms([])}
            style={{ padding: '0.35rem 0.8rem', borderRadius: '9999px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#64748b', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <RotateCcw style={{ width: '12px', height: '12px' }} /> Clear Facts
          </button>
        </div>
      </div>

      {/* CATEGORIZED SYMPTOM MATRIX (WORKING MEMORY INPUT) */}
      <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: '800' }}>
              Working Memory Facts ({selectedSymptoms.length} Active Symptoms):
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem' }}>Click chips to toggle patient percepts</span>
          </div>

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['All', 'Systemic', 'Respiratory', 'Gastrointestinal', 'Neuro & Muscular'].map(cat => (
              <button
                key={cat}
                onClick={() => setSymptomCategory(cat)}
                style={{
                  padding: '0.25rem 0.65rem', borderRadius: '6px', border: 'none',
                  backgroundColor: symptomCategory === cat ? '#0f172a' : '#f1f5f9',
                  color: symptomCategory === cat ? '#ffffff' : '#64748b',
                  fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Symptom Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxHeight: '180px', overflowY: 'auto', padding: '0.2rem' }}>
          {filteredSymptoms.map((sym) => {
            const active = selectedSymptoms.includes(sym.id);
            return (
              <button
                key={sym.id}
                onClick={() => toggleSymptom(sym.id)}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: '9999px',
                  border: active ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: active ? '#eff6ff' : '#f8fafc',
                  color: active ? '#1d4ed8' : '#475569',
                  fontWeight: active ? '800' : '500',
                  cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s ease',
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  boxShadow: active ? '0 2px 6px rgba(37,99,235,0.12)' : 'none'
                }}
              >
                {active ? <CheckCircle2 style={{ width: '13px', height: '13px', color: '#2563eb' }} /> : '+ '}
                <span>{sym.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: FORWARD CHAINING VIEW */}
      {activeTab === 'forward' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Confirmed Diagnostic Banner */}
          {topDiagnosis && topDiagnosis.isConfirmed ? (
            <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', padding: '1.25rem 1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 style={{ width: '32px', height: '32px', color: '#16a34a' }} />
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>★ FORWARD CHAINING INFERENCE CONFIRMED</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#14532d', margin: 0 }}>{topDiagnosis.disease}</h3>
                  <span style={{ fontSize: '0.82rem', color: '#166534' }}>{topDiagnosis.desc}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('ehr')}
                style={{ padding: '0.65rem 1.25rem', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: '9999px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 8px rgba(21,128,61,0.2)' }}
              >
                <span>Generate EHR Prescription</span>
                <ChevronRight style={{ width: '15px', height: '15px' }} />
              </button>
            </div>
          ) : (
            <div style={{ backgroundColor: '#eff6ff', border: '1.5px solid #bfdbfe', padding: '1rem 1.25rem', borderRadius: '14px', fontSize: '0.88rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>Select symptoms above to trigger matching production rules in Working Memory. Rules fire when 100% of required premises match.</span>
            </div>
          )}

          {/* Diagnostic Probability Ranking Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp style={{ width: '16px', height: '16px', color: '#2563eb' }} /> Live Rule Knowledge Base Matching ({knowledgeBase.length} Production Rules)
            </h4>

            {evaluation.map((rule) => {
              let barColor = '#10b981';
              if (rule.confidence < 40) barColor = '#cbd5e1';
              else if (rule.confidence < 100) barColor = '#f59e0b';

              return (
                <div
                  key={rule.id}
                  style={{
                    backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px',
                    border: rule.isConfirmed ? '2px solid #10b981' : '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column', gap: '0.65rem',
                    boxShadow: rule.isConfirmed ? '0 4px 16px rgba(16,185,129,0.12)' : '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ backgroundColor: '#0f172a', color: '#fff', fontSize: '0.72rem', fontWeight: '800', padding: '0.15rem 0.55rem', borderRadius: '6px' }}>{rule.id}</span>
                      <strong style={{ fontSize: '1.05rem', color: rule.isConfirmed ? '#10b981' : '#0f172a' }}>{rule.disease}</strong>
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.55rem', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '700' }}>{rule.triage}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: '900', color: barColor }}>
                        {rule.confidence}% Match
                      </span>
                      {rule.isConfirmed && (
                        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: '800', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                          ✓ RULE FIRED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${rule.confidence}%`, height: '100%', backgroundColor: barColor, transition: 'width 0.3s ease', borderRadius: '4px' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>Satisfied Premises: <strong style={{ color: '#2563eb' }}>{rule.satisfied.join(', ') || 'None'}</strong></span>
                    {rule.missing.length > 0 ? (
                      <span>Missing Premises: <strong style={{ color: '#f43f5e' }}>{rule.missing.join(', ')}</strong></span>
                    ) : (
                      <span style={{ color: '#10b981', fontWeight: '700' }}>All IF premises satisfied in Working Memory!</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BACKWARD CHAINING VIEW */}
      {activeTab === 'backward' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: '800' }}>
              Goal-Driven Backward Chaining Hypothesis Validation
            </h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
              Select a target disease hypothesis below. The inference engine works backward from the conclusion to check if required clinical evidence is present in Working Memory.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <select
                value={targetGoal}
                onChange={(e) => { setTargetGoal(e.target.value); setBackwardTrace(null); }}
                style={{ flex: 1, minWidth: '280px', backgroundColor: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', padding: '0.7rem 1rem', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem' }}
              >
                {knowledgeBase.map((k) => (
                  <option key={k.id} value={k.disease}>{k.id}: {k.disease} (Target Goal)</option>
                ))}
              </select>

              <button
                onClick={() => setBackwardTrace(evaluation.find(r => r.disease === targetGoal))}
                style={{ padding: '0.7rem 1.75rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '9999px', fontWeight: '800', cursor: 'pointer', fontSize: '0.88rem' }}
              >
                Execute Goal Deduction
              </button>
            </div>
          </div>

          {backwardTrace && (
            <div
              style={{
                backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '16px',
                border: backwardTrace.isConfirmed ? '2px solid #10b981' : '2px solid #f59e0b',
                display: 'flex', flexDirection: 'column', gap: '1rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {backwardTrace.isConfirmed ? <CheckCircle2 style={{ color: '#10b981', width: '24px', height: '24px' }} /> : <AlertTriangle style={{ color: '#f59e0b', width: '24px', height: '24px' }} />}
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: backwardTrace.isConfirmed ? '#10b981' : '#d97706' }}>
                  {backwardTrace.isConfirmed ? `Hypothesis Proven: ${backwardTrace.disease}` : `Hypothesis Inconclusive (${backwardTrace.confidence}% Evidence Satified)`}
                </h3>
              </div>

              <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>{backwardTrace.desc}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: '800', display: 'block', marginBottom: '0.35rem' }}>EVIDENCE PRESENT IN MEMORY:</span>
                  <span style={{ fontSize: '0.9rem', color: '#14532d', fontWeight: '600' }}>{backwardTrace.satisfied.join(', ') || 'None matched'}</span>
                </div>
                <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
                  <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: '800', display: 'block', marginBottom: '0.35rem' }}>MISSING REQUIRED EVIDENCE:</span>
                  <span style={{ fontSize: '0.9rem', color: '#7f1d1d', fontWeight: '600' }}>{backwardTrace.missing.join(', ') || 'None (All premises satisfied)'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PATIENT VITALS & EHR INPUT */}
      {activeTab === 'vitals' && (
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope style={{ width: '20px', height: '20px', color: '#2563eb' }} /> Patient Clinical Demographics & Vitals Entry
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>Patient Name</label>
              <input
                type="text" value={patientVitals.name}
                onChange={(e) => setPatientVitals({ ...patientVitals, name: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '600', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>Age / Gender</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number" value={patientVitals.age}
                  onChange={(e) => setPatientVitals({ ...patientVitals, age: Number(e.target.value) })}
                  style={{ width: '50%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '600', fontSize: '0.9rem' }}
                />
                <select
                  value={patientVitals.gender}
                  onChange={(e) => setPatientVitals({ ...patientVitals, gender: e.target.value })}
                  style={{ width: '50%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '600', fontSize: '0.9rem' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>Temperature (°F)</label>
              <input
                type="number" step="0.1" value={patientVitals.temp}
                onChange={(e) => setPatientVitals({ ...patientVitals, temp: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '700', fontSize: '0.9rem', color: patientVitals.temp > 100.4 ? '#f43f5e' : '#0f172a' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>Heart Rate (BPM)</label>
              <input
                type="number" value={patientVitals.hr}
                onChange={(e) => setPatientVitals({ ...patientVitals, hr: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '700', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>Oxygen Saturation SpO2 (%)</label>
              <input
                type="number" value={patientVitals.spO2}
                onChange={(e) => setPatientVitals({ ...patientVitals, spO2: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '700', fontSize: '0.9rem', color: patientVitals.spO2 < 95 ? '#f43f5e' : '#0f172a' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KNOWLEDGE BASE EDITOR (ADD CUSTOM RULE LIVE) */}
      {activeTab === 'custom_rule' && (
        <form onSubmit={handleAddRule} style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.3rem 0' }}>Add Custom Production Rule to Knowledge Base</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Demonstrate knowledge base extensibility live during your viva presentation.</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>Disease Conclusion Name</label>
              <input
                type="text" required placeholder="e.g. Acute Viral Bronchitis"
                value={newRule.disease}
                onChange={(e) => setNewRule({ ...newRule, disease: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '600' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>Triage Urgency Level</label>
              <select
                value={newRule.severity}
                onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '600' }}
              >
                <option value="Mild">Mild Self-Limiting</option>
                <option value="Moderate">Moderate Outpatient</option>
                <option value="Severe">Severe Risk</option>
                <option value="Critical">Critical Triage</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Select Required IF Premises (Symptoms):</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxHeight: '140px', overflowY: 'auto' }}>
              {INITIAL_SYMPTOMS.map(s => {
                const isSelected = newRule.required.includes(s.id);
                return (
                  <button
                    type="button" key={s.id}
                    onClick={() => {
                      const req = isSelected ? newRule.required.filter(x => x !== s.id) : [...newRule.required, s.id];
                      setNewRule({ ...newRule, required: req });
                    }}
                    style={{
                      padding: '0.35rem 0.75rem', borderRadius: '9999px',
                      border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      color: isSelected ? '#2563eb' : '#475569',
                      fontWeight: isSelected ? '800' : '500', fontSize: '0.78rem', cursor: 'pointer'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '9999px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
            + Append Rule to Knowledge Base
          </button>
        </form>
      )}

      {/* TAB 5: EHR CLINICAL ASSESSMENT REPORT */}
      {activeTab === 'ehr' && topDiagnosis && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px' }}>SPPU AI LAB // CLINICAL EHR SUMMARY REPORT</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', margin: '0.2rem 0 0 0' }}>Patient Diagnostic EHR Record</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Report ID: {patientVitals.id}</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Date: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Patient Details Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div><span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Patient Name:</span><strong style={{ color: '#0f172a' }}>{patientVitals.name}</strong></div>
            <div><span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Age / Gender:</span><strong style={{ color: '#0f172a' }}>{patientVitals.age} yrs / {patientVitals.gender}</strong></div>
            <div><span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Temp / HR:</span><strong style={{ color: '#0f172a' }}>{patientVitals.temp}°F / {patientVitals.hr} bpm</strong></div>
            <div><span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>SpO2 Level:</span><strong style={{ color: '#0f172a' }}>{patientVitals.spO2}%</strong></div>
          </div>

          {/* Diagnosis & Confidence Box */}
          <div style={{ backgroundColor: topDiagnosis.isConfirmed ? '#f0fdf4' : '#fffbeb', padding: '1.5rem', borderRadius: '16px', border: topDiagnosis.isConfirmed ? '2px solid #22c55e' : '2px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: topDiagnosis.isConfirmed ? '#15803d' : '#b45309', textTransform: 'uppercase' }}>
                {topDiagnosis.isConfirmed ? '★ PRIMARY CONFIRMED DIAGNOSIS' : 'PROVISIONAL DIFFERENTIAL DIAGNOSIS'}
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', margin: '0.2rem 0' }}>{topDiagnosis.disease}</h3>
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>ICD-10 Code: <strong>{topDiagnosis.icd}</strong> | Severity: <strong>{topDiagnosis.severity}</strong></span>
            </div>
            <div style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', fontWeight: '700' }}>CONFIDENCE SCORE</span>
              <span style={{ fontSize: '1.8rem', fontWeight: '900', color: topDiagnosis.isConfirmed ? '#16a34a' : '#d97706' }}>{topDiagnosis.confidence}%</span>
            </div>
          </div>

          {/* Recommended Tests & Protocols */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.75rem 0' }}>Suggested Diagnostic Investigations:</h4>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: '1.7' }}>
                {topDiagnosis.tests?.map((t, idx) => <li key={idx}><strong>{t}</strong></li>) || <li>Routine Complete Blood Count</li>}
              </ul>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.75rem 0' }}>Clinical Precautions & Management:</h4>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: '1.7' }}>
                {topDiagnosis.precautions?.map((p, idx) => <li key={idx}>{p}</li>) || <li>Rest & symptomatic care</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalExpertVisualizer;