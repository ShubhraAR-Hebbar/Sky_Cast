import express from 'express';
import { getWeatherByCity, getWeatherByCoordinates } from '../controllers/weatherController.js';

const router = express.Router();

// GET /api/weather/city/:city
router.get('/city/:city', getWeatherByCity);

// GET /api/weather/coordinates?lat=LAT&lon=LON
router.get('/coordinates', getWeatherByCoordinates);

export default router;
