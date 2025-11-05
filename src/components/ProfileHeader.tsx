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
  glassEffectId,
} from '@expo/ui/swift-ui/modifiers';
import Animated, { useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
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
  scrollY?: SharedValue<number>;
  tabbarPositionY?: SharedValue<number>;
  headerHeight?: number;
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
  onLogoutPress,
  scrollY,
  tabbarPositionY,
  headerHeight = 60
}: ProfileHeaderProps) {
  const { isDark } = useTheme();
  const namespaceId = useId();
  const [isTabbarVisible, setIsTabbarVisible] = useState(true);
  const [isSingleMenuButtonVisible, setIsSingleMenuButtonVisible] = useState(true);
  const [areBothButtonsVisible, setAreBothButtonsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Watch scroll position and update tabbar visibility
  useAnimatedReaction(
    () => {
      if (!scrollY || !tabbarPositionY) return true;
      // Return true if tabbar is on screen, false if off screen
      return scrollY.value - 300 <= tabbarPositionY.value - headerHeight;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue !== null) {
        runOnJS(setIsTabbarVisible)(currentValue);
      }
    },
    [scrollY, tabbarPositionY, headerHeight]
  );

  useAnimatedReaction(
    () => {
      if (!scrollY || !tabbarPositionY) return false;
      // Return true if tabbar is about to go off screen
      return scrollY.value - 200 > tabbarPositionY.value - headerHeight || scrollY.value - 400 <= tabbarPositionY.value - headerHeight;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue !== null) {
        runOnJS(setIsAnimating)(currentValue);
      }
    },
    [scrollY, tabbarPositionY, headerHeight]
  );

  useAnimatedReaction(
    () => {
      if (!scrollY || !tabbarPositionY) return true;
      // Return true if tabbar is on screen, false if off screen
      return scrollY.value - 200 <= tabbarPositionY.value - headerHeight;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue !== null) {
        runOnJS(setIsSingleMenuButtonVisible)(currentValue);
      }
    },
    [scrollY, tabbarPositionY, headerHeight]
  );

  useAnimatedReaction(
    () => {
      if (!scrollY || !tabbarPositionY) return false;
      // Return true if tabbar is about to go on screen
      return scrollY.value - 400 > tabbarPositionY.value - headerHeight;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue !== null) {
        runOnJS(setAreBothButtonsVisible)(currentValue);
      }
    },
    [scrollY, tabbarPositionY, headerHeight]
  );

  
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
        </Host>

        {/* Center - Username with dropdown */}
        <TouchableOpacity 
          onPress={onUsernamePress}
          className="flex-row items-center gap-1" 
        >
          <Text className="text-xl font-semibold text-black dark:text-white">
            {username}
          </Text>          
        </TouchableOpacity>

        {/* Right side - Tab icon button and Menu with Context Menu */}
        {
          isSingleMenuButtonVisible ? 
            (<View className="flex-row gap-2 justify-end w-30 h-18">
              <Host style={{ height: 44, width:56 }}>
                <MenuButton isDark={isDark} namespaceId={namespaceId} onSettingsPress={onSettingsPress} onArchivePress={onArchivePress} onActivityPress={onActivityPress} onLogoutPress={onLogoutPress} />
              </Host>
            </View>) :
          areBothButtonsVisible ?
           (<View className="flex-row gap-2 justify-end w-30 h-18">
            <Host style={{ height: 44, width:118, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
              <HStack spacing={10} modifiers={[animation(Animation.spring({ duration: 0.8 }), isTabbarVisible), frame({ width: 120, alignment: 'trailing'})]}>
                <TabSelector activeIcon={activeIcon} onTabChange={onTabChange} isDark={isDark} namespaceId={namespaceId} />
                <MenuButton isDark={isDark} namespaceId={namespaceId} onSettingsPress={onSettingsPress} onArchivePress={onArchivePress} onActivityPress={onActivityPress} onLogoutPress={onLogoutPress} />
              </HStack>
            </Host>
          </View>) :
          isAnimating ? 
           (<View className="flex-row gap-2 justify-end w-30 h-18">
            <Host style={{ height: 44, width:118, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
              <Namespace id={namespaceId}>
              <GlassEffectContainer spacing={10} modifiers={[animation(Animation.spring({ duration: 0.8 }), isTabbarVisible)]}>
                <HStack spacing={10} modifiers={[animation(Animation.spring({ duration: 0.8 }), isTabbarVisible), frame({ width: 120, alignment: 'trailing'})]}>
                  {!isTabbarVisible && <TabSelector activeIcon={activeIcon} onTabChange={onTabChange} isDark={isDark} namespaceId={namespaceId} />}
                  <MenuButton isDark={isDark} namespaceId={namespaceId} onSettingsPress={onSettingsPress} onArchivePress={onArchivePress} onActivityPress={onActivityPress} onLogoutPress={onLogoutPress} />
                </HStack>
                </GlassEffectContainer>
                </Namespace>
            </Host>
          </View>): null
}
    </View>
  );
}


function TabSelector({ activeIcon, onTabChange, isDark, namespaceId }: { activeIcon: string, onTabChange: (tab: TabType) => void, isDark: boolean, namespaceId: string }) {
  return (
    <ContextMenu activationMethod="singlePress">
      <ContextMenu.Trigger>
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
            }),
            glassEffectId('tabSelector', namespaceId)
          ]}
        />
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
  );
}

function MenuButton({ isDark, namespaceId, onSettingsPress, onArchivePress, onActivityPress, onLogoutPress }: { isDark: boolean, namespaceId: string, onSettingsPress: (() => void) | undefined, onArchivePress: (() => void) | undefined, onActivityPress: (() => void) | undefined, onLogoutPress: (() => void) | undefined }) {
  return (
  <ContextMenu activationMethod="singlePress">
    <ContextMenu.Trigger>
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
          }),
          glassEffectId('ellipsis', namespaceId)
        ]}
      />
    </ContextMenu.Trigger>
    <ContextMenu.Items>
      <Button onPress={onSettingsPress} systemImage="gearshape">Settings</Button>
      <Button onPress={onArchivePress} systemImage="archivebox">Archive</Button>
      <Button onPress={onActivityPress} systemImage="chart.bar">Your Activity</Button>
      <Divider />
      <Button onPress={onLogoutPress} role="destructive" systemImage="arrow.right.square">Logout</Button>
    </ContextMenu.Items>
  </ContextMenu>
  );
}