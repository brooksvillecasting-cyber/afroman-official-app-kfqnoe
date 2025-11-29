
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleAdminLogin = () => {
    router.push('/admin-login');
  };

  const handleSubscribe = () => {
    router.push('/subscription');
  };

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
            Alert.alert('Success', 'You have been logged out');
          }
        },
      ]
    );
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
          <IconSymbol 
            ios_icon_name="person.circle.fill" 
            android_material_icon_name="account_circle" 
            size={80} 
            color={colors.primary} 
          />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info */}
        {user ? (
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <IconSymbol 
                ios_icon_name="envelope.fill" 
                android_material_icon_name="email" 
                size={20} 
                color={colors.primary} 
              />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            
            {user.isAdmin && (
              <View style={styles.adminBadge}>
                <IconSymbol 
                  ios_icon_name="crown.fill" 
                  android_material_icon_name="workspace_premium" 
                  size={20} 
                  color={colors.accent} 
                />
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}

            {user.hasSubscription ? (
              <View style={styles.subscriptionActive}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check_circle" 
                  size={24} 
                  color={colors.primary} 
                />
                <Text style={styles.subscriptionActiveText}>Premium Active</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                <Text style={styles.subscribeButtonText}>Subscribe for $19.99/month</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.notLoggedInText}>Not logged in</Text>
          </View>
        )}

        {/* Admin Section */}
        {user?.isAdmin ? (
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={() => router.push('/admin-upload')}
          >
            <IconSymbol 
              ios_icon_name="plus.circle.fill" 
              android_material_icon_name="add_circle" 
              size={24} 
              color={colors.background} 
            />
            <Text style={styles.adminButtonText}>Upload Content</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.adminLoginButton} onPress={handleAdminLogin}>
            <IconSymbol 
              ios_icon_name="lock.fill" 
              android_material_icon_name="lock" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.adminLoginButtonText}>Admin Login</Text>
          </TouchableOpacity>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="bell.fill" 
              android_material_icon_name="notifications" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingText}>Notifications</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron_right" 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingText}>About</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron_right" 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        {user && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol 
              ios_icon_name="arrow.right.square.fill" 
              android_material_icon_name="logout" 
              size={24} 
              color={colors.text} 
            />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  adminBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
  },
  subscriptionActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  subscriptionActiveText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  notLoggedInText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  adminButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  adminButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
  },
  adminLoginButton: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  adminLoginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
