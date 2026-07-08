import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { RouteCatalog } from '../components/RouteCatalog';

/**
 * Modal route (`presentation: 'modal'`) exposing the same route catalog as the
 * home hub, reachable from the header menu button on every screen.
 *
 * Navigation from the modal: dismiss the modal first (`router.back()`), then
 * push the target route so it lands on the underlying stack rather than on top
 * of the still-presented modal.
 */
export default function MenuScreen() {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.back();
    router.push(href);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}>
        <RouteCatalog onNavigate={handleNavigate} />
      </ScrollView>
    </SafeAreaView>
  );
}
