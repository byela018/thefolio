import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://thefolio-api-rbwc.onrender.com/api'
    : 'http://localhost:5000/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
