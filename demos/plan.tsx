import {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanTrigger,
  PlanContent,
  PlanFooter,
  PlanAction,
} from '@/components/ai';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PreviewSection } from '@/components/showcase/preview';
import {
  CheckCircleIcon,
  CircleIcon,
  FileTextIcon,
  LoaderIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

type StepStatus = 'pending' | 'in-progress' | 'done';

type Step = {
  title: string;
  status: StepStatus;
};

const INITIAL_STEPS: Step[] = [
  { title: 'Set up SolidJS project structure', status: 'pending' },
  { title: 'Install solid-js/compat for React compatibility', status: 'pending' },
  { title: 'Migrate components one by one', status: 'pending' },
  { title: 'Update test suite for each component', status: 'pending' },
  { title: 'Verify compatibility with shadcn/ui', status: 'pending' },
];

function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'done':
      return <Icon as={CheckCircleIcon} className="size-4 text-green-500" />;
    case 'in-progress':
      return <Icon as={LoaderIcon} className="size-4 text-blue-500" />;
    case 'pending':
      return <Icon as={CircleIcon} className="text-muted-foreground/40 size-4" />;
  }
}

export function PlanDemo() {
  const [steps, setSteps] = React.useState<Step[]>(INITIAL_STEPS);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const currentStepRef = React.useRef(0);

  const startExecution = React.useCallback(() => {
    setSteps(INITIAL_STEPS);
    currentStepRef.current = 0;
    setIsPlaying(true);
  }, []);

  React.useEffect(() => {
    if (!isPlaying) return;

    const idx = currentStepRef.current;
    if (idx >= INITIAL_STEPS.length) {
      setIsPlaying(false);
      return;
    }

    // Set current step to in-progress
    setSteps((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, status: 'in-progress' as const } : s))
    );

    // After delay, mark it done and advance
    timerRef.current = setTimeout(() => {
      setSteps((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, status: 'done' as const } : s))
      );
      currentStepRef.current += 1;
    }, 1200);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, steps]);

  const completedCount = steps.filter((s) => s.status === 'done').length;

  return (
    <View className="gap-6">
      <PreviewSection
        title="Interactive Plan"
        description="Play to simulate step-by-step execution"
      >
        <Plan defaultOpen>
          <PlanHeader>
            <View className="flex-1 gap-2">
              <View className="flex-row items-center gap-2">
                <Icon as={FileTextIcon} className="text-muted-foreground size-4" />
                <PlanTitle>Rewrite AI Elements to SolidJS</PlanTitle>
              </View>
              <PlanDescription>
                Rewrite the AI Elements component library from React to SolidJS while maintaining
                compatibility with existing React-based shadcn/ui components.
              </PlanDescription>
            </View>
            <PlanTrigger />
          </PlanHeader>
          <PlanContent>
            <View className="gap-3">
              <Text className="text-muted-foreground text-xs">
                {completedCount}/{steps.length} steps completed
              </Text>
              <View className="gap-1">
                {steps.map((step, index) => (
                  <View key={index} className="flex-row items-center gap-3 py-1.5">
                    <StepIcon status={step.status} />
                    <Text
                      className={
                        step.status === 'done'
                          ? 'text-muted-foreground text-sm line-through'
                          : step.status === 'in-progress'
                            ? 'text-foreground text-sm font-medium'
                            : 'text-foreground text-sm'
                      }
                    >
                      {step.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </PlanContent>
          <PlanFooter className="justify-end">
            <PlanAction>
              <Button size="sm" onPress={startExecution} disabled={isPlaying}>
                <Text>{isPlaying ? 'Running...' : 'Build'}</Text>
              </Button>
            </PlanAction>
          </PlanFooter>
        </Plan>
      </PreviewSection>

      <PreviewSection title="Collapsed Plan" description="Click trigger to expand">
        <Plan defaultOpen={false}>
          <PlanHeader>
            <View className="flex-1">
              <PlanTitle>Deploy to Production</PlanTitle>
            </View>
            <PlanTrigger />
          </PlanHeader>
          <PlanContent>
            <View className="gap-2">
              <Text className="text-foreground text-sm">1. Run final test suite</Text>
              <Text className="text-foreground text-sm">2. Build production bundle</Text>
              <Text className="text-foreground text-sm">3. Deploy to CDN</Text>
              <Text className="text-foreground text-sm">4. Verify health checks</Text>
            </View>
          </PlanContent>
        </Plan>
      </PreviewSection>
    </View>
  );
}
