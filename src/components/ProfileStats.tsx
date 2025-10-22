import { View, Text, TouchableOpacity } from 'react-native';

interface ProfileStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  onPostsPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

export default function ProfileStats({ 
  postsCount, 
  followersCount, 
  followingCount,
  onPostsPress,
  onFollowersPress,
  onFollowingPress
}: ProfileStatsProps) {
  return (
    <View className="flex-row justify-around items-center">
      <TouchableOpacity 
        onPress={onPostsPress}
        className="items-center"
      >
        <Text className="text-lg font-semibold text-black dark:text-white">
          {postsCount}
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          posts
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onFollowersPress}
        className="items-center"
      >
        <Text className="text-lg font-semibold text-black dark:text-white">
          {followersCount}
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          followers
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onFollowingPress}
        className="items-center"
      >
        <Text className="text-lg font-semibold text-black dark:text-white">
          {followingCount}
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          following
        </Text>
      </TouchableOpacity>
    </View>
  );
}

