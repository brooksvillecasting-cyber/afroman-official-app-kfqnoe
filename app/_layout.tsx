
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/styles/commonStyles';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen 
        name="subscription" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen 
        name="movie-player" 
        options={{ 
          presentation: 'fullScreenModal',
          animation: 'fade',
        }} 
      />
    </Stack>
  );
}
