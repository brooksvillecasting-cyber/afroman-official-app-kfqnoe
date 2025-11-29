
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
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: any) => {
    await saveUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    await clearUser();
    setUser(null);
  };

  return { user, loading, login, logout };
};
