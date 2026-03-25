import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  type ViewProps,
  type TextInputProps,
  type PressableProps,
} from 'react-native';
import { SearchIcon } from 'lucide-react-native';

import { cn } from '../utils/cn';

/* ---------------------------------- Context --------------------------------- */

type CommandContextValue = {
  search: string;
  onSearchChange: (value: string) => void;
};

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommandContext() {
  const ctx = React.useContext(CommandContext);
  if (!ctx) {
    throw new Error('Command compound components must be used within <Command>');
  }
  return ctx;
}

/* ---------------------------------- Root ----------------------------------- */

type CommandProps = ViewProps & {
  className?: string;
};

function Command({ children, className, ...props }: CommandProps) {
  const [search, setSearch] = React.useState('');

  return (
    <CommandContext.Provider value={{ search, onSearchChange: setSearch }}>
      <View
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-md bg-popover',
          className,
        )}
        {...props}
      >
        {children}
      </View>
    </CommandContext.Provider>
  );
}

/* ---------------------------------- Input ---------------------------------- */

type CommandInputProps = TextInputProps & {
  className?: string;
};

function CommandInput({ className, ...props }: CommandInputProps) {
  const { search, onSearchChange } = useCommandContext();

  return (
    <View className="flex-row items-center gap-2 border-b border-border px-3 h-11">
      <SearchIcon size={16} className="opacity-50 text-muted-foreground" />
      <TextInput
        className={cn(
          'flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground',
          className,
        )}
        value={search}
        onChangeText={onSearchChange}
        placeholderTextColor="#9ca3af"
        accessibilityRole="search"
        {...props}
      />
    </View>
  );
}

/* ---------------------------------- List ----------------------------------- */

type CommandListProps<T = unknown> = ViewProps & {
  className?: string;
  data?: T[];
  renderItem?: (info: { item: T; index: number }) => React.ReactElement | null;
  keyExtractor?: (item: T, index: number) => string;
};

function CommandList<T = unknown>({
  children,
  className,
  data,
  renderItem,
  keyExtractor,
  ...props
}: CommandListProps<T>) {
  if (data && renderItem) {
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        className={cn('max-h-72', className)}
        keyboardShouldPersistTaps="handled"
        {...props}
      />
    );
  }

  return (
    <View className={cn('max-h-72', className)} {...props}>
      {children}
    </View>
  );
}

/* ---------------------------------- Item ----------------------------------- */

type CommandItemProps = PressableProps & {
  className?: string;
  disabled?: boolean;
};

function CommandItem({ children, className, disabled, ...props }: CommandItemProps) {
  return (
    <Pressable
      className={cn(
        'flex-row items-center gap-2 rounded-sm px-2 py-1.5',
        disabled && 'opacity-50',
        className,
      )}
      disabled={disabled}
      accessibilityRole="button"
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className="text-sm text-foreground">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

/* ---------------------------------- Empty ---------------------------------- */

type CommandEmptyProps = ViewProps & {
  className?: string;
};

function CommandEmpty({ children, className, ...props }: CommandEmptyProps) {
  return (
    <View className={cn('items-center justify-center py-6', className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="text-center text-sm text-muted-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

/* ---------------------------------- Group ---------------------------------- */

type CommandGroupProps = ViewProps & {
  className?: string;
  heading?: string;
};

function CommandGroup({ children, className, heading, ...props }: CommandGroupProps) {
  return (
    <View className={cn('overflow-hidden p-1', className)} {...props}>
      {heading && (
        <Text className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</Text>
      )}
      {children}
    </View>
  );
}

/* ------------------------------- Separator --------------------------------- */

type CommandSeparatorProps = ViewProps & {
  className?: string;
};

function CommandSeparator({ className, ...props }: CommandSeparatorProps) {
  return <View className={cn('-mx-1 h-px bg-border', className)} {...props} />;
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
};
