import React from 'react';
import { Sun } from 'lucide-react';

export const UVIndex = ({ weather }) => {
  if (!weather) return null;

  const uvVal = weather.uvIndex !== undefined ? weather.uvIndex : 5;
  const category = weather.uvCategory || {
    level: uvVal,
    text: uvVal <= 2 ? 'Low' : uvVal <= 5 ? 'Moderate' : uvVal <= 7 ? 'High' : 'Very High',
    color: uvVal <= 2 ? '#10b981' : uvVal <= 5 ? '#f59e0b' : uvVal <= 7 ? '#f97316' : '#ef4444',
    advice: 'Take appropriate precautions during peak sun hours.'
  };

  // Percentage for pointer position on meter (scale 0-11+)
  const pointerPercent = Math.min(100, Math.max(0, (uvVal / 11) * 100));

  return (
    <section className="glass-card uv-card">
      <h2 className="section-heading">
        <Sun size={18} />
        <span>UV Index</span>
      </h2>

      <div className="uv-visual-wrap">
        <div className="uv-number-badge">
          <span className="uv-score" style={{ color: category.color }}>{uvVal}</span>
          <span className="uv-category-name" style={{ color: category.color }}>
            {category.text}
          </span>
        </div>

        {/* Visual UV Color Scale Bar */}
        <div className="uv-meter-bar">
          <div
            className="uv-meter-indicator"
            style={{ left: `${pointerPercent}%` }}
            title={`UV Index: ${uvVal}`}
          />
        </div>

        <p className="uv-advice-text">
          {category.advice}
        </p>
      </div>
    </section>
  );
};

export default UVIndex;
