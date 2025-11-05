import { ScrollView, View, Alert, ActivityIndicator, Image, Text, useWindowDimensions } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '~/src/providers/AuthProvider';
import { useTheme } from '~/src/providers/ThemeProvider';
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
  Easing,
  interpolate,
  useAnimatedProps
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

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
  const { isDark } = useTheme();

  // Track tab order (can be reordered via drag and drop)
  const [tabOrder, setTabOrder] = useState<TabType[]>(['grid', 'reels', 'videos', 'tagged']);
  
  // Track tab indices for animation direction
  const tabs: TabType[] = tabOrder;
  const previousTabIndex = useRef(0);
  const previousTab = useRef<TabType>('grid');
  const currentTabIndex = tabs.indexOf(activeTab);
  
  // Shared values for scroll tracking (for glass effect animation)
  const scrollY = useSharedValue(0);
  const tabbarPositionY = useSharedValue(0);
  
  // Animation values for content sliding
  const contentOffset = useSharedValue(0);
  const outgoingOffset = useSharedValue(0);
  const blurIntensity = useSharedValue(0);

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
    // Generate more mock data by cycling through available images
    const images = ['post1.jpg', 'post2.jpg', 'post3.jpg', 'post4.jpg', 'post5.jpg', 'post6.jpg'];
    
    // Mock Reels data - 30 items
    const mockReels = Array.from({ length: 30 }, (_, i) => ({
      id: `reel${i + 1}`,
      image: images[i % images.length],
      media_type: 'video' as const,
    }));

    // Mock Videos data - 24 items
    const mockVideos = Array.from({ length: 24 }, (_, i) => ({
      id: `video${i + 1}`,
      image: images[i % images.length],
      media_type: 'video' as const,
    }));

    // Mock Tagged posts data - 36 items (mix of images and videos)
    const mockTagged = Array.from({ length: 36 }, (_, i) => {
      const mediaType: 'image' | 'video' = i % 3 === 0 ? 'video' : 'image';
      return {
        id: `tagged${i + 1}`,
        image: images[i % images.length],
        media_type: mediaType,
      };
    });

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

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  const handleTabbarLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    tabbarPositionY.value = y;
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
    blurIntensity.value = 500; // Start with strong blur
    
    // Animate both contents with slower duration
    contentOffset.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    
    outgoingOffset.value = withTiming(-direction * width, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    }, () => {
      runOnJS(setIsTransitioning)(false);
    });
    
    // Animate blur from 100 to 0 - slower than content animation
    blurIntensity.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
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

  const blurAnimatedProps = useAnimatedProps(() => {
    return {
      intensity: blurIntensity.value,
    };
  });

  const blurOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(blurIntensity.value, [0, 500], [0, 0.6]),
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
    <View className="flex-1 bg-white dark:bg-black">
      {/* Scrollable Content */}
      <ScrollView 
        style={{ paddingTop: insets.top + 60 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
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
        <View onLayout={handleTabbarLayout}>
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tabOrder={tabOrder}
            onTabOrderChange={setTabOrder}
          />
        </View>

        {/* Animated Content with Gesture Detection */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={{ overflow: 'hidden', minHeight: 400 }}>
            {isTransitioning && (
              <Animated.View style={[{ position: 'absolute', width: '100%', zIndex: 1 }, outgoingContentStyle]}>
                {getTabContent(previousTab.current)}
              </Animated.View>
            )}
            <Animated.View style={[{ width: '100%', position: 'relative' }, isTransitioning && incomingContentStyle]}>
              {getTabContent(activeTab)}
              {/* Blur overlay on incoming content */}
              {isTransitioning && (
                <>
                  <AnimatedBlurView 
                    animatedProps={blurAnimatedProps}
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0,
                      zIndex: 10,
                    }}
                    tint="dark"
                    pointerEvents="none"
                  />
                  <Animated.View
                    style={[
                      {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#000',
                        zIndex: 11,
                      },
                      blurOverlayStyle
                    ]}
                    pointerEvents="none"
                  />
                </>
              )}
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </ScrollView>

      {/* Sticky Transparent Header */}
      <View 
        className="absolute top-0 left-0 right-0 z-50"
        style={{ paddingTop: insets.top }}
      >
        <ProfileHeader
          username={profile.username}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onUsernamePress={handleUsernamePress}
          onAddPress={handleAddPress}
          onSettingsPress={handleSettingsPress}
          onArchivePress={handleArchivePress}
          onActivityPress={handleActivityPress}
          onLogoutPress={handleLogoutPress}
          scrollY={scrollY}
          tabbarPositionY={tabbarPositionY}
          headerHeight={insets.top + 60}
          tabOrder={tabOrder}
        />
      </View>
    </View>
  );
}
