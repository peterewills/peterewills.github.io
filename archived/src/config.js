// API Configuration

// stored as a github repo secret
if (!process.env.REACT_APP_ARTEMIS_API_KEY) {
  throw new Error('REACT_APP_ARTEMIS_API_KEY environment variable is required');
}

export const API_CONFIG = {
  API_KEY: process.env.REACT_APP_ARTEMIS_API_KEY,

  // API endpoints
  ENDPOINTS: {
    local: 'http://localhost:8000/api/chat',
    production: 'https://artemis-production-9690.up.railway.app/api/chat'
  }
};
