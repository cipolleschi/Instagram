import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys for different data types
export const STORAGE_KEYS = {
  USER_SESSION: 'instagram_user_session',
  POSTS: 'instagram_posts',
  LIKES: 'instagram_likes',
  PROFILE: 'instagram_profile',
  USER_POSTS: 'instagram_user_posts',
} as const;

/**
 * Generic storage service for AsyncStorage operations
 */
export class StorageService {
  /**
   * Store data in AsyncStorage
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve data from AsyncStorage
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all data from AsyncStorage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      throw error;
    }
  }

  /**
   * Get all keys from AsyncStorage
   */
  static async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Check if a key exists in AsyncStorage
   */
  static async hasKey(key: string): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error(`Error checking if key ${key} exists:`, error);
      return false;
    }
  }
}

// Convenience functions for common operations
export const storage = {
  setUserSession: (session: any) => StorageService.setItem(STORAGE_KEYS.USER_SESSION, session),
  getUserSession: () => StorageService.getItem(STORAGE_KEYS.USER_SESSION),
  removeUserSession: () => StorageService.removeItem(STORAGE_KEYS.USER_SESSION),
  
  setPosts: (posts: any[]) => StorageService.setItem(STORAGE_KEYS.POSTS, posts),
  getPosts: () => StorageService.getItem<any[]>(STORAGE_KEYS.POSTS),
  
  setLikes: (likes: any[]) => StorageService.setItem(STORAGE_KEYS.LIKES, likes),
  getLikes: () => StorageService.getItem<any[]>(STORAGE_KEYS.LIKES),
  
  setProfile: (profile: any) => StorageService.setItem(STORAGE_KEYS.PROFILE, profile),
  getProfile: () => StorageService.getItem(STORAGE_KEYS.PROFILE),
  
  setUserPosts: (posts: any[]) => StorageService.setItem(STORAGE_KEYS.USER_POSTS, posts),
  getUserPosts: () => StorageService.getItem<any[]>(STORAGE_KEYS.USER_POSTS),
};
