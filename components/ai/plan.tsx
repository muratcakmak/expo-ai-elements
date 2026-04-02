import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  CheckCircleIcon,
  CircleIcon,
  LoaderIcon,
  SkipForwardIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import * as Progress from '@rn-primitives/progress';

// --- Types ---

type PlanStepStatus = 'pending' | 'in-progress' | 'done' | 'skipped';

type PlanStep = {
  title: string;
  description?: string;
  status: PlanStepStatus;
};

type PlanProps = {
  steps: PlanStep[];
  className?: string;
};

// --- StepStatusIcon ---

function StepStatusIcon({ status }: { status: PlanStepStatus }) {
  switch (status) {
    case 'pending':
      return <Icon as={CircleIcon} className="text-muted-foreground/40 size-4" />;
    case 'in-progress':
      return <Icon as={LoaderIcon} className="size-4 text-blue-500" />;
    case 'done':
      return <Icon as={CheckCircleIcon} className="size-4 text-green-500" />;
    case 'skipped':
      return <Icon as={SkipForwardIcon} className="text-muted-foreground size-4" />;
  }
}

// --- Plan ---

const Plan = React.memo(function Plan({ steps, className }: PlanProps) {
  const completedCount = steps.filter(
    (s) => s.status === 'done' || s.status === 'skipped'
  ).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <View className={cn('gap-3', className)}>
      {/* Progress bar */}
      <View className="gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-sm font-medium">Plan</Text>
          <Text className="text-muted-foreground text-xs">
            {completedCount}/{steps.length} steps
          </Text>
        </View>
        <Progress.Root
          value={progressPercent}
          className="bg-secondary h-2 overflow-hidden rounded-full"
        >
          <Progress.Indicator
            className="bg-primary h-full rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </Progress.Root>
      </View>

      {/* Steps */}
      <View className="gap-1">
        {steps.map((step, index) => (
          <View key={index} className="flex-row items-start gap-3 py-1.5">
            <View className="mt-0.5">
              <StepStatusIcon status={step.status} />
            </View>
            <View className="flex-1 gap-0.5">
              <Text
                className={cn(
                  'text-sm',
                  step.status === 'done' && 'text-muted-foreground line-through',
                  step.status === 'skipped' && 'text-muted-foreground line-through',
                  step.status === 'in-progress' && 'text-foreground font-medium',
                  step.status === 'pending' && 'text-foreground'
                )}
              >
                {step.title}
              </Text>
              {step.description && (
                <Text className="text-muted-foreground text-xs">{step.description}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

Plan.displayName = 'Plan';

export { Plan };
export type { PlanProps, PlanStep, PlanStepStatus };
