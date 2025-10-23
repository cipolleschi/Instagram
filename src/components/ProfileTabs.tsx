import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/src/providers/ThemeProvider';
import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type TabType = 'grid' | 'reels' | 'videos' | 'tagged';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const indicatorPosition = useSharedValue(0);
  
  const tabs: { type: TabType; icon: string }[] = [
    { type: 'grid', icon: 'grid-outline' },
    { type: 'reels', icon: 'play-circle-outline' },
    { type: 'videos', icon: 'videocam-outline' },
    { type: 'tagged', icon: 'person-outline' },
  ];

  const tabWidth = width / tabs.length;
  const activeIndex = tabs.findIndex(tab => tab.type === activeTab);

  useEffect(() => {
    indicatorPosition.value = withTiming(activeIndex * tabWidth, {
      duration: 300,
    });
  }, [activeIndex, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View className="border-t border-gray-200 dark:border-gray-800">
      <View className="flex-row">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.type}
            onPress={() => onTabChange(tab.type)}
            className="flex-1 py-3 items-center justify-center"
          >
            <Ionicons 
              name={tab.icon as any} 
              size={24} 
              color={activeTab === tab.type ? (isDark ? '#fff' : '#000') : (isDark ? '#666' : '#999')}
            />
          </TouchableOpacity>
        ))}
      </View>
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
    </View>
  );
}

