import React from 'react';
import {
  Droplets,
  Wind as WindIcon,
  Gauge,
  Eye,
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react';
import { formatTemp, getTempValue, formatWindSpeed, getWeatherIcon } from '../utils/weatherUtils';

export const CurrentWeather = ({ weather, unit }) => {
  if (!weather) return null;

  const tempDisplay = getTempValue(weather.temperature, unit);
  const feelsLikeDisplay = formatTemp(weather.feelsLike, unit);
  const highDisplay = formatTemp(weather.tempMax, unit);
  const lowDisplay = formatTemp(weather.tempMin, unit);
  const windDisplay = formatWindSpeed(weather.windSpeed, unit);

  return (
    <section className="glass-card hero-weather-card">
      <div className="hero-weather-grid">
        {/* Left Column: Primary Weather Focus */}
        <div>
          {/* Location Header */}
          <div className="location-header">
            <h1 className="city-name">{weather.city}</h1>
            {weather.country && (
              <span className="country-badge">{weather.country}</span>
            )}
          </div>
          <div className="weather-updated">
            <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Observed just now • Local Source ({weather.source || 'OpenWeatherMap'})
          </div>

          {/* Temperature & Icon */}
          <div className="temp-display-row">
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span className="temp-primary">{tempDisplay}</span>
              <span className="temp-unit-symbol">°{unit}</span>
            </div>

            <div className="condition-badge-wrap">
              <div className="condition-pill">
                {getWeatherIcon(weather.condition, weather.isDay, weather.iconCode, 24)}
                <span>{weather.description ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1) : weather.condition}</span>
              </div>
              <span className="feels-like-text">
                Feels like <strong>{feelsLikeDisplay}</strong>
              </span>
            </div>
          </div>

          {/* High / Low Temperature */}
          <div className="temp-high-low">
            <span className="temp-high" title="Today's high">
              <ArrowUp size={16} /> High {highDisplay}
            </span>
            <span className="temp-low" title="Today's low">
              <ArrowDown size={16} /> Low {lowDisplay}
            </span>
          </div>
        </div>

        {/* Right Column: Hero Quick Statistics */}
        <div className="hero-stats-grid">
          {/* Humidity */}
          <div className="hero-stat-card">
            <div className="hero-stat-header">
              <Droplets size={16} />
              <span>Humidity</span>
            </div>
            <div className="hero-stat-value">{weather.humidity}%</div>
            <div className="hero-stat-sub">
              {weather.humidity > 60 ? 'Humid air' : weather.humidity < 30 ? 'Dry air' : 'Comfortable'}
            </div>
          </div>

          {/* Wind */}
          <div className="hero-stat-card">
            <div className="hero-stat-header">
              <WindIcon size={16} />
              <span>Wind</span>
            </div>
            <div className="hero-stat-value">{windDisplay}</div>
            <div className="hero-stat-sub">
              From {weather.windDirectionCompass || 'N'} ({weather.windDirection}°)
            </div>
          </div>

          {/* Pressure */}
          <div className="hero-stat-card">
            <div className="hero-stat-header">
              <Gauge size={16} />
              <span>Pressure</span>
            </div>
            <div className="hero-stat-value">{weather.pressure} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>hPa</span></div>
            <div className="hero-stat-sub">
              {weather.pressure > 1013 ? 'High pressure' : 'Normal pressure'}
            </div>
          </div>

          {/* Visibility */}
          <div className="hero-stat-card">
            <div className="hero-stat-header">
              <Eye size={16} />
              <span>Visibility</span>
            </div>
            <div className="hero-stat-value">{weather.visibility} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>km</span></div>
            <div className="hero-stat-sub">
              {weather.visibility >= 10 ? 'Clear visibility' : 'Moderate haze'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;
