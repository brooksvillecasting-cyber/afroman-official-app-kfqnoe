
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { MovieCard } from '@/components/MovieCard';
import { MusicVideoCard } from '@/components/MusicVideoCard';
import { useMovies } from '@/hooks/useMovies';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const router = useRouter();
  const { movies, musicVideos, loading, refreshMovies } = useMovies();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshMovies();
    setRefreshing(false);
  };

  const newMovies = movies.filter(m => m.isNew);
  const allMovies = movies;

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/1e10f7f3-1517-4585-aaa3-7e62500446bb.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerSubtitle}>Official Content</Text>
        </View>

        {/* Subscription Banner */}
        {!user?.hasSubscription && (
          <TouchableOpacity 
            style={styles.subscriptionBanner}
            onPress={() => router.push('/subscription')}
          >
            <View style={styles.subscriptionContent}>
              <IconSymbol 
                ios_icon_name="star.fill" 
                android_material_icon_name="star" 
                size={32} 
                color={colors.accent} 
              />
              <View style={styles.subscriptionText}>
                <Text style={styles.subscriptionTitle}>Get Premium Access</Text>
                <Text style={styles.subscriptionPrice}>$19.99/month - Unlock All Movies</Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron_right" 
                size={24} 
                color={colors.primary} 
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Free Music Video Section - Only "Because I Got High" */}
        {musicVideos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol 
                ios_icon_name="music.note" 
                android_material_icon_name="music_note" 
                size={24} 
                color={colors.accent} 
              />
              <Text style={styles.sectionTitle}>Free Music Video</Text>
              <View style={styles.freePill}>
                <Text style={styles.freePillText}>FREE</Text>
              </View>
            </View>
            <Text style={styles.sectionDescription}>
              Watch the Grammy-nominated hit for free on YouTube
            </Text>
            {musicVideos.map((video, index) => (
              <React.Fragment key={video.id}>
                <MusicVideoCard video={video} />
              </React.Fragment>
            ))}
          </View>
        )}

        {/* Premium Movies Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="film.fill" 
              android_material_icon_name="movie" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Premium Movies</Text>
            <View style={styles.premiumPill}>
              <IconSymbol 
                ios_icon_name="star.fill" 
                android_material_icon_name="star" 
                size={14} 
                color={colors.background} 
              />
              <Text style={styles.premiumPillText}>PREMIUM</Text>
            </View>
          </View>
          <Text style={styles.sectionDescription}>
            Subscribe for $19.99/month to unlock all premium content
          </Text>
          {allMovies.map((movie, index) => (
            <React.Fragment key={movie.id}>
              <MovieCard movie={movie} />
            </React.Fragment>
          ))}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading content...</Text>
          </View>
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
    marginBottom: 24,
    paddingVertical: 20,
  },
  logo: {
    width: 280,
    height: 140,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    letterSpacing: 1,
  },
  subscriptionBanner: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subscriptionText: {
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subscriptionPrice: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    marginLeft: 32,
  },
  freePill: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
  },
  freePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.background,
  },
  premiumPill: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  premiumPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.background,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
