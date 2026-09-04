import React from 'react';
import SearchBar from '../components/SearchBar';
import RecentSearches from '../components/RecentSearches';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import WeatherDetails from '../components/WeatherDetails';
import Precipitation from '../components/Precipitation';
import Wind from '../components/Wind';
import UVIndex from '../components/UVIndex';
import SunriseSunset from '../components/SunriseSunset';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export const Home = ({
  weather,
  isLoading,
  error,
  unit,
  recentSearches,
  onSearch,
  onClearRecent,
  onRetry
}) => {
  return (
    <div>
      {/* City Search Bar */}
      <SearchBar onSearch={onSearch} isLoading={isLoading} />

      {/* Recent Searches Pills */}
      <RecentSearches
        searches={recentSearches}
        onSelectCity={onSearch}
        onClearHistory={onClearRecent}
      />

      {/* Error Message Display */}
      {error && !isLoading && (
        <ErrorMessage message={error} onRetry={onRetry} />
      )}

      {/* Skeleton Loading State */}
      {isLoading && <Loading />}

      {/* Weather Dashboard Content */}
      {!isLoading && !error && weather && (
        <>
          {/* Main Hero Card */}
          <CurrentWeather weather={weather} unit={unit} />

          {/* 12-Hour Hourly Forecast */}
          <HourlyForecast hourly={weather.hourly} unit={unit} />

          {/* 2-Column Responsive Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Left Column: Multi-Day & Precipitation */}
            <div className="dashboard-col">
              <DailyForecast daily={weather.daily} unit={unit} />
              <Precipitation precipitation={weather.precipitation} />
            </div>

            {/* Right Column: In-depth atmospheric metrics */}
            <div className="dashboard-col">
              <WeatherDetails weather={weather} unit={unit} />
              
              <div className="wind-uv-grid">
                <Wind weather={weather} unit={unit} />
                <UVIndex weather={weather} />
              </div>

              <SunriseSunset weather={weather} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
