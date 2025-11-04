import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/src/providers/ThemeProvider';
import { LiquidGlassView } from '@callstack/liquid-glass';

interface ProfileHeaderProps {
  username: string;
  onUsernamePress?: () => void;
  onAddPress?: () => void;
  onMenuPress?: () => void;
}

export default function ProfileHeader({ 
  username, 
  onUsernamePress,
  onAddPress,
  onMenuPress 
}: ProfileHeaderProps) {
  const { isDark } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {/* Left side - Create new post in liquid glass container */}
      <TouchableOpacity onPress={onAddPress}>
        <LiquidGlassView
          effect="regular"
          tintColor={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}
          colorScheme={isDark ? 'dark' : 'light'}
          interactive={false}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add-outline" size={28} color={isDark ? '#fff' : '#000'} />
        </LiquidGlassView>
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

      {/* Right side - Menu in liquid glass container */}
      <TouchableOpacity onPress={onMenuPress}>
        <LiquidGlassView
          effect="regular"
          tintColor={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}
          colorScheme={isDark ? 'dark' : 'light'}
          interactive={false}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={isDark ? '#fff' : '#000'} />
        </LiquidGlassView>
      </TouchableOpacity>
    </View>
  );
}

