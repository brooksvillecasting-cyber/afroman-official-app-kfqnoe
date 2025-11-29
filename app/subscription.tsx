
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';

const SUBSCRIPTION_PRICE = 19.99;

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleSubscribe = async () => {
    if (!cardComplete) {
      Alert.alert('Card Required', 'Please enter your card details to continue.');
      return;
    }

    if (!user) {
      Alert.alert('Login Required', 'Please log in to subscribe.');
      return;
    }

    setLoading(true);
    setProcessingPayment(true);

    try {
      console.log('Creating payment intent for user:', user.id || user.email);

      // Call edge function to create payment intent
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            amount: SUBSCRIPTION_PRICE,
            currency: 'usd',
            userId: user.id || user.email,
            email: user.email,
          },
        }
      );

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(functionError.message || 'Failed to create payment intent');
      }

      if (!functionData?.clientSecret) {
        console.error('No client secret returned:', functionData);
        throw new Error('Failed to initialize payment');
      }

      console.log('Payment intent created, confirming payment...');

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await confirmPayment(
        functionData.clientSecret,
        {
          paymentMethodType: 'Card',
        }
      );

      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
        throw new Error(confirmError.message || 'Payment failed');
      }

      console.log('Payment confirmed:', paymentIntent?.id);

      // Confirm payment on backend
      const { data: confirmData, error: confirmBackendError } = await supabase.functions.invoke(
        'confirm-payment',
        {
          body: {
            paymentIntentId: paymentIntent?.id || functionData.paymentIntentId,
            userId: user.id || user.email,
          },
        }
      );

      if (confirmBackendError) {
        console.error('Backend confirmation error:', confirmBackendError);
        throw new Error('Payment succeeded but subscription activation failed. Please contact support.');
      }

      if (confirmData?.success) {
        console.log('Subscription activated successfully');

        // Update user with subscription status
        const updatedUser = {
          ...user,
          hasSubscription: true,
          subscriptionExpiresAt: new Date(confirmData.expiresAt),
        };
        await login(updatedUser);

        Alert.alert(
          'Success! 🎉',
          'Your subscription is now active! You can now watch all premium movies.',
          [
            {
              text: 'Start Watching',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw new Error('Subscription activation failed');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      Alert.alert(
        'Payment Failed',
        error.message || 'Failed to process payment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setProcessingPayment(false);
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

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Details</Text>
          <Text style={styles.paymentSubtitle}>Enter your card information (Test Mode)</Text>
          
          <View style={styles.cardFieldContainer}>
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: colors.card,
                textColor: colors.text,
                placeholderColor: colors.textSecondary,
                borderRadius: 8,
              }}
              style={styles.cardField}
              onCardChange={(cardDetails) => {
                console.log('Card details changed:', cardDetails.complete);
                setCardComplete(cardDetails.complete);
              }}
            />
          </View>

          <View style={styles.testModeNotice}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.testModeText}>
              Test Mode: Use card 4242 4242 4242 4242 with any future date and CVC
            </Text>
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity 
          style={[
            styles.subscribeButton, 
            (loading || !cardComplete) && styles.subscribeButtonDisabled
          ]}
          onPress={handleSubscribe}
          disabled={loading || !cardComplete}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <>
              <IconSymbol 
                ios_icon_name="creditcard.fill" 
                android_material_icon_name="payment" 
                size={24} 
                color={colors.background} 
              />
              <Text style={styles.subscribeButtonText}>
                Subscribe Now - ${SUBSCRIPTION_PRICE.toFixed(2)}
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
            Secure payment powered by Stripe (Test Mode)
          </Text>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscription automatically renews monthly unless cancelled. 
          Your payment information is securely processed by Stripe.
        </Text>
      </ScrollView>

      {/* Processing Overlay */}
      {processingPayment && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Processing Payment...</Text>
            <Text style={styles.processingSubtext}>Please wait, do not close the app</Text>
          </View>
        </View>
      )}
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
  paymentSection: {
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  cardFieldContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  cardField: {
    width: '100%',
    height: 50,
  },
  testModeNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  testModeText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
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
    opacity: 0.5,
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
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  processingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
