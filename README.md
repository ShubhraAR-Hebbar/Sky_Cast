# SkyCast - Professional Weather Web Application

SkyCast is a modern, responsive weather dashboard web application inspired by clean usability, featuring an original visual identity, dynamic atmospheric themes, and a secure Express.js proxy backend for real weather data.

---

## 🌟 Key Features

- **Original SkyCast Visual Identity**: Clean, modern, trustworthy aesthetic with dynamic themes that adapt to current weather conditions (Sunny, Cloudy, Rain, Thunderstorm, Snow, Fog, and Night).
- **Secure Backend Architecture**: Node.js + Express REST API proxies all weather requests. The OpenWeatherMap API key is stored strictly on the server and is **never exposed to the frontend**.
- **Real-Time Weather Data**:
  - Current weather hero card (temperature, condition, feels-like, high/low, humidity, wind, pressure, visibility).
  - 12-hour hourly forecast with probability of precipitation.
  - 7-day multi-day forecast with temperature range visual bars.
  - Interactive weather details (Humidity, Wind Compass & Speed, Pressure, Visibility, Cloudiness).
  - Precipitation probability chart.
  - Wind compass with dynamic directional indicator.
  - UV Index indicator with sun safety recommendations.
  - Sunrise & Sunset solar trajectory arc.
- **Location & Search**:
  - Search any city globally (with quick chips for popular cities).
  - "Use Current Location" via browser Geolocation API.
  - Recent searches stored in `localStorage`.
- **Units**:
  - Instant toggle between Celsius (°C) and Fahrenheit (°F) across all metrics.
- **Pages**:
  - **Home**: Core weather dashboard.
  - **Forecast**: Extended 7-day detailed meteorological view.
  - **About**: Architectural diagrams and technology details.
- **Responsive**: Fully responsive across mobile (320px+), tablet (768px), and desktop (1024px, 1440px+).

---

## 🏗️ Architecture

```
User Browser
    │
    ▼
SkyCast React Frontend (Vite on port 5173)
    │
    ▼  (Proxy /api requests)
SkyCast Express Backend (Node.js on port 5000)
    │
    ▼  (Secure API Key)
OpenWeatherMap API (Real-Time Weather & Forecast)
    │
    ▼
SkyCast Backend (Clean Data Normalization)
    │
    ▼
SkyCast Frontend (React UI & Dynamic Theme)
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18 or higher recommended
- **npm**: v8 or higher

### 2. Configure Backend Environment
Create `backend/.env` (or copy from `backend/.env.example`):
```bash
# In backend/.env
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
PORT=5000
```
> **Note**: SkyCast includes a built-in real-time fallback provider (Open-Meteo) so that you can run and test the app immediately even before entering your OpenWeatherMap API key!

### 3. Install Dependencies
You can install dependencies in both frontend and backend:
```bash
# In the project root:
npm run install:all
```
Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run Development Servers
From the project root:
```bash
npm run dev
```
Or run separately:
```bash
# Terminal 1 - Backend (port 5000)
npm run dev:backend

# Terminal 2 - Frontend (port 5173)
npm run dev:frontend
```

Open your browser at `http://localhost:5173`.

---

## 📁 Project Structure

```
weatherApp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── CurrentWeather.jsx
│   │   │   ├── HourlyForecast.jsx
│   │   │   ├── DailyForecast.jsx
│   │   │   ├── WeatherDetails.jsx
│   │   │   ├── Precipitation.jsx
│   │   │   ├── Wind.jsx
│   │   │   ├── UVIndex.jsx
│   │   │   ├── SunriseSunset.jsx
│   │   │   ├── RecentSearches.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Forecast.jsx
│   │   │   └── About.jsx
│   │   ├── services/
│   │   │   └── weatherService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   │   └── weatherController.js
│   ├── routes/
│   │   └── weatherRoutes.js
│   ├── services/
│   │   └── weatherService.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── .env.example
├── README.md
└── package.json
```

---

## 📱 Mobile Application (Android APK & PWA)

SkyCast is pre-configured to run as both an installable **PWA** and a **Native Android Application**!

### 1. Instant 1-Click Install (PWA)
- Open `http://localhost:5173` on your phone's browser (Chrome/Safari) or PC (Chrome/Edge).
- Click the **"Install App"** button in the top header or select **"Add to Home Screen"** in browser settings.
- SkyCast will install with its custom app icon and launch fullscreen without browser bars.

### 2. Native Android Project (Capacitor)
The complete native Android project is generated in [frontend/android](file:///c:/Users/Shubhra/Downloads/weatherApp/frontend/android).

To build or open in Android Studio:
```bash
# Sync any web code changes
npm run app:build

# Open native project in Android Studio
npm run app:open
```
- In Android Studio, select **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate `app-debug.apk` directly for your phone!

---

## 🛡️ Security
The OpenWeatherMap API key is kept exclusively on the backend in `backend/.env`, which is excluded from Git via `.gitignore`.
