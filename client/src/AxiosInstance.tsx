import axios from 'axios';

export const instance = axios.create();

export function setAuthToken(token: string | null) {
  return new Promise<void>((resolve) => {
    console.log('setting token for axios', token);
    if (token && token.length > 0) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common['Authorization'];
    }
    resolve();
  });
}
