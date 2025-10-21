import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import PostListItem from '~/src/components/PostListItem';
import { useAuth } from '~/src/providers/AuthProvider';
import { PostService, type Post } from '~/src/services/postService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

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
  );
}
