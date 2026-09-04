import React from 'react';
import { Sunrise, Sunset, SunDim } from 'lucide-react';

export const SunriseSunset = ({ weather }) => {
  if (!weather) return null;

  return (
    <section className="glass-card sun-card">
      <h2 className="section-heading">
        <SunDim size={18} />
        <span>Sunrise & Sunset</span>
      </h2>

      {/* Visual Sun Arc Curve */}
      <div className="sun-arc-wrap">
        <svg className="sun-svg-curve" viewBox="0 0 200 80" preserveAspectRatio="none">
          {/* Base horizon line */}
          <line x1="10" y1="75" x2="190" y2="75" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
          {/* Semicircle daylight trajectory path */}
          <path
            d="M 20 75 Q 100 0 180 75"
            fill="none"
            stroke="url(#sunPathGrad)"
            strokeWidth="3"
          />
          {/* Sun icon marker near apex */}
          <circle cx={weather.isDay ? "100" : "180"} cy={weather.isDay ? "18" : "75"} r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
          
          <defs>
            <linearGradient id="sunPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="sun-times-row">
        {/* Sunrise */}
        <div className="sun-time-box">
          <div className="sun-time-icon">
            <Sunrise size={20} />
          </div>
          <div>
            <div className="sun-time-label">Sunrise</div>
            <div className="sun-time-val">{weather.sunrise || '06:00 AM'}</div>
          </div>
        </div>

        {/* Sunset */}
        <div className="sun-time-box">
          <div className="sun-time-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <Sunset size={20} />
          </div>
          <div>
            <div className="sun-time-label">Sunset</div>
            <div className="sun-time-val">{weather.sunset || '06:30 PM'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SunriseSunset;
