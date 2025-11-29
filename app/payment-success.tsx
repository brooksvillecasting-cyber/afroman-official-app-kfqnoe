
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/hooks/useAuth';
import { getUser, saveUser } from '@/utils/storage';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    handlePaymentSuccess();
  }, []);

  const handlePaymentSuccess = async () => {
    console.log('Payment success - updating subscription status');
    
    try {
      // Get current user data
      const currentUser = await getUser();
      
      if (currentUser) {
        // Update user with subscription status
        const updatedUser = {
          ...currentUser,
          hasSubscription: true,
          subscriptionDate: new Date().toISOString(),
        };
        
        // Save updated user data
        await saveUser(updatedUser);
        await login(updatedUser);
        
        console.log('Subscription activated successfully');
        
        // Wait a moment to show success message
        setTimeout(() => {
          setIsProcessing(false);
          // Redirect to home after 2 seconds
          setTimeout(() => {
            router.replace('/(tabs)/(home)');
          }, 2000);
        }, 1000);
      } else {
        console.log('No user found - redirecting to home');
        setTimeout(() => {
          router.replace('/(tabs)/(home)');
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      setTimeout(() => {
        router.replace('/(tabs)/(home)');
      }, 2000);
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.content}>
        {isProcessing ? (
          <>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Processing your payment...</Text>
            <Text style={styles.processingSubtext}>Please wait a moment</Text>
          </>
        ) : (
          <>
            <View style={styles.successIcon}>
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill" 
                android_material_icon_name="check_circle" 
                size={100} 
                color={colors.primary} 
              />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSubtext}>
              Welcome to Premium! You now have access to all premium movies.
            </Text>
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check_circle" 
                  size={20} 
                  color={colors.primary} 
                />
                <Text style={styles.featureText}>Unlimited premium movies</Text>
              </View>
              <View style={styles.feature}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check_circle" 
                  size={20} 
                  color={colors.primary} 
                />
                <Text style={styles.featureText}>HD quality playback</Text>
              </View>
              <View style={styles.feature}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check_circle" 
                  size={20} 
                  color={colors.primary} 
                />
                <Text style={styles.featureText}>No ads</Text>
              </View>
            </View>
            <Text style={styles.redirectText}>Redirecting you to the app...</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  processingText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    textAlign: 'center',
  },
  processingSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  redirectText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
