import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Zap, Globe, CloudSun } from 'lucide-react';

export const About = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">About SkyCast</h1>
        <p className="page-subtitle">
          SkyCast is a modern weather application that provides real-time weather information, forecasts, and weather insights for cities around the world.
        </p>
      </div>

      {/* Mission & Brand Philosophy */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CloudSun size={24} style={{ color: 'var(--theme-accent)' }} />
          <span>Brand Identity & Design Vision</span>
        </h2>
        <p style={{ color: 'var(--theme-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Inspired by the intuitive simplicity and instant readability of top-tier weather services, SkyCast creates its own unique identity with atmospheric dynamic themes, glassmorphism, responsive data grids, and smooth micro-animations.
        </p>
        <p style={{ color: 'var(--theme-text-secondary)', lineHeight: 1.7 }}>
          Our mission is to deliver hyper-accurate weather intelligence wrapped in a clean, clutter-free user experience tailored for desktop, tablet, and mobile displays alike.
        </p>
      </div>

      {/* Technology Stack */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={24} style={{ color: 'var(--theme-accent)' }} />
          <span>Technology Stack</span>
        </h2>

        <div className="tech-badges-grid">
          <div className="tech-badge">⚛️ React.js (v18)</div>
          <div className="tech-badge">⚡ Vite Build Tool</div>
          <div className="tech-badge">🟢 Node.js Runtime</div>
          <div className="tech-badge">🚂 Express.js Framework</div>
          <div className="tech-badge">🌐 REST API Architecture</div>
          <div className="tech-badge">🌤️ OpenWeatherMap API</div>
          <div className="tech-badge">🎨 Vanilla CSS & Responsive Grid</div>
          <div className="tech-badge">✨ Lucide Weather Icons</div>
        </div>
      </div>

      {/* Architectural Data Flow */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={24} style={{ color: 'var(--theme-accent)' }} />
          <span>Architectural Data Pipeline</span>
        </h2>
        <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          To ensure maximum security and privacy, API keys are kept strictly on the Express backend and are <strong>never exposed</strong> to the client browser.
        </p>

        {/* Visual Flow diagram */}
        <div className="architecture-flow">
          <div className="arch-node">
            <div className="arch-node-title">1. SkyCast Frontend</div>
            <div className="arch-node-sub">React Client (Vite)</div>
          </div>

          <div className="arch-arrow">
            <ArrowRight size={22} />
          </div>

          <div className="arch-node">
            <div className="arch-node-title">2. SkyCast Backend</div>
            <div className="arch-node-sub">Express REST Proxy</div>
          </div>

          <div className="arch-arrow">
            <ArrowRight size={22} />
          </div>

          <div className="arch-node" style={{ borderColor: 'var(--theme-accent)' }}>
            <div className="arch-node-title" style={{ color: 'var(--theme-accent)' }}>3. Weather API</div>
            <div className="arch-node-sub">OpenWeatherMap</div>
          </div>

          <div className="arch-arrow">
            <ArrowRight size={22} />
          </div>

          <div className="arch-node">
            <div className="arch-node-title">4. Data Processing</div>
            <div className="arch-node-sub">Aggregation & Cleanup</div>
          </div>

          <div className="arch-arrow">
            <ArrowRight size={22} />
          </div>

          <div className="arch-node">
            <div className="arch-node-title">5. Client Render</div>
            <div className="arch-node-sub">Dynamic Theme & UI</div>
          </div>
        </div>
      </div>

      {/* Security & Reliability */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={24} style={{ color: '#10b981' }} />
          <span>Security & Dual-Provider Resilience</span>
        </h2>
        <p style={{ color: 'var(--theme-text-secondary)', lineHeight: 1.7 }}>
          SkyCast features a built-in fallback engine. If the primary OpenWeatherMap quota is exceeded or the API key is not configured in development, the backend automatically transitions to real-time satellite meteorology services without disrupting the user experience.
        </p>
      </div>
    </div>
  );
};

export default About;
