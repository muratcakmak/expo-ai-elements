import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as Collapsible from '@rn-primitives/collapsible';
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// --- Context ---

type FileTreeContextType = {
  expandedPaths: Set<string>;
  togglePath: (path: string) => void;
  selectedPath?: string;
  onSelect?: (path: string) => void;
};

const FileTreeContext = React.createContext<FileTreeContextType>({
  expandedPaths: new Set(),
  togglePath: () => {},
});

// --- FileTree (container) ---

type FileTreeProps = Omit<ViewProps, 'onSelect'> & {
  expanded?: Set<string>;
  defaultExpanded?: Set<string>;
  selectedPath?: string;
  onSelect?: (path: string) => void;
  onExpandedChange?: (expanded: Set<string>) => void;
};

function FileTree({
  expanded: controlledExpanded,
  defaultExpanded = new Set(),
  selectedPath,
  onSelect,
  onExpandedChange,
  className,
  children,
  ...props
}: FileTreeProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded);
  const expandedPaths = controlledExpanded ?? internalExpanded;

  const togglePath = React.useCallback(
    (path: string) => {
      const newExpanded = new Set(expandedPaths);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      setInternalExpanded(newExpanded);
      onExpandedChange?.(newExpanded);
    },
    [expandedPaths, onExpandedChange]
  );

  const contextValue = React.useMemo(
    () => ({ expandedPaths, onSelect, selectedPath, togglePath }),
    [expandedPaths, onSelect, selectedPath, togglePath]
  );

  return (
    <FileTreeContext.Provider value={contextValue}>
      <View
        className={cn('bg-background border-border rounded-lg border font-mono text-sm', className)}
        role="list"
        {...props}
      >
        <View className="p-2">{children}</View>
      </View>
    </FileTreeContext.Provider>
  );
}

// --- FileTreeIcon ---

type FileTreeIconProps = ViewProps;

function FileTreeIcon({ className, children, ...props }: FileTreeIconProps) {
  return (
    <View className={cn('shrink-0', className)} {...props}>
      {children}
    </View>
  );
}

// --- FileTreeName ---

type FileTreeNameProps = React.ComponentProps<typeof Text>;

function FileTreeName({ className, children, ...props }: FileTreeNameProps) {
  return (
    <Text className={cn('text-sm', className)} numberOfLines={1} {...props}>
      {children}
    </Text>
  );
}

// --- FileTreeFolder ---

type FileTreeFolderProps = ViewProps & {
  path: string;
  name: string;
};

function FileTreeFolder({ path, name, className, children, ...props }: FileTreeFolderProps) {
  const { expandedPaths, togglePath, selectedPath, onSelect } = React.useContext(FileTreeContext);
  const isExpanded = expandedPaths.has(path);
  const isSelected = selectedPath === path;

  const rotation = useSharedValue(isExpanded ? 90 : 0);

  React.useEffect(() => {
    rotation.value = withTiming(isExpanded ? 90 : 0, { duration: 200 });
  }, [isExpanded, rotation]);

  const animatedChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const handleToggle = React.useCallback(() => {
    togglePath(path);
  }, [togglePath, path]);

  const handleSelect = React.useCallback(() => {
    onSelect?.(path);
  }, [onSelect, path]);

  return (
    <Collapsible.Root open={isExpanded} onOpenChange={handleToggle}>
      <View className={cn('', className)} {...props}>
        <View
          className={cn(
            'flex-row items-center gap-1 rounded px-2 py-1',
            isSelected && 'bg-muted'
          )}
        >
          <Collapsible.Trigger asChild>
            <Pressable className="shrink-0 items-center justify-center" onPress={handleToggle}>
              <Animated.View style={animatedChevronStyle}>
                <Icon as={ChevronRightIcon} className="text-muted-foreground size-4" />
              </Animated.View>
            </Pressable>
          </Collapsible.Trigger>
          <Pressable
            className="min-w-0 flex-1 flex-row items-center gap-1"
            onPress={handleSelect}
          >
            <FileTreeIcon>
              <Icon
                as={isExpanded ? FolderOpenIcon : FolderIcon}
                className="size-4 text-blue-500"
              />
            </FileTreeIcon>
            <FileTreeName>{name}</FileTreeName>
          </Pressable>
        </View>
        <Collapsible.Content>
          <View className="border-border ml-4 border-l pl-2">{children}</View>
        </Collapsible.Content>
      </View>
    </Collapsible.Root>
  );
}

// --- FileTreeFile ---

type FileTreeFileProps = ViewProps & {
  path: string;
  name: string;
  icon?: React.ReactNode;
};

function FileTreeFile({ path, name, icon, className, children, ...props }: FileTreeFileProps) {
  const { selectedPath, onSelect } = React.useContext(FileTreeContext);
  const isSelected = selectedPath === path;

  const handlePress = React.useCallback(() => {
    onSelect?.(path);
  }, [onSelect, path]);

  return (
    <Pressable
      className={cn(
        'flex-row items-center gap-1 rounded px-2 py-1 active:bg-muted/50',
        isSelected && 'bg-muted',
        className
      )}
      onPress={handlePress}
      {...props}
    >
      {children ?? (
        <>
          {/* Spacer for alignment with folder chevron */}
          <View className="size-4 shrink-0" />
          <FileTreeIcon>
            {icon ?? <Icon as={FileIcon} className="text-muted-foreground size-4" />}
          </FileTreeIcon>
          <FileTreeName>{name}</FileTreeName>
        </>
      )}
    </Pressable>
  );
}

// --- FileTreeActions ---

type FileTreeActionsProps = ViewProps;

function FileTreeActions({ className, children, ...props }: FileTreeActionsProps) {
  return (
    <View className={cn('ml-auto flex-row items-center gap-1', className)} {...props}>
      {children}
    </View>
  );
}

FileTree.displayName = 'FileTree';
FileTreeIcon.displayName = 'FileTreeIcon';
FileTreeName.displayName = 'FileTreeName';
FileTreeFolder.displayName = 'FileTreeFolder';
FileTreeFile.displayName = 'FileTreeFile';
FileTreeActions.displayName = 'FileTreeActions';

export { FileTree, FileTreeIcon, FileTreeName, FileTreeFolder, FileTreeFile, FileTreeActions };
export type {
  FileTreeProps,
  FileTreeIconProps,
  FileTreeNameProps,
  FileTreeFolderProps,
  FileTreeFileProps,
  FileTreeActionsProps,
};
