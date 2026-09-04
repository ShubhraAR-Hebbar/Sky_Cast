import express from 'express';
import { getWeather, getWeatherByCity, getWeatherByCoordinates } from '../controllers/weatherController.js';

const router = express.Router();

// GET /api/weather?city=London or ?lat=LAT&lon=LON
router.get('/', getWeather);

// GET /api/weather/coordinates?lat=LAT&lon=LON
router.get('/coordinates', getWeatherByCoordinates);

// Friendly handler for /api/weather/city with no param
router.get('/city', (req, res) => {
  if (req.query.city || req.query.q) {
    return getWeatherByCity(req, res);
  }
  return res.status(400).json({
    success: false,
    error: 'Please specify a city name, e.g., /api/weather/city/London or /api/weather/city?city=London'
  });
});

// GET /api/weather/city/:city
router.get('/city/:city', getWeatherByCity);

// GET /api/weather/:city (direct city query fallback, ignores reserved paths)
router.get('/:city', (req, res, next) => {
  if (['coordinates', 'city', 'health'].includes(req.params.city)) {
    return next();
  }
  return getWeatherByCity(req, res);
});

export default router;
