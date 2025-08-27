
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../types';
import { authenticateUser, getMockUsers } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // This is a simple mock session persistence. In a real app, you'd use tokens.
    const storedUser = sessionStorage.getItem('authUser');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Revive date objects
        parsedUser.createdAt = new Date(parsedUser.createdAt);
        parsedUser.lastLogin = new Date(parsedUser.lastLogin);
        return parsedUser;
    }
    return null;
  });

  const login = async (email: string): Promise<User | null> => {
    const authenticatedUser = await authenticateUser(email);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      sessionStorage.setItem('authUser', JSON.stringify(authenticatedUser));
    }
    return authenticatedUser;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
