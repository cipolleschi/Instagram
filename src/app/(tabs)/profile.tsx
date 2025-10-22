import { ScrollView, View, Alert, ActivityIndicator, Image, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '~/src/providers/AuthProvider';
import { ProfileService } from '~/src/services/profileService';
import { PostService } from '~/src/services/postService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ProfileHeader from '~/src/components/ProfileHeader';
import ProfileInfo from '~/src/components/ProfileInfo';
import ProfileStats from '~/src/components/ProfileStats';
import ProfileActions from '~/src/components/ProfileActions';
import ProfileTabs from '~/src/components/ProfileTabs';
import PostGrid from '~/src/components/PostGrid';

type TabType = 'grid' | 'reels' | 'videos' | 'tagged';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ posts_count: 0, followers_count: 0, following_count: 0 });
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('grid');
  const insets = useSafeAreaInsets();

  const { user } = useAuth();

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Load profile, stats, and posts in parallel
      const [profileData, statsData, postsData] = await Promise.all([
        ProfileService.getProfile(user.id),
        ProfileService.getProfileStats(user.id),
        PostService.getPostsByUser(user.id),
      ]);

      // If profileData is null, fallback to user data from auth
      if (profileData) {
        setProfile(profileData);
      } else {
        // Fallback to user data if profile service returns null
        setProfile({
          ...user,
          followers_count: 0,
          following_count: 0,
          posts_count: postsData.length,
        });
      }
      
      setStats(statsData);
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      // Set profile to user data even on error to prevent infinite loading
      setProfile({
        ...user,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen (to be implemented)
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  const handleShareProfile = () => {
    Alert.alert('Share Profile', 'Share profile functionality coming soon!');
  };

  const handleAddUser = () => {
    Alert.alert('Add User', 'Add user functionality coming soon!');
  };

  const handleUsernamePress = () => {
    Alert.alert('Account Switcher', 'Account switching functionality coming soon!');
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'Notifications page coming soon!');
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Settings menu coming soon!');
  };

  const handlePostPress = (post: any) => {
    Alert.alert('Post', `View post: ${post.id}`);
  };

  const handleAvatarPress = () => {
    Alert.alert('Story', 'View story functionality coming soon!');
  };

  const getAvatarSource = (avatarUrl: string) => {
    if (!avatarUrl) return require('../../../assets/images/avatars/avatar1.jpg');
    
    if (avatarUrl.startsWith('http') || avatarUrl.startsWith('file://')) {
      return { uri: avatarUrl };
    }
    
    // Handle local assets
    const avatarPath = avatarUrl.replace('avatar', '').replace('.jpg', '');
    switch(avatarPath) {
      case '1': return require('../../../assets/images/avatars/avatar1.jpg');
      case '2': return require('../../../assets/images/avatars/avatar2.jpg');
      case '3': return require('../../../assets/images/avatars/avatar3.jpg');
      case '4': return require('../../../assets/images/avatars/avatar4.jpg');
      case '5': return require('../../../assets/images/avatars/avatar5.jpg');
      default: return require('../../../assets/images/avatars/avatar1.jpg');
    }
  };

  if (loading || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ paddingTop: insets.top }}>
      <ScrollView>
        {/* Header */}
        <ProfileHeader
          username={profile.username}
          notificationCount={9}
          onUsernamePress={handleUsernamePress}
          onNotificationPress={handleNotificationPress}
          onMenuPress={handleMenuPress}
        />

        {/* Profile Info Section */}
        <View className="mb-4">
          {/* Avatar and Stats Row */}
          <View className="flex-row px-4 mb-4">
            {/* Avatar - takes less space */}
            <View className="mr-4">
              <View className="relative w-20 h-20">
                {/* Story ring */}
                <View className="absolute inset-0 rounded-full border-2 border-pink-500 p-0.5">
                  <View className="w-full h-full rounded-full border-2 border-white dark:border-black" />
                </View>
                <Image
                  source={getAvatarSource(profile.avatar_url)}
                  className="w-full h-full rounded-full"
                  style={{ padding: 3 }}
                />
                {/* Add story button */}
                <View className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full items-center justify-center border-2 border-white dark:border-black">
                  <Text className="text-white text-xs font-bold">+</Text>
                </View>
              </View>
            </View>

            {/* Stats - takes more space */}
            <View className="flex-1">
              <ProfileStats
                postsCount={stats.posts_count}
                followersCount={stats.followers_count}
                followingCount={stats.following_count}
              />
            </View>
          </View>

          {/* Name, Bio, etc */}
          <View className="px-4 mb-4">
            {/* Name and pronouns */}
            <Text className="text-base font-semibold text-black dark:text-white mb-1">
              {profile.username}
              <Text className="text-gray-600 dark:text-gray-400 font-normal"> he/him</Text>
            </Text>

            {/* Badge */}
            <View className="self-start mb-2">
              <View className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                <Text className="text-xs font-semibold text-black dark:text-white">
                  INTERNAL
                </Text>
              </View>
            </View>

            {/* Bio */}
            {profile.bio && (
              <Text className="text-sm text-black dark:text-white mb-2">
                {profile.bio}
              </Text>
            )}

            {/* Thread handle */}
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center">
                <Text className="text-xs font-bold text-black dark:text-white">@</Text>
              </View>
              <Text className="text-sm text-black dark:text-white font-semibold">
                {profile.username}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <ProfileActions
            onEditProfile={handleEditProfile}
            onShareProfile={handleShareProfile}
            onAddUser={handleAddUser}
          />
        </View>

        {/* Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content based on active tab */}
        {activeTab === 'grid' && (
          <PostGrid posts={posts} onPostPress={handlePostPress} />
        )}
        {activeTab === 'reels' && (
          <View className="items-center justify-center py-20">
            {/* Placeholder for reels */}
          </View>
        )}
        {activeTab === 'videos' && (
          <View className="items-center justify-center py-20">
            {/* Placeholder for videos */}
          </View>
        )}
        {activeTab === 'tagged' && (
          <View className="items-center justify-center py-20">
            {/* Placeholder for tagged */}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
