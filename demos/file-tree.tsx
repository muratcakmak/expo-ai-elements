import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from '@/components/ai';
import { Text } from '@/components/ui/text';
import { PreviewSection } from '@/components/showcase/preview';
import { useState } from 'react';
import { View } from 'react-native';

export function FileTreeDemo() {
  const [selectedPath, setSelectedPath] = useState<string | undefined>();

  return (
    <View className="gap-6">
      <PreviewSection
        title="Interactive file tree"
        description="Expandable folders with selection state"
      >
        <FileTree
          defaultExpanded={new Set(['src', 'src/components'])}
          onSelect={setSelectedPath}
          selectedPath={selectedPath}
        >
          <FileTreeFolder name="src" path="src">
            <FileTreeFolder name="components" path="src/components">
              <FileTreeFile name="button.tsx" path="src/components/button.tsx" />
              <FileTreeFile name="input.tsx" path="src/components/input.tsx" />
              <FileTreeFile name="modal.tsx" path="src/components/modal.tsx" />
            </FileTreeFolder>
            <FileTreeFolder name="hooks" path="src/hooks">
              <FileTreeFile name="use-auth.ts" path="src/hooks/use-auth.ts" />
              <FileTreeFile name="use-theme.ts" path="src/hooks/use-theme.ts" />
            </FileTreeFolder>
            <FileTreeFolder name="lib" path="src/lib">
              <FileTreeFile name="utils.ts" path="src/lib/utils.ts" />
            </FileTreeFolder>
            <FileTreeFile name="app.tsx" path="src/app.tsx" />
            <FileTreeFile name="main.tsx" path="src/main.tsx" />
          </FileTreeFolder>
          <FileTreeFile name="package.json" path="package.json" />
          <FileTreeFile name="tsconfig.json" path="tsconfig.json" />
          <FileTreeFile name="README.md" path="README.md" />
        </FileTree>

        {selectedPath && (
          <View className="mt-2">
            <Text className="text-muted-foreground text-xs">
              Selected: {selectedPath}
            </Text>
          </View>
        )}
      </PreviewSection>
    </View>
  );
}
