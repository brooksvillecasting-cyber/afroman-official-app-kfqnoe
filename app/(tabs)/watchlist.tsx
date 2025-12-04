
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useMovies } from '@/hooks/useMovies';
import { MovieCard } from '@/components/MovieCard';
import { MusicVideoCard } from '@/components/MusicVideoCard';
import { IconSymbol } from '@/components/IconSymbol';

export default function WatchlistScreen() {
  const router = useRouter();
  const { watchlist } = useWatchlist();
  const { movies, musicVideos } = useMovies();

  // Get actual movie and video objects from watchlist IDs
  const watchlistMovies = watchlist
    .filter(item => item.type === 'movie')
    .map(item => movies.find(m => m.id === item.id))
    .filter(Boolean);

  const watchlistVideos = watchlist
    .filter(item => item.type === 'music_video')
    .map(item => musicVideos.find(v => v.id === item.id))
    .filter(Boolean);

  const hasContent = watchlistMovies.length > 0 || watchlistVideos.length > 0;

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="bookmark.fill" 
            android_material_icon_name="bookmark" 
            size={48} 
            color={colors.primary} 
          />
          <Text style={styles.title}>My Watchlist</Text>
          <Text style={styles.subtitle}>
            {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} saved
          </Text>
        </View>

        {!hasContent ? (
          <View style={styles.emptyState}>
            <IconSymbol 
              ios_icon_name="bookmark" 
              android_material_icon_name="bookmark_border" 
              size={80} 
              color={colors.textSecondary} 
            />
            <Text style={styles.emptyTitle}>Your Watchlist is Empty</Text>
            <Text style={styles.emptyText}>
              Add movies and music videos to your watchlist to watch them later.
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)/(home)')}
            >
              <IconSymbol 
                ios_icon_name="film.fill" 
                android_material_icon_name="movie" 
                size={20} 
                color={colors.background} 
              />
              <Text style={styles.browseButtonText}>Browse Content</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Movies Section */}
            {watchlistMovies.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <IconSymbol 
                    ios_icon_name="film.fill" 
                    android_material_icon_name="movie" 
                    size={24} 
                    color={colors.primary} 
                  />
                  <Text style={styles.sectionTitle}>Movies</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{watchlistMovies.length}</Text>
                  </View>
                </View>
                {watchlistMovies.map((movie, index) => (
                  <React.Fragment key={movie.id}>
                    <MovieCard movie={movie} />
                  </React.Fragment>
                ))}
              </View>
            )}

            {/* Music Videos Section */}
            {watchlistVideos.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <IconSymbol 
                    ios_icon_name="music.note" 
                    android_material_icon_name="music_note" 
                    size={24} 
                    color={colors.accent} 
                  />
                  <Text style={styles.sectionTitle}>Music Videos</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{watchlistVideos.length}</Text>
                  </View>
                </View>
                {watchlistVideos.map((video, index) => (
                  <React.Fragment key={video.id}>
                    <MusicVideoCard video={video} />
                  </React.Fragment>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.background,
  },
});
