import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';

const MODULE_VISUALS = {
  'vacuum-cleaner-agent': {
    tag: 'INTELLIGENT AGENTS',
    meta: 'Deterministic 2-Room Model',
    renderCanvas: (
      <div style={{ height: '160px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div style={{ width: '70px', height: '75px', borderRadius: '10px', border: '2px dashed #94a3b8', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#475569' }}>ROOM A</span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
        </div>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>
          🤖
        </div>
        <div style={{ width: '70px', height: '75px', borderRadius: '10px', border: '2px dashed #94a3b8', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#475569' }}>ROOM B</span>
        </div>
      </div>
    )
  },
  'tower-of-hanoi': {
    tag: 'RECURSION & SEARCH',
    meta: 'State Space Traversal',
    renderCanvas: (
      <div style={{ height: '160px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '22px', gap: '2rem' }}>
        {['A', 'B', 'C'].map((peg, idx) => (
          <div key={peg} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{ width: '4px', height: '65px', backgroundColor: '#cbd5e1', borderRadius: '2px' }} />
            {idx === 0 && (
              <div style={{ position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center' }}>
                <div style={{ width: '46px', height: '9px', backgroundColor: '#ef4444', borderRadius: '3px', margin: '1px 0' }} />
                <div style={{ width: '32px', height: '9px', backgroundColor: '#3b82f6', borderRadius: '3px', margin: '1px 0' }} />
                <div style={{ width: '18px', height: '9px', backgroundColor: '#10b981', borderRadius: '3px', margin: '1px 0' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  },
  'bfs-maze-pathfinder': {
    tag: 'UNINFORMED SEARCH',
    meta: 'FIFO Queue Pathfinder',
    renderCanvas: (
      <div style={{ height: '160px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 22px)', gap: '4px' }}>
          {Array.from({ length: 25 }).map((_, i) => {
            const isStart = i === 0;
            const isGoal = i === 24;
            const isPath = [0, 5, 10, 11, 12, 17, 22, 23, 24].includes(i);
            const isWall = [6, 7, 8, 16, 21].includes(i);
            return (
              <div
                key={i}
                style={{
                  width: '22px', height: '22px', borderRadius: '4px',
                  backgroundColor: isStart ? '#10b981' : isGoal ? '#ef4444' : isPath ? '#3b82f6' : isWall ? '#64748b' : '#e2e8f0'
                }}
              />
            );
          })}
        </div>
      </div>
    )
  },
  'a-star-8-puzzle': {
    tag: 'INFORMED SEARCH',
    meta: 'f(n) = g(n) + h(n)',
    renderCanvas: (
      <div style={{ height: '160px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 34px)', gap: '4px', backgroundColor: '#e2e8f0', padding: '5px', borderRadius: '8px' }}>
          {[1, 2, 3, 4, 0, 5, 7, 8, 6].map((val, idx) => (
            <div key={idx} style={{ width: '34px', height: '34px', borderRadius: '4px', backgroundColor: val === 0 ? 'transparent' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', color: '#0f172a' }}>
              {val !== 0 ? val : ''}
            </div>
          ))}
        </div>
      </div>
    )
  },
  'medical-expert-system': {
    tag: 'EXPERT SYSTEMS',
    meta: 'Forward & Backward Inference',
    renderCanvas: (
      <div style={{ height: '160px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '700' }}>Fever</span>
          <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '700' }}>Chills</span>
          <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '700' }}>Sweating</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
          IF (all 3 in WM) THEN:
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
          → Diagnosed: Malaria
        </div>
      </div>
    )
  }
};

function Home() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/assignments')
      .then((res) => {
        setAssignments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Editorial Header */}
      <div style={{ maxWidth: '850px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ● SPPU 2024 Pattern AI Practical Curriculum
        </span>
        <h1 style={{ fontSize: '3.2rem', fontWeight: '800', letterSpacing: '-1.5px', lineHeight: '1.15', color: '#0f172a', margin: '0.8rem 0 1rem 0' }}>
          Interactive Artificial Intelligence Laboratory
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
          Interactive simulation workbench for autonomous reflex agents, recursive state-space trees, graph search strategies, and rule-based diagnostic inference systems.
        </p>
      </div>

      {/* 5-Card Consistent Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Laboratory Workbenches
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            5 Core Experiments
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', color: '#64748b' }}>Loading assignments...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.75rem' }}>
            {assignments.map((item) => {
              const visual = MODULE_VISUALS[item.slug] || { tag: 'AI LAB', meta: 'Simulation', renderCanvas: null };
              const isPartC = item.slug === 'medical-expert-system';

              return (
                <div
                  key={item.slug}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '24px',
                    padding: '1.4rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '430px',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  {visual.renderCanvas}

                  <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#2563eb', letterSpacing: '0.5px' }}>
                          {visual.tag}
                        </span>
                        {isPartC ? (
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '700' }}>
                            Part C Capstone
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.difficulty}</span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.4rem 0', lineHeight: '1.35' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                        {visual.meta}
                      </p>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                      <Link
                        to={`/assignment/${item.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.65rem 1.4rem',
                          borderRadius: '9999px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        <span>Open Simulator</span>
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;