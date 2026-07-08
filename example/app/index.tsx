import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '../../src/primitives/Badge';
import { RouteCatalog } from '../components/RouteCatalog';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        {/* ===== HERO ===== */}
        <View className="px-4 pb-6 pt-5">
          <Badge
            variant="secondary"
            className="self-start border-transparent bg-ai-accent"
            textClassName="font-semibold text-ai-accent-foreground"
          >
            SDK 57
          </Badge>
          <Text className="mt-3 text-[32px] font-bold tracking-tight text-ai-foreground">
            expo-ai-elements
          </Text>
          <Text className="mt-2 text-[15px] text-ai-muted-foreground">
            AI chat UI primitives for React Native
          </Text>
        </View>

        {/* ===== CATALOG ===== */}
        <RouteCatalog />
      </ScrollView>
    </SafeAreaView>
  );
}
