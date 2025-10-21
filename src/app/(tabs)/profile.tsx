import { Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import Button from '~/src/components/Button';
import { useAuth } from '~/src/providers/AuthProvider';
import { useTheme } from '~/src/providers/ThemeProvider';
import CustomTextInput from '~/src/components/CustomTextInput';
import { auth } from '~/src/services/authService';
import { ProfileService } from '~/src/services/profileService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [remoteImage, setRemoteImage] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const insets = useSafeAreaInsets();

  const { user } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    if (!user) {
      return;
    }
    
    try {
      const profile = await ProfileService.getProfile(user.id);
      if (profile) {
        setUsername(profile.username);
        setBio(profile.bio);
        setRemoteImage(profile.avatar_url);
      } else {
        // Use current user data as fallback
        setUsername(user.username);
        setBio(user.bio);
        setRemoteImage(user.avatar_url);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      Alert.alert('Failed to fetch profile');
    }
  };

  const updateProfile = async () => {
    if (!user) {
      return;
    }

    try {
      const updates = {
        username,
        bio,
        avatar_url: image || remoteImage || user.avatar_url,
      };

      await ProfileService.updateProfile(user.id, updates);
      
      // Update the remote image to show the new avatar
      if (image) {
        setRemoteImage(image);
        setImage(null); // Clear the temporary image
      }
      
      Alert.alert('Profile Updated!', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Failed to update profile');
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      Alert.alert('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Failed', 'Failed to log out. Please try again.');
    }
  };

  let avatarSource;
  if (image) {
    avatarSource = { uri: image };
  } else if (remoteImage) {
    // For local avatars, check if it's a full path or just filename
    if (remoteImage.startsWith('http') || remoteImage.startsWith('file://')) {
      avatarSource = { uri: remoteImage };
    } else {
      // Local asset from avatars folder
      const avatarPath = remoteImage.replace('avatar', '').replace('.jpg', '');
      switch(avatarPath) {
        case '1': avatarSource = require('../../../assets/images/avatars/avatar1.jpg'); break;
        case '2': avatarSource = require('../../../assets/images/avatars/avatar2.jpg'); break;
        case '3': avatarSource = require('../../../assets/images/avatars/avatar3.jpg'); break;
        case '4': avatarSource = require('../../../assets/images/avatars/avatar4.jpg'); break;
        case '5': avatarSource = require('../../../assets/images/avatars/avatar5.jpg'); break;
        default: avatarSource = require('../../../assets/images/avatars/avatar1.jpg'); break;
      }
    }
  }

  const handleThemeChange = () => {
    Alert.alert(
      'Choose Theme',
      'Select your preferred theme',
      [
        { text: 'Light', onPress: () => setTheme('light') },
        { text: 'Dark', onPress: () => setTheme('dark') },
        { text: 'System', onPress: () => setTheme('system') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View className="p-3 flex-1 bg-white dark:bg-black" style={{ paddingTop: insets.top }}>
      {/* Theme Toggle */}
      <View className="flex-row items-center justify-between mb-4 px-2">
        <Text className="text-lg font-semibold text-black dark:text-white">Theme</Text>
        <TouchableOpacity 
          onPress={handleThemeChange}
          className="flex-row items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full"
        >
          <Ionicons 
            name={theme === 'dark' ? 'moon' : theme === 'light' ? 'sunny' : 'phone-portrait'} 
            size={20} 
            color={isDark ? '#fff' : '#000'} 
          />
          <Text className="text-black dark:text-white capitalize">{theme}</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar image picker */}
      {avatarSource ? (
        <Image
          source={avatarSource}
          className="w-52 h-52 rounded-full self-center bg-slate-300 dark:bg-slate-700"
        />
      ) : (
        <View className="w-52 h-52 rounded-full self-center bg-slate-300 dark:bg-slate-700" />
      )}
      <Text
        onPress={pickImage}
        className="text-blue-500 dark:text-blue-400 font-semibold m-5 self-center"
      >
        Change
      </Text>

      {/* Form */}
      <View className="gap-5">
        <CustomTextInput
          label="Username"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <CustomTextInput
          label="Bio"
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Button */}
      <View className="gap-2 mt-auto" style={{ paddingBottom: insets.bottom + 60 }}>
        <Button title="Update profile" onPress={updateProfile} />
        <Button title="Sign out" onPress={handleLogout} variant="secondary" />
      </View>
    </View>
  );
}
