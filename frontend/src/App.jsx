import React, { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import { fetchCityWeather, fetchCoordinateWeather, fetchAutoIpLocation } from './services/weatherService';
import { getThemeClass, getWeatherBackground } from './utils/weatherUtils';

const DEFAULT_CITY = 'Bengaluru';
const RECENT_KEY = 'skycast_recent_searches';
const UNIT_KEY = 'skycast_temp_unit';
const COORDS_KEY = 'skycast_last_coords';
const WEATHER_CACHE_KEY = 'skycast_cached_weather_snapshot';

export const App = () => {
  const [unit, setUnit] = useState(() => localStorage.getItem(UNIT_KEY) || 'C');
  
  // Instant Cold-Start Cache: Zero-millisecond startup time
  const [weather, setWeather] = useState(() => {
    try {
      const cached = localStorage.getItem(WEATHER_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  // If cached weather exists, show UI instantly with 0ms delay
  const [isLoading, setIsLoading] = useState(() => {
    try {
      return !localStorage.getItem(WEATHER_CACHE_KEY);
    } catch (e) {
      return true;
    }
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isLiveGps, setIsLiveGps] = useState(true);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(DEFAULT_CITY);
  const watchIdRef = useRef(null);

  // Helper to persist weather state to storage for instant subsequent startups
  const updateWeather = (data) => {
    if (data && data.temperature !== undefined) {
      setWeather(data);
      try {
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(data));
      } catch (e) {}
    }
  };

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : ['Bengaluru', 'Mumbai', 'London', 'Tokyo'];
    } catch (e) {
      return ['Bengaluru', 'Mumbai', 'London', 'Tokyo'];
    }
  });

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

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem(UNIT_KEY, newUnit);
  };

  // Fetch weather by city name (manual search)
  const loadCityWeather = async (city) => {
    setIsLoading(true);
    setError(null);
    setLastQuery(city);
    setIsLiveGps(false);

    try {
      const data = await fetchCityWeather(city);
      updateWeather(data);
      addRecentSearch(data.city);
    } catch (err) {
      setError(err.message || 'Unable to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Live Auto GPS Location Tracker (Active & Silent Background Refresh)
  const startLiveLocationTracking = (isManual = false) => {
    setIsLocating(true);
    if (isManual) {
      setIsLoading(true);
      setError(null);
    }

    if (!navigator.geolocation) {
      if (isManual) setError('Geolocation is not supported on this device.');
      else if (!weather) {
        fetchAutoIpLocation().then(data => {
          if (data) {
            updateWeather(data);
            setIsLoading(false);
          } else loadCityWeather(DEFAULT_CITY);
        }).catch(() => loadCityWeather(DEFAULT_CITY));
      }
      setIsLocating(false);
      return;
    }

    // Fast GPS request (4s timeout, 60s maxAge for instant cached GPS lock)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem(COORDS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
        setIsLiveGps(true);
        try {
          const data = await fetchCoordinateWeather(latitude, longitude);
          updateWeather(data);
          addRecentSearch(data.city);
        } catch (err) {
          console.warn('Coordinate weather fetch failed:', err);
          if (isManual) setError('Unable to fetch live weather for your location.');
          else if (!weather) loadCityWeather(DEFAULT_CITY);
        } finally {
          setIsLoading(false);
          setIsLocating(false);
        }
      },
      async (err) => {
        console.warn('Geolocation fast lock note:', err.message);
        setIsLocating(false);
        if (isManual) {
          setError('Location access not available. Showing local area weather.');
          setIsLoading(false);
        }
        
        // Fast IP-based location fallback
        if (!weather) {
          const cached = localStorage.getItem(COORDS_KEY);
          if (cached) {
            try {
              const { lat, lon } = JSON.parse(cached);
              const data = await fetchCoordinateWeather(lat, lon);
              updateWeather(data);
              setIsLiveGps(true);
              setIsLoading(false);
              return;
            } catch(e) {}
          }

          try {
            const ipData = await fetchAutoIpLocation();
            if (ipData) {
              updateWeather(ipData);
              setIsLiveGps(true);
            } else {
              loadCityWeather(DEFAULT_CITY);
            }
          } catch (e) {
            loadCityWeather(DEFAULT_CITY);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { enableHighAccuracy: true, timeout: 4000, maximumAge: 60000 }
    );

    // Continuous watchPosition in background
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem(COORDS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
        setIsLiveGps(true);
        try {
          const data = await fetchCoordinateWeather(latitude, longitude);
          updateWeather(data);
        } catch(e) {}
      },
      (err) => console.warn('WatchPosition note:', err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  // Initial load: Instant 0ms Cold Start + Parallel Fresh Sync
  useEffect(() => {
    // 1. Parallel Instant IP / Cached coords check
    const cachedCoords = localStorage.getItem(COORDS_KEY);
    if (cachedCoords) {
      try {
        const { lat, lon } = JSON.parse(cachedCoords);
        fetchCoordinateWeather(lat, lon).then(data => {
          if (data) {
            updateWeather(data);
            setIsLoading(false);
          }
        }).catch(() => {});
      } catch (e) {}
    } else if (!weather) {
      // Instant IP detection in parallel so screen is never blank
      fetchAutoIpLocation().then(data => {
        if (data) {
          updateWeather(data);
          setIsLoading(false);
        }
      }).catch(() => {});
    }

    // 2. Start high-accuracy GPS tracking
    startLiveLocationTracking(false);

    // Auto-refresh weather every 5 minutes
    const interval = setInterval(() => {
      const stored = localStorage.getItem(COORDS_KEY);
      if (stored) {
        try {
          const { lat, lon } = JSON.parse(stored);
          fetchCoordinateWeather(lat, lon).then(updateWeather).catch(() => {});
        } catch (e) {}
      }
    }, 300000);

    return () => {
      clearInterval(interval);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const themeClass = getThemeClass(weather);
  const backgroundImage = getWeatherBackground(weather);

  return (
    <div className={`app-wrapper ${themeClass}`}>
      {/* Real-time Dynamic Weather Picture Background with Strong Depth Blur */}
      <div className="weather-bg-container">
        <img
          key={backgroundImage}
          src={backgroundImage}
          alt={weather ? `${weather.condition} weather background` : 'SkyCast Weather'}
          className="weather-bg-img"
        />
        <div className="weather-bg-overlay" />
      </div>

      {/* Main Content */}
      <main className="main-content">
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
          onRetry={() => {
            if (isLiveGps) startLiveLocationTracking(true);
            else loadCityWeather(lastQuery);
          }}
        />
      </main>
    </div>
  );
};

export default App;
