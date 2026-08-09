import { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginApi, signUp as signUpApi, getMe } from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const userData = await getMe();
          setUser(userData.user || userData);
        } catch (error) {
          console.error("Session expired:", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await loginApi(credentials);

      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
      }

      return response;
    } catch (err) {
      throw err.response?.data || err;
    }
  }, []);

  const signUp = useCallback(async (credentials) => {
    try {
      const response = await signUpApi(credentials);

      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
      }

      return response;
    } catch (err) {
      throw err.response?.data || err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    signUp,
    logout,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
  }), [user, loading, login, signUp, logout]);

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-screen text-gray-500">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};