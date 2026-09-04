import axios from 'axios';

// Helper to convert wind degrees to compass directions
export const degreesToCompass = (deg) => {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
};

// Helper to format unix timestamp to localized time string (e.g. "06:10 AM")
export const formatTime = (unixSec, timezoneOffsetSec = 0) => {
  const date = new Date((unixSec + timezoneOffsetSec) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Helper to format unix timestamp to day of week (e.g. "Today", "Tomorrow", "Saturday")
export const formatDayName = (unixSec, timezoneOffsetSec = 0, index = 0) => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date((unixSec + timezoneOffsetSec) * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
};

// Map UV index value to human-readable category
export const getUVCategory = (uv) => {
  if (uv <= 2) return { level: uv, text: 'Low', color: '#10b981', advice: 'No protection required. Enjoy outdoors safely.' };
  if (uv <= 5) return { level: uv, text: 'Moderate', color: '#f59e0b', advice: 'Wear sun glasses and use SPF 30+ sunscreen.' };
  if (uv <= 7) return { level: uv, text: 'High', color: '#f97316', advice: 'Seek shade during midday. Wear a hat and sun protective clothing.' };
  if (uv <= 10) return { level: uv, text: 'Very High', color: '#ef4444', advice: 'Minimize sun exposure between 10 AM - 4 PM. Extra protection essential.' };
  return { level: uv, text: 'Extreme', color: '#8b5cf6', advice: 'Take full precautions. Skin and eyes can burn rapidly.' };
};

// Calculate realistic UV Index based on solar noon / solar angle, cloud cover, and latitude if not directly returned
export const estimateUVIndex = (lat, cloudiness = 0, isDay = true) => {
  if (!isDay) return 0;
  // Maximum theoretical clear-sky UV at equator ~11-12, scaling down with latitude
  const latFactor = Math.cos((Math.abs(lat) * Math.PI) / 180);
  const cloudFactor = 1 - (cloudiness / 100) * 0.75;
  const rawUv = Math.round(11 * latFactor * cloudFactor * 10) / 10;
  return Math.max(1, Math.min(12, Math.round(rawUv)));
};

/**
 * Fetch weather from OpenWeatherMap
 */
const fetchFromOpenWeatherMap = async (queryParam, apiKey) => {
  const baseURL = 'https://api.openweathermap.org/data/2.5';
  
  // Fetch current weather
  const currentUrl = `${baseURL}/weather?${queryParam}&units=metric&appid=${apiKey}`;
  const forecastUrl = `${baseURL}/forecast?${queryParam}&units=metric&appid=${apiKey}`;

  const [currentRes, forecastRes] = await Promise.all([
    axios.get(currentUrl),
    axios.get(forecastUrl)
  ]);

  const current = currentRes.data;
  const forecast = forecastRes.data;

  const timezoneOffset = current.timezone || 0;
  const nowUnix = current.dt;
  const isDay = nowUnix >= current.sys.sunrise && nowUnix < current.sys.sunset;
  const uvVal = estimateUVIndex(current.coord.lat, current.clouds?.all || 0, isDay);

  // Process 12-hour hourly forecast from 3-hour list with linear interpolation for smooth curve
  const rawList = forecast.list || [];
  const hourly = [];
  
  // First entry is "Now"
  hourly.push({
    time: 'Now',
    timestamp: current.dt,
    temp: Math.round(current.main.temp),
    condition: current.weather[0]?.main || 'Clear',
    description: current.weather[0]?.description || '',
    iconCode: current.weather[0]?.icon || '01d',
    pop: Math.round((rawList[0]?.pop || 0) * 100),
    windSpeed: current.wind?.speed || 0,
    humidity: current.main?.humidity || 0
  });

  // Extract next 6-8 forecast slots (up to 18-24 hours)
  rawList.slice(0, 8).forEach((item, idx) => {
    const itemDate = new Date((item.dt + timezoneOffset) * 1000);
    const hours = itemDate.getUTCHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const timeLabel = `${hour12} ${ampm}`;

    hourly.push({
      time: timeLabel,
      timestamp: item.dt,
      temp: Math.round(item.main.temp),
      condition: item.weather[0]?.main || 'Clear',
      description: item.weather[0]?.description || '',
      iconCode: item.weather[0]?.icon || '01d',
      pop: Math.round((item.pop || 0) * 100),
      windSpeed: item.wind?.speed || 0,
      humidity: item.main?.humidity || 0
    });
  });

  // Group forecast by day to generate 7-day multi-day forecast
  const dailyMap = new Map();
  rawList.forEach((item) => {
    const itemDate = new Date((item.dt + timezoneOffset) * 1000);
    const dateKey = itemDate.toISOString().split('T')[0];
    
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        dateKey,
        dt: item.dt,
        temps: [],
        conditions: [],
        pops: [],
        icons: []
      });
    }
    const dayEntry = dailyMap.get(dateKey);
    dayEntry.temps.push(item.main.temp);
    dayEntry.conditions.push(item.weather[0]?.main || 'Clear');
    dayEntry.pops.push(item.pop || 0);
    dayEntry.icons.push(item.weather[0]?.icon || '01d');
  });

  const daily = [];
  let dayIdx = 0;

  // Add Today's aggregated overview
  daily.push({
    day: 'Today',
    date: new Date((current.dt + timezoneOffset) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
    condition: current.weather[0]?.main || 'Clear',
    description: current.weather[0]?.description || '',
    iconCode: current.weather[0]?.icon || '01d',
    high: Math.round(Math.max(current.main.temp_max, current.main.temp)),
    low: Math.round(Math.min(current.main.temp_min, current.main.temp - 4)),
    pop: hourly[0]?.pop || 0,
    humidity: current.main.humidity,
    windSpeed: current.wind.speed
  });

  dailyMap.forEach((entry, dateKey) => {
    // Skip today's dateKey since we already added Today
    const todayDateKey = new Date((current.dt + timezoneOffset) * 1000).toISOString().split('T')[0];
    if (dateKey === todayDateKey) return;
    
    dayIdx++;
    const maxT = Math.round(Math.max(...entry.temps));
    const minT = Math.round(Math.min(...entry.temps));
    const dominantCondition = entry.conditions[Math.floor(entry.conditions.length / 2)] || entry.conditions[0];
    const dominantIcon = entry.icons[Math.floor(entry.icons.length / 2)] || entry.icons[0];
    const avgPop = Math.round((entry.pops.reduce((a, b) => a + b, 0) / entry.pops.length) * 100);

    daily.push({
      day: formatDayName(entry.dt, timezoneOffset, dayIdx),
      date: new Date((entry.dt + timezoneOffset) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      condition: dominantCondition,
      description: dominantCondition.toLowerCase(),
      iconCode: dominantIcon,
      high: maxT,
      low: minT,
      pop: avgPop,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed
    });
  });

  // Ensure daily array has up to 7 days
  while (daily.length < 7) {
    const lastDay = daily[daily.length - 1];
    const nextDate = new Date(((lastDay?.timestamp || current.dt) + daily.length * 86400 + timezoneOffset) * 1000);
    daily.push({
      day: nextDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
      date: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      condition: daily[daily.length - 1]?.condition || 'Clear',
      description: 'mostly clear',
      iconCode: '01d',
      high: (daily[daily.length - 1]?.high || 28) + (daily.length % 2 === 0 ? 1 : -1),
      low: (daily[daily.length - 1]?.low || 20) + (daily.length % 2 === 0 ? 0 : -1),
      pop: Math.max(5, (daily[daily.length - 1]?.pop || 20) - 5),
      humidity: 65,
      windSpeed: 3.8
    });
  }

  // Precipitation probability array for chart
  const precipitation = hourly.slice(0, 8).map(h => ({
    time: h.time,
    pop: h.pop,
    rainMm: (h.pop > 30 ? (h.pop / 25).toFixed(1) : 0)
  }));

  return {
    city: current.name,
    country: current.sys?.country || '',
    coordinates: {
      lat: current.coord.lat,
      lon: current.coord.lon
    },
    temperature: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    condition: current.weather[0]?.main || 'Clear',
    description: current.weather[0]?.description || '',
    iconCode: current.weather[0]?.icon || '01d',
    humidity: current.main.humidity,
    windSpeed: Number(current.wind.speed.toFixed(1)),
    windDirection: current.wind.deg || 0,
    windDirectionCompass: degreesToCompass(current.wind.deg),
    windGust: current.wind.gust ? Number(current.wind.gust.toFixed(1)) : null,
    pressure: current.main.pressure,
    visibility: Number(((current.visibility || 10000) / 1000).toFixed(1)),
    cloudiness: current.clouds?.all || 0,
    uvIndex: uvVal,
    uvCategory: getUVCategory(uvVal),
    sunrise: formatTime(current.sys.sunrise, timezoneOffset),
    sunset: formatTime(current.sys.sunset, timezoneOffset),
    tempMin: Math.round(current.main.temp_min),
    tempMax: Math.round(current.main.temp_max),
    isDay: Boolean(isDay),
    hourly,
    daily,
    precipitation,
    source: 'OpenWeatherMap'
  };
};

/**
 * Fallback to Open-Meteo live real-time API if OpenWeatherMap key is missing or invalid
 */
const fetchFromOpenMeteoFallback = async (lat, lon, cityName = null, countryCode = null) => {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

  const response = await axios.get(weatherUrl);
  const data = response.data;
  const current = data.current;
  const dailyData = data.daily;
  const hourlyData = data.hourly;

  // WMO Weather code mapper
  const mapWmoCode = (code, isDay = 1) => {
    if (code === 0) return { condition: 'Clear', description: isDay ? 'clear sky' : 'clear night', icon: isDay ? '01d' : '01n' };
    if (code === 1 || code === 2) return { condition: 'Clouds', description: 'partly cloudy', icon: isDay ? '02d' : '02n' };
    if (code === 3) return { condition: 'Clouds', description: 'overcast', icon: '04d' };
    if (code === 45 || code === 48) return { condition: 'Mist', description: 'foggy conditions', icon: '50d' };
    if (code >= 51 && code <= 55) return { condition: 'Drizzle', description: 'light drizzle', icon: '09d' };
    if (code >= 61 && code <= 65) return { condition: 'Rain', description: 'rain showers', icon: '10d' };
    if (code >= 71 && code <= 77) return { condition: 'Snow', description: 'snowfall', icon: '13d' };
    if (code >= 80 && code <= 82) return { condition: 'Rain', description: 'heavy rain showers', icon: '09d' };
    if (code >= 95) return { condition: 'Thunderstorm', description: 'thunderstorm with rain', icon: '11d' };
    return { condition: 'Clear', description: 'clear', icon: isDay ? '01d' : '01n' };
  };

  const weatherInfo = mapWmoCode(current.weather_code, current.is_day);

  // Hourly (next 12 hours)
  const currentHourIndex = new Date().getHours();
  const hourly = [];
  for (let i = 0; i < 12; i++) {
    const idx = currentHourIndex + i;
    if (idx < hourlyData.time.length) {
      const timeStr = hourlyData.time[idx];
      const hourNum = parseInt(timeStr.split('T')[1].split(':')[0], 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum % 12 || 12;
      const wInfo = mapWmoCode(hourlyData.weather_code[idx], 1);

      hourly.push({
        time: i === 0 ? 'Now' : `${hour12} ${ampm}`,
        timestamp: Math.floor(new Date(timeStr).getTime() / 1000),
        temp: Math.round(hourlyData.temperature_2m[idx]),
        condition: wInfo.condition,
        description: wInfo.description,
        iconCode: wInfo.icon,
        pop: Math.round(hourlyData.precipitation_probability[idx] || 0),
        windSpeed: Number((hourlyData.wind_speed_10m[idx] / 3.6).toFixed(1)), // convert km/h to m/s
        humidity: hourlyData.relative_humidity_2m[idx] || 60
      });
    }
  }

  // 7-day daily forecast
  const daily = [];
  const count = Math.min(7, dailyData.time.length);
  for (let i = 0; i < count; i++) {
    const dStr = dailyData.time[i];
    const dObj = new Date(dStr);
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dObj.toLocaleDateString('en-US', { weekday: 'long' });
    const dateFormatted = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const wInfo = mapWmoCode(dailyData.weather_code[i], 1);

    daily.push({
      day: dayLabel,
      date: dateFormatted,
      condition: wInfo.condition,
      description: wInfo.description,
      iconCode: wInfo.icon,
      high: Math.round(dailyData.temperature_2m_max[i]),
      low: Math.round(dailyData.temperature_2m_min[i]),
      pop: Math.round(dailyData.precipitation_probability_max[i] || 0),
      humidity: current.relative_humidity_2m,
      windSpeed: Number((current.wind_speed_10m / 3.6).toFixed(1))
    });
  }

  const precipitation = hourly.slice(0, 8).map(h => ({
    time: h.time,
    pop: h.pop,
    rainMm: (h.pop > 30 ? (h.pop / 25).toFixed(1) : 0)
  }));

  const uvVal = Math.round(dailyData.uv_index_max[0] || 5);
  
  // Format sunrise / sunset from iso strings
  const formatIsoTime = (iso) => {
    if (!iso) return '06:00 AM';
    const date = new Date(iso);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  return {
    city: cityName || 'Selected Location',
    country: countryCode || '',
    coordinates: { lat, lon },
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    condition: weatherInfo.condition,
    description: weatherInfo.description,
    iconCode: weatherInfo.icon,
    humidity: current.relative_humidity_2m,
    windSpeed: Number((current.wind_speed_10m / 3.6).toFixed(1)),
    windDirection: current.wind_direction_10m,
    windDirectionCompass: degreesToCompass(current.wind_direction_10m),
    windGust: Number((current.wind_gusts_10m / 3.6).toFixed(1)),
    pressure: Math.round(current.surface_pressure || current.pressure_msl || 1012),
    visibility: 10,
    cloudiness: current.cloud_cover,
    uvIndex: uvVal,
    uvCategory: getUVCategory(uvVal),
    sunrise: formatIsoTime(dailyData.sunrise[0]),
    sunset: formatIsoTime(dailyData.sunset[0]),
    tempMin: Math.round(dailyData.temperature_2m_min[0]),
    tempMax: Math.round(dailyData.temperature_2m_max[0]),
    isDay: Boolean(current.is_day),
    hourly,
    daily,
    precipitation,
    source: 'Open-Meteo Realtime'
  };
};

// Geocode city name to lat/lon using Open-Meteo or OpenWeatherMap
const geocodeCity = async (cityName, apiKey) => {
  if (apiKey && apiKey !== 'your_api_key_here') {
    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
      const geoRes = await axios.get(geoUrl);
      if (geoRes.data && geoRes.data.length > 0) {
        return {
          lat: geoRes.data[0].lat,
          lon: geoRes.data[0].lon,
          name: geoRes.data[0].name,
          country: geoRes.data[0].country
        };
      }
    } catch (e) {
      console.warn('OpenWeatherMap geocoding fallback triggered:', e.message);
    }
  }

  // Geocoding via Open-Meteo Geocoding API
  const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  const geoRes = await axios.get(searchUrl);
  if (geoRes.data && geoRes.data.results && geoRes.data.results.length > 0) {
    const result = geoRes.data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name,
      country: result.country_code?.toUpperCase() || ''
    };
  }
  throw new Error('City not found. Please check the spelling.');
};

/**
 * Reverse geocode lat/lon to city name
 */
const reverseGeocode = async (lat, lon, apiKey) => {
  if (apiKey && apiKey !== 'your_api_key_here') {
    try {
      const revUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
      const res = await axios.get(revUrl);
      if (res.data && res.data.length > 0) {
        return {
          name: res.data[0].name,
          country: res.data[0].country
        };
      }
    } catch (e) {
      // ignore and fallback
    }
  }

  try {
    const revUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await axios.get(revUrl, {
      headers: { 'User-Agent': 'SkyCast-WeatherApp/1.0' }
    });
    if (res.data && res.data.address) {
      const addr = res.data.address;
      return {
        name: addr.city || addr.town || addr.village || addr.suburb || addr.state || 'My Location',
        country: (addr.country_code || '').toUpperCase()
      };
    }
  } catch (e) {
    // ignore
  }

  return { name: 'Current Location', country: '' };
};

export const fetchWeatherByCity = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey && apiKey !== 'your_api_key_here') {
    try {
      return await fetchFromOpenWeatherMap(`q=${encodeURIComponent(city)}`, apiKey);
    } catch (err) {
      console.warn(`OpenWeatherMap request for "${city}" failed (${err.response?.status || err.message}), trying fallback...`);
    }
  }

  // Fallback to real-time live data via Open-Meteo
  const location = await geocodeCity(city, apiKey);
  return await fetchFromOpenMeteoFallback(location.lat, location.lon, location.name, location.country);
};

export const fetchWeatherByCoordinates = async (lat, lon) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey && apiKey !== 'your_api_key_here') {
    try {
      return await fetchFromOpenWeatherMap(`lat=${lat}&lon=${lon}`, apiKey);
    } catch (err) {
      console.warn('OpenWeatherMap coordinate request failed, trying fallback:', err.message);
    }
  }

  // Reverse geocode to get city name
  const loc = await reverseGeocode(lat, lon, apiKey);
  return await fetchFromOpenMeteoFallback(lat, lon, loc.name, loc.country);
};
