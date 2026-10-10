import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ideaforge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ideaforge_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          localStorage.setItem('ideaforge_user', JSON.stringify(userData));
        } catch (err) {
          console.error('Session expired or invalid', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setToken(data.token);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    localStorage.setItem('ideaforge_token', data.token);
    localStorage.setItem(
      'ideaforge_user',
      JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      })
    );
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    setToken(data.token);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    localStorage.setItem('ideaforge_token', data.token);
    localStorage.setItem(
      'ideaforge_user',
      JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      })
    );
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ideaforge_token');
    localStorage.removeItem('ideaforge_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
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
