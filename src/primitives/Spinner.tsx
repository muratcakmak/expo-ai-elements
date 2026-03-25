import * as React from 'react';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

import { cn } from '../utils/cn';

/* --------------------------------- Spinner --------------------------------- */

type SpinnerProps = ActivityIndicatorProps & {
  className?: string;
};

function Spinner({ className, size = 'small', color, ...props }: SpinnerProps) {
  return (
    <ActivityIndicator
      className={cn(className)}
      size={size}
      color={color}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      {...props}
    />
  );
}

export { Spinner };
