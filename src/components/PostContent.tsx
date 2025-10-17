import { useWindowDimensions, Image } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { type Post } from '~/src/services/postService';

// Static asset mappings - Metro bundler requires static paths
const imageAssets: Record<string, any> = {
  'post1.jpg': require('../../assets/images/posts/post1.jpg'),
  'post2.jpg': require('../../assets/images/posts/post2.jpg'),
  'post3.jpg': require('../../assets/images/posts/post3.jpg'),
  'post4.jpg': require('../../assets/images/posts/post4.jpg'),
  'post5.jpg': require('../../assets/images/posts/post5.jpg'),
  'post6.jpg': require('../../assets/images/posts/post6.jpg'),
};

const videoAssets: Record<string, any> = {
  'otter.mp4': require('../../assets/videos/posts/otter.mp4'),
};

type PostContentProps = {
  post: Post;
};

export default function PostContent({ post }: PostContentProps) {
  const { width } = useWindowDimensions();

  // Get local image/video source
  const getMediaSource = () => {
    if (!post.image) return null;
    
    // If it's a full URI (user-uploaded), use as is
    if (post.image.startsWith('http') || post.image.startsWith('file://')) {
      return { uri: post.image };
    }
    
    // Static asset loading based on media type and filename
    const fileName = post.image;
    const mediaType = post.media_type || 'image';
    
    if (mediaType === 'image') {
      // Look for images in the static image assets
      if (imageAssets[fileName]) {
        return imageAssets[fileName];
      }
    } else if (mediaType === 'video') {
      // Look for videos in the static video assets
      if (videoAssets[fileName]) {
        return videoAssets[fileName];
      }
    }
    
    // Fallback to a default image if the file doesn't exist
    console.warn(`Could not load media file: ${fileName}`);
    return imageAssets['post1.jpg'];
  };

  const mediaSource = getMediaSource();
  if (!mediaSource) return null;

  if (post.media_type === 'image') {
    return (
      <Image 
        source={mediaSource} 
        className="w-full aspect-[4/3]"
        style={{ width: width, height: width * 0.75 }}
        resizeMode="cover"
      />
    );
  }

  if (post.media_type === 'video') {
    return (
      <Video
        className="w-full aspect-[4/3]"
        style={{ width: width, height: width * 0.75 }}
        source={mediaSource}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        shouldPlay
      />
    );
  }

  // Default to image if no media_type specified
  return (
    <Image 
      source={mediaSource} 
      className="w-full aspect-[4/3]"
      style={{ width: width, height: width * 0.75 }}
      resizeMode="cover"
    />
  );
}
