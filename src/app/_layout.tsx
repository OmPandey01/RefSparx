import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SparkProvider } from '@/context/SparkContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SparkProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="camera" options={{ presentation: 'modal' }} />
          <Stack.Screen name="spark/[id]" />
        </Stack>
      </ThemeProvider>
    </SparkProvider>
  );
}
