import { FileTree } from '@/components/ai';
import type { FileNode } from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

const treeData: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Button.tsx', type: 'file' },
          { name: 'Card.tsx', type: 'file' },
          { name: 'Modal.tsx', type: 'file' },
        ],
      },
      {
        name: 'hooks',
        type: 'folder',
        children: [
          { name: 'useAuth.ts', type: 'file' },
          { name: 'useTheme.ts', type: 'file' },
        ],
      },
      { name: 'App.tsx', type: 'file' },
      { name: 'index.ts', type: 'file' },
    ],
  },
];

export function FileTreeDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Project structure" description="3 levels deep with folders and files">
        <FileTree data={treeData} />
      </PreviewSection>
    </View>
  );
}
