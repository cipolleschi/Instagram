import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileActionsProps {
  onEditProfile?: () => void;
  onShareProfile?: () => void;
  onAddUser?: () => void;
}

export default function ProfileActions({ 
  onEditProfile,
  onShareProfile,
  onAddUser
}: ProfileActionsProps) {
  return (
    <View className="flex-row items-center gap-2 px-4 mb-4">
      {/* Edit profile button */}
      <TouchableOpacity 
        onPress={onEditProfile}
        className="flex-1 bg-gray-200 dark:bg-gray-800 py-2 rounded-lg items-center"
      >
        <Text className="text-sm font-semibold text-black dark:text-white">
          Edit profile
        </Text>
      </TouchableOpacity>

      {/* Share profile button */}
      <TouchableOpacity 
        onPress={onShareProfile}
        className="flex-1 bg-gray-200 dark:bg-gray-800 py-2 rounded-lg items-center"
      >
        <Text className="text-sm font-semibold text-black dark:text-white">
          Share profile
        </Text>
      </TouchableOpacity>

      {/* Add user button */}
      <TouchableOpacity 
        onPress={onAddUser}
        className="bg-gray-200 dark:bg-gray-800 py-2 px-3 rounded-lg items-center justify-center"
      >
        <Ionicons name="person-add-outline" size={20} color="#000" className="dark:text-white" />
      </TouchableOpacity>
    </View>
  );
}

