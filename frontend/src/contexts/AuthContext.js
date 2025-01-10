import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);
const CONSTANT_PASSWORD = 'mkc';
const ADMIN_PASSWORD = 'swyam9818'; // Admin password

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = async (password) => {
    if (password === ADMIN_PASSWORD) {
      setUser({ name: 'Admin', isAdmin: true });
      setError('');
      return true;
    } else if (password === CONSTANT_PASSWORD) {
      setUser({ name: 'User', isAdmin: false });
      setError('');
      return true;
    } else {
      setError('Invalid password');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    error,
    login,
    logout,
    loading: false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 