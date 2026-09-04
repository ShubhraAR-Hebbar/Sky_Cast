import React from 'react';
import { CloudRain } from 'lucide-react';

export const Precipitation = ({ precipitation = [] }) => {
  if (!precipitation || precipitation.length === 0) return null;

  const maxPop = Math.max(...precipitation.map(p => p.pop), 10);
  const avgPop = Math.round(precipitation.reduce((acc, p) => acc + p.pop, 0) / precipitation.length);

  return (
    <section className="glass-card precipitation-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-heading" style={{ marginBottom: 0 }}>
          <CloudRain size={18} />
          <span>Precipitation Probability</span>
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--theme-text-secondary)' }}>
          Next 12-18h avg: <strong style={{ color: '#38bdf8' }}>{avgPop}%</strong>
        </span>
      </div>

      <div className="precip-chart-container">
        {precipitation.map((item, index) => {
          const heightPercent = Math.max(8, (item.pop / 100) * 100);
          return (
            <div key={`${item.time}-${index}`} className="precip-bar-group">
              <span className="precip-percent-label">{item.pop}%</span>
              <div className="precip-bar-wrapper">
                <div
                  className="precip-bar-fill"
                  style={{
                    height: `${heightPercent}%`,
                    opacity: item.pop > 0 ? 0.9 : 0.2
                  }}
                  title={`${item.pop}% rain probability at ${item.time}`}
                />
              </div>
              <span className="precip-time-label">{item.time}</span>
            </div>
          );
        })}
      </div>

      <div className="precip-legend">
        <span>0% (Dry)</span>
        <span>50% (Likely)</span>
        <span>100% (Rain)</span>
      </div>
    </section>
  );
};

export default Precipitation;
