import type { ComponentProps } from 'react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../primitives/HoverCard';
import { cn } from '../../utils/cn';

// ============================================================================
// PromptInputHoverCard — wraps HoverCard primitive
// ============================================================================

export type PromptInputHoverCardProps = ComponentProps<typeof HoverCard>;

export const PromptInputHoverCard = ({
  openDelay = 0,
  closeDelay = 0,
  ...props
}: PromptInputHoverCardProps) => (
  <HoverCard closeDelay={closeDelay} openDelay={openDelay} {...props} />
);

// ============================================================================
// PromptInputHoverCardTrigger
// ============================================================================

export type PromptInputHoverCardTriggerProps = ComponentProps<
  typeof HoverCardTrigger
>;

export const PromptInputHoverCardTrigger = (
  props: PromptInputHoverCardTriggerProps,
) => <HoverCardTrigger {...props} />;

// ============================================================================
// PromptInputHoverCardContent
// ============================================================================

export type PromptInputHoverCardContentProps = ComponentProps<
  typeof HoverCardContent
>;

export const PromptInputHoverCardContent = ({
  className,
  ...props
}: PromptInputHoverCardContentProps) => (
  <HoverCardContent className={cn(className)} {...props} />
);
