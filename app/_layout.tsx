
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    // Handle deep linking
    const handleDeepLink = (event: { url: string }) => {
      console.log('Deep link received:', event.url);
      // Deep link handling is managed by expo-router automatically
    };

    // Listen for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('App opened with URL:', url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <Stack.Screen 
          name="payment-success" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
