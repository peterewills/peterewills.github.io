// API Configuration

// IMPORTANT: This API key must match the API_KEY environment variable 
// set in your Railway deployment for the backend!
// To update on Railway: railway variables set API_KEY=your-key-here
const DEFAULT_API_KEY = '6UmXnQkuKTsC_C3Xzr1P0rCWCWV6XebNVT-Qc9L-kOo';

export const API_CONFIG = {
  // For now, just use the default key since the repo is private
  // In a Create React App, you'd use: process.env.REACT_APP_ARTEMIS_API_KEY || DEFAULT_API_KEY
  API_KEY: DEFAULT_API_KEY,
  
  // API endpoints
  ENDPOINTS: {
    local: 'http://localhost:8000/api/chat',
    production: 'https://artemis-production-9690.up.railway.app/api/chat'
  }
};