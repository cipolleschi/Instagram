import { Text, TextInput, View, TextInputProps } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

type CustomTextInputProps = {
  label: string;
} & TextInputProps;

export default function CustomTextInput({ label, ...textInputProps }: CustomTextInputProps) {
  const { isDark } = useTheme();
  
  return (
    <View>
      <Text className="mb-2 text-gray-500 dark:text-gray-400 font-semibold">{label}</Text>
      <TextInput
        {...textInputProps}
        className="border border-gray-300 dark:border-gray-600 p-3 rounded-md text-black dark:text-white bg-white dark:bg-gray-800"
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
      />
    </View>
  );
}
