import * as weatherService from '../services/weatherService.js';

/**
 * Controller to handle city weather requests
 * GET /api/weather/city/:city
 */
export const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid city name.'
      });
    }

    const weatherData = await weatherService.fetchWeatherByCity(city.trim());
    return res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    const message = error.message || 'Unable to fetch weather data. Please try again.';
    const statusCode = message.includes('City not found') ? 404 : 500;
    
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  }
};

/**
 * Controller to handle coordinate weather requests
 * GET /api/weather/coordinates?lat=LAT&lon=LON
 */
export const getWeatherByCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude query parameters are required.'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        error: 'Valid coordinates are required (-90 <= lat <= 90, -180 <= lon <= 180).'
      });
    }

    const weatherData = await weatherService.fetchWeatherByCoordinates(latitude, longitude);
    return res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Unable to fetch weather data for your location. Please try again.'
    });
  }
};
