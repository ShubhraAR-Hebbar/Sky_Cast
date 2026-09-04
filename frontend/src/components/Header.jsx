import React, { useState } from 'react';
import { Cloud, MapPin, Loader2, Menu, X, SunMedium } from 'lucide-react';

export const Header = ({
  activePage,
  setActivePage,
  unit,
  setUnit,
  onUseCurrentLocation,
  isLocating
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* SkyCast Brand */}
        <div className="brand" onClick={() => handleNavClick('home')}>
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
          <div>
            <span className="brand-title">SkyCast</span>
            <span className="brand-badge">LIVE</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <button
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activePage === 'forecast' ? 'active' : ''}`}
            onClick={() => handleNavClick('forecast')}
          >
            Forecast
          </button>
          <button
            className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            About
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="header-actions">
          {/* PWA Install App Button */}
          {installPrompt && (
            <button
              className="loc-btn"
              onClick={handleInstallClick}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
              }}
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

          {/* Current Location Button */}
          <button
            className="loc-btn"
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
              className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
              onClick={() => setUnit('C')}
              aria-pressed={unit === 'C'}
            >
              °C
            </button>
            <button
              className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
              onClick={() => setUnit('F')}
              aria-pressed={unit === 'F'}
            >
              °F
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            paddingTop: '1rem',
            paddingBottom: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '0.75rem',
          }}
        >
          <button
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
            style={{ textAlign: 'left', width: '100%' }}
          >
            Home Dashboard
          </button>
          <button
            className={`nav-link ${activePage === 'forecast' ? 'active' : ''}`}
            onClick={() => handleNavClick('forecast')}
            style={{ textAlign: 'left', width: '100%' }}
          >
            7-Day Forecast
          </button>
          <button
            className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
            style={{ textAlign: 'left', width: '100%' }}
          >
            About SkyCast
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
