import { storage } from './storageService';
import postsData from '../../assets/data/posts.json';
import likesData from '../../assets/data/likes.json';

export interface Post {
  id: string;
  image: string;
  media_type: 'image' | 'video';
  caption: string;
  user_id: string;
  created_at: string;
  likes_count: number;
  user: {
    id: string;
    username: string;
    avatar_url: string;
    bio: string;
  };
  likes: Array<{ count: number }>;
  my_likes: any[];
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface CreatePostData {
  caption: string;
  image: string;
  media_type: 'image' | 'video';
  user_id: string;
}

/**
 * Mock Post Service
 * Handles all post-related operations with local data and AsyncStorage
 */
export class PostService {
  /**
   * Get all posts with user information and likes
   */
  static async getPosts(userId?: string): Promise<Post[]> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get posts from storage or use default data
      let posts = await storage.getPosts();
      if (!posts) {
        posts = [...postsData];
        await storage.setPosts(posts);
      }

      // Get likes from storage or use default data
      let likes = await storage.getLikes();
      if (!likes) {
        likes = [...likesData];
        await storage.setLikes(likes);
      }

      // Enhance posts with like information
      const enhancedPosts = posts.map(post => {
        const postLikes = likes.filter(like => like.post_id === post.id);
        const userLikes = userId ? postLikes.filter(like => like.user_id === userId) : [];
        
        return {
          ...post,
          likes_count: postLikes.length,
          likes: [{ count: postLikes.length }],
          my_likes: userLikes,
        };
      });

      // Sort by created_at (newest first)
      return enhancedPosts.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error('Get posts error:', error);
      return [];
    }
  }

  /**
   * Get posts by specific user
   */
  static async getPostsByUser(userId: string): Promise<Post[]> {
    try {
      const allPosts = await this.getPosts(userId);
      return allPosts.filter(post => post.user_id === userId);
    } catch (error) {
      console.error('Get posts by user error:', error);
      return [];
    }
  }

  /**
   * Create a new post
   */
  static async createPost(postData: CreatePostData): Promise<Post | null> {
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get current posts
      let posts = await storage.getPosts() || [...postsData];

      // Get current user information
      const { AuthService } = await import('./authService');
      const currentUser = await AuthService.getCurrentUser();
      
      if (!currentUser) {
        console.error('No current user found');
        return null;
      }

      // Create new post
      const newPost: Post = {
        id: `post_${Date.now()}`,
        image: postData.image,
        media_type: postData.media_type,
        caption: postData.caption,
        user_id: postData.user_id,
        created_at: new Date().toISOString(),
        likes_count: 0,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          avatar_url: currentUser.avatar_url,
          bio: currentUser.bio,
        },
        likes: [{ count: 0 }],
        my_likes: [],
      };

      // Add to posts array
      posts.unshift(newPost); // Add to beginning (newest first)

      // Save to storage
      await storage.setPosts(posts);

      return newPost;
    } catch (error) {
      console.error('Create post error:', error);
      return null;
    }
  }

  /**
   * Update a post (caption only for now)
   */
  static async updatePost(postId: string, updates: { caption?: string }): Promise<Post | null> {
    try {
      let posts = await storage.getPosts() || [...postsData];
      
      const postIndex = posts.findIndex(post => post.id === postId);
      if (postIndex === -1) {
        return null;
      }

      // Update post
      posts[postIndex] = {
        ...posts[postIndex],
        ...updates,
      };

      // Save to storage
      await storage.setPosts(posts);

      return posts[postIndex];
    } catch (error) {
      console.error('Update post error:', error);
      return null;
    }
  }

  /**
   * Delete a post
   */
  static async deletePost(postId: string, userId: string): Promise<boolean> {
    try {
      let posts = await storage.getPosts() || [...postsData];
      
      const postIndex = posts.findIndex(post => post.id === postId && post.user_id === userId);
      if (postIndex === -1) {
        return false;
      }

      // Remove post
      posts.splice(postIndex, 1);

      // Save to storage
      await storage.setPosts(posts);

      // Also remove associated likes
      let likes = await storage.getLikes() || [...likesData];
      likes = likes.filter(like => like.post_id !== postId);
      await storage.setLikes(likes);

      return true;
    } catch (error) {
      console.error('Delete post error:', error);
      return false;
    }
  }

  /**
   * Like a post
   */
  static async likePost(postId: string, userId: string): Promise<boolean> {
    try {
      let likes = await storage.getLikes() || [...likesData];
      
      // Check if already liked
      const existingLike = likes.find(like => 
        like.post_id === postId && like.user_id === userId
      );
      
      if (existingLike) {
        return true; // Already liked
      }

      // Add new like
      const newLike: Like = {
        id: `like_${Date.now()}`,
        user_id: userId,
        post_id: postId,
        created_at: new Date().toISOString(),
      };

      likes.push(newLike);
      await storage.setLikes(likes);

      return true;
    } catch (error) {
      console.error('Like post error:', error);
      return false;
    }
  }

  /**
   * Unlike a post
   */
  static async unlikePost(postId: string, userId: string): Promise<boolean> {
    try {
      let likes = await storage.getLikes() || [...likesData];
      
      // Find and remove like
      const likeIndex = likes.findIndex(like => 
        like.post_id === postId && like.user_id === userId
      );
      
      if (likeIndex === -1) {
        return true; // Not liked anyway
      }

      likes.splice(likeIndex, 1);
      await storage.setLikes(likes);

      return true;
    } catch (error) {
      console.error('Unlike post error:', error);
      return false;
    }
  }

  /**
   * Get likes for a specific post
   */
  static async getPostLikes(postId: string): Promise<Like[]> {
    try {
      const likes = await storage.getLikes() || [...likesData];
      return likes.filter(like => like.post_id === postId);
    } catch (error) {
      console.error('Get post likes error:', error);
      return [];
    }
  }

  /**
   * Check if user liked a post
   */
  static async isPostLiked(postId: string, userId: string): Promise<boolean> {
    try {
      const likes = await storage.getLikes() || [...likesData];
      return likes.some(like => like.post_id === postId && like.user_id === userId);
    } catch (error) {
      console.error('Is post liked error:', error);
      return false;
    }
  }

  /**
   * Get post count for a user
   */
  static async getUserPostCount(userId: string): Promise<number> {
    try {
      const posts = await this.getPostsByUser(userId);
      return posts.length;
    } catch (error) {
      console.error('Get user post count error:', error);
      return 0;
    }
  }

  /**
   * Reset posts to default (for development/testing)
   */
  static async resetPosts(): Promise<void> {
    await storage.setPosts([...postsData]);
    await storage.setLikes([...likesData]);
  }
}

// Export convenience functions
export const posts = {
  getPosts: PostService.getPosts,
  getPostsByUser: PostService.getPostsByUser,
  createPost: PostService.createPost,
  updatePost: PostService.updatePost,
  deletePost: PostService.deletePost,
  likePost: PostService.likePost,
  unlikePost: PostService.unlikePost,
  getPostLikes: PostService.getPostLikes,
  isPostLiked: PostService.isPostLiked,
  getUserPostCount: PostService.getUserPostCount,
  resetPosts: PostService.resetPosts,
};
