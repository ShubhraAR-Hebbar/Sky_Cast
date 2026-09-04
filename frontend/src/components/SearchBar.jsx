import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { fetchCitySuggestions } from '../services/weatherService';

const POPULAR_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Hyderabad',
  'London',
  'New York',
  'Tokyo'
];

export const SearchBar = ({ onSearch, isLoading, unit, onUnitChange, onLiveGps }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const containerRef = useRef(null);

  // Live Recommendation as user types (debounced)
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await fetchCitySuggestions(searchTerm);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside to close recommendations
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      onSearch(searchTerm.trim());
    }
  };

  const handleSelectSuggestion = (city) => {
    const displayName = city.admin1 ? `${city.name}, ${city.admin1}` : city.name;
    setSearchTerm(displayName);
    setShowSuggestions(false);
    onSearch(city.name);
  };

  const handleCityClick = (city) => {
    setSearchTerm(city);
    setShowSuggestions(false);
    onSearch(city);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <section className="search-section" ref={containerRef}>
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-input-wrapper">
          <Search size={20} className="search-icon-left" />
          <input
            type="text"
            className="search-input"
            placeholder="Search any city or country (e.g. London, Tokyo)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            disabled={isLoading}
            aria-label="City search input"
            autoComplete="off"
          />

          {isSearchingSuggestions && (
            <Loader2 size={16} className="animate-spin search-loader-icon" />
          )}

          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear-btn"
              title="Clear text"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="submit"
            className="search-submit-btn"
            disabled={isLoading || !searchTerm.trim()}
          >
            <span>Search</span>
          </button>
        </form>

        {/* Live Recommendation Dropdown as user types */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions-dropdown">
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(item)}
              >
                <MapPin size={16} className="suggestion-pin-icon" />
                <div className="suggestion-text-wrap">
                  <span className="suggestion-city-name">{item.name}</span>
                  <span className="suggestion-region">
                    {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                  </span>
                </div>
                {item.countryCode && (
                  <span className="suggestion-country-badge">{item.countryCode}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick city suggestions */}
        <div className="quick-cities">
          <span className="quick-city-label">Popular:</span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              className="quick-city-pill"
              onClick={() => handleCityClick(city)}
              disabled={isLoading}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
