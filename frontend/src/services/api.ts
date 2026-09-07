import axios from 'axios';

// 45 seconds for cold start on the first request
const COLD_START_TIMEOUT = 45000; 
const NORMAL_TIMEOUT = 15000;

export const api = axios.create({
  baseURL: (typeof process !== 'undefined' ? process.env.VITE_API_URL : undefined) || 'http://localhost:3000',
  timeout: COLD_START_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to adjust timeout after the first successful request
let isWarmedUp = false;

api.interceptors.request.use((config) => {
  if (isWarmedUp) {
    config.timeout = NORMAL_TIMEOUT;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    isWarmedUp = true;
    return response;
  },
  (error) => {
    // If we get an error but it's not a timeout or network error, the server is awake
    if (error.response) {
      isWarmedUp = true;
    }
    return Promise.reject(error);
  }
);
