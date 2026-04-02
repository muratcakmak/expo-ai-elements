import '@/global.css';

import { Sidebar } from '@/components/showcase/sidebar';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from 'uniwind';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { theme } = useUniwind();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Drawer
          drawerContent={(props) => <Sidebar navigation={props.navigation} />}
          screenOptions={{
            headerShown: true,
            drawerType: 'front',
            drawerStyle: { width: 280 },
          }}
        >
          <Drawer.Screen name="index" options={{ title: 'expo-ai-elements' }} />
          <Drawer.Screen name="chat" options={{ title: 'Chat Demo' }} />
          <Drawer.Screen name="[slug]" options={{ title: 'Component' }} />
        </Drawer>
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
