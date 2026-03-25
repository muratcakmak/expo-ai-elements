import * as React from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '../utils/cn';

/* --------------------------------- Progress -------------------------------- */

type ProgressProps = ViewProps & {
  className?: string;
  /** Progress value between 0 and 100 */
  value?: number;
};

function Progress({ value = 0, className, ...props }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <View
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
      {...props}
    >
      <View
        style={{ width: `${clampedValue}%` }}
        className="h-full rounded-full bg-primary"
      />
    </View>
  );
}

export { Progress };
