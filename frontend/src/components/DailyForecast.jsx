import React from 'react';
import { Calendar } from 'lucide-react';
import { formatTemp, getWeatherIcon } from '../utils/weatherUtils';

export const DailyForecast = ({ daily = [], unit = 'C' }) => {
  if (!daily || daily.length === 0) return null;

  // Calculate overall lowest and highest for proportional range bars
  const allLows = daily.map(d => d.low);
  const allHighs = daily.map(d => d.high);
  const minTemp = Math.min(...allLows);
  const maxTemp = Math.max(...allHighs);
  const tempSpan = Math.max(1, maxTemp - minTemp);

  return (
    <section className="glass-card daily-section">
      <h2 className="section-heading">
        <Calendar size={18} />
        <span>7-Day Forecast</span>
      </h2>

      <div className="daily-list">
        {daily.map((item, index) => {
          const lowDisplay = formatTemp(item.low, unit);
          const highDisplay = formatTemp(item.high, unit);

          // Calculate bar position and width relative to week span
          const leftPercent = Math.max(0, Math.min(100, ((item.low - minTemp) / tempSpan) * 100));
          const widthPercent = Math.max(20, Math.min(100, ((item.high - item.low) / tempSpan) * 100));

          return (
            <div key={`${item.day}-${index}`} className="daily-row">
              {/* Day & Date */}
              <div>
                <div className="daily-day">{item.day}</div>
                <div className="daily-date">{item.date}</div>
              </div>

              {/* Weather Icon */}
              <div className="daily-icon-cell">
                {getWeatherIcon(item.condition, true, item.iconCode, 24)}
              </div>

              {/* Condition Name */}
              <div className="daily-condition-name" title={item.description || item.condition}>
                {item.condition}
                {item.pop > 25 && (
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginLeft: '6px' }}>
                    {item.pop}% rain
                  </span>
                )}
              </div>

              {/* High / Low Bar */}
              <div className="daily-temp-bar-wrap">
                <span className="daily-low-val">{lowDisplay}</span>
                <div className="temp-bar-track">
                  <div
                    className="temp-bar-fill"
                    style={{
                      marginLeft: `${leftPercent * 0.4}%`,
                      width: `${widthPercent}%`
                    }}
                  />
                </div>
                <span className="daily-high-val">{highDisplay}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DailyForecast;
