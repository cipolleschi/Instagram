import { ScrollView, View, Alert, ActivityIndicator, Image, Text, useWindowDimensions } from 'react-native';
import { useEffect, useState, useRef } from 'react';
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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  Easing
} from 'react-native-reanimated';

type TabType = 'grid' | 'reels' | 'videos' | 'tagged';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ posts_count: 0, followers_count: 0, following_count: 0 });
  const [posts, setPosts] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [taggedPosts, setTaggedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('grid');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const { user } = useAuth();

  // Track tab indices for animation direction
  const tabs: TabType[] = ['grid', 'reels', 'videos', 'tagged'];
  const previousTabIndex = useRef(0);
  const previousTab = useRef<TabType>('grid');
  const currentTabIndex = tabs.indexOf(activeTab);
  
  // Animation values for content sliding
  const contentOffset = useSharedValue(0);
  const outgoingOffset = useSharedValue(0);

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
      
      // Load mock data for other tabs
      loadMockTabData();
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

  const loadMockTabData = () => {
    // Mock Reels data
    const mockReels = [
      { id: 'reel1', image: 'post1.jpg', media_type: 'video' as const },
      { id: 'reel2', image: 'post2.jpg', media_type: 'video' as const },
      { id: 'reel3', image: 'post3.jpg', media_type: 'video' as const },
      { id: 'reel4', image: 'post4.jpg', media_type: 'video' as const },
      { id: 'reel5', image: 'post5.jpg', media_type: 'video' as const },
      { id: 'reel6', image: 'post6.jpg', media_type: 'video' as const },
    ];

    // Mock Videos data
    const mockVideos = [
      { id: 'video1', image: 'post2.jpg', media_type: 'video' as const },
      { id: 'video2', image: 'post4.jpg', media_type: 'video' as const },
      { id: 'video3', image: 'post6.jpg', media_type: 'video' as const },
    ];

    // Mock Tagged posts data
    const mockTagged = [
      { id: 'tagged1', image: 'post3.jpg', media_type: 'image' as const },
      { id: 'tagged2', image: 'post5.jpg', media_type: 'image' as const },
      { id: 'tagged3', image: 'post1.jpg', media_type: 'image' as const },
      { id: 'tagged4', image: 'post4.jpg', media_type: 'image' as const },
      { id: 'tagged5', image: 'post2.jpg', media_type: 'image' as const },
    ];

    setReels(mockReels);
    setVideos(mockVideos);
    setTaggedPosts(mockTagged);
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

  const handleAddPress = () => {
    Alert.alert('Create', 'Create new post functionality coming soon!');
  };

  const handleSettingsPress = () => {
    Alert.alert('Settings', 'Settings functionality coming soon!');
  };

  const handleArchivePress = () => {
    Alert.alert('Archive', 'Archive functionality coming soon!');
  };

  const handleActivityPress = () => {
    Alert.alert('Your Activity', 'Your Activity functionality coming soon!');
  };

  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Logout functionality coming soon!');
  };

  const handlePostPress = (post: any) => {
    Alert.alert('Post', `View post: ${post.id}`);
  };

  const handleAvatarPress = () => {
    Alert.alert('Story', 'View story functionality coming soon!');
  };

  const handleTabChange = (newTab: TabType) => {
    if (isTransitioning || newTab === activeTab) return;
    
    const newIndex = tabs.indexOf(newTab);
    const oldIndex = previousTabIndex.current;
    const direction = newIndex > oldIndex ? 1 : -1; // 1 = left to right, -1 = right to left
    
    // Store previous tab before changing
    previousTab.current = activeTab;
    
    // Update the active tab first
    setActiveTab(newTab);
    setIsTransitioning(true);
    
    // Set initial positions based on direction
    // If going right (direction = 1), new content starts from right (width)
    // If going left (direction = -1), new content starts from left (-width)
    contentOffset.value = direction * width;
    outgoingOffset.value = 0;
    
    // Animate both contents
    contentOffset.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    
    outgoingOffset.value = withTiming(-direction * width, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    }, () => {
      runOnJS(setIsTransitioning)(false);
    });
    
    previousTabIndex.current = newIndex;
  };

  // Helper function to handle swipe navigation
  const handleSwipeNavigation = (direction: 'left' | 'right') => {
    const currentIndex = tabs.indexOf(activeTab);
    if (direction === 'right' && currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1]);
    } else if (direction === 'left' && currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1]);
    }
  };

  // Swipe gesture handler
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate when horizontal movement is significant
    .failOffsetY([-10, 10]) // Fail if vertical movement is too much (let ScrollView handle it)
    .onEnd((event: any) => {
      'worklet';
      if (isTransitioning) return;
      
      const threshold = 50; // Minimum swipe distance
      const velocity = event.velocityX;
      
      if (Math.abs(event.translationX) > threshold || Math.abs(velocity) > 500) {
        if (event.translationX > 0) {
          // Swipe right - go to previous tab
          runOnJS(handleSwipeNavigation)('right');
        } else if (event.translationX < 0) {
          // Swipe left - go to next tab
          runOnJS(handleSwipeNavigation)('left');
        }
      }
    });

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

  // Animated styles for content
  const incomingContentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: contentOffset.value }],
    };
  });

  const outgoingContentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: outgoingOffset.value }],
    };
  });

  // Get content for a specific tab
  const getTabContent = (tab: TabType) => {
    switch (tab) {
      case 'grid':
        return <PostGrid posts={posts} onPostPress={handlePostPress} />;
      case 'reels':
        return <PostGrid posts={reels} onPostPress={handlePostPress} />;
      case 'videos':
        return <PostGrid posts={videos} onPostPress={handlePostPress} />;
      case 'tagged':
        return <PostGrid posts={taggedPosts} onPostPress={handlePostPress} />;
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
          onUsernamePress={handleUsernamePress}
          onAddPress={handleAddPress}
          onSettingsPress={handleSettingsPress}
          onArchivePress={handleArchivePress}
          onActivityPress={handleActivityPress}
          onLogoutPress={handleLogoutPress}
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
          onTabChange={handleTabChange}
        />

        {/* Animated Content with Gesture Detection */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={{ overflow: 'hidden', minHeight: 400 }}>
            {isTransitioning && (
              <Animated.View style={[{ position: 'absolute', width: '100%', zIndex: 1 }, outgoingContentStyle]}>
                {getTabContent(previousTab.current)}
              </Animated.View>
            )}
            <Animated.View style={[{ width: '100%' }, isTransitioning && incomingContentStyle]}>
              {getTabContent(activeTab)}
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </ScrollView>
    </View>
  );
}
