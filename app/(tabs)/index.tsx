
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Logo */}
        <View style={styles.hero}>
          <Image 
            source={require('@/assets/images/78f09d30-583a-4e97-8a0c-72de573f1869.jpeg')}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>Official Afroman App</Text>
          <Text style={styles.heroSubtitle}>
            Grammy-Nominated Artist
          </Text>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/shop')}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconSymbol 
                ios_icon_name="cart.fill" 
                android_material_icon_name="shopping_cart" 
                size={48} 
                color={colors.background} 
              />
              <Text style={styles.actionTitle}>Shop Merch</Text>
              <Text style={styles.actionDescription}>
                Official T-Shirts, Hoodies & More
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/videos')}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconSymbol 
                ios_icon_name="play.rectangle.fill" 
                android_material_icon_name="play_circle" 
                size={48} 
                color={colors.background} 
              />
              <Text style={styles.actionTitle}>Music Videos</Text>
              <Text style={styles.actionDescription}>
                Watch Official Videos
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/about')}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconSymbol 
                ios_icon_name="info.circle.fill" 
                android_material_icon_name="info" 
                size={48} 
                color={colors.background} 
              />
              <Text style={styles.actionTitle}>About Afroman</Text>
              <Text style={styles.actionDescription}>
                Bio, Photos & Achievements
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured</Text>
          
          <View style={styles.featuredCard}>
            <Text style={styles.featuredTitle}>🎵 Because I Got High</Text>
            <Text style={styles.featuredText}>
              Stream the Grammy-nominated hit that made Afroman a household name
            </Text>
            <TouchableOpacity 
              style={buttonStyles.primaryButton}
              onPress={() => router.push('/videos')}
            >
              <Text style={buttonStyles.buttonText}>Watch Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredCard}>
            <Text style={styles.featuredTitle}>🎬 Happily Divorced</Text>
            <Text style={styles.featuredText}>
              Get the exclusive movie for just $24.99
            </Text>
            <TouchableOpacity 
              style={buttonStyles.primaryButton}
              onPress={() => router.push('/shop')}
            >
              <Text style={buttonStyles.buttonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  heroImage: {
    width: 300,
    height: 300,
    marginBottom: 24,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 2,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 6px 16px rgba(50, 205, 50, 0.3)',
    elevation: 8,
  },
  actionGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  actionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.background,
    marginTop: 8,
  },
  actionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
    opacity: 0.9,
    textAlign: 'center',
  },
  featuredSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(50, 205, 50, 0.2)',
    elevation: 6,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  featuredText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 24,
  },
});
