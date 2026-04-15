import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useSegments } from 'expo-router';

// A single hardcoded user for login as per requirements
const DUMMY_USER = {
  username: "user",
  password: "password"
};

type AuthContextType = {
  isAuthenticated: boolean | null;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  login: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const val = await AsyncStorage.getItem('isAuthenticated');
        setIsAuthenticated(val === 'true');
      } catch (e) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (typeof isAuthenticated !== 'boolean') return;
    
    // Simple route protection
    const isAuthGroup = segments[0] === '(tabs)';
    const isLoginPath = segments[0] === 'login';

    if (!isAuthenticated && !isLoginPath) {
      router.replace('/login');
    } else if (isAuthenticated && isLoginPath) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  const login = async (username: string, password: string) => {
    if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
