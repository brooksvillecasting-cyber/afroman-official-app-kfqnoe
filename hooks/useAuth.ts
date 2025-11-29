
import { useState, useEffect } from 'react';
import { getUser, saveUser, clearUser } from '@/utils/storage';
import { supabase } from '@/app/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getUser();
      
      if (userData) {
        // Check subscription status from database
        const subscriptionStatus = await checkSubscriptionStatus(userData.id || userData.email);
        const updatedUser = {
          ...userData,
          hasSubscription: subscriptionStatus.hasSubscription,
          subscriptionExpiresAt: subscriptionStatus.expiresAt,
        };
        setUser(updatedUser);
        
        // Update stored user data if subscription status changed
        if (userData.hasSubscription !== subscriptionStatus.hasSubscription) {
          await saveUser(updatedUser);
        }
        
        console.log('User loaded:', updatedUser.email, 'Subscription:', subscriptionStatus.hasSubscription);
      } else {
        setUser(null);
        console.log('No user logged in');
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async (userId: string) => {
    try {
      console.log('Checking subscription status for user:', userId);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No subscription found
          console.log('No active subscription found');
          return { hasSubscription: false, expiresAt: null };
        }
        console.error('Error checking subscription:', error);
        return { hasSubscription: false, expiresAt: null };
      }

      if (data) {
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        const isActive = expiresAt > now;
        
        console.log('Subscription found:', {
          status: data.status,
          expiresAt: expiresAt.toISOString(),
          isActive,
        });

        return {
          hasSubscription: isActive,
          expiresAt: isActive ? expiresAt : null,
        };
      }

      return { hasSubscription: false, expiresAt: null };
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return { hasSubscription: false, expiresAt: null };
    }
  };

  const login = async (userData: any) => {
    try {
      // Check subscription status when logging in
      const subscriptionStatus = await checkSubscriptionStatus(userData.id || userData.email);
      const userWithSubscription = {
        ...userData,
        hasSubscription: subscriptionStatus.hasSubscription,
        subscriptionExpiresAt: subscriptionStatus.expiresAt,
      };
      
      await saveUser(userWithSubscription);
      setUser(userWithSubscription);
      console.log('User logged in:', userWithSubscription.email, 'Subscription:', subscriptionStatus.hasSubscription);
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

  const refreshSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      const subscriptionStatus = await checkSubscriptionStatus(user.id || user.email);
      const updatedUser = {
        ...user,
        hasSubscription: subscriptionStatus.hasSubscription,
        subscriptionExpiresAt: subscriptionStatus.expiresAt,
      };
      
      await saveUser(updatedUser);
      setUser(updatedUser);
      console.log('Subscription status refreshed:', subscriptionStatus.hasSubscription);
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
    }
  };

  return { 
    user, 
    loading, 
    login, 
    logout,
    refreshSubscriptionStatus,
  };
};
