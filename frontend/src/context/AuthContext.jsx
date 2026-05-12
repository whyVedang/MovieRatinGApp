import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('movie_mate_token')
  );
  
  const login = (newToken) => {
    localStorage.setItem('movie_mate_token', newToken);
    setToken(newToken);
  };
  
  const logout = () => {
    localStorage.removeItem('movie_mate_token');
    setToken(null);
  };
  
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'movie_mate_token') {
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  
  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);