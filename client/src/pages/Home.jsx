import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, FlaskConical, Cpu } from 'lucide-react';
import { API_URL } from '../config';

const FALLBACK_ASSIGNMENTS = [
  { title: "Reflex Agent for Vacuum Cleaner World", slug: "vacuum-cleaner-agent", category: "Intelligent Agents", difficulty: "Easy" },
  { title: "Adversarial Search with Alpha-Beta Pruning", slug: "alpha-beta-pruning", category: "Adversarial Search", difficulty: "Hard" },
  { title: "A* Search Algorithm for 8-Puzzle Problem", slug: "a-star-8-puzzle", category: "Informed Search / Heuristics", difficulty: "Hard" },
  { title: "Tower of Hanoi: State Space Search", slug: "tower-of-hanoi", category: "State Space Representation", difficulty: "Medium" },
  { title: "BFS Maze & Graph Pathfinder", slug: "bfs-maze-pathfinder", category: "Uninformed Search", difficulty: "Medium" },
  { title: "BFS Robot Path Planning on Grid", slug: "bfs-robot-path", category: "Uninformed Search", difficulty: "Medium" },
  { title: "DFS Water Jug Problem (State Space Search)", slug: "dfs-water-jug", category: "Uninformed Search", difficulty: "Medium" },
  { title: "8-Queens Problem using Backtracking (CSP)", slug: "eight-queens", category: "Constraint Satisfaction Problems", difficulty: "Hard" },
  { title: "Rule-Based Chatbot with Pattern Matching", slug: "chatbot-pattern-matching", category: "Natural Language Processing", difficulty: "Easy" },
  { title: "Part C Mini-Project: MediMind Clinical AI Suite", slug: "medical-expert-system", category: "Knowledge Representation & Expert Systems", difficulty: "Hard" },
];

const MODULE_VISUALS = {
  'vacuum-cleaner-agent': {
    tag: 'EXP 1 · INTELLIGENT AGENTS',
    meta: 'Deterministic 2-Room Model · PAGE Specification',
    accent: '#10b981',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#f0fdf4', borderRadius: '14px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem' }}>
        <div style={{ width: '68px', height: '72px', borderRadius: '10px', border: '2px dashed #86efac', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: '700', color: '#15803d' }}>ROOM A</span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
        </div>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤖</div>
        <div style={{ width: '68px', height: '72px', borderRadius: '10px', border: '2px dashed #86efac', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: '700', color: '#15803d' }}>ROOM B</span>
        </div>
      </div>
    )
  },
  'alpha-beta-pruning': {
    tag: 'EXP 3 · ADVERSARIAL SEARCH',
    meta: 'Minimax + Alpha-Beta · Game Tree',
    accent: '#f43f5e',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#fff1f2', borderRadius: '14px', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="220" height="120" viewBox="0 0 220 120">
          {/* Edges */}
          <line x1="110" y1="20" x2="60" y2="65" stroke="#fca5a5" strokeWidth="1.5"/>
          <line x1="110" y1="20" x2="160" y2="65" stroke="#fca5a5" strokeWidth="1.5"/>
          <line x1="60" y1="65" x2="35" y2="105" stroke="#fca5a5" strokeWidth="1.5"/>
          <line x1="60" y1="65" x2="85" y2="105" stroke="#fca5a5" strokeWidth="1.5"/>
          <line x1="160" y1="65" x2="135" y2="105" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4,3"/>
          <line x1="160" y1="65" x2="185" y2="105" stroke="#fca5a5" strokeWidth="1.5" opacity="0.3"/>
          {/* Nodes */}
          <circle cx="110" cy="20" r="14" fill="#fff7ed" stroke="#fb923c" strokeWidth="2"/>
          <text x="110" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill="#c2410c">MAX</text>
          <circle cx="60" cy="65" r="12" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="2"/>
          <text x="60" y="69" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0369a1">MIN</text>
          <circle cx="160" cy="65" r="12" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="2"/>
          <text x="160" y="69" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0369a1">MIN</text>
          <circle cx="35" cy="105" r="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
          <text x="35" y="109" textAnchor="middle" fontSize="10" fontWeight="800" fill="#475569">3</text>
          <circle cx="85" cy="105" r="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"/>
          <text x="85" y="109" textAnchor="middle" fontSize="10" fontWeight="800" fill="#475569">5</text>
          <circle cx="135" cy="105" r="10" fill="#fee2e2" stroke="#fca5a5" strokeWidth="2"/>
          <text x="135" y="109" textAnchor="middle" fontSize="10" fontWeight="800" fill="#b91c1c">✂</text>
          <text x="175" y="100" fontSize="9" fill="#94a3b8">pruned</text>
        </svg>
      </div>
    )
  },
  'a-star-8-puzzle': {
    tag: 'EXP 2 · INFORMED SEARCH',
    meta: 'f(n) = g(n) + h(n) Heuristic',
    accent: '#a855f7',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#fdf4ff', borderRadius: '14px', border: '1px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 38px)', gap: '4px', backgroundColor: '#e9d5ff', padding: '6px', borderRadius: '10px' }}>
          {[1, 2, 3, 4, 0, 5, 7, 8, 6].map((val, idx) => (
            <div key={idx} style={{ width: '38px', height: '38px', borderRadius: '7px', backgroundColor: val === 0 ? 'transparent' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem', color: '#6b21a8', boxShadow: val !== 0 ? '0 1px 4px rgba(168,85,247,0.15)' : 'none' }}>
              {val !== 0 ? val : ''}
            </div>
          ))}
        </div>
      </div>
    )
  },
  'tower-of-hanoi': {
    tag: 'EXP 4 · STATE SPACE SEARCH',
    meta: 'Recursive Divide & Conquer',
    accent: '#f59e0b',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#fffbeb', borderRadius: '14px', border: '1px solid #fcd34d', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '20px', gap: '2.5rem' }}>
        {['A', 'B', 'C'].map((peg, idx) => (
          <div key={peg} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{ width: '4px', height: '68px', backgroundColor: '#fcd34d', borderRadius: '2px' }} />
            {idx === 0 && (
              <div style={{ position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '9px', backgroundColor: '#f43f5e', borderRadius: '3px', margin: '1px 0' }} />
                <div style={{ width: '34px', height: '9px', backgroundColor: '#3b82f6', borderRadius: '3px', margin: '1px 0' }} />
                <div style={{ width: '20px', height: '9px', backgroundColor: '#10b981', borderRadius: '3px', margin: '1px 0' }} />
              </div>
            )}
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#92400e', marginTop: '4px' }}>{peg}</span>
          </div>
        ))}
      </div>
    )
  },
  'bfs-maze-pathfinder': {
    tag: 'BONUS · UNINFORMED SEARCH',
    meta: 'BFS Wave Expansion · 5×8 Interactive Grid',
    accent: '#3b82f6',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#eff6ff', borderRadius: '14px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '6px', padding: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '3px', width: '100%' }}>
          {Array.from({ length: 40 }).map((_, i) => {
            const r = Math.floor(i / 8), c = i % 8;
            const isStart = r === 0 && c === 0;
            const isGoal = r === 4 && c === 7;
            const isWall = [10, 18, 26].includes(i);
            const isPath = [0, 8, 16, 24, 25, 26, 34, 35, 36, 37, 38, 39].includes(i) && !isWall;
            const isVisited = [1, 9, 17].includes(i);
            return (
              <div key={i} style={{
                height: '20px', borderRadius: '3px',
                backgroundColor: isStart ? '#10b981' : isGoal ? '#f43f5e' : isWall ? '#64748b' : isPath ? '#2563eb' : isVisited ? '#dbeafe' : '#f1f5f9',
              }} />
            );
          })}
        </div>
        <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: '700', letterSpacing: '0.3px' }}>Click cells · Toggle walls · Launch BFS</div>
      </div>
    )
  },
  'bfs-robot-path': {
    tag: 'EXP 5 · UNINFORMED SEARCH',
    meta: 'BFS FIFO Queue · 5×5 Grid',
    accent: '#2563eb',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#eff6ff', borderRadius: '14px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 22px)', gap: '3px' }}>
          {Array.from({ length: 25 }).map((_, i) => {
            const r = Math.floor(i / 5), c = i % 5;
            const isStart = r === 0 && c === 0;
            const isGoal = r === 4 && c === 4;
            const isPath = [0, 5, 6, 7, 8, 13, 18, 23, 24].includes(i);
            const isWall = [2, 9, 10, 17].includes(i);
            return (
              <div key={i} style={{
                width: '22px', height: '22px', borderRadius: '4px',
                backgroundColor: isStart ? '#10b981' : isGoal ? '#f43f5e' : isPath ? '#2563eb' : isWall ? '#64748b' : '#f1f5f9',
                fontSize: isStart ? '9px' : isGoal ? '9px' : '0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: '800'
              }}>
                {isStart ? '🤖' : isGoal ? '🏁' : ''}
              </div>
            );
          })}
        </div>
      </div>
    )
  },
  'dfs-water-jug': {
    tag: 'EXP 6 · UNINFORMED SEARCH',
    meta: 'DFS Stack · 4L & 3L Jugs',
    accent: '#0ea5e9',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#f0f9ff', borderRadius: '14px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2rem', paddingBottom: '16px' }}>
        {/* Jug X 4L - 75% fill */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '50px', height: '90px', borderRadius: '4px 4px 8px 8px', border: '2px solid #7dd3fc', backgroundColor: '#f0f9ff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%', backgroundColor: '#38bdf8', opacity: 0.8 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', color: '#0c4a6e', zIndex: 1 }}>2L</div>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#0369a1' }}>Jug X (4L)</span>
        </div>
        {/* DFS arrow */}
        <div style={{ paddingBottom: '30px', fontSize: '1rem', color: '#0369a1', fontWeight: '700' }}>→</div>
        {/* Jug Y 3L - empty */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '44px', height: '75px', borderRadius: '4px 4px 8px 8px', border: '2px solid #7dd3fc', backgroundColor: '#f0f9ff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', color: '#94a3b8' }}>0L</div>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#0369a1' }}>Jug Y (3L)</span>
        </div>
      </div>
    )
  },
  'eight-queens': {
    tag: 'EXP 7 · CSP BACKTRACKING',
    meta: '8×8 Board · 92 Solutions',
    accent: '#8b5cf6',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#fdf4ff', borderRadius: '14px', border: '1px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 17px)', gap: '1px', backgroundColor: '#e9d5ff', padding: '4px', borderRadius: '8px' }}>
          {Array.from({ length: 64 }).map((_, i) => {
            const r = Math.floor(i / 8), c = i % 8;
            const isLight = (r + c) % 2 === 0;
            const queens = [0, 4, 7, 5, 2, 6, 1, 3]; // a valid 8-queens solution
            const hasQueen = queens[c] === r;
            return (
              <div key={i} style={{
                width: '17px', height: '17px',
                backgroundColor: hasQueen ? '#7c3aed' : isLight ? '#fafaf9' : '#d4d4d4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px'
              }}>
                {hasQueen ? '♛' : ''}
              </div>
            );
          })}
        </div>
      </div>
    )
  },
  'chatbot-pattern-matching': {
    tag: 'EXP 8 · NLP',
    meta: 'Rule-Based Pattern Matching',
    accent: '#06b6d4',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#ecfeff', borderRadius: '14px', border: '1px solid #a5f3fc', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '14px', gap: '8px' }}>
        {[
          { from: 'user', text: 'What is BFS?' },
          { from: 'bot', text: 'BFS uses a FIFO queue...' },
          { from: 'user', text: 'Explain Alpha-Beta' },
        ].map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              padding: '0.3rem 0.65rem', borderRadius: msg.from === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              backgroundColor: msg.from === 'user' ? '#0f172a' : '#fff',
              color: msg.from === 'user' ? '#fff' : '#0f172a',
              fontSize: '0.7rem', fontWeight: '600', maxWidth: '75%',
              border: msg.from === 'bot' ? '1px solid #e2e8f0' : 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    )
  },
  'medical-expert-system': {
    tag: 'MINI PROJECT · EXPERT SYSTEMS',
    meta: 'Forward & Backward Inference · Clinical AI',
    accent: '#ef4444',
    renderCanvas: (
      <div style={{ height: '150px', backgroundColor: '#fff1f2', borderRadius: '14px', border: '1px solid #fecdd3', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '14px', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {['Fever', 'Chills', 'Sweating'].map(s => (
            <span key={s} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '700' }}>{s}</span>
          ))}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>IF (all 3 in WM) THEN:</div>
        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#b91c1c' }}>→ Diagnosed: Malaria 🦠</div>
        <div style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: '600' }}>★ Part C Mini-Project Capstone</div>
      </div>
    )
  }
};

const DIFFICULTY_COLORS = {
  Easy:   { bg: '#dcfce7', text: '#15803d' },
  Medium: { bg: '#fef3c7', text: '#92400e' },
  Hard:   { bg: '#fee2e2', text: '#b91c1c' },
};

function Home() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/assignments`)
      .then((res) => {
        setAssignments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setAssignments(FALLBACK_ASSIGNMENTS);
        setLoading(false);
      });
  }, []);

  const displayData = assignments.length > 0 ? assignments : FALLBACK_ASSIGNMENTS;
  const miniProject = displayData.find(a => a.slug === 'medical-expert-system');
  const experiments = displayData.filter(a => a.slug !== 'medical-expert-system');

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>

      {/* Editorial Header */}
      <div style={{ maxWidth: '800px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FlaskConical style={{ width: '14px', height: '14px' }} />
          SPPU 2024 Pattern · AI Practical Curriculum
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '800', letterSpacing: '-1.5px', lineHeight: '1.15', color: '#0f172a', margin: '0.8rem 0 1rem 0' }}>
          Interactive AI Laboratory
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: '1.65', margin: 0 }}>
          8 fully interactive experiment workbenches covering intelligent agents, search algorithms, adversarial game theory, constraint satisfaction, and NLP — plus a capstone clinical AI mini project.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {[
            { n: '8', label: 'Experiments' },
            { n: '1', label: 'Mini Project' },
            { n: '45+', label: 'Quiz Questions' },
            { n: '18', label: 'Visualizers' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#64748b' }}>Loading experiments...</div>
      ) : (
        <>
          {/* ── EXPERIMENTS GRID (8 cards) ── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                Practical Experiments
              </h2>
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                {experiments.length} workbenches
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.5rem' }}>
              {experiments.map((item) => {
                const visual = MODULE_VISUALS[item.slug] || { tag: 'AI LAB', meta: 'Simulation', accent: '#64748b', renderCanvas: null };
                const diffCol = DIFFICULTY_COLORS[item.difficulty] || DIFFICULTY_COLORS.Medium;

                return (
                  <div
                    key={item.slug}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '20px',
                      padding: '1.3rem',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '390px',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      borderTop: `3px solid ${visual.accent}`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.07)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)'; }}
                  >
                    {visual.renderCanvas}

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: '700', color: visual.accent, letterSpacing: '0.4px' }}>
                            {visual.tag}
                          </span>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: '9999px', backgroundColor: diffCol.bg, color: diffCol.text, fontWeight: '700' }}>
                            {item.difficulty}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.3rem 0', lineHeight: '1.35' }}>
                          {item.title}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{visual.meta}</p>
                      </div>

                      <div style={{ marginTop: '1.25rem' }}>
                        <Link
                          to={`/assignment/${item.slug}`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.6rem 1.3rem', borderRadius: '9999px',
                            backgroundColor: '#0f172a', color: '#ffffff',
                            fontSize: '0.82rem', fontWeight: '700',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          <span>Open Workbench</span>
                          <ArrowRight style={{ width: '13px', height: '13px' }} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MINI PROJECT FEATURED CARD ── */}
          {miniProject && (() => {
            const visual = MODULE_VISUALS['medical-expert-system'];
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ★ Part C Capstone Mini-Project
                  </h2>
                  <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.7rem', borderRadius: '9999px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '800', border: '1px solid #fcd34d' }}>
                    Marks here! 🎯
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '24px',
                    padding: '2rem',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '2rem',
                    alignItems: 'center',
                    borderLeft: '4px solid #ef4444'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(239,68,68,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.04)'; }}
                >
                  <div>
                    {visual.renderCanvas}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#ef4444', backgroundColor: '#fff1f2', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid #fecdd3' }}>
                        PART C MINI-PROJECT
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#92400e', backgroundColor: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid #fcd34d' }}>
                        Hard
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>
                      MediMind Clinical AI Suite
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.65', margin: '0 0 1.25rem 0' }}>
                      A complete clinical decision support system with Forward Chaining inference, Backward Chaining diagnosis, real-time Patient Vitals monitoring, Knowledge Base editor, and EHR report generation. Built using Rule-Based Expert Systems — the centerpiece of your mini-project submission.
                    </p>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      {['Forward Chaining', 'Backward Chaining', 'Patient Vitals', 'KB Editor', 'EHR Reports'].map(f => (
                        <span key={f} style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/assignment/${miniProject.slug}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.75rem', borderRadius: '9999px',
                        backgroundColor: '#ef4444', color: '#ffffff',
                        fontSize: '0.92rem', fontWeight: '800',
                        boxShadow: '0 4px 14px rgba(239,68,68,0.25)'
                      }}
                    >
                      <span>Open MediMind Suite</span>
                      <ArrowRight style={{ width: '15px', height: '15px' }} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

export default Home;