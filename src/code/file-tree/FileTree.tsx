import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type ViewProps,
} from 'react-native';
import {
  ChevronRight,
  File as FileIcon,
  Folder,
  FolderOpen,
} from 'lucide-react-native';

import { cn } from '../../utils/cn';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../primitives/Collapsible';

/* --------------------------------- Context -------------------------------- */

interface FileTreeContextType {
  expandedPaths: Set<string>;
  togglePath: (path: string) => void;
  selectedPath?: string;
  onSelect?: (path: string) => void;
}

const noop = () => {};

const FileTreeContext = createContext<FileTreeContextType>({
  expandedPaths: new Set(),
  togglePath: noop,
});

/* ---------------------------------- Root ---------------------------------- */

type FileTreeProps = ViewProps & {
  className?: string;
  expanded?: Set<string>;
  defaultExpanded?: Set<string>;
  selectedPath?: string;
  onSelect?: (path: string) => void;
  onExpandedChange?: (expanded: Set<string>) => void;
  children?: React.ReactNode;
};

const FileTree = ({
  expanded: controlledExpanded,
  defaultExpanded = new Set(),
  selectedPath,
  onSelect,
  onExpandedChange,
  className,
  children,
  ...props
}: FileTreeProps) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expandedPaths = controlledExpanded ?? internalExpanded;

  const togglePath = useCallback(
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
    [expandedPaths, onExpandedChange],
  );

  const contextValue = useMemo(
    () => ({ expandedPaths, onSelect, selectedPath, togglePath }),
    [expandedPaths, onSelect, selectedPath, togglePath],
  );

  return (
    <FileTreeContext.Provider value={contextValue}>
      <View
        className={cn(
          'rounded-lg border border-border bg-background',
          className,
        )}
        accessibilityRole="menu"
        {...props}
      >
        <View className="p-2">{children}</View>
      </View>
    </FileTreeContext.Provider>
  );
};

/* ---------------------------------- Icon ---------------------------------- */

type FileTreeIconProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const FileTreeIcon = ({
  className,
  children,
  ...props
}: FileTreeIconProps) => (
  <View className={cn('shrink-0', className)} {...props}>
    {children}
  </View>
);

/* ---------------------------------- Name ---------------------------------- */

type FileTreeNameProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const FileTreeName = ({
  className,
  children,
  ...props
}: FileTreeNameProps) => (
  <View className={cn('flex-1', className)} {...props}>
    {typeof children === 'string' ? (
      <Text className="font-mono text-sm text-foreground" numberOfLines={1}>
        {children}
      </Text>
    ) : (
      children
    )}
  </View>
);

/* --------------------------------- Folder --------------------------------- */

type FileTreeFolderProps = ViewProps & {
  className?: string;
  path: string;
  name: string;
  children?: React.ReactNode;
};

const FileTreeFolder = ({
  path,
  name,
  className,
  children,
  ...props
}: FileTreeFolderProps) => {
  const { expandedPaths, togglePath, selectedPath, onSelect } =
    useContext(FileTreeContext);
  const isExpanded = expandedPaths.has(path);
  const isSelected = selectedPath === path;

  const handleToggle = useCallback(() => {
    togglePath(path);
  }, [togglePath, path]);

  const handleSelect = useCallback(() => {
    onSelect?.(path);
  }, [onSelect, path]);

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={handleToggle}
    >
      <View className={cn(className)} {...props}>
        <View
          className={cn(
            'flex-row w-full items-center gap-1 rounded px-2 py-1',
            isSelected && 'bg-muted',
          )}
        >
          <CollapsibleTrigger className="shrink-0">
            <ChevronRight
              size={16}
              className={cn(
                'text-muted-foreground',
              )}
              style={isExpanded ? { transform: [{ rotate: '90deg' }] } : undefined}
            />
          </CollapsibleTrigger>
          <Pressable
            className="flex-1 flex-row items-center gap-1"
            onPress={handleSelect}
            accessibilityRole="button"
          >
            <FileTreeIcon>
              {isExpanded ? (
                <FolderOpen size={16} className="text-blue-500" />
              ) : (
                <Folder size={16} className="text-blue-500" />
              )}
            </FileTreeIcon>
            <FileTreeName>{name}</FileTreeName>
          </Pressable>
        </View>
        <CollapsibleContent>
          <View className="ml-4 border-l border-border pl-2">
            {children}
          </View>
        </CollapsibleContent>
      </View>
    </Collapsible>
  );
};

/* ---------------------------------- File ---------------------------------- */

type FileTreeFileProps = PressableProps & {
  className?: string;
  path: string;
  name: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

const FileTreeFile = ({
  path,
  name,
  icon,
  className,
  children,
  ...props
}: FileTreeFileProps) => {
  const { selectedPath, onSelect } = useContext(FileTreeContext);
  const isSelected = selectedPath === path;

  const handlePress = useCallback(() => {
    onSelect?.(path);
  }, [onSelect, path]);

  return (
    <Pressable
      className={cn(
        'flex-row items-center gap-1 rounded px-2 py-1',
        isSelected && 'bg-muted',
        className,
      )}
      onPress={handlePress}
      accessibilityRole="menuitem"
      {...props}
    >
      {children ?? (
        <>
          {/* Spacer for alignment with folder chevron */}
          <View className="h-4 w-4 shrink-0" />
          <FileTreeIcon>
            {icon ?? <FileIcon size={16} className="text-muted-foreground" />}
          </FileTreeIcon>
          <FileTreeName>{name}</FileTreeName>
        </>
      )}
    </Pressable>
  );
};

/* -------------------------------- Actions --------------------------------- */

type FileTreeActionsProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const FileTreeActions = ({
  className,
  children,
  ...props
}: FileTreeActionsProps) => (
  <View
    className={cn('ml-auto flex-row items-center gap-1', className)}
    {...props}
  >
    {children}
  </View>
);

export {
  FileTree,
  FileTreeIcon,
  FileTreeName,
  FileTreeFolder,
  FileTreeFile,
  FileTreeActions,
  FileTreeContext,
  type FileTreeProps,
  type FileTreeIconProps,
  type FileTreeNameProps,
  type FileTreeFolderProps,
  type FileTreeFileProps,
  type FileTreeActionsProps,
};
