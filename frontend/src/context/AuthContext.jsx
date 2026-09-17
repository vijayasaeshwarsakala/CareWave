import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('carewave_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile on startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('carewave_token');
      const storedUser = localStorage.getItem('carewave_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend silently
          const res = await api.get('/auth/me');
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('carewave_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('[Auth] Stored session invalid, resetting:', err.message);
          localStorage.removeItem('carewave_token');
          localStorage.removeItem('carewave_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data.data;

      localStorage.setItem('carewave_token', token);
      localStorage.setItem('carewave_user', JSON.stringify(userData));

      setToken(token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const demoLogin = async () => {
    setError(null);
    try {
      const res = await api.post('/auth/demo-login');
      const { token, ...userData } = res.data.data;

      localStorage.setItem('carewave_token', token);
      localStorage.setItem('carewave_user', JSON.stringify(userData));

      setToken(token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Demo login failed.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      const { token, ...newUserData } = res.data.data;

      localStorage.setItem('carewave_token', token);
      localStorage.setItem('carewave_user', JSON.stringify(newUserData));

      setToken(token);
      setUser(newUserData);
      return { success: true, user: newUserData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('carewave_token');
    localStorage.removeItem('carewave_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        demoLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
