/**
 * Primitives barrel export.
 * All primitive UI components used across the library.
 */

// Re-exported so consumers can wrap their app root without importing
// @gorhom/bottom-sheet directly (required host for the modal-based primitives:
// Select, Drawer, DropdownMenu).
export { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';

export { Badge, badgeVariants, badgeTextVariants, type BadgeProps } from './Badge';

export { Button, type ButtonProps } from './Button';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './Card';

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  useCollapsible,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  type CollapsibleContentProps,
} from './Collapsible';

export {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
} from './Command';

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './Dialog';

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from './Drawer';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from './DropdownMenu';

export { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard';

export {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
  type InputGroupProps,
  type InputGroupTextareaProps,
  type InputGroupAddonProps,
  type InputGroupButtonProps,
} from './InputGroup';

export { Progress } from './Progress';

export { ScrollArea } from './ScrollArea';

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  useSelect,
  type SelectProps,
  type SelectTriggerProps,
  type SelectContentProps,
  type SelectItemProps,
  type SelectValueProps,
} from './Select';

export { Separator, type SeparatorProps } from './Separator';

export { Spinner } from './Spinner';

export { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip';
