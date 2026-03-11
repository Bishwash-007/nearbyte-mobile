import { Stack } from 'expo-router';
import { StatusBar, View } from 'react-native';

export default function RootLayout() {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="settings" />
        <Stack.Screen name="home" />
        <Stack.Screen name="sharing" />
      </Stack>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}
