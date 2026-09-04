/**
 * SkyCast Frontend Weather Service
 * Communicates strictly with the secure SkyCast Express backend.
 */

const API_BASE = '/api/weather';

export const fetchCityWeather = async (city) => {
  try {
    const response = await fetch(`${API_BASE}/city/${encodeURIComponent(city.trim())}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Unable to fetch weather data. Please try again.');
    }

    return result.data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Please check your internet connection or verify the backend server is running.');
    }
    throw error;
  }
};

export const fetchCoordinateWeather = async (lat, lon) => {
  try {
    const response = await fetch(`${API_BASE}/coordinates?lat=${lat}&lon=${lon}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Unable to access weather for your coordinates.');
    }

    return result.data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Please check your internet connection or verify the backend server is running.');
    }
    throw error;
  }
};
