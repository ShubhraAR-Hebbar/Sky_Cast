import React, { useState } from 'react';
import { Calendar, Droplets, Wind as WindIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { formatTemp, formatWindSpeed, getWeatherIcon } from '../utils/weatherUtils';
import HourlyForecast from '../components/HourlyForecast';

export const Forecast = ({ weather, unit }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!weather || !weather.daily) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>No forecast data available</h2>
        <p style={{ color: 'var(--theme-text-secondary)', marginTop: '0.5rem' }}>
          Please search for a city on the Home dashboard to view its multi-day forecast.
        </p>
      </div>
    );
  }

  const selectedDay = weather.daily[selectedDayIndex] || weather.daily[0];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">7-Day Extended Forecast</h1>
        <p className="page-subtitle">
          Comprehensive meteorological outlook for <strong style={{ color: '#ffffff' }}>{weather.city}, {weather.country}</strong>
        </p>
      </div>

      {/* Day Selector Carousel / Pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {weather.daily.map((item, idx) => {
          const isSelected = idx === selectedDayIndex;
          return (
            <button
              key={`${item.day}-${idx}`}
              onClick={() => setSelectedDayIndex(idx)}
              className="glass-card glass-card-interactive"
              style={{
                flex: '1 0 130px',
                padding: '1rem',
                textAlign: 'center',
                borderColor: isSelected ? 'var(--theme-accent)' : undefined,
                background: isSelected ? 'var(--theme-badge-bg)' : undefined,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isSelected ? 'var(--theme-accent)' : 'inherit' }}>
                {item.day}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>
                {item.date}
              </span>
              <div style={{ margin: '0.2rem 0' }}>
                {getWeatherIcon(item.condition, true, item.iconCode, 28)}
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                {formatTemp(item.high, unit)} / {formatTemp(item.low, unit)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Spotlight Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {getWeatherIcon(selectedDay.condition, true, selectedDay.iconCode, 52)}
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                {selectedDay.day}’s Outlook
              </h2>
              <p style={{ color: 'var(--theme-text-secondary)', fontSize: '0.95rem' }}>
                {selectedDay.date} • {selectedDay.condition} ({selectedDay.description || 'mostly pleasant'})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', textTransform: 'uppercase' }}>High</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>
                {formatTemp(selectedDay.high, unit)}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', textTransform: 'uppercase' }}>Low</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60a5fa' }}>
                {formatTemp(selectedDay.low, unit)}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Day Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="detail-card">
            <div className="detail-card-header">
              <Droplets size={16} />
              <span>Precipitation Chance</span>
            </div>
            <div className="detail-card-val">{selectedDay.pop || 10}%</div>
            <div className="detail-card-desc">Probability of rain during daytime</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">
              <Droplets size={16} />
              <span>Relative Humidity</span>
            </div>
            <div className="detail-card-val">{selectedDay.humidity || 65}%</div>
            <div className="detail-card-desc">Average moisture saturation</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">
              <WindIcon size={16} />
              <span>Anticipated Wind</span>
            </div>
            <div className="detail-card-val">{formatWindSpeed(selectedDay.windSpeed, unit)}</div>
            <div className="detail-card-desc">Sustained surface airflow</div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast for the day */}
      <HourlyForecast hourly={weather.hourly} unit={unit} />
    </div>
  );
};

export default Forecast;
