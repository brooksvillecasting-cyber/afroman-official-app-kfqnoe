
import { useState, useEffect } from 'react';
import { getUser, saveUser, clearUser } from '@/utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
      console.log('User loaded:', userData ? 'Logged in' : 'Not logged in');
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: any) => {
    try {
      await saveUser(userData);
      setUser(userData);
      console.log('User logged in:', userData.email);
    } catch (error) {
      console.log('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearUser();
      setUser(null);
      console.log('User logged out');
    } catch (error) {
      console.log('Error during logout:', error);
      throw error;
    }
  };

  return { user, loading, login, logout };
};
