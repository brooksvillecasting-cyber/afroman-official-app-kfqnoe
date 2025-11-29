
import * as SecureStore from 'expo-secure-store';

const ADMIN_CREDENTIALS_KEY = 'admin_credentials';
const USER_KEY = 'user_data';
const MOVIES_KEY = 'movies_data';
const MUSIC_VIDEOS_KEY = 'music_videos_data';
const SUBSCRIPTION_KEY = 'subscription_data';

// Admin credentials (in production, this would be in a secure backend)
const ADMIN_EMAIL = 'hungry.hustler@yahoo.com';
const ADMIN_PASSWORD = 'Afroman_420';

export const validateAdminCredentials = async (email: string, password: string): Promise<boolean> => {
  try {
    return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  } catch (error) {
    console.log('Error validating admin credentials:', error);
    return false;
  }
};

export const saveUser = async (user: any) => {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    console.log('User saved successfully');
  } catch (error) {
    console.log('Error saving user:', error);
    throw error;
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
    console.log('User cleared successfully');
  } catch (error) {
    console.log('Error clearing user:', error);
    throw error;
  }
};

export const saveMovies = async (movies: any[]) => {
  try {
    await SecureStore.setItemAsync(MOVIES_KEY, JSON.stringify(movies));
    console.log('Movies saved successfully:', movies.length);
  } catch (error) {
    console.log('Error saving movies:', error);
    throw error;
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

export const saveMusicVideos = async (musicVideos: any[]) => {
  try {
    await SecureStore.setItemAsync(MUSIC_VIDEOS_KEY, JSON.stringify(musicVideos));
    console.log('Music videos saved successfully:', musicVideos.length);
  } catch (error) {
    console.log('Error saving music videos:', error);
    throw error;
  }
};

export const getMusicVideos = async () => {
  try {
    const musicVideosData = await SecureStore.getItemAsync(MUSIC_VIDEOS_KEY);
    return musicVideosData ? JSON.parse(musicVideosData) : [];
  } catch (error) {
    console.log('Error getting music videos:', error);
    return [];
  }
};

export const saveSubscription = async (subscription: any) => {
  try {
    await SecureStore.setItemAsync(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    console.log('Subscription saved successfully');
  } catch (error) {
    console.log('Error saving subscription:', error);
    throw error;
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
