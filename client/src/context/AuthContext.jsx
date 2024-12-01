import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (authToken, userData) => {
    console.log('Token recebido:', authToken);
    console.log('Usuário recebido:', userData);
    
    localStorage.setItem('token', authToken); 
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('Conteúdo do localStorage:', localStorage);

    setToken(authToken); // Atualiza o estado local
    setUser(userData); // Atualiza o estado do usuário
    setIsAuthenticated(true); // Marca o usuário como autenticado
  };

  const logout = () => {
  console.log('Fazendo logout...');
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setToken(null);
  setUser(null);
  setIsAuthenticated(false);
};

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
