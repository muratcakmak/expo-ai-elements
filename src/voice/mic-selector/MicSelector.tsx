import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import { usePermissions } from 'expo-audio';
import { Check, ChevronsUpDown } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Button } from '../../primitives/Button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../primitives/Drawer';
import { colors } from '../../theme/tokens';

/* --------------------------------- Types --------------------------------- */

type AudioInputDevice = {
  uid: string;
  name: string;
  type: string;
};

type MicSelectorContextValue = {
  devices: AudioInputDevice[];
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  loading: boolean;
  error: string | null;
};

/* -------------------------------- Context -------------------------------- */

const MicSelectorContext = createContext<MicSelectorContextValue | null>(null);

function useMicSelector(): MicSelectorContextValue {
  const ctx = useContext(MicSelectorContext);
  if (!ctx) {
    throw new Error(
      'MicSelector compound components must be used within <MicSelector>.',
    );
  }
  return ctx;
}

/* ------------------------------ Hook -------------------------------------- */

/**
 * Hook to enumerate available audio input devices using expo-audio.
 * Requests microphone permission. Device enumeration is platform-limited.
 */
function useAudioDevices() {
  const [devices, setDevices] = useState<AudioInputDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionResponse, requestPermission] = usePermissions();

  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!permissionResponse?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          setError('Microphone permission not granted');
          setHasPermission(false);
          return;
        }
      }

      setHasPermission(true);

      // expo-audio doesn't expose device enumeration directly.
      // Provide a default "Built-in Microphone" entry.
      setDevices([
        { uid: 'default', name: 'Built-in Microphone', type: 'builtin' },
      ]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Failed to get audio devices';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [permissionResponse, requestPermission]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  return { devices, loading, error, hasPermission, loadDevices };
}

/* --------------------------------- Root ---------------------------------- */

type MicSelectorProps = {
  className?: string;
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function MicSelector({
  className,
  children,
  value: controlledValue,
  defaultValue,
  onValueChange: controlledOnValueChange,
  open,
  onOpenChange,
}: MicSelectorProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );
  const { devices, loading, error, loadDevices } = useAudioDevices();

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const onValueChange = useCallback(
    (nextValue: string | undefined) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      controlledOnValueChange?.(nextValue);
    },
    [isControlled, controlledOnValueChange],
  );

  const contextValue = useMemo(
    () => ({
      devices,
      value,
      onValueChange,
      loading,
      error,
    }),
    [devices, value, onValueChange, loading, error],
  );

  return (
    <MicSelectorContext.Provider value={contextValue}>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <View className={cn(className)}>{children}</View>
        <MicSelectorContentInner />
      </Drawer>
    </MicSelectorContext.Provider>
  );
}

/* -------------------------------- Trigger -------------------------------- */

type MicSelectorTriggerProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

function MicSelectorTrigger({
  children,
  className,
  ...props
}: MicSelectorTriggerProps) {
  return (
    <DrawerTrigger
      className={cn(
        'flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronsUpDown size={16} color={colors.mutedForeground} />
    </DrawerTrigger>
  );
}

/* ------------------------------ Content ---------------------------------- */

function MicSelectorContentInner() {
  const { devices, value, onValueChange, loading } = useMicSelector();

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Select Microphone</DrawerTitle>
      </DrawerHeader>
      {loading ? (
        <View className="items-center justify-center p-8">
          <Text className="text-sm text-muted-foreground">
            Loading audio inputs...
          </Text>
        </View>
      ) : devices.length === 0 ? (
        <View className="items-center justify-center p-8">
          <Text className="text-sm text-muted-foreground">
            No microphone found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <Pressable
              className={cn(
                'flex-row items-center px-4 py-3',
                value === item.uid && 'bg-accent/10',
              )}
              onPress={() => onValueChange(item.uid)}
              accessibilityRole="menuitem"
              accessibilityState={{ selected: value === item.uid }}
            >
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground">
                  {item.name}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {item.type}
                </Text>
              </View>
              {value === item.uid && (
                <Check size={16} color={colors.primary} />
              )}
            </Pressable>
          )}
        />
      )}
    </DrawerContent>
  );
}

/* -------------------------------- Value ---------------------------------- */

type MicSelectorValueProps = TextProps & {
  className?: string;
  placeholder?: string;
};

function MicSelectorValue({
  className,
  placeholder = 'Select microphone...',
  ...props
}: MicSelectorValueProps) {
  const { devices, value } = useMicSelector();
  const currentDevice = devices.find((d) => d.uid === value);

  return (
    <Text
      className={cn(
        'flex-1 text-sm',
        currentDevice ? 'text-foreground' : 'text-muted-foreground',
        className,
      )}
      numberOfLines={1}
      {...props}
    >
      {currentDevice?.name ?? placeholder}
    </Text>
  );
}

/* -------------------------------- Label ---------------------------------- */

type MicSelectorLabelProps = TextProps & {
  className?: string;
  device: AudioInputDevice;
};

function MicSelectorLabel({
  device,
  className,
  ...props
}: MicSelectorLabelProps) {
  return (
    <Text className={cn('text-sm text-foreground', className)} {...props}>
      {device.name}
    </Text>
  );
}

/* -------------------------------- Exports -------------------------------- */

export {
  MicSelector,
  MicSelectorTrigger,
  MicSelectorValue,
  MicSelectorLabel,
  useAudioDevices,
  useMicSelector,
  type MicSelectorProps,
  type MicSelectorTriggerProps,
  type MicSelectorValueProps,
  type MicSelectorLabelProps,
  type AudioInputDevice,
};
