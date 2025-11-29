
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { MovieCard } from '@/components/MovieCard';
import { useMovies } from '@/hooks/useMovies';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const router = useRouter();
  const { movies, loading, refreshMovies } = useMovies();
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AFROMAN</Text>
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
                <Text style={styles.subscriptionPrice}>$19.99/month - Unlimited Content</Text>
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

        {/* New Movie Finds */}
        {newMovies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol 
                ios_icon_name="sparkles" 
                android_material_icon_name="auto_awesome" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={styles.sectionTitle}>New Movie Finds</Text>
            </View>
            {newMovies.map((movie, index) => (
              <React.Fragment key={movie.id}>
                <MovieCard movie={movie} />
              </React.Fragment>
            ))}
          </View>
        )}

        {/* All Content */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="film.fill" 
              android_material_icon_name="movie" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>All Content</Text>
          </View>
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
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 2,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
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
