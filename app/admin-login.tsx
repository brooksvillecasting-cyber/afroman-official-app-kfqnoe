
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/hooks/useAuth';
import { validateAdminCredentials } from '@/utils/storage';
import { IconSymbol } from '@/components/IconSymbol';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const isAdmin = await validateAdminCredentials(email, password);
      
      if (isAdmin) {
        const adminUser = {
          id: 'admin',
          email: email,
          isAdmin: true,
          hasSubscription: true, // Admin has full access
        };
        
        await login(adminUser);
        
        Alert.alert(
          'Welcome Admin! 🎬',
          'You have successfully logged in as administrator.',
          [
            {
              text: 'Upload Content',
              onPress: () => {
                router.back();
                router.push('/admin-upload');
              },
            },
            {
              text: 'Go to Home',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid admin credentials. Please check your email and password.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[commonStyles.container, styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <IconSymbol 
            ios_icon_name="xmark.circle.fill" 
            android_material_icon_name="close" 
            size={32} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="person.badge.key.fill" 
            android_material_icon_name="admin_panel_settings" 
            size={80} 
            color={colors.primary} 
          />
          <Text style={styles.title}>Admin Login</Text>
          <Text style={styles.subtitle}>Enter your admin credentials to continue</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <IconSymbol 
              ios_icon_name="envelope.fill" 
              android_material_icon_name="email" 
              size={20} 
              color={colors.textSecondary} 
            />
            <TextInput
              style={styles.input}
              placeholder="Admin Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <IconSymbol 
              ios_icon_name="lock.fill" 
              android_material_icon_name="lock" 
              size={20} 
              color={colors.textSecondary} 
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Login as Admin'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            Admin access is required to upload and manage content
          </Text>
        </View>

        {/* Test Mode Notice */}
        <View style={styles.testModeNotice}>
          <IconSymbol 
            ios_icon_name="exclamationmark.triangle.fill" 
            android_material_icon_name="warning" 
            size={20} 
            color={colors.accent} 
          />
          <Text style={styles.testModeText}>
            App is running in test mode with Stripe test keys
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
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
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.background,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  testModeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  testModeText: {
    flex: 1,
    fontSize: 14,
    color: colors.accent,
    lineHeight: 20,
    fontWeight: '600',
  },
});
