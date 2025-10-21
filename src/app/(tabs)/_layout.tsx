import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '~/src/providers/AuthProvider';
import NotificationProvider from '~/src/providers/NotificationProvider';
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
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: () => ({ sfSymbol: 'house' }),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: () => ({ sfSymbol: 'person' }),
          }}
        />

        <Tabs.Screen
          name="new"
          options={{
            tabBarIcon: () => ({ sfSymbol: 'plus.circle.fill', role: 'search' }),
            role: 'search',
            preventsDefault: true,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.navigate('/newModal');
            },
          }}
        />
      </Tabs>
    </NotificationProvider>
  );
}
