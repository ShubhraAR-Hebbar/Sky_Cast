import React, { useState } from 'react';
import { Cloud, MapPin, Loader2 } from 'lucide-react';

export const Header = ({
  activePage,
  setActivePage,
  unit,
  setUnit,
  onUseCurrentLocation,
  isLocating
}) => {
  const [installPrompt, setInstallPrompt] = useState(null);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* SkyCast Brand */}
        <div className="brand" onClick={() => setActivePage('home')}>
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.5 18C4.01472 18 2 15.9853 2 13.5C2 11.2398 3.66986 9.36952 5.86475 9.04943C6.3986 6.1775 8.8986 4 11.9 4C15.352 4 18.15 6.798 18.15 10.25C18.15 10.5342 18.131 10.8139 18.0939 11.0882C20.298 11.5361 22 13.4862 22 15.8C22 18.451 19.851 20.6 17.2 20.6L6.5 20.6"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="16" cy="8" r="2.5" fill="#fbbf24" />
            </svg>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">SkyCast</span>
            <span className="brand-badge">LIVE</span>
          </div>
        </div>

        {/* Desktop Navigation Links (Laptop / Desktop only) */}
        <nav className="nav-links">
          <button
            type="button"
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link ${activePage === 'forecast' ? 'active' : ''}`}
            onClick={() => setActivePage('forecast')}
          >
            Forecast
          </button>
          <button
            type="button"
            className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
            onClick={() => setActivePage('about')}
          >
            About
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="header-actions">
          {/* PWA Install App Button (Desktop only) */}
          {installPrompt && (
            <button
              type="button"
              className="loc-btn install-btn-desktop"
              onClick={handleInstallClick}
              title="Install SkyCast on your device"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Install App</span>
            </button>
          )}

          {/* Current Location Button (Laptop / Desktop only; mobile uses bottom nav) */}
          <button
            type="button"
            className="loc-btn desktop-loc-btn"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            title="Detect your current weather via GPS"
          >
            {isLocating ? (
              <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <MapPin size={16} style={{ color: 'var(--theme-accent)' }} />
            )}
            <span className="loc-btn-text">
              {isLocating ? 'Locating...' : 'Current Location'}
            </span>
          </button>

          {/* Temperature Unit Toggle (°C / °F) */}
          <div className="unit-toggle" role="group" aria-label="Temperature unit selector">
            <button
              type="button"
              className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
              onClick={() => setUnit('C')}
              aria-pressed={unit === 'C'}
            >
              °C
            </button>
            <button
              type="button"
              className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
              onClick={() => setUnit('F')}
              aria-pressed={unit === 'F'}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
