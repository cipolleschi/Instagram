import { Stack } from 'expo-router';
import '../../global.css';
import AuthProvider from '../providers/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="new" 
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Create post',
          }}
        />
        <Stack.Screen name="about" />
      </Stack>
    </AuthProvider>
  );
}
