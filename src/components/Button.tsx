import { Pressable, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export default function Button({ title, onPress, disabled, variant = 'primary' }: ButtonProps) {
  const primaryClasses = disabled ? 'bg-gray-400 dark:bg-gray-600' : 'bg-blue-500 dark:bg-blue-600';
  const secondaryClasses = 'bg-gray-200 dark:bg-gray-700';
  
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`w-full p-3 items-center rounded-md ${variant === 'primary' ? primaryClasses : secondaryClasses}`}
    >
      <Text className={`font-semibold ${variant === 'primary' ? 'text-white' : 'text-black dark:text-white'}`}>
        {title}
      </Text>
    </Pressable>
  );
}
