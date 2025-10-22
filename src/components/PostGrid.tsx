import { View, Image, FlatList, TouchableOpacity, Dimensions, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Post {
  id: string;
  image: string;
  media_type: 'image' | 'video';
}

interface PostGridProps {
  posts: Post[];
  onPostPress?: (post: Post) => void;
}

export default function PostGrid({ posts, onPostPress }: PostGridProps) {
  const screenWidth = Dimensions.get('window').width;
  const itemSize = (screenWidth - 4) / 3; // 3 columns with 2px gaps

  const getImageSource = (imageName: string) => {
    // Handle local assets
    if (imageName.includes('post1.jpg')) return require('../../assets/images/posts/post1.jpg');
    if (imageName.includes('post2.jpg')) return require('../../assets/images/posts/post2.jpg');
    if (imageName.includes('post3.jpg')) return require('../../assets/images/posts/post3.jpg');
    if (imageName.includes('post4.jpg')) return require('../../assets/images/posts/post4.jpg');
    if (imageName.includes('post5.jpg')) return require('../../assets/images/posts/post5.jpg');
    if (imageName.includes('post6.jpg')) return require('../../assets/images/posts/post6.jpg');
    
    // For remote images or videos, return uri
    if (imageName.startsWith('http')) {
      return { uri: imageName };
    }
    
    // Default fallback
    return require('../../assets/images/posts/post1.jpg');
  };

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      onPress={() => onPostPress?.(item)}
      style={{ width: itemSize, height: itemSize, margin: 1 }}
      className="relative"
    >
      <Image
        source={getImageSource(item.image)}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
      {item.media_type === 'video' && (
        <View className="absolute top-2 right-2">
          <Ionicons name="play" size={20} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  if (posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Ionicons name="camera-outline" size={60} color="#999" />
        <Text className="text-gray-500 dark:text-gray-400 text-lg mt-4">No posts yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
}

