import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

interface LoginContextType {
  login: (username: string, password: string) => any;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<LoginContextType | null>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = (props: any) => {
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  const login = async  (username: string, password: string) => {
    const res = await axios.post('/api/login', { username, password });
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
    axios.post('/api/logout');
    localStorage.removeItem('accessToken');
    setAccessToken('');
    setRefreshToken('');
  };

  const getAccessToken = () => {
    return accessToken;
  }

  const getRefreshToken = () => {
    return refreshToken;
  }

  return (
    <AuthContext.Provider value={{login, logout, getAccessToken, getRefreshToken}}>
      {props.children}
    </AuthContext.Provider>
  );
};
