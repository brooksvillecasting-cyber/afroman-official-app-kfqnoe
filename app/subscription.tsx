
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const SUBSCRIPTION_PRICE = 19.99;
const PAYMENT_LINK = 'https://buy.stripe.com/4gw6qg0Aw1Hy5Ow5kk';

export default function SubscriptionScreen() {
  const router = useRouter();

  const handleSubscribe = async () => {
    console.log('Opening payment link:', PAYMENT_LINK);
    try {
      const supported = await Linking.canOpenURL(PAYMENT_LINK);
      if (supported) {
        await Linking.openURL(PAYMENT_LINK);
      } else {
        console.error('Cannot open payment link');
      }
    } catch (error) {
      console.error('Error opening payment link:', error);
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
          <Text style={styles.subtitle}>Unlock all movies - Music videos stay free!</Text>
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
          <Text style={styles.featuresTitle}>What&apos;s Included:</Text>
          
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
            <Text style={styles.featureText}>Early access to new movie releases</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.featureText}>HD quality playback with speed control</Text>
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

        {/* Free Content Notice */}
        <View style={styles.freeNotice}>
          <IconSymbol 
            ios_icon_name="music.note" 
            android_material_icon_name="music_note" 
            size={24} 
            color={colors.accent} 
          />
          <View style={styles.freeNoticeContent}>
            <Text style={styles.freeNoticeTitle}>Music Videos Are Free!</Text>
            <Text style={styles.freeNoticeText}>
              All music videos remain free to watch. Only movies require a subscription.
            </Text>
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        >
          <IconSymbol 
            ios_icon_name="creditcard.fill" 
            android_material_icon_name="payment" 
            size={24} 
            color={colors.background} 
          />
          <Text style={styles.subscribeButtonText}>
            Subscribe Now - ${SUBSCRIPTION_PRICE.toFixed(2)}
          </Text>
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
          Subscription automatically renews monthly unless cancelled. 
          Your payment information is securely processed by Stripe.
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
  },
});
