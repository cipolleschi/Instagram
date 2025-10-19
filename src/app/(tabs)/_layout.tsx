import { Redirect, Tabs, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '~/src/providers/AuthProvider';
import NotificationProvider from '~/src/providers/NotificationProvider';
import { TouchableOpacity } from 'react-native';

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
          tabBarShowLabel: false,
        }}
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
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={26} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: 'Profile',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={26} color={color} />
            ),
          }}
        />
      </Tabs>
    </NotificationProvider>
  );
}
