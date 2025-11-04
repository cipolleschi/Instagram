import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/src/providers/ThemeProvider';
import { LiquidGlassView } from '@callstack/liquid-glass';
import { ContextMenu, Button, Divider, Host } from '@expo/ui/swift-ui';

type TabType = 'grid' | 'reels' | 'videos' | 'tagged';

interface ProfileHeaderProps {
  username: string;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onUsernamePress?: () => void;
  onAddPress?: () => void;
  onSettingsPress?: () => void;
  onArchivePress?: () => void;
  onActivityPress?: () => void;
  onLogoutPress?: () => void;
}

export default function ProfileHeader({ 
  username, 
  activeTab,
  onTabChange,
  onUsernamePress,
  onAddPress,
  onSettingsPress,
  onArchivePress,
  onActivityPress,
  onLogoutPress
}: ProfileHeaderProps) {
  const { isDark } = useTheme();

  // Tab icon mapping
  const tabIcons: Record<TabType, string> = {
    grid: 'grid-outline',
    reels: 'play-circle-outline',
    videos: 'videocam-outline',
    tagged: 'person-outline',
  };

  const activeIcon = tabIcons[activeTab];

  return (
    <View 
      className="flex-row items-center justify-between px-4 py-3"
      style={{ backgroundColor: 'transparent' }}
    >
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

        {/* Right side - Tab icon button and Menu with Context Menu */}
        <View className="flex-row items-center gap-2">
          {/* Tab icon button with context menu */}
          <Host>
            <ContextMenu activationMethod="singlePress">
              <ContextMenu.Trigger>
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
                  <Ionicons name={activeIcon as any} size={24} color={isDark ? '#fff' : '#000'} />
                </LiquidGlassView>
              </ContextMenu.Trigger>
              <ContextMenu.Items>
                <Button 
                  onPress={() => onTabChange('grid')} 
                  systemImage="square.grid.3x3"
                >
                  Grid
                </Button>
                <Button 
                  onPress={() => onTabChange('reels')} 
                  systemImage="play.circle"
                >
                  Reels
                </Button>
                <Button 
                  onPress={() => onTabChange('videos')} 
                  systemImage="video"
                >
                  Videos
                </Button>
                <Button 
                  onPress={() => onTabChange('tagged')} 
                  systemImage="person.crop.circle"
                >
                  Tagged
                </Button>
              </ContextMenu.Items>
            </ContextMenu>
          </Host>

          {/* Menu button */}
          <Host>
            <ContextMenu activationMethod="singlePress">
              <ContextMenu.Trigger>
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
              </ContextMenu.Trigger>
              <ContextMenu.Items>
                <Button onPress={onSettingsPress} systemImage="gearshape">Settings</Button>
                <Button onPress={onArchivePress} systemImage="archivebox">Archive</Button>
                <Button onPress={onActivityPress} systemImage="chart.bar">Your Activity</Button>
                <Divider />
                <Button onPress={onLogoutPress} role="destructive" systemImage="arrow.right.square">Logout</Button>
              </ContextMenu.Items>
            </ContextMenu>
          </Host>
        </View>
    </View>
  );
}

