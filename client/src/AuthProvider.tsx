import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { instance, setAuthToken } from './AxiosInstance';

interface LoginContextType {
  login: (username: string, password: string) => any;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getUsername: () => string | null;
}

const AuthContext = createContext<LoginContextType | null>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = (props: any) => {
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem('username'),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken'),
  );

  const socket = useSocket();

  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken);
    }
  }, [accessToken]);

  const login = async (username: string, password: string) => {
    const res = await instance.post('/api/login', { username, password });
    if (res.status === 200) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('username', username);
      setUsername(username);

      setRefreshToken(res.data.refreshToken);
      setAccessToken(res.data.accessToken);
      return res.data;
    } else {
      throw new Error('Failed to login');
    }
  };

  const logout = () => {
    const currentRefreshToken = getRefreshToken();
    instance.delete('/api/logout', {
      data: { token: currentRefreshToken },
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    socket?.disconnect();
    setUsername(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const getUsername = () => {
    return username;
  };

  const getAccessToken = () => {
    return accessToken;
  };

  const getRefreshToken = () => {
    return refreshToken;
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, getAccessToken, getRefreshToken, getUsername }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
