import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = () => {
  return (
    <div className="skeleton-wrap" aria-busy="true" aria-label="Loading weather data">
      <div className="skeleton-msg">
        <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1.2s linear infinite', color: 'var(--theme-accent)' }} />
        <span>Loading SkyCast weather intelligence...</span>
      </div>

      {/* Hero card skeleton */}
      <div className="glass-card skeleton-shimmer skeleton-hero" />

      {/* Hourly forecast skeleton */}
      <div className="glass-card skeleton-shimmer skeleton-hourly" />

      {/* Grid columns skeleton */}
      <div className="skeleton-grid">
        <div className="glass-card skeleton-shimmer skeleton-box" />
        <div className="glass-card skeleton-shimmer skeleton-box" />
      </div>
    </div>
  );
};

export default Loading;
