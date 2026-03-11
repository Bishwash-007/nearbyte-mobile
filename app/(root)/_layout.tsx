import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 300,
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(screens)" />
    </Stack>
  );
}
