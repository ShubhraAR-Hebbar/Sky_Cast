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
import WeatherAlerts from '../components/WeatherAlerts';
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
    <div className="home-container">
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
          {/* Severe Weather Warnings & Advisories */}
          <WeatherAlerts alerts={weather.alerts} city={weather.city} />

          {/* Main Hero Card */}
          <CurrentWeather weather={weather} unit={unit} />

          {/* 12-Hour Hourly Forecast */}
          <HourlyForecast hourly={weather.hourly} unit={unit} />

          {/* Symmetrical 2-Column Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Left Column: 7-Day Forecast + Precipitation Probability */}
            <div className="dashboard-col-left">
              <DailyForecast daily={weather.daily} unit={unit} />
              <Precipitation precipitation={weather.precipitation} />
            </div>

            {/* Right Column: Wind+UV (2x2) + Sunrise + Atmospheric Details */}
            <div className="dashboard-col-right">
              <div className="highlights-grid-2x2">
                <Wind weather={weather} unit={unit} />
                <UVIndex weather={weather} />
              </div>
              <SunriseSunset weather={weather} />
              <WeatherDetails weather={weather} unit={unit} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
