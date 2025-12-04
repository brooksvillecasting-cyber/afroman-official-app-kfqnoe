
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = '@afroman_watchlist';

export interface WatchlistItem {
  id: string;
  type: 'movie' | 'music_video';
  addedAt: Date;
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const data = await AsyncStorage.getItem(WATCHLIST_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Convert date strings back to Date objects
        const watchlistWithDates = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setWatchlist(watchlistWithDates);
        console.log('Watchlist loaded:', watchlistWithDates.length, 'items');
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWatchlist = async (newWatchlist: WatchlistItem[]) => {
    try {
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(newWatchlist));
      console.log('Watchlist saved:', newWatchlist.length, 'items');
    } catch (error) {
      console.error('Error saving watchlist:', error);
      throw error;
    }
  };

  const addToWatchlist = async (id: string, type: 'movie' | 'music_video') => {
    try {
      const newItem: WatchlistItem = {
        id,
        type,
        addedAt: new Date(),
      };
      const updatedWatchlist = [...watchlist, newItem];
      await saveWatchlist(updatedWatchlist);
      setWatchlist(updatedWatchlist);
      console.log('Added to watchlist:', id, type);
      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      const updatedWatchlist = watchlist.filter(item => item.id !== id);
      await saveWatchlist(updatedWatchlist);
      setWatchlist(updatedWatchlist);
      console.log('Removed from watchlist:', id);
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  };

  const isInWatchlist = (id: string): boolean => {
    return watchlist.some(item => item.id === id);
  };

  const toggleWatchlist = async (id: string, type: 'movie' | 'music_video') => {
    if (isInWatchlist(id)) {
      return await removeFromWatchlist(id);
    } else {
      return await addToWatchlist(id, type);
    }
  };

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };
};
