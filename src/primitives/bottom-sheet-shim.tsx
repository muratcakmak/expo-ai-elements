/**
 * BottomSheet shim for Expo Go compatibility.
 * @gorhom/bottom-sheet requires native modules not available in Expo Go.
 * This shim provides fallback Modal-based implementations.
 * For production, use the real @gorhom/bottom-sheet with a dev client build.
 */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  View,
  type FlatListProps,
  type ViewProps,
} from 'react-native';

// Shim context
type SheetContextValue = {
  open: boolean;
  snapToIndex: (index: number) => void;
  close: () => void;
  expand: () => void;
};

const SheetContext = createContext<SheetContextValue>({
  open: false,
  snapToIndex: () => {},
  close: () => {},
  expand: () => {},
});

// BottomSheet shim — renders as a Modal slide-up
const BottomSheet = React.forwardRef<any, any>(
  ({ children, snapPoints, enablePanDownToClose, onClose, index = -1, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(index >= 0);

    const close = useCallback(() => {
      setIsOpen(false);
      onClose?.();
    }, [onClose]);

    const expand = useCallback(() => setIsOpen(true), []);
    const snapToIndex = useCallback((i: number) => {
      if (i < 0) close();
      else expand();
    }, [close, expand]);

    React.useImperativeHandle(ref, () => ({
      close,
      expand,
      snapToIndex,
      collapse: close,
    }));

    const ctx = useMemo(() => ({ open: isOpen, snapToIndex, close, expand }), [isOpen, snapToIndex, close, expand]);

    return (
      <SheetContext.Provider value={ctx}>
        {isOpen && (
          <Modal visible transparent animationType="slide" onRequestClose={close}>
            <Pressable
              style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}
              onPress={close}
            >
              <Pressable onPress={(e) => e.stopPropagation()}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    maxHeight: '80%',
                    paddingBottom: 34,
                  }}
                  {...props}
                >
                  {/* Drag handle */}
                  <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                    <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#d1d5db' }} />
                  </View>
                  {children}
                </View>
              </Pressable>
            </Pressable>
          </Modal>
        )}
      </SheetContext.Provider>
    );
  }
);

// BottomSheetView shim
const BottomSheetView = ({ children, style, ...props }: ViewProps) => (
  <View style={[{ paddingHorizontal: 16 }, style]} {...props}>{children}</View>
);

// BottomSheetFlatList shim
function BottomSheetFlatList<T>(props: FlatListProps<T>) {
  return <FlatList {...props} style={[{ maxHeight: 300 }, props.style]} />;
}

// BottomSheetScrollView shim
const BottomSheetScrollView = ({ children, ...props }: any) => (
  <ScrollView style={{ maxHeight: 300 }} {...props}>{children}</ScrollView>
);

// BottomSheetBackdrop shim
const BottomSheetBackdrop = () => null;

// BottomSheetModalProvider shim
const BottomSheetModalProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default BottomSheet;
export {
  BottomSheetView,
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  SheetContext,
};
