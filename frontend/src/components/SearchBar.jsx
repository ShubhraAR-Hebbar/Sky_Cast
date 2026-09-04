import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

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

export const SearchBar = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleCityClick = (city) => {
    setSearchTerm(city);
    onSearch(city);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <section className="search-section">
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-input-wrapper">
          <Search size={20} className="search-icon-left" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city... (e.g. Bengaluru, London, Tokyo)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
            aria-label="City search input"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                color: 'var(--theme-text-muted)',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
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
