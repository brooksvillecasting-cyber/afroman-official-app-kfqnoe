
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Movie } from '@/types/Movie';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import { useWatchlist } from '@/hooks/useWatchlist';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const router = useRouter();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const handlePress = () => {
    router.push({
      pathname: '/movie-player',
      params: { movieId: movie.id },
    });
  };

  const handleWatchlistToggle = async (e: any) => {
    e.stopPropagation();
    const success = await toggleWatchlist(movie.id, 'movie');
    if (success) {
      Alert.alert(
        inWatchlist ? 'Removed from Watchlist' : 'Added to Watchlist',
        inWatchlist 
          ? `${movie.title} has been removed from your watchlist.`
          : `${movie.title} has been added to your watchlist.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: movie.thumbnailUrl }} style={styles.thumbnail} />
      {movie.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      {movie.isPremium && (
        <View style={styles.premiumBadge}>
          <IconSymbol 
            ios_icon_name="star.fill" 
            android_material_icon_name="star" 
            size={16} 
            color={colors.background} 
          />
          <Text style={styles.premiumBadgeText}>PREMIUM</Text>
        </View>
      )}
      <TouchableOpacity 
        style={styles.watchlistButton}
        onPress={handleWatchlistToggle}
      >
        <IconSymbol 
          ios_icon_name={inWatchlist ? "bookmark.fill" : "bookmark"}
          android_material_icon_name={inWatchlist ? "bookmark" : "bookmark_border"}
          size={24} 
          color={inWatchlist ? colors.accent : colors.text} 
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{movie.description}</Text>
        <View style={styles.footer}>
          <View style={styles.durationContainer}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              android_material_icon_name="schedule" 
              size={16} 
              color={colors.textSecondary} 
            />
            <Text style={styles.duration}>{Math.floor(movie.duration / 60)} min</Text>
          </View>
          <IconSymbol 
            ios_icon_name="play.circle.fill" 
            android_material_icon_name="play_circle" 
            size={32} 
            color={colors.primary} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary,
    boxShadow: '0px 4px 8px rgba(50, 205, 50, 0.2)',
    elevation: 4,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background,
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  newBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '800',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  premiumBadgeText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '800',
  },
  watchlistButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    zIndex: 10,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
