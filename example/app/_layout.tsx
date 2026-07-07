import "../global.css";

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerTitle: 'AI Chat',
            headerLargeTitle: false,
          }}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
