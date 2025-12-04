
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { CartProvider } from '@/contexts/CartContext';
import { Platform } from 'react-native';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.log('Error preventing splash screen auto-hide:', error);
});

export default function RootLayout() {
  useEffect(() => {
    console.log('RootLayout mounted');
    console.log('Platform:', Platform.OS);
    
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch((error) => {
        console.log('Error hiding splash screen:', error);
      });
    }, 2000);

    // Handle deep linking
    const handleDeepLink = (event: { url: string }) => {
      console.log('Deep link received:', event.url);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('App opened with URL:', url);
      }
    }).catch((error) => {
      console.log('Error getting initial URL:', error);
    });

    return () => {
      clearTimeout(timer);
      subscription.remove();
      console.log('RootLayout unmounted');
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="product-detail" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="cart" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="video-player" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom',
            }} 
          />
        </Stack>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
