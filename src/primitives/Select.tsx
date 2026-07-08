import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { Check, ChevronDown } from 'lucide-react-native';

import { cn } from '../utils/cn';

type BottomSheetModalRef = React.ComponentRef<typeof BottomSheetModal>;

/* --------------------------------- Context -------------------------------- */

type SelectContextValue = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  open: () => void;
  close: () => void;
};

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect(): SelectContextValue {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error(
      'Select compound components must be rendered within a <Select> root.',
    );
  }
  return context;
}

/* -------------------------------- Item Ctx -------------------------------- */

type SelectItemContextValue = {
  items: SelectItemData[];
  registerItem: (item: SelectItemData) => void;
  unregisterItem: (value: string) => void;
};

type SelectItemData = {
  value: string;
  label: string;
};

const SelectItemContext = createContext<SelectItemContextValue | null>(null);

function useSelectItems(): SelectItemContextValue {
  const context = useContext(SelectItemContext);
  if (!context) {
    throw new Error(
      'SelectItem must be rendered within a <Select> root.',
    );
  }
  return context;
}

/* ---------------------------------- Root ---------------------------------- */

type SelectProps = ViewProps & {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children?: React.ReactNode;
};

function Select({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue = '',
  className,
  children,
  ...props
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const onValueChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      controlledOnValueChange?.(nextValue);
    },
    [isControlled, controlledOnValueChange],
  );

  const open = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const [items, setItems] = useState<SelectItemData[]>([]);

  const registerItem = useCallback((item: SelectItemData) => {
    setItems((prev) => {
      if (prev.some((existing) => existing.value === item.value)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const unregisterItem = useCallback((itemValue: string) => {
    setItems((prev) => prev.filter((item) => item.value !== itemValue));
  }, []);

  const selectCtx = useMemo<SelectContextValue>(
    () => ({ value, onValueChange, open, close }),
    [value, onValueChange, open, close],
  );

  const itemCtx = useMemo<SelectItemContextValue>(
    () => ({ items, registerItem, unregisterItem }),
    [items, registerItem, unregisterItem],
  );

  return (
    <SelectContext.Provider value={selectCtx}>
      <SelectItemContext.Provider value={itemCtx}>
        <View className={cn(className)} {...props}>
          {children}
        </View>
        <BottomSheetModal
          ref={bottomSheetRef}
          enablePanDownToClose
          enableDynamicSizing={false}
          snapPoints={['40%']}
        >
          {/*
            BottomSheetModal re-parents its children to the
            BottomSheetModalProvider host via @gorhom/portal, so context
            provided below that host is lost — re-provide both contexts for
            SelectContentInner.
          */}
          <SelectContext.Provider value={selectCtx}>
            <SelectItemContext.Provider value={itemCtx}>
              <SelectContentInner />
            </SelectItemContext.Provider>
          </SelectContext.Provider>
        </BottomSheetModal>
      </SelectItemContext.Provider>
    </SelectContext.Provider>
  );
}

/* ------------------------------ Content Inner ----------------------------- */

function SelectContentInner() {
  const { value, onValueChange, close } = useSelect();
  const { items } = useSelectItems();

  const handleSelect = useCallback(
    (itemValue: string) => {
      onValueChange(itemValue);
      close();
    },
    [onValueChange, close],
  );

  return (
    <BottomSheetFlatList
      data={items}
      keyExtractor={(item) => item.value}
      renderItem={({ item }) => (
        <Pressable
          className={cn(
            'flex-row items-center px-4 py-3',
            value === item.value && 'bg-accent',
          )}
          onPress={() => handleSelect(item.value)}
          accessibilityRole="menuitem"
          accessibilityState={{ selected: value === item.value }}
        >
          <Text
            className={cn(
              'flex-1 text-sm text-foreground',
              value === item.value && 'font-medium',
            )}
          >
            {item.label}
          </Text>
          {value === item.value && (
            <Check size={16} className="text-primary" />
          )}
        </Pressable>
      )}
    />
  );
}

/* -------------------------------- Trigger -------------------------------- */

type SelectTriggerProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

function SelectTrigger({
  className,
  children,
  ...props
}: SelectTriggerProps) {
  const { open } = useSelect();

  return (
    <Pressable
      className={cn(
        'flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2',
        className,
      )}
      onPress={open}
      accessibilityRole="button"
      {...props}
    >
      {children}
      <ChevronDown size={16} className="text-muted-foreground opacity-50" />
    </Pressable>
  );
}

/* -------------------------------- Content -------------------------------- */

type SelectContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

/**
 * SelectContent is used declaratively to register items via SelectItem children.
 * The actual bottom-sheet rendering happens inside Select root.
 */
function SelectContent({
  children,
  ...props
}: SelectContentProps) {
  return <View {...props}>{children}</View>;
}

/* ---------------------------------- Item ---------------------------------- */

type SelectItemProps = {
  value: string;
  label: string;
  className?: string;
};

function SelectItem({
  value: itemValue,
  label,
}: SelectItemProps) {
  const { registerItem, unregisterItem } = useSelectItems();

  React.useEffect(() => {
    registerItem({ value: itemValue, label });
    return () => unregisterItem(itemValue);
  }, [itemValue, label, registerItem, unregisterItem]);

  // SelectItem is declarative only: it registers data for the bottom sheet.
  // Rendering happens in SelectContentInner. Return null.
  return null;
}

/* --------------------------------- Value --------------------------------- */

type SelectValueProps = TextProps & {
  className?: string;
  placeholder?: string;
};

function SelectValue({
  className,
  placeholder,
  ...props
}: SelectValueProps) {
  const { value } = useSelect();
  const { items } = useSelectItems();

  const selectedItem = items.find((item) => item.value === value);
  const displayText = selectedItem?.label ?? placeholder ?? '';

  return (
    <Text
      className={cn(
        'text-sm',
        selectedItem ? 'text-foreground' : 'text-muted-foreground',
        className,
      )}
      numberOfLines={1}
      {...props}
    >
      {displayText}
    </Text>
  );
}

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  useSelect,
  type SelectProps,
  type SelectTriggerProps,
  type SelectContentProps,
  type SelectItemProps,
  type SelectValueProps,
};
