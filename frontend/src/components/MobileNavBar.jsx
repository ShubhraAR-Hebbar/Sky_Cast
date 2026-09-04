import React from 'react';
import { CloudSun, Calendar, Info, MapPin, Loader2 } from 'lucide-react';

export const MobileNavBar = ({
  activePage,
  setActivePage,
  unit,
  setUnit,
  onUseCurrentLocation,
  isLocating
}) => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <button
        type="button"
        className={`mobile-nav-item ${activePage === 'home' ? 'active' : ''}`}
        onClick={() => setActivePage('home')}
      >
        <CloudSun size={20} />
        <span>Weather</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${activePage === 'forecast' ? 'active' : ''}`}
        onClick={() => setActivePage('forecast')}
      >
        <Calendar size={20} />
        <span>7-Day</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${activePage === 'about' ? 'active' : ''}`}
        onClick={() => setActivePage('about')}
      >
        <Info size={20} />
        <span>About</span>
      </button>

      <button
        type="button"
        className="mobile-nav-item"
        onClick={onUseCurrentLocation}
        disabled={isLocating}
        title="Current GPS Location"
      >
        {isLocating ? (
          <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <MapPin size={20} style={{ color: 'var(--theme-accent)' }} />
        )}
        <span>{isLocating ? 'Locating' : 'GPS'}</span>
      </button>

      <button
        type="button"
        className="mobile-nav-item"
        onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
        title="Toggle Celsius and Fahrenheit"
      >
        <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--theme-accent)' }}>
          °{unit}
        </span>
        <span>Unit</span>
      </button>
    </nav>
  );
};

export default MobileNavBar;
