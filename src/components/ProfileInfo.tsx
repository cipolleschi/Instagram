import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';

interface ProfileInfoProps {
  avatarSource: ImageSourcePropType;
  fullName: string;
  pronouns?: string;
  bio: string;
  badge?: string;
  threadHandle?: string;
  hasStory?: boolean;
  onAvatarPress?: () => void;
}

export default function ProfileInfo({ 
  avatarSource,
  fullName,
  pronouns,
  bio,
  badge,
  threadHandle,
  hasStory = false,
  onAvatarPress
}: ProfileInfoProps) {
  return (
    <View className="px-4">
      {/* Avatar with story ring */}
      <TouchableOpacity 
        onPress={onAvatarPress}
        className="relative w-20 h-20 mb-4"
      >
        {hasStory && (
          <View className="absolute inset-0 rounded-full border-2 border-pink-500 p-0.5">
            <View className="w-full h-full rounded-full border-2 border-white dark:border-black" />
          </View>
        )}
        <Image
          source={avatarSource}
          className="w-full h-full rounded-full"
          style={hasStory ? { padding: 3 } : {}}
        />
        {/* Add story button */}
        <View className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full items-center justify-center border-2 border-white dark:border-black">
          <Text className="text-white text-xs font-bold">+</Text>
        </View>
      </TouchableOpacity>

      {/* Name and pronouns */}
      <Text className="text-base font-semibold text-black dark:text-white mb-1">
        {fullName}
        {pronouns && (
          <Text className="text-gray-600 dark:text-gray-400 font-normal"> {pronouns}</Text>
        )}
      </Text>

      {/* Badge */}
      {badge && (
        <View className="self-start mb-2">
          <View className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            <Text className="text-xs font-semibold text-black dark:text-white">
              {badge}
            </Text>
          </View>
        </View>
      )}

      {/* Bio */}
      {bio && (
        <Text className="text-sm text-black dark:text-white mb-2">
          {bio}
        </Text>
      )}

      {/* Thread handle */}
      {threadHandle && (
        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center">
            <Text className="text-xs font-bold text-black dark:text-white">@</Text>
          </View>
          <Text className="text-sm text-black dark:text-white font-semibold">
            {threadHandle}
          </Text>
        </View>
      )}
    </View>
  );
}

