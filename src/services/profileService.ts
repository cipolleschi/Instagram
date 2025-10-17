import { storage, StorageService } from './storageService';
import usersData from '../../assets/data/users.json';
import { User } from './authService';

export interface Profile {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatar_url: string;
  push_token: string | null;
  created_at: string;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  avatar_url?: string;
}

export interface ProfileStats {
  posts_count: number;
  followers_count: number;
  following_count: number;
}

/**
 * Mock Profile Service
 * Handles all profile-related operations with local data and AsyncStorage
 */
export class ProfileService {
  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // First check storage for updated profiles
      const savedProfiles = (await storage.getProfile()) as Record<string, Profile> | null;
      const profiles: Record<string, Profile> = savedProfiles || {};
      if (profiles && profiles[userId]) {
        return profiles[userId];
      }

      // Fall back to default users data
      const user = usersData.find(u => u.id === userId);
      if (!user) {
        return null;
      }

      // Convert user to profile format with additional stats
      const profile: Profile = {
        ...user,
        followers_count: Math.floor(Math.random() * 1000) + 50, // Mock followers
        following_count: Math.floor(Math.random() * 500) + 20,  // Mock following
        posts_count: 0, // Will be calculated separately
      };

      return profile;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: UpdateProfileData): Promise<Profile | null> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get current profiles from storage
      let savedProfiles = (await storage.getProfile()) as Record<string, Profile> | null;
      let profiles: Record<string, Profile> = savedProfiles || {};

      // Get current profile or create from default data
      let currentProfile = profiles[userId];
      if (!currentProfile) {
        const defaultUser = usersData.find(u => u.id === userId);
        if (!defaultUser) {
          return null;
        }
        currentProfile = {
          ...defaultUser,
          followers_count: Math.floor(Math.random() * 1000) + 50,
          following_count: Math.floor(Math.random() * 500) + 20,
          posts_count: 0,
        };
      }

      // Apply updates
      const updatedProfile: Profile = {
        ...currentProfile,
        ...updates,
        id: userId, // Ensure ID doesn't change
      };

      // Save updated profile
      profiles[userId] = updatedProfile;
      await storage.setProfile(profiles);

      return updatedProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      return null;
    }
  }

  /**
   * Get profile statistics
   */
  static async getProfileStats(userId: string): Promise<ProfileStats> {
    try {
      const profile = await this.getProfile(userId);
      
      // Get actual post count from post service
      const { PostService } = await import('./postService');
      const posts_count = await PostService.getUserPostCount(userId);

      return {
        posts_count,
        followers_count: profile?.followers_count || 0,
        following_count: profile?.following_count || 0,
      };
    } catch (error) {
      console.error('Get profile stats error:', error);
      return {
        posts_count: 0,
        followers_count: 0,
        following_count: 0,
      };
    }
  }

  /**
   * Search profiles by username
   */
  static async searchProfiles(query: string): Promise<Profile[]> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const allUsers = usersData as User[];
      const matchingUsers = allUsers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.bio.toLowerCase().includes(query.toLowerCase())
      );

      // Convert to profiles with stats
      const profiles: Profile[] = matchingUsers.map(user => ({
        ...user,
        followers_count: Math.floor(Math.random() * 1000) + 50,
        following_count: Math.floor(Math.random() * 500) + 20,
        posts_count: Math.floor(Math.random() * 50) + 1,
      }));

      return profiles;
    } catch (error) {
      console.error('Search profiles error:', error);
      return [];
    }
  }

  /**
   * Get all profiles (for development/admin purposes)
   */
  static async getAllProfiles(): Promise<Profile[]> {
    try {
      const allUsers = usersData as User[];
      
      // Convert to profiles with mock stats
      const profiles: Profile[] = allUsers.map(user => ({
        ...user,
        followers_count: Math.floor(Math.random() * 1000) + 50,
        following_count: Math.floor(Math.random() * 500) + 20,
        posts_count: Math.floor(Math.random() * 50) + 1,
      }));

      return profiles;
    } catch (error) {
      console.error('Get all profiles error:', error);
      return [];
    }
  }

  /**
   * Follow/Unfollow functionality (mock)
   */
  static async followUser(currentUserId: string, targetUserId: string): Promise<boolean> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get current follow relationships
      let followData: Record<string, string[]> = await StorageService.getItem('instagram_follows') || {};
      
      if (!followData[currentUserId]) {
        followData[currentUserId] = [];
      }

      // Add follow if not already following
      if (!followData[currentUserId].includes(targetUserId)) {
        followData[currentUserId].push(targetUserId);
        await StorageService.setItem('instagram_follows', followData);
      }

      return true;
    } catch (error) {
      console.error('Follow user error:', error);
      return false;
    }
  }

  /**
   * Unfollow user
   */
  static async unfollowUser(currentUserId: string, targetUserId: string): Promise<boolean> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get current follow relationships
      let followData: Record<string, string[]> = await StorageService.getItem('instagram_follows') || {};
      
      if (followData[currentUserId]) {
        followData[currentUserId] = followData[currentUserId].filter(
          (id: string) => id !== targetUserId
        );
        await StorageService.setItem('instagram_follows', followData);
      }

      return true;
    } catch (error) {
      console.error('Unfollow user error:', error);
      return false;
    }
  }

  /**
   * Check if user is following another user
   */
  static async isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
    try {
      const followData: Record<string, string[]> = await StorageService.getItem('instagram_follows') || {};
      return followData[currentUserId]?.includes(targetUserId) || false;
    } catch (error) {
      console.error('Is following error:', error);
      return false;
    }
  }

  /**
   * Get user's following list
   */
  static async getFollowing(userId: string): Promise<Profile[]> {
    try {
      const followData: Record<string, string[]> = await StorageService.getItem('instagram_follows') || {};
      const followingIds = followData[userId] || [];
      
      const profiles: Profile[] = [];
      for (const id of followingIds) {
        const profile = await this.getProfile(id);
        if (profile) {
          profiles.push(profile);
        }
      }

      return profiles;
    } catch (error) {
      console.error('Get following error:', error);
      return [];
    }
  }

  /**
   * Get user's followers (mock implementation)
   */
  static async getFollowers(userId: string): Promise<Profile[]> {
    try {
      // For now, return random profiles as followers
      const allProfiles = await this.getAllProfiles();
      const followerCount = Math.floor(Math.random() * 5) + 1;
      
      return allProfiles
        .filter(p => p.id !== userId)
        .slice(0, followerCount);
    } catch (error) {
      console.error('Get followers error:', error);
      return [];
    }
  }

  /**
   * Reset profile data to defaults (for development/testing)
   */
  static async resetProfiles(): Promise<void> {
    await StorageService.removeItem('instagram_profile');
    await StorageService.removeItem('instagram_follows');
  }
}

// Export convenience functions
export const profiles = {
  getProfile: ProfileService.getProfile,
  updateProfile: ProfileService.updateProfile,
  getProfileStats: ProfileService.getProfileStats,
  searchProfiles: ProfileService.searchProfiles,
  getAllProfiles: ProfileService.getAllProfiles,
  followUser: ProfileService.followUser,
  unfollowUser: ProfileService.unfollowUser,
  isFollowing: ProfileService.isFollowing,
  getFollowing: ProfileService.getFollowing,
  getFollowers: ProfileService.getFollowers,
  resetProfiles: ProfileService.resetProfiles,
};
