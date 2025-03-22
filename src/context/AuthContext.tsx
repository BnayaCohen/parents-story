
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  login: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const login = async (name: string, email: string): Promise<boolean> => {
    // Simple validation for demo purposes
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter both name and email");
      return false;
    }
    
    // For this demo, we're just setting authenticated to true with any non-empty credentials
    // In a real app, this would validate against a backend
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setIsAuthenticated(true);
      setUsername(name);
      toast.success(`Welcome, ${name}!`);
      return true;
    } catch (error) {
      toast.error("Authentication failed");
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    toast.info("You've been logged out");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
