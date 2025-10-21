import { useEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import PostListItem from '~/src/components/PostListItem';
import { useAuth } from '~/src/providers/AuthProvider';
import { useTheme } from '~/src/providers/ThemeProvider';
import { PostService, type Post } from '~/src/services/postService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LiquidGlassView } from '@callstack/liquid-glass';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();

  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsData = await PostService.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      Alert.alert('Something went wrong', 'Failed to load posts. Please try again.');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
        contentContainerStyle={{
          gap: 10,
          maxWidth: 512,
          alignSelf: 'center',
          width: '100%',
          paddingBottom: insets.bottom, // Space for tab bar + safe area
        }}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchPosts}
        refreshing={loading}
        contentInsetAdjustmentBehavior="automatic"
      />
      
      {/* Floating Action Button with Liquid Glass Effect */}
      <TouchableOpacity
        onPress={() => router.push('/new')}
        style={{
          position: 'absolute',
          bottom: insets.bottom + 80, // Above tab bar
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        activeOpacity={0.7}
      >
        <LiquidGlassView
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FontAwesome name="plus" size={28} color="white" />
        </LiquidGlassView>
      </TouchableOpacity>
    </View>
  );
}
