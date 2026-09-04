import React from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Moon,
  CloudMoon,
  CloudDrizzle,
  Wind
} from 'lucide-react';

/**
 * Format temperature based on unit ('C' or 'F')
 */
export const formatTemp = (celsiusTemp, unit = 'C') => {
  if (celsiusTemp === undefined || celsiusTemp === null || isNaN(celsiusTemp)) {
    return '--';
  }
  if (unit === 'F') {
    const fahrenheit = Math.round((celsiusTemp * 9) / 5 + 32);
    return `${fahrenheit}°`;
  }
  return `${Math.round(celsiusTemp)}°`;
};

/**
 * Format raw temperature value without degree symbol
 */
export const getTempValue = (celsiusTemp, unit = 'C') => {
  if (celsiusTemp === undefined || celsiusTemp === null || isNaN(celsiusTemp)) {
    return '--';
  }
  if (unit === 'F') {
    return Math.round((celsiusTemp * 9) / 5 + 32);
  }
  return Math.round(celsiusTemp);
};

/**
 * Format wind speed based on unit (m/s for C, mph for F)
 */
export const formatWindSpeed = (speedMs, unit = 'C') => {
  if (speedMs === undefined || speedMs === null) return '--';
  if (unit === 'F') {
    const mph = (speedMs * 2.23694).toFixed(1);
    return `${mph} mph`;
  }
  return `${speedMs} m/s`;
};

/**
 * High-definition dynamic background image matching current weather conditions
 */
export const getWeatherBackground = (weather) => {
  if (!weather) {
    // Default sunny sky
    return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=2000&q=85';
  }

  const cond = (weather.condition || '').toLowerCase();
  const desc = (weather.description || '').toLowerCase();
  const isDay = weather.isDay;

  // Night condition
  if (!isDay && !cond.includes('thunder')) {
    return 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?auto=format&fit=crop&w=2000&q=85'; // Deep starry night sky
  }

  // Thunderstorm / Lightning
  if (cond.includes('thunder') || cond.includes('storm')) {
    return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=2000&q=85'; // Dramatic lightning strike
  }

  // Rain or Heavy Showers
  if (cond.includes('rain')) {
    return 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=2000&q=85'; // Atmospheric raindrops
  }

  // Drizzle
  if (cond.includes('drizzle')) {
    return 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=2000&q=85'; // Soft misting rain drops
  }

  // Snow
  if (cond.includes('snow')) {
    return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=2000&q=85'; // Winter snow scape
  }

  // Fog / Mist / Haze
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze') || cond.includes('smoke')) {
    return 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=2000&q=85'; // Misty fog morning
  }

  // Cloudy / Overcast
  if (cond.includes('cloud')) {
    if (desc.includes('scattered') || desc.includes('few') || desc.includes('broken') || desc.includes('partly')) {
      return 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=2000&q=85'; // Sunlit blue sky with soft white clouds
    }
    return 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=2000&q=85'; // Dramatic rolling overcast cloudscape
  }

  // Clear / Sunny
  return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=2000&q=85'; // Brilliant sunny day with clear azure sky
};

/**
 * Maps condition and iconCode to a Lucide icon component with customized size and styling
 */
export const getWeatherIcon = (condition, isDay = true, iconCode = '', size = 28, className = '') => {
  const cond = (condition || '').toLowerCase();
  const icon = (iconCode || '').toLowerCase();

  // Clear Sky
  if (cond.includes('clear')) {
    if (!isDay || icon.includes('n')) {
      return <Moon size={size} className={className} style={{ color: '#c7d2fe' }} />;
    }
    return <Sun size={size} className={className} style={{ color: '#fbbf24' }} />;
  }

  // Thunderstorm
  if (cond.includes('thunder') || cond.includes('storm')) {
    return <CloudLightning size={size} className={className} style={{ color: '#c084fc' }} />;
  }

  // Rain
  if (cond.includes('rain')) {
    return <CloudRain size={size} className={className} style={{ color: '#38bdf8' }} />;
  }

  // Drizzle
  if (cond.includes('drizzle')) {
    return <CloudDrizzle size={size} className={className} style={{ color: '#7dd3fc' }} />;
  }

  // Snow
  if (cond.includes('snow')) {
    return <CloudSnow size={size} className={className} style={{ color: '#a5f3fc' }} />;
  }

  // Fog / Mist / Haze
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze') || cond.includes('smoke')) {
    return <CloudFog size={size} className={className} style={{ color: '#cbd5e1' }} />;
  }

  // Clouds
  if (cond.includes('cloud')) {
    if (cond.includes('few') || cond.includes('scattered') || cond.includes('partly')) {
      return isDay ? (
        <CloudSun size={size} className={className} style={{ color: '#93c5fd' }} />
      ) : (
        <CloudMoon size={size} className={className} style={{ color: '#a5b4fc' }} />
      );
    }
    return <Cloud size={size} className={className} style={{ color: '#94a3b8' }} />;
  }

  // Default fallback
  return isDay ? (
    <Sun size={size} className={className} style={{ color: '#fbbf24' }} />
  ) : (
    <Moon size={size} className={className} style={{ color: '#c7d2fe' }} />
  );
};

/**
 * Determine dynamic theme CSS class based on weather data
 */
export const getThemeClass = (weather) => {
  if (!weather) return 'theme-clear';

  const cond = (weather.condition || '').toLowerCase();
  const isDay = weather.isDay;

  if (!isDay && !cond.includes('thunder')) {
    return 'theme-night';
  }

  if (cond.includes('thunder') || cond.includes('storm')) {
    return 'theme-thunderstorm';
  }

  if (cond.includes('rain') || cond.includes('drizzle')) {
    return 'theme-rain';
  }

  if (cond.includes('snow')) {
    return 'theme-snow';
  }

  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) {
    return 'theme-mist';
  }

  if (cond.includes('cloud')) {
    return 'theme-clouds';
  }

  return 'theme-clear';
};
