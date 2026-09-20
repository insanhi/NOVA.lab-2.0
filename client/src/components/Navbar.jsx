import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

function Navbar() {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 2.5rem'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: '#0f172a', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '0.9rem'
          }}>
            N
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a' }}>
            NOVA<span style={{ fontWeight: '500', color: '#64748b' }}>.lab</span>
          </span>
          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontWeight: '600' }}>
            SPPU 2024
          </span>
        </Link>

        {/* Real Profile Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <a
            href="https://github.com/insanhi"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '0.45rem 0.9rem', borderRadius: '9999px',
              border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
              color: '#0f172a', fontSize: '0.82rem', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '0.35rem'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>GitHub</span>
            <ArrowUpRight style={{ width: '12px', height: '12px', color: '#64748b' }} />
          </a>

          <a
            href="https://www.linkedin.com/in/ansh-devkate-758064329?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '0.45rem 0.95rem', borderRadius: '9999px',
              backgroundColor: '#0f172a', color: '#ffffff',
              fontSize: '0.82rem', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
            </svg>
            <span>LinkedIn</span>
            <ArrowUpRight style={{ width: '12px', height: '12px' }} />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;