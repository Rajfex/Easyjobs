import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth, login as apiLogin, logout as apiLogout } from '../api';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: ()  => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const fetchUserData = async () => {
    try {
      const response = await checkAuth();
      if (response.data.isLoggedIn) {
        setUser({
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
          isAuthenticated: true
        });
        return true;
      }
      return false;
    } catch (error) {
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Login endpoint only sets HTTP-only cookies
      await apiLogin(email, password);
      
      // After successful login, fetch user data
      const isAuthenticated = await fetchUserData();
      
      if (!isAuthenticated) {
        throw new Error('Failed to fetch user data after login');
      }
      
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      toast.success('Successfully logged out!');
    } catch (error) {
      toast.error('Logout failed.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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