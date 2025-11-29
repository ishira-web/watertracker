// water-tracker-client/lib/api.ts

import axios from 'axios';

// Get the API URL from the environment variable (best practice)
// The value of NEXT_PUBLIC_API_URL must be: "https://watertracker-gid5.onrender.com/api"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
    // Use the full URL including the /api prefix
    baseURL: API_BASE_URL, 
});

// Request interceptor to attach JWT token
API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default API;