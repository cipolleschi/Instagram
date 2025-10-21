import { Redirect, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '~/src/providers/AuthProvider';
import NotificationProvider from '~/src/providers/NotificationProvider';
import { TouchableOpacity } from 'react-native';
import { Tabs } from '~/src/components/BottomTabs';

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <NotificationProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black',
          headerShown: true,
          headerLargeTitle: false,
        }}
        tabBarVariant="uikit"
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: 'For you',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.push('/new')}
                style={{ marginLeft: 15 }}
              >
                <FontAwesome name="plus" size={24} color="black" />
              </TouchableOpacity>
            ),
            tabBarIcon: () => ({ sfSymbol: 'house' }),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: 'Profile',
            tabBarIcon: () => ({ sfSymbol: 'person' }),
          }}
        />
      </Tabs>
    </NotificationProvider>
  );
}
