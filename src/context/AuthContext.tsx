import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('deepshield_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('deepshield_token');
      const storedUser = localStorage.getItem('deepshield_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        // Default to demo user for seamless preview experience if desired
        const defaultUser: User = {
          id: 'user-demo-001',
          name: 'Demo User',
          email: 'demo@deepshield.local',
          role: 'Investigator'
        };
        setUser(defaultUser);
        localStorage.setItem('deepshield_user', JSON.stringify(defaultUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('deepshield_token', data.token);
      localStorage.setItem('deepshield_user', JSON.stringify(data.user));
    } catch (err: any) {
      // Fallback for offline/demo simulation
      if (email === 'demo@deepshield.local') {
        const demoUser: User = {
          id: 'user-demo-001',
          name: 'Demo User',
          email: 'demo@deepshield.local',
          role: 'Investigator'
        };
        setUser(demoUser);
        localStorage.setItem('deepshield_user', JSON.stringify(demoUser));
        return;
      }
      throw err;
    }
  };

  const demoLogin = async () => {
    await login('demo@deepshield.local', 'Demo@123');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('deepshield_token', data.token);
    localStorage.setItem('deepshield_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('deepshield_token');
    localStorage.removeItem('deepshield_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, demoLogin, register, logout }}>
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
