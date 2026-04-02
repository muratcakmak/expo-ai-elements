import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as Collapsible from '@rn-primitives/collapsible';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { File, Folder, FolderOpen } from 'lucide-react-native';

type FileNode = {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};

type FileTreeProps = {
  data: FileNode[];
  onSelect?: (path: string) => void;
  className?: string;
};

function FileTree({ data, onSelect, className }: FileTreeProps) {
  return (
    <View className={cn('gap-0.5', className)}>
      {data.map((node) => (
        <FileTreeNode key={node.name} node={node} depth={0} path={node.name} onSelect={onSelect} />
      ))}
    </View>
  );
}

// --- Internal recursive node ---

type FileTreeNodeProps = {
  node: FileNode;
  depth: number;
  path: string;
  onSelect?: (path: string) => void;
};

function FileTreeNode({ node, depth, path, onSelect }: FileTreeNodeProps) {
  const [open, setOpen] = React.useState(false);
  const paddingLeft = depth * 16;

  if (node.type === 'folder') {
    return (
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <Pressable
            className="flex-row items-center gap-2 rounded-md px-2 py-1.5 active:bg-accent"
            style={{ paddingLeft }}
            onPress={() => onSelect?.(path)}
          >
            <Icon
              as={open ? FolderOpen : Folder}
              className="text-muted-foreground size-4"
            />
            <Text className="text-sm">{node.name}</Text>
          </Pressable>
        </Collapsible.Trigger>
        <Collapsible.Content>
          {node.children?.map((child) => (
            <FileTreeNode
              key={child.name}
              node={child}
              depth={depth + 1}
              path={`${path}/${child.name}`}
              onSelect={onSelect}
            />
          ))}
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }

  return (
    <Pressable
      className="flex-row items-center gap-2 rounded-md px-2 py-1.5 active:bg-accent"
      style={{ paddingLeft }}
      onPress={() => onSelect?.(path)}
    >
      <Icon as={File} className="text-muted-foreground size-4" />
      <Text className="text-sm">{node.name}</Text>
    </Pressable>
  );
}

FileTree.displayName = 'FileTree';

export { FileTree };
export type { FileTreeProps, FileNode };
