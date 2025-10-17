import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator } from 'react-native';

import { auth, type User, type MockSession } from '~/src/services/authService';

type Auth = {
  isAuthenticated: boolean;
  session: MockSession | null;
  user?: User;
};

const AuthContext = createContext<Auth>({
  isAuthenticated: false,
  session: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<MockSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load current session on app start
    auth.getCurrentSession().then((mockSession) => {
      setSession(mockSession);
      setIsReady(true);
    });

    // Set up session change listener (mock)
    const checkSession = async () => {
      const currentSession = await auth.getCurrentSession();
      if (currentSession !== session) {
        setSession(currentSession);
      }
    };

    // Check session every 5 seconds (simulating real-time auth state changes)
    const interval = setInterval(checkSession, 5000);

    return () => clearInterval(interval);
  }, [session]);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user, isAuthenticated: !!session?.user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
