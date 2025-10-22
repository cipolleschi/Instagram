import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/src/providers/ThemeProvider';

type TabType = 'grid' | 'reels' | 'videos' | 'tagged';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const { isDark } = useTheme();
  
  const tabs: { type: TabType; icon: string }[] = [
    { type: 'grid', icon: 'grid-outline' },
    { type: 'reels', icon: 'play-circle-outline' },
    { type: 'videos', icon: 'videocam-outline' },
    { type: 'tagged', icon: 'person-outline' },
  ];

  return (
    <View className="flex-row border-t border-gray-200 dark:border-gray-800">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.type}
          onPress={() => onTabChange(tab.type)}
          className="flex-1 py-3 items-center justify-center"
          style={{
            borderTopWidth: activeTab === tab.type ? 1 : 0,
            borderTopColor: isDark ? '#fff' : '#000',
          }}
        >
          <Ionicons 
            name={tab.icon as any} 
            size={24} 
            color={activeTab === tab.type ? (isDark ? '#fff' : '#000') : (isDark ? '#666' : '#999')}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

