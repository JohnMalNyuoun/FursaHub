import { createContext, useState, useEffect } from 'react';
import { identifyUser, resetPosthog } from '../lib/posthog';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prefer tab-scoped session storage so different tabs can use different accounts.
    // Fall back to legacy localStorage once, then migrate and clear it.
    let storedToken = sessionStorage.getItem('token');
    let storedUser = sessionStorage.getItem('user');

    if (!storedToken || !storedUser) {
      storedToken = localStorage.getItem('token');
      storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        sessionStorage.setItem('token', storedToken);
        sessionStorage.setItem('user', storedUser);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        identifyUser(parsed);
      } catch (err) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    sessionStorage.setItem('token', userToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    identifyUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    resetPosthog();
  };

  const updateUser = (partialUserData) => {
    setUser((current) => {
      const nextUser = {
        ...(current || {}),
        ...(partialUserData || {})
      };
      sessionStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};