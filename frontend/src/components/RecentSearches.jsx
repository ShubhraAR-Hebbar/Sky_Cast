import React from 'react';
import { History, Trash2 } from 'lucide-react';

export const RecentSearches = ({ searches = [], onSelectCity, onClearHistory }) => {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="recent-searches">
      <span className="recent-label">
        <History size={14} style={{ color: 'var(--theme-accent)' }} />
        Recent Searches:
      </span>
      {searches.map((city) => (
        <button
          key={city}
          type="button"
          className="recent-pill"
          onClick={() => onSelectCity(city)}
          title={`View weather for ${city}`}
        >
          {city}
        </button>
      ))}

      <button
        type="button"
        className="recent-clear-btn"
        onClick={onClearHistory}
        title="Clear search history"
      >
        <Trash2 size={13} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
        Clear
      </button>
    </div>
  );
};

export default RecentSearches;
