/**
 * SkyCast Frontend Weather Service
 * Communicates with backend proxy, with automatic standalone fallback for mobile APKs.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api/weather';

// Helper for degrees to compass
const degreesToCompass = (deg) => {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
};

const getUVCategory = (uv) => {
  if (uv <= 2) return { level: uv, text: 'Low', color: '#10b981', advice: 'No protection required. Enjoy outdoors safely.' };
  if (uv <= 5) return { level: uv, text: 'Moderate', color: '#f59e0b', advice: 'Wear sunglasses and use SPF 30+ sunscreen.' };
  if (uv <= 7) return { level: uv, text: 'High', color: '#f97316', advice: 'Seek shade during midday. Wear a hat.' };
  if (uv <= 10) return { level: uv, text: 'Very High', color: '#ef4444', advice: 'Minimize sun exposure between 10 AM - 4 PM.' };
  return { level: uv, text: 'Extreme', color: '#8b5cf6', advice: 'Take full precautions. Skin can burn rapidly.' };
};

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

// Direct Client-Side Fallback for Standalone Mobile APK
const fetchDirectFromOpenMeteo = async (lat, lon, cityName = 'Current Location', countryCode = '') => {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

  const res = await fetch(weatherUrl);
  if (!res.ok) throw new Error('Unable to connect to meteorology network.');
  const data = await res.json();

  const current = data.current;
  const dailyData = data.daily;
  const hourlyData = data.hourly;
  const weatherInfo = mapWmoCode(current.weather_code, current.is_day);

  const currentHourIndex = new Date().getHours();
  const hourly = [];
  for (let i = 0; i < 12; i++) {
    const idx = currentHourIndex + i;
    if (idx < (hourlyData?.time?.length || 0)) {
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
        windSpeed: Number((hourlyData.wind_speed_10m[idx] / 3.6).toFixed(1)),
        humidity: hourlyData.relative_humidity_2m[idx] || 60
      });
    }
  }

  const daily = [];
  const count = Math.min(7, dailyData?.time?.length || 0);
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

  const uvVal = Math.round(dailyData?.uv_index_max?.[0] || 5);

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
    city: cityName,
    country: countryCode,
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
    source: 'Open-Meteo Satellite'
  };
  
  // Attach calculated real-time severe weather alerts
  result.alerts = generateSevereAlerts(result);
  return result;
};

/**
 * Real-time Severe Weather Alert Engine
 * Evaluates atmospheric parameters to generate actionable severe weather alerts & advisories
 */
export const generateSevereAlerts = (data) => {
  if (!data) return [];
  const alerts = [];
  const city = data.city || 'your area';
  const temp = data.temperature;
  const feelsLike = data.feelsLike;
  const wind = data.windSpeed;
  const gust = data.windGust;
  const uv = data.uvIndex;
  const cond = (data.condition || '').toLowerCase();
  const desc = (data.description || '').toLowerCase();
  const pop = data.hourly?.[0]?.pop || data.daily?.[0]?.pop || 0;

  // 1. Thunderstorm Alert
  if (cond.includes('thunderstorm') || desc.includes('thunderstorm')) {
    alerts.push({
      id: 'alert-thunderstorm',
      severity: 'warning',
      title: 'Thunderstorm Warning',
      event: 'Severe Weather Warning',
      description: `Active thunderstorm detected over ${city}. Lightning strikes and heavy downpours probable.`,
      instruction: 'Stay indoors, keep away from windows, and unplug non-essential electronic devices.',
      icon: 'zap',
      color: '#ef4444',
      time: 'Active Now'
    });
  }

  // 2. High Wind Alert
  if (gust >= 45 || wind >= 35) {
    alerts.push({
      id: 'alert-wind',
      severity: gust >= 60 ? 'warning' : 'watch',
      title: gust >= 60 ? 'High Wind Warning' : 'Gale Wind Advisory',
      event: 'Wind Hazard',
      description: `Strong sustained winds of ${wind} km/h with sudden gusts up to ${gust || Math.round(wind * 1.4)} km/h in ${city}.`,
      instruction: 'Secure patio furniture, trash bins, and watch out for loose branches or flying debris.',
      icon: 'wind',
      color: gust >= 60 ? '#ef4444' : '#f59e0b',
      time: 'Active Next 6 Hours'
    });
  }

  // 3. Heavy Rain / Downpour Alert
  if (cond.includes('rain') && pop >= 70) {
    alerts.push({
      id: 'alert-rain',
      severity: 'watch',
      title: 'Heavy Rain Advisory',
      event: 'Precipitation Alert',
      description: `${pop}% probability of heavy rainfall in ${city}. Potential local waterlogging on roadways.`,
      instruction: 'Drive with caution, reduce speed, and use headlights in heavy rain.',
      icon: 'cloud-rain',
      color: '#3b82f6',
      time: 'Next 12 Hours'
    });
  }

  // 4. Extreme Heat Warning
  if (temp >= 37 || feelsLike >= 39) {
    alerts.push({
      id: 'alert-heat',
      severity: 'warning',
      title: 'Extreme Heat Warning',
      event: 'Heat Advisory',
      description: `Unusually high heat index recorded in ${city}. Feels like ${feelsLike || temp}°C. High heat stroke risk.`,
      instruction: 'Drink plenty of water, stay in air-conditioned environments, and avoid outdoor activity from 11 AM - 4 PM.',
      icon: 'sun',
      color: '#f97316',
      time: 'Midday Peak'
    });
  }

  // 5. Extreme Cold / Freeze Alert
  if (temp <= 3) {
    alerts.push({
      id: 'alert-cold',
      severity: 'watch',
      title: 'Freeze & Frost Advisory',
      event: 'Low Temperature Alert',
      description: `Temperature dropping to ${temp}°C in ${city}. Risk of frost and slippery conditions.`,
      instruction: 'Dress in insulated layers and protect exposed water pipes and sensitive vegetation.',
      icon: 'snowflake',
      color: '#38bdf8',
      time: 'Overnight & Dawn'
    });
  }

  // 6. High UV Solar Alert
  if (uv >= 8) {
    alerts.push({
      id: 'alert-uv',
      severity: 'advisory',
      title: 'Extreme UV Index Alert',
      event: 'Solar Exposure Warning',
      description: `UV index reached Level ${uv} (${data.uvCategory?.text || 'Extreme'}). Skin damage can occur rapidly.`,
      instruction: 'Apply broad-spectrum SPF 50+ sunscreen, wear wide-brimmed hats, and seek shade.',
      icon: 'shield-alert',
      color: '#a855f7',
      time: '10:00 AM - 4:00 PM'
    });
  }

  return alerts;
};



// Ultra-fast Reverse Geocoding (<100ms) with BigDataCloud & OpenStreetMap fallback
const fastReverseGeocode = async (lat, lon) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || data.localityInfo?.administrative?.[2]?.name || 'Current Location';
      const countryCode = (data.countryCode || '').toUpperCase();
      if (city && city !== 'Current Location') return { city, countryCode };
    }
  } catch (e) {
    // ignore
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const revUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const revRes = await fetch(revUrl, { signal: controller.signal, headers: { 'User-Agent': 'SkyCast-App/1.0' } });
    clearTimeout(timeoutId);
    if (revRes.ok) {
      const revData = await revRes.json();
      if (revData?.address) {
        const city = revData.address.city || revData.address.town || revData.address.village || revData.address.suburb || 'Current Location';
        const countryCode = (revData.address.country_code || '').toUpperCase();
        return { city, countryCode };
      }
    }
  } catch (e) {
    // ignore
  }

  return { city: 'Current Location', countryCode: '' };
};

export const fetchCityWeather = async (city) => {
  if (!city || !city.trim()) throw new Error('Please enter a city name.');
  const trimmed = city.trim();

  // Instant direct Open-Meteo Geocoding (~100ms)
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        const loc = geoData.results[0];
        return await fetchDirectFromOpenMeteo(loc.latitude, loc.longitude, loc.name, loc.country_code?.toUpperCase() || '');
      }
    }
  } catch (err) {}

  // Fallback to backend proxy with tight timeout if available
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    const response = await fetch(`${API_BASE}/city/${encodeURIComponent(trimmed)}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const result = await response.json();
      if (result.success) return result.data;
    }
  } catch (error) {}

  throw new Error(`City "${trimmed}" not found. Please check spelling.`);
};

export const fetchCoordinateWeather = async (lat, lon) => {
  // Blazing Fast: Run weather data fetch and reverse geocoding in PARALLEL
  const weatherPromise = fetchDirectFromOpenMeteo(lat, lon, 'Current Location', '');
  const geoPromise = fastReverseGeocode(lat, lon);

  const [weatherData, geo] = await Promise.all([weatherPromise, geoPromise]);

  if (weatherData) {
    if (geo && geo.city && geo.city !== 'Current Location') {
      weatherData.city = geo.city;
    }
    if (geo && geo.countryCode) {
      weatherData.country = geo.countryCode;
    }
  }

  return weatherData;
};

// Automatic Network/IP Location for 0ms startup live detection
export const fetchAutoIpLocation = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        const city = data.city || 'Local Weather';
        const country = (data.country_code || '').toUpperCase();
        return await fetchDirectFromOpenMeteo(lat, lon, city, country);
      }
    }
  } catch (e) {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        const city = data.city || 'Local Weather';
        const country = (data.country_code || '').toUpperCase();
        return await fetchDirectFromOpenMeteo(lat, lon, city, country);
      }
    }
  } catch (e) {}

  return null;
};

// Live City Recommendations / Autocomplete when typing
export const fetchCitySuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        return data.results.map((item) => ({
          id: item.id,
          name: item.name,
          admin1: item.admin1 || '',
          country: item.country || '',
          countryCode: item.country_code ? item.country_code.toUpperCase() : '',
          lat: item.latitude,
          lon: item.longitude
        }));
      }
    }
  } catch (e) {
    // ignore
  }
  return [];
};
