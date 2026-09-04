import React from 'react';
import {
  Droplets,
  Wind as WindIcon,
  Compass,
  Gauge,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  Layers
} from 'lucide-react';
import { formatWindSpeed } from '../utils/weatherUtils';

export const WeatherDetails = ({ weather, unit = 'C' }) => {
  if (!weather) return null;

  const windSpeedDisplay = formatWindSpeed(weather.windSpeed, unit);

  // Compute dew point approximation: T - (100 - RH)/5
  const dewPoint = Math.round(weather.temperature - (100 - weather.humidity) / 5);

  return (
    <section className="glass-card weather-details-section">
      <h2 className="section-heading">
        <Layers size={18} />
        <span>Weather Details</span>
      </h2>

      <div className="details-cards-grid">
        {/* Humidity */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Droplets size={16} />
            <span>Humidity</span>
          </div>
          <div className="detail-card-val">{weather.humidity}%</div>
          <div className="detail-card-desc">
            Dew point is {dewPoint}°{unit}
          </div>
        </div>

        {/* Wind Speed */}
        <div className="detail-card">
          <div className="detail-card-header">
            <WindIcon size={16} />
            <span>Wind Speed</span>
          </div>
          <div className="detail-card-val">{windSpeedDisplay}</div>
          <div className="detail-card-desc">
            {weather.windGust ? `Gusts up to ${weather.windGust} m/s` : 'Gentle breeze'}
          </div>
        </div>

        {/* Wind Direction */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Compass size={16} />
            <span>Wind Direction</span>
          </div>
          <div className="detail-card-val">{weather.windDirectionCompass || 'N'}</div>
          <div className="detail-card-desc">
            Bearing {weather.windDirection || 0}°
          </div>
        </div>

        {/* Pressure */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Gauge size={16} />
            <span>Pressure</span>
          </div>
          <div className="detail-card-val">{weather.pressure} <span style={{ fontSize: '0.9rem' }}>hPa</span></div>
          <div className="detail-card-desc">
            Standard atmospheric level
          </div>
        </div>

        {/* Visibility */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Eye size={16} />
            <span>Visibility</span>
          </div>
          <div className="detail-card-val">{weather.visibility} <span style={{ fontSize: '0.9rem' }}>km</span></div>
          <div className="detail-card-desc">
            {weather.visibility >= 10 ? 'Optimal clear sight' : 'Moderate visibility'}
          </div>
        </div>

        {/* Cloudiness */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Cloud size={16} />
            <span>Cloudiness</span>
          </div>
          <div className="detail-card-val">{weather.cloudiness}%</div>
          <div className="detail-card-desc">
            {weather.cloudiness > 80 ? 'Overcast sky' : weather.cloudiness > 40 ? 'Partly cloudy' : 'Clear skies'}
          </div>
        </div>

        {/* Sunrise */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Sunrise size={16} />
            <span>Sunrise</span>
          </div>
          <div className="detail-card-val" style={{ fontSize: '1.35rem' }}>{weather.sunrise}</div>
          <div className="detail-card-desc">
            First light of the day
          </div>
        </div>

        {/* Sunset */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Sunset size={16} />
            <span>Sunset</span>
          </div>
          <div className="detail-card-val" style={{ fontSize: '1.35rem' }}>{weather.sunset}</div>
          <div className="detail-card-desc">
            Dusk and night transition
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherDetails;
