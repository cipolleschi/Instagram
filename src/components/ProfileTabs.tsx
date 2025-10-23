import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/src/providers/ThemeProvider';
import { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, runOnJS } from 'react-native-reanimated';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';

type TabType = 'grid' | 'reels' | 'videos' | 'tagged';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const indicatorPosition = useSharedValue(0);
  const iconOpacity = useSharedValue(1);
  const [bubbleIcon, setBubbleIcon] = useState<string>('grid-outline');
  
  const tabs: { type: TabType; icon: string }[] = [
    { type: 'grid', icon: 'grid-outline' },
    { type: 'reels', icon: 'play-circle-outline' },
    { type: 'videos', icon: 'videocam-outline' },
    { type: 'tagged', icon: 'person-outline' },
  ];

  const tabWidth = width / tabs.length;
  const activeIndex = tabs.findIndex(tab => tab.type === activeTab);
  const activeIcon = tabs[activeIndex]?.icon || 'grid-outline';

  // Check if liquid glass is supported
  const liquidGlassAvailable = isLiquidGlassSupported;

  useEffect(() => {
    if (liquidGlassAvailable) {
      // Complex animation: fade out old icon, move bubble, fade in new icon
      iconOpacity.value = withSequence(
        // Fade out current icon quickly
        withTiming(0, { duration: 100 }),
        // Wait for the icon to update (using a callback)
        withTiming(0, { duration: 0 }, (finished) => {
          if (finished) {
            runOnJS(setBubbleIcon)(activeIcon);
          }
        }),
        // Fade in new icon after a short delay
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 150 })
      );
      
      // Move bubble to new position
      indicatorPosition.value = withTiming(activeIndex * tabWidth, {
        duration: 300,
      });
    } else {
      // Simple animation for line indicator
      indicatorPosition.value = withTiming(activeIndex * tabWidth, {
        duration: 300,
      });
    }
  }, [activeIndex, tabWidth, activeIcon, liquidGlassAvailable]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
    };
  });

  return (
    <View className="border-t border-gray-200 dark:border-gray-800">
      <View className="flex-row">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.type;
          // Hide the active icon when liquid glass is available (it's in the bubble)
          const shouldHideIcon = liquidGlassAvailable && isActive;
          
          return (
            <TouchableOpacity
              key={tab.type}
              onPress={() => onTabChange(tab.type)}
              className="flex-1 py-3 items-center justify-center"
            >
              <View style={{ opacity: shouldHideIcon ? 0 : 1 }}>
                <Ionicons 
                  name={tab.icon as any} 
                  size={24} 
                  color={isActive ? (isDark ? '#fff' : '#000') : (isDark ? '#666' : '#999')}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {liquidGlassAvailable ? (
        // Animated liquid glass bubble indicator with icon inside
        <Animated.View
          style={[
            indicatorStyle,
            {
              position: 'absolute',
              top: 4,
              width: tabWidth,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }
          ]}
        >
          <LiquidGlassView
            effect="regular"
            tintColor={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}
            colorScheme={isDark ? 'dark' : 'light'}
            interactive={false}
            style={{
              width: tabWidth * 0.6,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.View style={iconAnimatedStyle}>
              <Ionicons 
                name={bubbleIcon as any} 
                size={24} 
                color={isDark ? '#fff' : '#000'}
              />
            </Animated.View>
          </LiquidGlassView>
        </Animated.View>
      ) : (
        // Fallback to line indicator when liquid glass is not available
        <Animated.View
          style={[
            indicatorStyle,
            {
              position: 'absolute',
              top: 0,
              width: tabWidth,
              height: 1,
              backgroundColor: isDark ? '#fff' : '#000',
            }
          ]}
        />
      )}
    </View>
  );
}

