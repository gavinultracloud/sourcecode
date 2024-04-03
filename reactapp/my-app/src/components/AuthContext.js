import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedDetails = localStorage.getItem('userDetails');
    setIsAuthenticated(storedAuth);
    if (storedDetails) {
      try {
        const parsedDetails = JSON.parse(storedDetails);
        setUserDetails(parsedDetails);
      } catch (error) {
        console.error('Error parsing user details from localStorage:', error);
        // Handle error or clear the corrupted data from localStorage
        localStorage.removeItem('userDetails');
      }
    }
  }, []);
  

  // Log userDetails whenever it updates
  useEffect(() => {
    console.log('User Details Updated:', userDetails);
  }, [userDetails]);

  const login = (token, userDetails) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userDetails', JSON.stringify(userDetails)); // Save userDetails to localStorage
    setIsAuthenticated(true);
    setUserDetails(userDetails); // Update context's userDetails state
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userDetails');
    setIsAuthenticated(false);
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userDetails, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
