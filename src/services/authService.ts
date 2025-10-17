import { storage } from './storageService';
import users from '../../assets/data/users.json';

export interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatar_url: string;
  push_token: string | null;
  created_at: string;
}

export interface MockSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthResponse {
  user?: User;
  session?: MockSession;
  error?: string;
}

/**
 * Mock Authentication Service
 * Simulates Supabase auth behavior with local data
 */
export class AuthService {
  private static currentSession: MockSession | null = null;

  /**
   * Mock login function - accepts any email/password combination
   */
  static async mockLogin(email: string, password: string): Promise<AuthResponse> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email or create a default user
      let user = users.find(u => u.email === email);
      
      if (!user) {
        // Create a temporary user for any email
        user = {
          id: `temp_${Date.now()}`,
          username: email.split('@')[0],
          email: email,
          bio: 'New user',
          avatar_url: 'avatar1.jpg',
          push_token: null,
          created_at: new Date().toISOString(),
        };
      }

      // Create mock session
      const session: MockSession = {
        user: user as User,
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      // Store session
      this.currentSession = session;
      await storage.setUserSession(session);

      return { user: user as User, session };
    } catch (error) {
      console.error('Mock login error:', error);
      return { error: 'Login failed' };
    }
  }

  /**
   * Mock signup function - creates a new user
   */
  static async mockSignup(email: string, password: string): Promise<AuthResponse> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return { error: 'User already exists' };
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        username: email.split('@')[0],
        email: email,
        bio: 'New Instagram user 📸',
        avatar_url: 'avatar5.jpg',
        push_token: null,
        created_at: new Date().toISOString(),
      };

      // Create mock session
      const session: MockSession = {
        user: newUser,
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      // Store session
      this.currentSession = session;
      await storage.setUserSession(session);

      // Send welcome notification for new users
      const { sendWelcomeNotification } = await import('../utils/notifications');
      await sendWelcomeNotification(newUser.username);

      return { user: newUser, session };
    } catch (error) {
      console.error('Mock signup error:', error);
      return { error: 'Signup failed' };
    }
  }

  /**
   * Mock logout function
   */
  static async mockLogout(): Promise<{ error?: string }> {
    try {
      this.currentSession = null;
      await storage.removeUserSession();
      return {};
    } catch (error) {
      console.error('Mock logout error:', error);
      return { error: 'Logout failed' };
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      if (this.currentSession) {
        return this.currentSession.user;
      }

      const savedSession = await storage.getUserSession();
      if (savedSession && typeof savedSession === 'object' && 'user' in savedSession) {
        this.currentSession = savedSession as MockSession;
        return (savedSession as MockSession).user;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<MockSession | null> {
    try {
      if (this.currentSession) {
        return this.currentSession;
      }

      // Try to load from storage
      const savedSession = await storage.getUserSession();
      if (savedSession && typeof savedSession === 'object' && 'user' in savedSession) {
        this.currentSession = savedSession as MockSession;
        return savedSession as MockSession;
      }

      return null;
    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return session !== null && session.expires_at > Date.now();
  }

  /**
   * Auto-refresh session (mock)
   */
  static async refreshSession(): Promise<MockSession | null> {
    try {
      const currentSession = await this.getCurrentSession();
      if (!currentSession) {
        return null;
      }

      // Create new session with updated expiry
      const refreshedSession: MockSession = {
        ...currentSession,
        access_token: `mock_token_${Date.now()}`,
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      this.currentSession = refreshedSession;
      await storage.setUserSession(refreshedSession);

      return refreshedSession;
    } catch (error) {
      console.error('Refresh session error:', error);
      return null;
    }
  }

  /**
   * Get predefined users for testing
   */
  static getPredefinedUsers(): User[] {
    return users as User[];
  }

  /**
   * Quick login with predefined user (for development)
   */
  static async quickLogin(userId: string): Promise<AuthResponse> {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { error: 'User not found' };
    }

    return this.mockLogin(user.email, 'password');
  }
}

// Export convenience functions
export const auth = {
  login: AuthService.mockLogin,
  signup: AuthService.mockSignup,
  logout: AuthService.mockLogout,
  getCurrentUser: AuthService.getCurrentUser,
  getCurrentSession: AuthService.getCurrentSession,
  isAuthenticated: AuthService.isAuthenticated,
  refreshSession: AuthService.refreshSession,
  quickLogin: AuthService.quickLogin,
  getPredefinedUsers: AuthService.getPredefinedUsers,
};
