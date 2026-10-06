import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api/services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(AuthService.getToken());
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.setToken(token);
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    setUser({ authenticated: true });
    navigate('/questions');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    AuthService.logout();
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!token, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
