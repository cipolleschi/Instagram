import { Text, TextInput, View, TextInputProps } from 'react-native';

type CustomTextInputProps = {
  label: string;
} & TextInputProps;

export default function CustomTextInput({ label, ...textInputProps }: CustomTextInputProps) {
  return (
    <View>
      <Text className="mb-2 text-gray-500 font-semibold">{label}</Text>
      <TextInput
        {...textInputProps}
        className="border border-gray-300 p-3 rounded-md"
      />
    </View>
  );
}
