
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/hooks/useAuth';
import { saveSubscription } from '@/utils/storage';
import { IconSymbol } from '@/components/IconSymbol';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const subscriptionData = {
        active: true,
        price: 19.99,
        startDate: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      await saveSubscription(subscriptionData);

      if (user) {
        await login({
          ...user,
          hasSubscription: true,
          subscriptionExpiresAt: subscriptionData.expiresAt,
        });
      }

      Alert.alert(
        'Success!',
        'Welcome to Afroman Premium! You now have unlimited access to all content.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.log('Subscription error:', error);
      Alert.alert('Error', 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow_back" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="star.fill" 
            android_material_icon_name="star" 
            size={80} 
            color={colors.accent} 
          />
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.subtitle}>Unlimited access to all Afroman content</Text>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>$</Text>
            <Text style={styles.price}>19.99</Text>
            <Text style={styles.period}>/month</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What&apos;s Included:</Text>
          
          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Unlimited streaming of all movies</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Early access to new releases</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>HD quality playback</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Exclusive behind-the-scenes content</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>No ads, ever</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Cancel anytime</Text>
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity 
          style={[styles.subscribeButton, loading && styles.subscribeButtonDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          <Text style={styles.subscribeButtonText}>
            {loading ? 'Processing...' : 'Subscribe Now'}
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.terms}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscription automatically renews monthly unless cancelled.
        </Text>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  pricingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currency: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  price: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.primary,
  },
  period: {
    fontSize: 20,
    color: colors.textSecondary,
    marginTop: 20,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.background,
  },
  terms: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
