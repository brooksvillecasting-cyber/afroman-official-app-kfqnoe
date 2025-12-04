
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const SUBSCRIPTION_PRICE = 19.99;
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/7sYdRb1Nj5xCfSlfKd6Na07';

export default function SubscriptionScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    console.log('Subscribe button pressed');
    console.log('Opening Stripe payment link:', STRIPE_PAYMENT_LINK);
    
    setIsLoading(true);
    
    try {
      // Check if the URL can be opened
      const canOpen = await Linking.canOpenURL(STRIPE_PAYMENT_LINK);
      console.log('Can open URL:', canOpen);
      
      if (!canOpen) {
        console.error('Cannot open Stripe payment link');
        Alert.alert(
          'Error',
          'Unable to open payment page. Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      // Open the Stripe payment link
      await Linking.openURL(STRIPE_PAYMENT_LINK);
      console.log('Successfully opened Stripe payment link');
      
      // Show info to user about external payment
      Alert.alert(
        'External Payment Portal',
        'You are being redirected to our secure payment portal powered by Stripe. After completing your payment, you will be automatically redirected back to the app with full premium access. Your payment information is securely processed by Stripe and never stored in the app.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Error opening Stripe payment link:', error);
      Alert.alert(
        'Something Went Wrong',
        'We couldn\'t open the payment page. Please try again or contact support if the problem persists.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: () => handleSubscribe() }
        ]
      );
    } finally {
      setIsLoading(false);
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
          <Text style={styles.subtitle}>Unlock exclusive movies and content</Text>
        </View>

        {/* Payment Notice */}
        <View style={styles.paymentNotice}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={24} 
            color={colors.primary} 
          />
          <View style={styles.paymentNoticeContent}>
            <Text style={styles.paymentNoticeTitle}>External Payment Portal</Text>
            <Text style={styles.paymentNoticeText}>
              Subscriptions are managed through our secure web portal. You&apos;ll be redirected to complete your payment and then returned to the app automatically.
            </Text>
          </View>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>$</Text>
            <Text style={styles.price}>{SUBSCRIPTION_PRICE.toFixed(2)}</Text>
            <Text style={styles.period}>/month</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Premium Features:</Text>
          
          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Unlimited streaming of all premium movies</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Exclusive documentaries and behind-the-scenes content</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Early access to new movie releases</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>HD quality playback with adjustable speed control</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Offline viewing capability (coming soon)</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Ad-free experience</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>Cancel anytime through web portal</Text>
          </View>
        </View>

        {/* Free Content Notice */}
        <View style={styles.freeNotice}>
          <IconSymbol 
            ios_icon_name="music.note" 
            android_material_icon_name="music_note" 
            size={24} 
            color={colors.accent} 
          />
          <View style={styles.freeNoticeContent}>
            <Text style={styles.freeNoticeTitle}>Music Videos Stay Free!</Text>
            <Text style={styles.freeNoticeText}>
              All music videos, including the Grammy-nominated &quot;Because I Got High,&quot; remain completely free to watch. Only movies require a subscription.
            </Text>
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity 
          style={[styles.subscribeButton, isLoading && styles.subscribeButtonDisabled]}
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <>
              <IconSymbol 
                ios_icon_name="arrow.up.right.square.fill" 
                android_material_icon_name="open_in_new" 
                size={24} 
                color={colors.background} 
              />
              <Text style={styles.subscribeButtonText}>
                Continue to Payment Portal
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Secure Payment Notice */}
        <View style={styles.secureNotice}>
          <IconSymbol 
            ios_icon_name="lock.shield.fill" 
            android_material_icon_name="verified_user" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.secureNoticeText}>
            Secure payment powered by Stripe
          </Text>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscription automatically renews monthly unless cancelled through the web portal. 
          Your payment information is securely processed by Stripe and never stored in this app. 
          Subscriptions are managed externally through our web portal at buy.stripe.com.
        </Text>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoTitle}>How It Works:</Text>
          <Text style={styles.additionalInfoText}>
            1. Tap &quot;Continue to Payment Portal&quot; above{'\n'}
            2. Complete your payment securely on Stripe{'\n'}
            3. You&apos;ll be automatically redirected back to the app{'\n'}
            4. Enjoy instant access to all premium content!
          </Text>
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
    marginBottom: 24,
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
  paymentNotice: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  paymentNoticeContent: {
    flex: 1,
  },
  paymentNoticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  paymentNoticeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
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
    marginBottom: 24,
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
  freeNotice: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  freeNoticeContent: {
    flex: 1,
  },
  freeNoticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 6,
  },
  freeNoticeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.background,
  },
  secureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  secureNoticeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  terms: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  additionalInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  additionalInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
