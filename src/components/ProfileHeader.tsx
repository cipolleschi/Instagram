import { View, Text, TouchableOpacity } from 'react-native';
import { useId, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/src/providers/ThemeProvider';
import { ContextMenu, Button, Divider, Host, HStack, GlassEffectContainer, Namespace, Image } from '@expo/ui/swift-ui';
import {
  animation,
  Animation,
  frame,
  padding,
  glassEffect,
} from '@expo/ui/swift-ui/modifiers';
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
  const [isTabbarVisible, setIsTabbarVisible] = useState(false);
  const namespaceId = useId();

  // Tab icon mapping - SF Symbols
  const tabIcons: Record<TabType, string> = {
    grid: 'square.grid.3x3',
    reels: 'play.circle',
    videos: 'video',
    tagged: 'person.crop.circle',
  };

  const activeIcon = tabIcons[activeTab];

  return (
    <View 
      className="flex-row items-center justify-between px-4 py-3"
      style={{ backgroundColor: 'transparent' }}
    >
        {/* Left side - Create new post with glass effect */}
        <Host style={{ width: 44, height: 44 }}>
          <GlassEffectContainer>
            <Image
              systemName="plus"
              size={28}
              color={isDark ? '#fff' : '#000'}
              onPress={onAddPress}
              modifiers={[
                frame({ width: 36, height: 36 }),
                padding({ all: 10 }),
                glassEffect({ 
                  glass: { variant: 'regular' },
                  shape: 'circle'
                })
              ]}
            />
          </GlassEffectContainer>
        </Host>

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
        <View className="flex-row gap-2 justify-end w-30 h-18">
          {/* Tab icon button with context menu */}
          <Host style={{ height: 44, width:118, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
            <Namespace id={namespaceId}>
            <GlassEffectContainer spacing={20} modifiers={[animation(Animation.spring({ duration: 0.8 }), isTabbarVisible)]}>
              <HStack spacing={20} modifiers={[frame({ width: 120, alignment: 'trailing'}),]}>
              <ContextMenu activationMethod="singlePress">
                <ContextMenu.Trigger>
                  <GlassEffectContainer>
                    <Image
                      systemName={activeIcon as any}
                      size={24}
                      color={isDark ? '#fff' : '#000'}
                      modifiers={[
                        frame({ width: 36, height: 36 }),
                        padding({ all: 10 }),
                        glassEffect({ 
                          glass: { variant: 'regular' },
                          shape: 'circle'
                        })
                      ]}
                    />
                  </GlassEffectContainer>
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

              <ContextMenu activationMethod="singlePress">
                <ContextMenu.Trigger>
                  <GlassEffectContainer>
                    <Image
                      systemName="ellipsis"
                      size={24}
                      color={isDark ? '#fff' : '#000'}
                      modifiers={[
                        frame({ width: 36, height: 36 }),
                        padding({ all: 10 }),
                        glassEffect({ 
                          glass: { variant: 'regular' },
                          shape: 'circle'
                        })
                      ]}
                    />
                  </GlassEffectContainer>
                </ContextMenu.Trigger>
                <ContextMenu.Items>
                  <Button onPress={onSettingsPress} systemImage="gearshape">Settings</Button>
                  <Button onPress={onArchivePress} systemImage="archivebox">Archive</Button>
                  <Button onPress={onActivityPress} systemImage="chart.bar">Your Activity</Button>
                  <Divider />
                  <Button onPress={onLogoutPress} role="destructive" systemImage="arrow.right.square">Logout</Button>
                </ContextMenu.Items>
              </ContextMenu>
              </HStack> 
              </GlassEffectContainer>
              </Namespace>
          </Host>
        </View>
    </View>
  );
}

