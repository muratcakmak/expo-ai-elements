import * as React from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '../../utils/cn';

/* ---------------------------------- Types --------------------------------- */

type FlowPanelPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

type FlowPanelProps = ViewProps & {
  className?: string;
  position?: FlowPanelPosition;
};

/* ------------------------------ Position Map ------------------------------ */

const positionStyles: Record<FlowPanelPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 self-center',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 self-center',
  'bottom-right': 'bottom-4 right-4',
};

/* -------------------------------- Component ------------------------------- */

/**
 * FlowPanel — floating overlay panel for the FlowCanvas.
 * Positioned absolutely over the canvas area.
 */
function FlowPanel({ className, position = 'top-left', ...props }: FlowPanelProps) {
  return (
    <View
      className={cn(
        'absolute m-4 overflow-hidden rounded-md border border-border bg-card p-1',
        positionStyles[position],
        className,
      )}
      {...props}
    />
  );
}

export {
  FlowPanel,
  type FlowPanelProps,
  type FlowPanelPosition,
};
