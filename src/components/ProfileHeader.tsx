import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/src/providers/ThemeProvider';

interface ProfileHeaderProps {
  username: string;
  notificationCount?: number;
  onUsernamePress?: () => void;
  onNotificationPress?: () => void;
  onMenuPress?: () => void;
}

export default function ProfileHeader({ 
  username, 
  notificationCount = 0,
  onUsernamePress,
  onNotificationPress,
  onMenuPress 
}: ProfileHeaderProps) {
  const { isDark } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {/* Left side - Create new post */}
      <TouchableOpacity>
        <Ionicons name="add-outline" size={32} color={isDark ? '#fff' : '#000'} />
      </TouchableOpacity>

      {/* Center - Username with dropdown */}
      <TouchableOpacity 
        onPress={onUsernamePress}
        className="flex-row items-center gap-1"
      >
        <Text className="text-xl font-semibold text-black dark:text-white">
          {username}
        </Text>
        <Ionicons name="chevron-down" size={16} color={isDark ? '#fff' : '#000'} />
        {/* Live indicator */}
        <View className="w-2 h-2 rounded-full bg-red-500 ml-1" />
      </TouchableOpacity>

      {/* Right side - Notifications and Menu */}
      <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={onNotificationPress} className="relative">
          <Ionicons name="heart-outline" size={28} color={isDark ? '#fff' : '#000'} />
          {notificationCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
              <Text className="text-white text-xs font-semibold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onMenuPress}>
          <Ionicons name="menu" size={28} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

