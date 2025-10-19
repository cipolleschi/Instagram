import { Text, View, Image, TextInput, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Button from '~/src/components/Button';
import { useAuth } from '~/src/providers/AuthProvider';
import { router } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';
import { PostService } from '~/src/services/postService';
import { sendPostCreatedNotification } from '~/src/utils/notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | undefined>();

  const { user } = useAuth();

  useEffect(() => {
    if (!media) {
      pickMedia();
    }
  }, [media]);

  const pickMedia = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
      const type = result.assets[0].type;
      if (type === 'image' || type === 'video') {
        setMediaType(type);
      } else {
        setMediaType('image'); // Default to image for other types
      }
    }
  };

  const createPost = async () => {
    if (!media || !user?.id) {
      Alert.alert('Error', 'Please select an image and make sure you are logged in.');
      return;
    }

    try {
      // Create post data for local storage
      const postData = {
        caption,
        image: media, // Store the local URI directly
        media_type: mediaType || 'image',
        user_id: user.id,
      };

      // Save post using PostService
      const newPost = await PostService.createPost(postData);
      
      if (newPost) {
        // Send local notification for successful post creation
        await sendPostCreatedNotification();
        Alert.alert('Success!', 'Your post has been created successfully.');
        router.push('/(tabs)');
      } else {
        Alert.alert('Error', 'Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Create post error:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={['bottom']}>
      <View className="p-3 items-center flex-1">
        {/* Image picker */}
        {!media ? (
          <View className="w-52 aspect-[3/4] rounded-lg bg-slate-300" />
        ) : mediaType === 'image' ? (
          <Image
            source={{ uri: media }}
            className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
          />
        ) : (
          <Video
            className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
            style={{ width: '100%', aspectRatio: 16 / 9 }}
            source={{
              uri: media,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay
          />
        )}

        <Text onPress={pickMedia} className="text-blue-500 font-semibold m-5">
          Change
        </Text>

        {/* TextInput for caption */}
        <TextInput
          value={caption}
          onChangeText={(newValue) => setCaption(newValue)}
          placeholder="What is on your mind"
          className="w-full p-3"
        />

        {/* Button */}
        <View className="mt-auto w-full pb-8 px-3">
          <Button title="Share" onPress={createPost} />
        </View>
      </View>
    </SafeAreaView>
  );
}
