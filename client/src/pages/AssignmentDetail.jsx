import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Play, BookOpen, Code2, HelpCircle, CheckCircle2, XCircle, Copy, Check, Sparkles, Lightbulb, FileText, Bookmark } from 'lucide-react';

import VacuumVisualizer from '../components/VacuumVisualizer';
import HanoiVisualizer from '../components/HanoiVisualizer';
import BFSVisualizer from '../components/BFSVisualizer';
import EightPuzzleVisualizer from '../components/EightPuzzleVisualizer';
import MedicalExpertVisualizer from '../components/MedicalExpertVisualizer';
import AlphaBetaVisualizer from '../components/AlphaBetaVisualizer';
import BFSRobotVisualizer from '../components/BFSRobotVisualizer';
import WaterJugVisualizer from '../components/WaterJugVisualizer';
import EightQueensVisualizer from '../components/EightQueensVisualizer';
import ChatbotVisualizer from '../components/ChatbotVisualizer';

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
    if (!assignment?.code?.[codeLang]) return;
    navigator.clipboard.writeText(assignment.code[codeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div style={{ padding: '6rem', textAlign: 'center', fontSize: '1.1rem', color: '#64748b' }}>Launching experiment workbench...</div>;
  }

  if (!assignment) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Module not found. <Link to="/" style={{ color: '#2563eb', fontWeight: '600' }}>Return to Labs</Link></div>;
  }

  const isPartC = assignment.slug === 'medical-expert-system';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Breadcrumb Header */}
      <div>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> All Experiments
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                SPPU 2024 // {assignment.category}
              </span>
              {isPartC && (
                <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.65rem', borderRadius: '9999px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '800', border: '1px solid #fcd34d' }}>
                  ★ Part C Mini-Project Capstone
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', color: '#0f172a', margin: '0.4rem 0 0 0' }}>
              {assignment.title}
            </h1>
          </div>
          <span style={{ padding: '0.4rem 1.1rem', borderRadius: '9999px', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.85rem', fontWeight: '700' }}>
            {assignment.difficulty}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { id: 'simulate', label: isPartC ? '⚡ MediMind Clinical AI Suite' : 'Interactive Sandbox', icon: Play },
          { id: 'manual', label: 'Academic Theory & Manual', icon: BookOpen },
          { id: 'code', label: 'Dual Source Code (Python/Java)', icon: Code2 },
          { id: 'quiz', label: `Viva Assessment (${assignment.quiz?.length || 0} Questions)`, icon: HelpCircle }
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
                gap: '0.5rem',
                padding: '0.65rem 1.3rem',
                borderRadius: '9999px',
                border: isActive ? 'none' : '1px solid #e5e7eb',
                backgroundColor: isActive ? '#0f172a' : '#ffffff',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.88rem',
                boxShadow: isActive ? '0 2px 10px rgba(15,23,42,0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon style={{ width: '15px', height: '15px' }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SIMULATION */}
      {activeTab === 'simulate' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '1.75rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          {assignment.visualizationType === 'vacuum' && <VacuumVisualizer />}
          {assignment.visualizationType === 'hanoi' && <HanoiVisualizer />}
          {assignment.visualizationType === 'bfs' && <BFSVisualizer />}
          {assignment.visualizationType === 'eight-puzzle' && <EightPuzzleVisualizer />}
          {assignment.visualizationType === 'expert-system' && <MedicalExpertVisualizer />}
          {assignment.visualizationType === 'alpha-beta' && <AlphaBetaVisualizer />}
          {assignment.visualizationType === 'bfs-robot' && <BFSRobotVisualizer />}
          {assignment.visualizationType === 'dfs-waterjug' && <WaterJugVisualizer />}
          {assignment.visualizationType === 'eight-queens' && <EightQueensVisualizer />}
          {assignment.visualizationType === 'chatbot' && <ChatbotVisualizer />}
        </div>
      )}

      {/* TAB 2: MANUAL & THEORY */}
      {activeTab === 'manual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Aim & Objectives Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2.25rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Bookmark style={{ width: '18px', height: '18px', color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Aim of Experiment</h3>
              </div>
              <p style={{ margin: 0, fontSize: '1.02rem', color: '#334155', lineHeight: '1.7', backgroundColor: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '500' }}>
                {assignment.manual.aim}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: '#10b981' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Key Objectives (SPPU 2024 Pattern)</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                {assignment.manual.objectives.map((o, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0, marginTop: '2px' }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.6', fontWeight: '500' }}>{o}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Theoretical Foundations & Deep Dive */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
              <Sparkles style={{ width: '22px', height: '22px', color: '#2563eb' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Formal Theory, Mathematical Foundations & Analysis
              </h2>
            </div>

            {/* Markdown Rendered Theory */}
            <div className="markdown-theory-container" style={{ fontSize: '1rem', lineHeight: '1.8', color: '#334155' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginTop: '2rem', marginBottom: '0.8rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>{children}</h2>,
                  h2: ({ children }) => <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginTop: '1.75rem', marginBottom: '0.75rem' }}>{children}</h3>,
                  h3: ({ children }) => <h4 style={{ fontSize: '1.12rem', fontWeight: '800', color: '#2563eb', marginTop: '1.5rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>🔹 {children}</h4>,
                  h4: ({ children }) => <h5 style={{ fontSize: '1.02rem', fontWeight: '700', color: '#0f172a', marginTop: '1.25rem', marginBottom: '0.5rem' }}>{children}</h5>,
                  p: ({ children }) => <p style={{ marginBottom: '1.1rem', color: '#334155', lineHeight: '1.75' }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ color: '#0f172a', fontWeight: '700' }}>{children}</strong>,
                  em: ({ children }) => <em style={{ color: '#2563eb', fontStyle: 'italic' }}>{children}</em>,
                  ul: ({ children }) => <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ paddingLeft: '1.4rem', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>{children}</ol>,
                  li: ({ children }) => <li style={{ marginBottom: '0.35rem', color: '#334155' }}>{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote style={{ borderLeft: '4px solid #2563eb', backgroundColor: '#f0f9ff', padding: '1rem 1.25rem', margin: '1.25rem 0', borderRadius: '0 12px 12px 0', color: '#1e40af', fontWeight: '500' }}>
                      {children}
                    </blockquote>
                  ),
                  code: ({ inline, children }) => inline ? (
                    <code style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.45rem', borderRadius: '6px', fontSize: '0.88em', fontFamily: 'var(--font-mono)', color: '#0f172a', border: '1px solid #e2e8f0', fontWeight: '600' }}>
                      {children}
                    </code>
                  ) : (
                    <pre style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '1.25rem', borderRadius: '12px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', margin: '1.25rem 0' }}>
                      <code>{children}</code>
                    </pre>
                  ),
                  table: ({ children }) => (
                    <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>{children}</table>
                    </div>
                  ),
                  th: ({ children }) => <th style={{ backgroundColor: '#f1f5f9', color: '#0f172a', padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '700', borderBottom: '2px solid #e2e8f0' }}>{children}</th>,
                  td: ({ children }) => <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#334155' }}>{children}</td>
                }}
              >
                {assignment.manual.theory}
              </ReactMarkdown>
            </div>
          </div>

          {/* Algorithm & Complexity Breakdown Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {/* Algorithm Steps */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText style={{ width: '18px', height: '18px', color: '#2563eb' }} /> Step-by-Step Execution Algorithm
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {assignment.manual.algorithm.map((step, idx) => (
                  <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1.1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#334155', fontFamily: 'var(--font-mono)', lineHeight: '1.6' }}>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Complexity Analysis */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lightbulb style={{ width: '18px', height: '18px', color: '#f59e0b' }} /> Computational Complexity Profile
              </h3>

              <div style={{ backgroundColor: '#eff6ff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>
                  TIME COMPLEXITY T(N):
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e3a8a', lineHeight: '1.6' }}>
                  {assignment.manual.complexity.time}
                </span>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>
                  SPACE COMPLEXITY S(N):
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#14532d', lineHeight: '1.6' }}>
                  {assignment.manual.complexity.space}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOURCE CODE */}
      {activeTab === 'code' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['python', 'java'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCodeLang(lang)}
                  style={{
                    padding: '0.55rem 1.2rem', borderRadius: '9999px',
                    border: 'none', cursor: 'pointer',
                    backgroundColor: codeLang === lang ? '#0f172a' : '#f1f5f9',
                    color: codeLang === lang ? '#ffffff' : '#64748b',
                    fontWeight: '700', fontSize: '0.85rem'
                  }}
                >
                  {lang === 'python' ? 'Python 3' : 'Java Standard'}
                </button>
              ))}
            </div>

            <button onClick={copyCode} style={{ padding: '0.55rem 1.1rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>
              {copied ? <Check style={{ width: '14px', height: '14px', color: '#10b981' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
              {copied ? 'Copied to Clipboard' : 'Copy Code'}
            </button>
          </div>

          <pre style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '1.75rem', borderRadius: '16px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', lineHeight: '1.7' }}>
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
              <div key={qIdx} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.75rem', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
                  {qIdx + 1}. {q.question}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {q.options.map((opt, oIdx) => {
                    let bg = '#f8fafc';
                    let text = '#0f172a';
                    let border = '1px solid #e5e7eb';

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
                        style={{ padding: '0.85rem 1.25rem', borderRadius: '12px', backgroundColor: bg, color: text, border: border, cursor: answered ? 'default' : 'pointer', fontWeight: '500', fontSize: '0.92rem', transition: 'all 0.15s ease' }}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {answered && (
                  <div style={{ marginTop: '1rem', padding: '0.9rem 1.2rem', borderRadius: '10px', backgroundColor: '#f1f5f9', fontSize: '0.88rem', color: '#334155' }}>
                    <strong style={{ display: 'block', color: '#0f172a', marginBottom: '0.2rem' }}>Viva Explanation:</strong>
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