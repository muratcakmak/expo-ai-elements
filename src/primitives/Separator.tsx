import { View, type AccessibilityRole, type ViewProps } from 'react-native';

import { cn } from '../utils/cn';

type SeparatorProps = ViewProps & {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
};

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <View
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      // RN has no ARIA "separator" role; cast keeps the semantic hint on native.
      accessibilityRole={(decorative ? 'none' : 'separator') as AccessibilityRole}
      {...props}
    />
  );
}

export { Separator, type SeparatorProps };
