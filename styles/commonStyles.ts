
import { StyleSheet } from 'react-native';

export const colors = {
  background: '#000000',      // Black
  text: '#FFFFFF',            // White
  textSecondary: '#A9A9A9',   // Dark Gray
  primary: '#32CD32',         // Money Green (Lime Green)
  secondary: '#228B22',       // Forest Green
  accent: '#00FF00',          // Bright Green
  card: '#1A1A1A',            // Dark Gray Card
  highlight: '#32CD32',       // Money Green
  error: '#FF4444',           // Red for errors
  success: '#32CD32',         // Green for success
};

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    boxShadow: '0px 4px 12px rgba(50, 205, 50, 0.4)',
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    boxShadow: '0px 4px 12px rgba(34, 139, 34, 0.4)',
    elevation: 6,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  outlineButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 8px rgba(50, 205, 50, 0.2)',
    elevation: 4,
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    width: '100%',
    marginBottom: 16,
  },
});
