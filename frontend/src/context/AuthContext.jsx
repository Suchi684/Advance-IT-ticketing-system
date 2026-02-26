import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken, getUser, setUser, isTokenExpired } from '../utils/tokenUtils';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken() && !isTokenExpired());

  useEffect(() => {
    if (isTokenExpired()) {
      logout();
    }
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    setUserState(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setUserState(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
