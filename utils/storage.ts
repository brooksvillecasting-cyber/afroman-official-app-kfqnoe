
import * as SecureStore from 'expo-secure-store';

const ADMIN_CREDENTIALS_KEY = 'admin_credentials';
const USER_KEY = 'user_data';
const MOVIES_KEY = 'movies_data';
const SUBSCRIPTION_KEY = 'subscription_data';

// Admin credentials (in production, this would be in a secure backend)
const ADMIN_EMAIL = 'admin@afroman.com';
const ADMIN_PASSWORD = 'afroman2024';

export const validateAdminCredentials = async (email: string, password: string): Promise<boolean> => {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
};

export const saveUser = async (user: any) => {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.log('Error saving user:', error);
  }
};

export const getUser = async () => {
  try {
    const userData = await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.log('Error getting user:', error);
    return null;
  }
};

export const clearUser = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.log('Error clearing user:', error);
  }
};

export const saveMovies = async (movies: any[]) => {
  try {
    await SecureStore.setItemAsync(MOVIES_KEY, JSON.stringify(movies));
  } catch (error) {
    console.log('Error saving movies:', error);
  }
};

export const getMovies = async () => {
  try {
    const moviesData = await SecureStore.getItemAsync(MOVIES_KEY);
    return moviesData ? JSON.parse(moviesData) : [];
  } catch (error) {
    console.log('Error getting movies:', error);
    return [];
  }
};

export const saveSubscription = async (subscription: any) => {
  try {
    await SecureStore.setItemAsync(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  } catch (error) {
    console.log('Error saving subscription:', error);
  }
};

export const getSubscription = async () => {
  try {
    const subscriptionData = await SecureStore.getItemAsync(SUBSCRIPTION_KEY);
    return subscriptionData ? JSON.parse(subscriptionData) : null;
  } catch (error) {
    console.log('Error getting subscription:', error);
    return null;
  }
};
