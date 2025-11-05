import { View, TouchableOpacity, useWindowDimensions, Alert, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/src/providers/ThemeProvider';
import { useEffect, useState, useCallback } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, runOnJS, withSpring } from 'react-native-reanimated';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { Host, ContextMenu, Button } from '@expo/ui/swift-ui';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type TabType = 'grid' | 'reels' | 'videos' | 'tagged';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tabOrder: TabType[];
  onTabOrderChange: (newOrder: TabType[]) => void;
}

export default function ProfileTabs({ activeTab, onTabChange, tabOrder, onTabOrderChange }: ProfileTabsProps) {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const indicatorPosition = useSharedValue(0);
  const iconOpacity = useSharedValue(1);
  const [bubbleIcon, setBubbleIcon] = useState<string>('grid-outline');
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const tabPositions = useSharedValue<number[]>([]);
  
  // Map tab types to icons
  const tabIconMap: Record<TabType, string> = {
    'grid': 'grid-outline',
    'reels': 'play-circle-outline',
    'videos': 'videocam-outline',
    'tagged': 'person-outline',
  };
  
  // Build tabs array from tabOrder
  const tabs: { type: TabType; icon: string }[] = tabOrder.map(type => ({
    type,
    icon: tabIconMap[type],
  }));

  const handleMenuItemPress = (action: string) => {
    switch (action) {
      case 'most-viewed':
        Alert.alert('Most Viewed', 'Showing most viewed reels');
        break;
      case 'recent':
        Alert.alert('Recent', 'Showing recent reels');
        break;
    }
  };

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

  // Handle tab reordering
  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newOrder = [...tabOrder];
    const [movedTab] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedTab);
    onTabOrderChange(newOrder);
  }, [tabOrder, onTabOrderChange]);

  return (
    <>
      <View className="border-t border-gray-200 dark:border-gray-800">
        <View className="flex-row">
          {tabs.map((tab, index) => (
            <DraggableTabItem
              key={tab.type}
              tab={tab}
              index={index}
              isActive={activeTab === tab.type}
              isDark={isDark}
              tabWidth={tabWidth}
              liquidGlassAvailable={liquidGlassAvailable}
              onPress={() => onTabChange(tab.type)}
              onReorder={handleReorder}
              isBeingDragged={draggingIndex === index}
              onDragStart={() => setDraggingIndex(index)}
              onDragEnd={() => setDraggingIndex(null)}
            />
          ))}
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
          {activeIndex === 1 ? (
            <Host style={{ width: tabWidth * 0.7, height: 44 }}>
              <ContextMenu>
                <ContextMenu.Items>
                  <Button
                    systemImage="flame"
                    onPress={() => handleMenuItemPress('most-viewed')}
                  >
                    Most Viewed
                  </Button>
                  <Button
                    systemImage="clock"
                    onPress={() => handleMenuItemPress('recent')}
                  >
                    Recent
                  </Button>
                </ContextMenu.Items>
                <ContextMenu.Trigger>
                  <LiquidGlassView
                    effect="regular"
                    tintColor={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}
                    colorScheme={isDark ? 'dark' : 'light'}
                    interactive={false}
                    style={{
                      width: tabWidth * 0.7,
                      height: 44,
                      borderRadius: 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Animated.View style={[iconAnimatedStyle, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                      <Ionicons 
                        name={bubbleIcon as any} 
                        size={24} 
                        color={isDark ? '#fff' : '#000'}
                      />
                      <Ionicons 
                        name="chevron-down" 
                        size={16} 
                        color={isDark ? '#fff' : '#000'}
                      />
                    </Animated.View>
                  </LiquidGlassView>
                </ContextMenu.Trigger>
              </ContextMenu>
            </Host>
          ) : (
            <LiquidGlassView
              effect="regular"
              tintColor={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'}
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
          )}
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
    </>
  );
}

// Draggable Tab Item Component
interface DraggableTabItemProps {
  tab: { type: TabType; icon: string };
  index: number;
  isActive: boolean;
  isDark: boolean;
  tabWidth: number;
  liquidGlassAvailable: boolean;
  onPress: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  isBeingDragged: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function DraggableTabItem({
  tab,
  index,
  isActive,
  isDark,
  tabWidth,
  liquidGlassAvailable,
  onPress,
  onReorder,
  isBeingDragged,
  onDragStart,
  onDragEnd,
}: DraggableTabItemProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startX = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  
  // Hide the active icon when liquid glass is available (it's in the bubble)
  const shouldHideIcon = liquidGlassAvailable && isActive;

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      runOnJS(onDragStart)();
      scale.value = withSpring(1.1);
      translateY.value = withSpring(-10);
      badgeOpacity.value = withSpring(1);
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      'worklet';
      if (isBeingDragged) {
        translateX.value = startX.value + event.translationX;
        
        // Calculate target index based on position
        const currentPosition = index * tabWidth + translateX.value;
        const targetIndex = Math.round(currentPosition / tabWidth);
        
        // Clamp to valid range
        if (targetIndex >= 0 && targetIndex < 4 && targetIndex !== index) {
          // We'll handle reordering on end
        }
      }
    })
    .onEnd((event) => {
      'worklet';
      if (isBeingDragged) {
        // Calculate final position
        const currentPosition = index * tabWidth + translateX.value;
        const targetIndex = Math.max(0, Math.min(3, Math.round(currentPosition / tabWidth)));
        
        // Animate back to position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        badgeOpacity.value = withSpring(0);
        
        // Call reorder
        if (targetIndex !== index) {
          runOnJS(onReorder)(index, targetIndex);
        }
        
        runOnJS(onDragEnd)();
      }
    });

  const composedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: isBeingDragged ? 100 : 1,
      opacity: isBeingDragged ? 0.8 : 1,
    };
  });

  const badgeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: badgeOpacity.value,
      transform: [
        { scale: badgeOpacity.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <TouchableOpacity
          onPress={onPress}
          className="py-5 items-center justify-center"
          disabled={isBeingDragged}
        >
          <View style={{ opacity: shouldHideIcon ? 0 : 1, position: 'relative' }}>
            <Ionicons 
              name={tab.icon as any} 
              size={24} 
              color={isActive ? (isDark ? '#fff' : '#000') : (isDark ? '#666' : '#999')}
            />
            {/* Green badge with + sign */}
            <Animated.View
              style={[
                badgeAnimatedStyle,
                {
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: '#22c55e',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: isDark ? '#000' : '#fff',
                },
              ]}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', lineHeight: 20 }}>
                +
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

