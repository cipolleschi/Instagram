import { Stack } from 'expo-router';
import '../../global.css';
import AuthProvider from '../providers/AuthProvider';
import { ThemeProvider, useTheme } from '../providers/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

function RootLayoutContent() {
  const { isDark } = useTheme();
  
  return (
    <View className={isDark ? 'dark' : ''} style={{ flex: 1 }}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? '#000' : '#fff' }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="newModal" 
          options={{
            presentation: 'formSheet',
            headerShown: true,
            headerTitle: 'Create post',
            headerStyle: { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
            headerTintColor: isDark ? '#fff' : '#000',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="about" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
