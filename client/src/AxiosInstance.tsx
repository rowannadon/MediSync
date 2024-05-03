import axios from 'axios';

export const instance = axios.create();

export function setAuthToken(token: string | null) {
  console.log('setting token', token);
  if (token && token.length > 0) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
}

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);
