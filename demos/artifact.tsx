import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
  CodeBlock,
} from '@/components/ai';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';
import {
  CopyIcon,
  DownloadIcon,
  PlayIcon,
  RefreshCwIcon,
  ShareIcon,
} from 'lucide-react-native';

const code = `# Dijkstra's Algorithm implementation
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    heap = [(0, start)]
    visited = set()

    while heap:
        current_distance, current_node = heapq.heappop(heap)
        if current_node in visited:
            continue
        visited.add(current_node)

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(heap, (distance, neighbor))

    return distances

# Example graph
graph = {
    'A': {'B': 1, 'C': 4},
    'B': {'A': 1, 'C': 2, 'D': 5},
    'C': {'A': 4, 'B': 2, 'D': 1},
    'D': {'B': 5, 'C': 1}
}

print(dijkstra(graph, 'A'))`;

export function ArtifactDemo() {
  return (
    <View className="gap-6">
      <PreviewSection
        title="Code artifact"
        description="Composable artifact with title, description, and action buttons"
      >
        <Artifact>
          <ArtifactHeader>
            <View>
              <ArtifactTitle>Dijkstra's Algorithm</ArtifactTitle>
              <ArtifactDescription>Updated 1 minute ago</ArtifactDescription>
            </View>
            <ArtifactActions>
              <ArtifactAction icon={PlayIcon} label="Run" />
              <ArtifactAction icon={CopyIcon} label="Copy" />
              <ArtifactAction icon={RefreshCwIcon} label="Regenerate" />
              <ArtifactAction icon={DownloadIcon} label="Download" />
              <ArtifactAction icon={ShareIcon} label="Share" />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactContent className="p-0">
            <CodeBlock code={code} language="python" />
          </ArtifactContent>
        </Artifact>
      </PreviewSection>
    </View>
  );
}
