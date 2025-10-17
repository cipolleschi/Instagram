import {
  View,
  Image,
  Text,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';

import PostContent from './PostContent';
import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { sendLikeNotification } from '../utils/notifications';
import { PostService, type Post } from '../services/postService';

export default function PostListItem({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    loadLikeState();
  }, [post.id, user?.id]);

  const loadLikeState = async () => {
    if (!user?.id || !post.id) return;
    
    try {
      const isPostLiked = await PostService.isPostLiked(post.id, user.id);
      const postLikes = await PostService.getPostLikes(post.id);
      
      setIsLiked(isPostLiked);
      setLikesCount(postLikes.length);
    } catch (error) {
      console.error('Failed to load like state:', error);
      // Use fallback data from post
      setLikesCount(post.likes?.[0]?.count || 0);
      setIsLiked(post.my_likes && post.my_likes.length > 0);
    }
  };

  const handleLikePress = async () => {
    if (!user?.id || !post.id) return;

    try {
      if (isLiked) {
        await PostService.unlikePost(post.id, user.id);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await PostService.likePost(post.id, user.id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        
        // Send notification to post owner
        if (post.user_id !== user.id) {
          sendLikeNotification({
            id: `like_${Date.now()}`,
            post_id: post.id,
            user_id: user.id,
            created_at: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // Get avatar source - local avatar images
  let avatarSource;
  const avatarUrl = post.user?.avatar_url || 'avatar1.jpg';
  
  if (avatarUrl.startsWith('http') || avatarUrl.startsWith('file://')) {
    avatarSource = { uri: avatarUrl };
  } else {
    // Local asset from avatars folder
    const avatarPath = avatarUrl.replace('avatar', '').replace('.jpg', '');
    switch(avatarPath) {
      case '1': avatarSource = require('../../assets/images/avatars/avatar1.jpg'); break;
      case '2': avatarSource = require('../../assets/images/avatars/avatar2.jpg'); break;
      case '3': avatarSource = require('../../assets/images/avatars/avatar3.jpg'); break;
      case '4': avatarSource = require('../../assets/images/avatars/avatar4.jpg'); break;
      case '5': avatarSource = require('../../assets/images/avatars/avatar5.jpg'); break;
      default: avatarSource = require('../../assets/images/avatars/avatar1.jpg'); break;
    }
  }

  return (
    <View className="bg-white">
      {/* Header */}
      <View className="p-3 flex-row items-center gap-2">
        <Image
          source={avatarSource}
          className="w-12 aspect-square rounded-full"
        />
        <Text className="font-semibold">
          {post.user?.username || 'New user'}
        </Text>
      </View>

      {/* Content */}
      <PostContent post={post} />

      {/* Icons */}
      <View className="flex-row gap-3 p-3">
        {isLiked ? (
          <AntDesign
            onPress={handleLikePress}
            name="heart"
            size={20}
            color="crimson"
          />
        ) : (
          <Feather
            onPress={handleLikePress}
            name="heart"
            size={20}
            color="black"
          />
        )}
        <Ionicons name="chatbubble-outline" size={20} />
        <Feather name="send" size={20} />

        <Feather name="bookmark" size={20} className="ml-auto" />
      </View>

      <View className="px-3 gap-1">
        <Text className="font-semibold">
          {likesCount} likes
        </Text>
        <Text>
          <Text className="font-semibold">
            {post.user?.username || 'New user'}{' '}
          </Text>
          {post.caption}
        </Text>
      </View>
    </View>
  );
}
