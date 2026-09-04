import React from 'react';
import { Wind as WindIcon } from 'lucide-react';
import { formatWindSpeed } from '../utils/weatherUtils';

export const Wind = ({ weather, unit = 'C' }) => {
  if (!weather) return null;

  const speedDisplay = formatWindSpeed(weather.windSpeed, unit);
  const rotationDeg = weather.windDirection || 0;
  const compassDir = weather.windDirectionCompass || 'N';

  return (
    <section className="glass-card wind-card">
      <h2 className="section-heading">
        <WindIcon size={18} />
        <span>Wind & Airflow</span>
      </h2>

      <div className="wind-content-wrap">
        {/* Visual Compass Needle Indicator */}
        <div className="compass-container" title={`Wind blowing from ${rotationDeg}° (${compassDir})`}>
          <span className="compass-cardinal compass-n">N</span>
          <span className="compass-cardinal compass-e">E</span>
          <span className="compass-cardinal compass-s">S</span>
          <span className="compass-cardinal compass-w">W</span>

          {/* Compass Needle pointing in wind direction */}
          <div
            className="compass-needle"
            style={{
              transform: `rotate(${rotationDeg}deg)`
            }}
          />
          <div className="compass-center-dot" />
        </div>

        {/* Readout Data */}
        <div className="wind-data-readout">
          <div className="wind-speed-large">
            {speedDisplay.split(' ')[0]} <span className="wind-speed-unit">{speedDisplay.split(' ')[1]}</span>
          </div>
          <div className="wind-direction-text">
            Direction: <strong>{compassDir}</strong> ({rotationDeg}°)
          </div>
          {weather.windGust ? (
            <div className="wind-gust-text">
              Peak gusts: {formatWindSpeed(weather.windGust, unit)}
            </div>
          ) : (
            <div className="wind-gust-text">
              Status: Steady airflow
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Wind;
