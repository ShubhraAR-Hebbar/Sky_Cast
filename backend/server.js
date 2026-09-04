import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherRoutes from './routes/weatherRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'SkyCast Backend API',
    timestamp: new Date().toISOString()
  });
});

// Weather API Routes
app.use('/api/weather', weatherRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error. Please try again later.'
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found.'
  });
});

app.listen(PORT, () => {
  console.log(`🌤️ SkyCast Backend running on http://localhost:${PORT}`);
  console.log(`API Key configured: ${Boolean(process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_api_key_here')}`);
});
