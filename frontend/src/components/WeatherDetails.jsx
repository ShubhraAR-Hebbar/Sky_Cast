import React from 'react';
import {
  Droplets,
  Gauge,
  Eye,
  Cloud,
  Layers
} from 'lucide-react';

export const WeatherDetails = ({ weather, unit = 'C' }) => {
  if (!weather) return null;

  // Compute dew point approximation: T - (100 - RH)/5
  const dewPoint = Math.round(weather.temperature - (100 - weather.humidity) / 5);

  return (
    <section className="glass-card weather-details-section">
      <h2 className="section-heading" style={{ marginBottom: '0.85rem' }}>
        <Layers size={18} />
        <span>Atmospheric Conditions</span>
      </h2>

      <div className="details-cards-grid-4">
        {/* Humidity */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Droplets size={16} />
            <span>Humidity</span>
          </div>
          <div className="detail-card-val">{weather.humidity}%</div>
          <div className="detail-card-desc">
            Dew point: {dewPoint}°{unit}
          </div>
        </div>

        {/* Pressure */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Gauge size={16} />
            <span>Pressure</span>
          </div>
          <div className="detail-card-val">
            {weather.pressure} <span style={{ fontSize: '0.85rem' }}>hPa</span>
          </div>
          <div className="detail-card-desc">
            Standard atmospheric
          </div>
        </div>

        {/* Visibility */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Eye size={16} />
            <span>Visibility</span>
          </div>
          <div className="detail-card-val">
            {weather.visibility} <span style={{ fontSize: '0.85rem' }}>km</span>
          </div>
          <div className="detail-card-desc">
            {weather.visibility >= 10 ? 'Clear line of sight' : 'Moderate visibility'}
          </div>
        </div>

        {/* Cloudiness */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Cloud size={16} />
            <span>Cloud Cover</span>
          </div>
          <div className="detail-card-val">{weather.cloudiness}%</div>
          <div className="detail-card-desc">
            {weather.cloudiness > 80 ? 'Overcast sky' : weather.cloudiness > 40 ? 'Partly cloudy' : 'Clear skies'}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherDetails;
