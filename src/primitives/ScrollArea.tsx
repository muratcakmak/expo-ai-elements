import * as React from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

import { cn } from '../utils/cn';

/* -------------------------------- ScrollArea -------------------------------- */

type ScrollAreaProps = ScrollViewProps & {
  className?: string;
  horizontal?: boolean;
};

function ScrollArea({ children, className, horizontal = false, ...props }: ScrollAreaProps) {
  return (
    <ScrollView
      className={cn('relative', className)}
      horizontal={horizontal}
      showsVerticalScrollIndicator={!horizontal}
      showsHorizontalScrollIndicator={horizontal}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export { ScrollArea };
