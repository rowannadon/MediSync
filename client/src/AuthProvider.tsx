import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { instance, setAuthToken } from './AxiosInstance';

interface LoginContextType {
  login: (username: string, password: string) => any;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<LoginContextType | null>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = (props: any) => {
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken'),
  );

  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  const login = async (username: string, password: string) => {
    const res = await instance.post('/api/login', { username, password });
    if (res.status === 200) {
      localStorage.setItem('accessToken', res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setAccessToken(res.data.accessToken);
      return res.data;
    } else {
      throw new Error('Failed to login');
    }
  };

  const logout = () => {
    instance.delete('/api/logout');
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setRefreshToken(null);
  };

  const getAccessToken = () => {
    return accessToken;
  };

  const getRefreshToken = () => {
    return refreshToken;
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, getAccessToken, getRefreshToken }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
