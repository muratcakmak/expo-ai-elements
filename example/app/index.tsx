import { Text, View } from 'react-native';

export default function TestScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dev client + Uniwind test</Text>
      <View className="bg-red-500 p-4 rounded-lg mt-4">
        <Text className="text-white font-bold">If this is red, Uniwind works!</Text>
      </View>
    </View>
  );
}
