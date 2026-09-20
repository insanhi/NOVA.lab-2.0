import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Play, BookOpen, Code2, HelpCircle, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';

import VacuumVisualizer from '../components/VacuumVisualizer';
import HanoiVisualizer from '../components/HanoiVisualizer';
import BFSVisualizer from '../components/BFSVisualizer';
import EightPuzzleVisualizer from '../components/EightPuzzleVisualizer';
import MedicalExpertVisualizer from '../components/MedicalExpertVisualizer';

function AssignmentDetail() {
  const { slug } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState('simulate');
  const [codeLang, setCodeLang] = useState('python');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/assignments/${slug}`)
      .then((res) => {
        setAssignment(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const copyCode = () => {
    navigator.clipboard.writeText(assignment.code[codeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div style={{ padding: '6rem', textAlign: 'center', fontSize: '1.2rem', color: '#5f6368' }}>Launching experiment workbench...</div>;
  }

  if (!assignment) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Module not found. <Link to="/">Return to Labs</Link></div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Breadcrumb Header */}
      <div>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#5f6368', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> All Experiments
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              SPPU 2024 // {assignment.category}
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', color: '#121316', margin: '0.3rem 0 0 0' }}>
              {assignment.title}
            </h1>
          </div>
          <span style={{ padding: '0.4rem 1rem', borderRadius: '9999px', backgroundColor: '#121316', color: '#fff', fontSize: '0.85rem', fontWeight: '700' }}>
            {assignment.difficulty}
          </span>
        </div>
      </div>

      {/* Pill Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1rem' }}>
        {[
          { id: 'simulate', label: 'Interactive Sandbox' },
          { id: 'manual', label: 'Theory & Academic Manual' },
          { id: 'code', label: 'Dual Source Code' },
          { id: 'quiz', label: `Viva Assessment (${assignment.quiz.length} Questions)` }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: '9999px',
                border: isActive ? 'none' : '1px solid rgba(0,0,0,0.1)',
                backgroundColor: isActive ? '#121316' : '#ffffff',
                color: isActive ? '#ffffff' : '#5f6368',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.9rem',
                boxShadow: isActive ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SIMULATION SANDBOX */}
      {activeTab === 'simulate' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
          {assignment.visualizationType === 'vacuum' && <VacuumVisualizer />}
          {assignment.visualizationType === 'hanoi' && <HanoiVisualizer />}
          {assignment.visualizationType === 'bfs' && <BFSVisualizer />}
          {assignment.visualizationType === 'eight-puzzle' && <EightPuzzleVisualizer />}
          {assignment.visualizationType === 'expert-system' && <MedicalExpertVisualizer />}
        </div>
      )}

      {/* TAB 2: MANUAL */}
      {activeTab === 'manual' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#121316', marginBottom: '0.5rem' }}>Aim of Experiment</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#4a4d57', lineHeight: '1.7' }}>{assignment.manual.aim}</p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#121316', marginBottom: '0.5rem' }}>Key Objectives</h3>
            <ul style={{ paddingLeft: '1.25rem', color: '#4a4d57', lineHeight: '1.8' }}>
              {assignment.manual.objectives.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#121316', marginBottom: '0.5rem' }}>Formal Theory & Intuition</h3>
            <div style={{ whiteSpace: 'pre-line', color: '#4a4d57', lineHeight: '1.8', fontSize: '0.98rem' }}>
              {assignment.manual.theory}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOURCE CODE */}
      {activeTab === 'code' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['python', 'java'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCodeLang(lang)}
                  style={{
                    padding: '0.45rem 1rem', borderRadius: '9999px',
                    border: 'none', cursor: 'pointer',
                    backgroundColor: codeLang === lang ? '#121316' : '#f1f3f4',
                    color: codeLang === lang ? '#ffffff' : '#5f6368',
                    fontWeight: '700', fontSize: '0.85rem'
                  }}
                >
                  {lang === 'python' ? 'Python 3' : 'Java Standard'}
                </button>
              ))}
            </div>

            <button onClick={copyCode} style={{ padding: '0.45rem 1rem', borderRadius: '9999px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '600' }}>
              {copied ? <Check style={{ width: '14px', height: '14px', color: '#34a853' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>

          <pre style={{ backgroundColor: '#0f1015', color: '#f8fafc', padding: '1.5rem', borderRadius: '16px', overflowX: 'auto', fontFamily: 'var(--font-code)', fontSize: '0.9rem', lineHeight: '1.7' }}>
            <code>{assignment.code[codeLang]}</code>
          </pre>
        </div>
      )}

      {/* TAB 4: QUIZ */}
      {activeTab === 'quiz' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {assignment.quiz.map((q, qIdx) => {
            const answered = selectedAnswers[qIdx] !== undefined;
            const chosen = selectedAnswers[qIdx];
            const isCorrect = chosen === q.correctIndex;

            return (
              <div key={qIdx} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.08)' }}>
                <p style={{ fontSize: '1.05rem', fontWeight: '800', color: '#121316', marginBottom: '1rem' }}>
                  {qIdx + 1}. {q.question}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {q.options.map((opt, oIdx) => {
                    let bg = '#f8f9fa';
                    let text = '#121316';
                    let border = '1px solid rgba(0,0,0,0.06)';

                    if (answered) {
                      if (oIdx === q.correctIndex) {
                        bg = '#dcfce7'; text = '#15803d'; border = '1px solid #86efac';
                      } else if (chosen === oIdx) {
                        bg = '#fee2e2'; text = '#b91c1c'; border = '1px solid #fca5a5';
                      }
                    }

                    return (
                      <div
                        key={oIdx}
                        onClick={() => {
                          if (!answered) setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx });
                        }}
                        style={{ padding: '0.85rem 1.25rem', borderRadius: '12px', backgroundColor: bg, color: text, border: border, cursor: answered ? 'default' : 'pointer', fontWeight: '500', fontSize: '0.92rem' }}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {answered && (
                  <div style={{ marginTop: '1rem', padding: '0.9rem 1.2rem', borderRadius: '10px', backgroundColor: '#f1f3f4', fontSize: '0.88rem', color: '#374151' }}>
                    <strong style={{ display: 'block', color: '#121316', marginBottom: '0.2rem' }}>Viva Explanation:</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AssignmentDetail;