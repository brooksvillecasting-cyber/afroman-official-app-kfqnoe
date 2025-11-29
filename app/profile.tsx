
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, refreshSubscriptionStatus } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          },
        },
      ]
    );
  };

  const handleRefreshSubscription = async () => {
    try {
      await refreshSubscriptionStatus();
      Alert.alert('Refreshed', 'Subscription status has been updated.');
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh subscription status.');
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
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol 
              ios_icon_name={user?.isAdmin ? "person.badge.key.fill" : "person.circle.fill"}
              android_material_icon_name={user?.isAdmin ? "admin_panel_settings" : "account_circle"}
              size={80} 
              color={colors.primary} 
            />
          </View>
          <Text style={styles.name}>{user?.email || 'Guest'}</Text>
          {user?.isAdmin && (
            <View style={styles.adminBadge}>
              <IconSymbol 
                ios_icon_name="star.fill" 
                android_material_icon_name="star" 
                size={16} 
                color={colors.background} 
              />
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          )}
        </View>

        {/* Subscription Status */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription Status</Text>
            <View style={[
              styles.statusCard,
              user.hasSubscription ? styles.statusCardActive : styles.statusCardInactive
            ]}>
              <IconSymbol 
                ios_icon_name={user.hasSubscription ? "checkmark.circle.fill" : "xmark.circle.fill"}
                android_material_icon_name={user.hasSubscription ? "check_circle" : "cancel"}
                size={32} 
                color={user.hasSubscription ? colors.primary : colors.textSecondary} 
              />
              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>
                  {user.hasSubscription ? 'Premium Active' : 'No Active Subscription'}
                </Text>
                {user.hasSubscription && user.subscriptionExpiresAt && (
                  <Text style={styles.statusSubtitle}>
                    Expires: {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                  </Text>
                )}
                {!user.hasSubscription && !user.isAdmin && (
                  <Text style={styles.statusSubtitle}>
                    Subscribe to unlock all premium movies
                  </Text>
                )}
              </View>
            </View>

            {!user.hasSubscription && !user.isAdmin && (
              <TouchableOpacity 
                style={styles.subscribeButton}
                onPress={() => router.push('/subscription')}
              >
                <IconSymbol 
                  ios_icon_name="star.fill" 
                  android_material_icon_name="star" 
                  size={20} 
                  color={colors.background} 
                />
                <Text style={styles.subscribeButtonText}>Subscribe Now - $19.99/month</Text>
              </TouchableOpacity>
            )}

            {user.hasSubscription && (
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={handleRefreshSubscription}
              >
                <IconSymbol 
                  ios_icon_name="arrow.clockwise" 
                  android_material_icon_name="refresh" 
                  size={20} 
                  color={colors.primary} 
                />
                <Text style={styles.refreshButtonText}>Refresh Status</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Admin Actions */}
        {user?.isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin Actions</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/admin-upload')}
            >
              <IconSymbol 
                ios_icon_name="square.and.arrow.up.fill" 
                android_material_icon_name="upload" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={styles.menuItemText}>Upload Content</Text>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron_right" 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {!user && (
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/admin-login')}
            >
              <IconSymbol 
                ios_icon_name="person.badge.key.fill" 
                android_material_icon_name="admin_panel_settings" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={styles.menuItemText}>Admin Login</Text>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron_right" 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          )}

          {user && (
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <IconSymbol 
                ios_icon_name="rectangle.portrait.and.arrow.right.fill" 
                android_material_icon_name="logout" 
                size={24} 
                color={colors.accent} 
              />
              <Text style={[styles.menuItemText, { color: colors.accent }]}>Logout</Text>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron_right" 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Test Mode Info */}
        <View style={styles.testModeCard}>
          <IconSymbol 
            ios_icon_name="exclamationmark.triangle.fill" 
            android_material_icon_name="warning" 
            size={24} 
            color={colors.accent} 
          />
          <View style={styles.testModeContent}>
            <Text style={styles.testModeTitle}>Test Mode Active</Text>
            <Text style={styles.testModeText}>
              This app is running in Stripe test mode. Use test card 4242 4242 4242 4242 for payments.
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Afroman Official App</Text>
          <Text style={styles.appInfoText}>Version 1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 All Rights Reserved</Text>
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
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.background,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusCardActive: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  statusCardInactive: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.background,
  },
  refreshButton: {
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  testModeCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  testModeContent: {
    flex: 1,
  },
  testModeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 6,
  },
  testModeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
