import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import About from './pages/About';
import MobileNavBar from './components/MobileNavBar';
import { fetchCityWeather, fetchCoordinateWeather } from './services/weatherService';
import { getThemeClass, getWeatherBackground } from './utils/weatherUtils';

const DEFAULT_CITY = 'Bengaluru';
const RECENT_KEY = 'skycast_recent_searches';
const UNIT_KEY = 'skycast_temp_unit';
const VIEW_MODE_KEY = 'skycast_view_mode';

export const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem(UNIT_KEY) || 'C';
  });
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(VIEW_MODE_KEY) || 'auto';
  });
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(DEFAULT_CITY);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : ['Bengaluru', 'Mumbai', 'London', 'Tokyo'];
    } catch (e) {
      return ['Bengaluru', 'Mumbai', 'London', 'Tokyo'];
    }
  });

  // Save recent searches to localStorage
  const addRecentSearch = (city) => {
    if (!city) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, 6);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  // Save temperature unit preference
  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem(UNIT_KEY, newUnit);
  };

  // Save device view mode preference (auto / laptop / mobile)
  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    localStorage.setItem(VIEW_MODE_KEY, newMode);
  };

  // Fetch weather by city name
  const loadCityWeather = async (city) => {
    setIsLoading(true);
    setError(null);
    setLastQuery(city);

    try {
      const data = await fetchCityWeather(city);
      setWeather(data);
      addRecentSearch(data.city);
    } catch (err) {
      setError(err.message || 'Unable to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please search for a city.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setIsLoading(true);
        try {
          const data = await fetchCoordinateWeather(latitude, longitude);
          setWeather(data);
          addRecentSearch(data.city);
          if (activePage !== 'home') setActivePage('home');
        } catch (err) {
          setError(err.message || 'Unable to fetch weather for your location.');
        } finally {
          setIsLoading(false);
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        setError('Unable to access your location. Please search for a city.');
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Initial load
  useEffect(() => {
    loadCityWeather(DEFAULT_CITY);
  }, []);

  // Update dynamic theme and picture based on weather
  const themeClass = getThemeClass(weather);
  const backgroundImage = getWeatherBackground(weather);

  return (
    <div className={`app-wrapper ${themeClass} mode-${viewMode}`}>
      {/* Real-time Dynamic Weather Picture Background */}
      <div className="weather-bg-container">
        <img
          key={backgroundImage}
          src={backgroundImage}
          alt={weather ? `${weather.condition} weather background` : 'SkyCast Weather'}
          className="weather-bg-img"
        />
        <div className="weather-bg-overlay" />
      </div>

      {/* Top Banner when in Mobile Simulator Mode on Desktop */}
      {viewMode === 'mobile' && (
        <aside className="device-simulator-banner" aria-label="Device Simulator Alert">
          <span>📱 Viewing in <strong>Mobile View</strong></span>
          <button
            type="button"
            className="simulator-switch-btn"
            onClick={() => handleViewModeChange('laptop')}
          >
            Switch to Laptop View 💻
          </button>
        </aside>
      )}

      {/* Top Navbar */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        unit={unit}
        setUnit={handleUnitChange}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        viewMode={viewMode}
        setViewMode={handleViewModeChange}
      />

      {/* Main Page Content - Wrapped in Phone Simulator Frame when in Mobile Mode on Desktop */}
      <div className={viewMode === 'mobile' ? 'phone-frame-wrapper' : 'desktop-view-wrapper'}>
        {viewMode === 'mobile' && (
          <div className="phone-island-notch">
            <div className="phone-speaker" />
            <div className="phone-lens" />
          </div>
        )}

        <main className={`main-content ${viewMode === 'mobile' ? 'phone-screen-content' : ''}`}>
          {activePage === 'home' && (
            <Home
              weather={weather}
              isLoading={isLoading}
              error={error}
              unit={unit}
              recentSearches={recentSearches}
              onSearch={(city) => {
                loadCityWeather(city);
              }}
              onClearRecent={handleClearRecent}
              onRetry={() => loadCityWeather(lastQuery)}
            />
          )}

          {activePage === 'forecast' && (
            <Forecast weather={weather} unit={unit} />
          )}

          {activePage === 'about' && (
            <About />
          )}
        </main>

        {viewMode === 'mobile' && <div className="phone-home-indicator" />}
      </div>

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens and in mobile simulator mode) */}
      <MobileNavBar
        activePage={activePage}
        setActivePage={setActivePage}
        unit={unit}
        setUnit={handleUnitChange}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
      />

      {/* Modern Footer */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} <strong>SkyCast</strong> — Real-time atmospheric intelligence. Optimized for Mobile & Laptop.
        </p>
      </footer>
    </div>
  );
};

export default App;
