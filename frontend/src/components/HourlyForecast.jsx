import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { formatTemp, getWeatherIcon } from '../utils/weatherUtils';

export const HourlyForecast = ({ hourly = [], unit = 'C' }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <section className="glass-card hourly-section">
      <h2 className="section-heading">
        <Clock size={18} />
        <span>Hourly Forecast</span>
      </h2>

      <div className="hourly-scroll-container">
        {hourly.map((item, index) => {
          const isNow = index === 0;
          return (
            <div
              key={`${item.time}-${index}`}
              className={`hourly-card ${isNow ? 'now' : ''}`}
            >
              <span className="hourly-time">{item.time}</span>
              
              <div className="hourly-icon">
                {getWeatherIcon(item.condition, true, item.iconCode, 32)}
              </div>

              <span className="hourly-temp">
                {formatTemp(item.temp, unit)}
              </span>

              {item.pop > 0 ? (
                <span className="hourly-pop">
                  <Droplets size={11} />
                  {item.pop}%
                </span>
              ) : (
                <span className="hourly-pop" style={{ opacity: 0.4 }}>
                  0%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HourlyForecast;
