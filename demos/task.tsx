import {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
  TaskItemFile,
} from '@/components/ai';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PreviewSection } from '@/components/showcase/preview';
import { FileIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export function TaskDemo() {
  const [taskOpen, setTaskOpen] = React.useState(true);

  return (
    <View className="gap-6">
      <PreviewSection
        title="Interactive Task"
        description="Collapsible task with sub-items and file references"
      >
        <View className="gap-3">
          <View className="flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onPress={() => setTaskOpen((prev) => !prev)}
            >
              <Text>{taskOpen ? 'Collapse' : 'Expand'}</Text>
            </Button>
          </View>
          <Task open={taskOpen} onOpenChange={setTaskOpen}>
            <TaskTrigger title="Found project files" />
            <TaskContent>
              <TaskItem>
                <Text className="text-muted-foreground text-sm">
                  Searching &quot;app/page.tsx, components structure&quot;
                </Text>
              </TaskItem>
              <TaskItem>
                <View className="flex-row items-center gap-1">
                  <Text className="text-muted-foreground text-sm">Read</Text>
                  <TaskItemFile>
                    <Icon as={FileIcon} className="size-3 text-blue-500" />
                    <Text className="text-foreground text-xs">page.tsx</Text>
                  </TaskItemFile>
                </View>
              </TaskItem>
              <TaskItem>
                <Text className="text-muted-foreground text-sm">Scanning 52 files</Text>
              </TaskItem>
              <TaskItem>
                <Text className="text-muted-foreground text-sm">Scanning 2 files</Text>
              </TaskItem>
              <TaskItem>
                <View className="flex-row items-center gap-1">
                  <Text className="text-muted-foreground text-sm">Reading files</Text>
                  <TaskItemFile>
                    <Icon as={FileIcon} className="size-3 text-blue-500" />
                    <Text className="text-foreground text-xs">layout.tsx</Text>
                  </TaskItemFile>
                </View>
              </TaskItem>
            </TaskContent>
          </Task>
        </View>
      </PreviewSection>

      <PreviewSection
        title="Multiple Tasks"
        description="Nested task items with different states"
      >
        <View className="gap-4">
          <Task defaultOpen>
            <TaskTrigger title="Analyzed dependencies" />
            <TaskContent>
              <TaskItem>
                <Text className="text-muted-foreground text-sm">
                  Found 12 direct dependencies
                </Text>
              </TaskItem>
              <TaskItem>
                <View className="flex-row items-center gap-1">
                  <Text className="text-muted-foreground text-sm">Read</Text>
                  <TaskItemFile>
                    <Text className="text-foreground text-xs">package.json</Text>
                  </TaskItemFile>
                </View>
              </TaskItem>
              <TaskItem>
                <Text className="text-muted-foreground text-sm">
                  3 outdated packages found
                </Text>
              </TaskItem>
            </TaskContent>
          </Task>

          <Task defaultOpen={false}>
            <TaskTrigger title="Updated configuration" />
            <TaskContent>
              <TaskItem>
                <View className="flex-row items-center gap-1">
                  <Text className="text-muted-foreground text-sm">Modified</Text>
                  <TaskItemFile>
                    <Text className="text-foreground text-xs">tsconfig.json</Text>
                  </TaskItemFile>
                </View>
              </TaskItem>
              <TaskItem>
                <Text className="text-muted-foreground text-sm">
                  Added strict mode flags
                </Text>
              </TaskItem>
            </TaskContent>
          </Task>
        </View>
      </PreviewSection>
    </View>
  );
}
