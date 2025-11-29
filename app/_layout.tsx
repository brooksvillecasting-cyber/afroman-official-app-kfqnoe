
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Stripe publishable key (test mode)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SHylYRqxjczpVGKlCQo5vvp21r5c357TtOiVASvqwT5YnuxPWEwKb6qmKJiaZkhLAMWJXWq7iEaZnl9pt6c0Cxx00zEqORvoi';

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier="merchant.com.afroman.app"
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="formsheet" 
            options={{ 
              presentation: 'formSheet',
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="transparent-modal" 
            options={{ 
              presentation: 'transparentModal',
              animation: 'fade',
            }} 
          />
          <Stack.Screen 
            name="admin-login" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="admin-upload" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="movie-player" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="youtube-player" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="subscription" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom',
            }} 
          />
        </Stack>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
