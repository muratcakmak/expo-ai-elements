import * as React from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '../../utils/cn';

/* ---------------------------------- Types --------------------------------- */

type FlowToolbarPosition = 'top' | 'bottom' | 'left' | 'right';

type FlowToolbarProps = ViewProps & {
  className?: string;
  position?: FlowToolbarPosition;
};

/* -------------------------------- Component ------------------------------- */

/**
 * FlowToolbar — horizontal Pressable button row that floats relative to a node.
 * In the RN bridge this is rendered as a positioned View overlay.
 */
function FlowToolbar({ className, position = 'bottom', ...props }: FlowToolbarProps) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-1 rounded-sm border border-border bg-background p-1.5',
        className,
      )}
      {...props}
    />
  );
}

export {
  FlowToolbar,
  type FlowToolbarProps,
  type FlowToolbarPosition,
};
