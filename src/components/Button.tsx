import { Pressable, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function Button({ title, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`w-full p-3 items-center rounded-md ${disabled ? 'bg-gray-400' : 'bg-blue-500'}`}
    >
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  );
}
