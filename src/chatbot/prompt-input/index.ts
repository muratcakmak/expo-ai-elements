// PromptInput core — contexts, hooks, types, main component
export {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputProvider,
  PromptInputTools,
  LocalReferencedSourcesContext,
  matchesAccept,
  usePromptInputAttachments,
  usePromptInputController,
  usePromptInputReferencedSources,
  usePromptInputSubmit,
  useProviderAttachments,
} from './PromptInput';
export type {
  AttachmentsContext,
  NativeFile,
  PromptInputBodyProps,
  PromptInputControllerProps,
  PromptInputFooterProps,
  PromptInputHeaderProps,
  PromptInputMessage,
  PromptInputProps,
  PromptInputProviderProps,
  PromptInputToolsProps,
  ReferencedSourcesContext,
  TextInputContext,
} from './PromptInput';

// PromptInputTextarea
export { PromptInputTextarea } from './PromptInputTextarea';
export type { PromptInputTextareaProps } from './PromptInputTextarea';

// PromptInputSubmit
export { PromptInputSubmit } from './PromptInputSubmit';
export type { PromptInputSubmitProps } from './PromptInputSubmit';

// PromptInputAttachments
export {
  PromptInputAttachments,
  pickDocuments,
  pickImages,
  validateFiles,
} from './PromptInputAttachments';
export type { PromptInputAttachmentsProps } from './PromptInputAttachments';

// PromptInputActionMenu
export {
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
} from './PromptInputActionMenu';
export type {
  PromptInputActionMenuProps,
  PromptInputActionMenuTriggerProps,
  PromptInputActionMenuContentProps,
  PromptInputActionMenuItemProps,
  PromptInputActionAddAttachmentsProps,
  PromptInputActionAddScreenshotProps,
} from './PromptInputActionMenu';

// PromptInputSelect
export {
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectValue,
} from './PromptInputSelect';
export type {
  PromptInputSelectProps,
  PromptInputSelectTriggerProps,
  PromptInputSelectContentProps,
  PromptInputSelectItemProps,
  PromptInputSelectValueProps,
} from './PromptInputSelect';

// PromptInputCommand
export {
  PromptInputCommand,
  PromptInputCommandInput,
  PromptInputCommandList,
  PromptInputCommandEmpty,
  PromptInputCommandGroup,
  PromptInputCommandItem,
  PromptInputCommandSeparator,
} from './PromptInputCommand';
export type {
  PromptInputCommandProps,
  PromptInputCommandInputProps,
  PromptInputCommandListProps,
  PromptInputCommandEmptyProps,
  PromptInputCommandGroupProps,
  PromptInputCommandItemProps,
  PromptInputCommandSeparatorProps,
} from './PromptInputCommand';

// PromptInputHoverCard
export {
  PromptInputHoverCard,
  PromptInputHoverCardTrigger,
  PromptInputHoverCardContent,
} from './PromptInputHoverCard';
export type {
  PromptInputHoverCardProps,
  PromptInputHoverCardTriggerProps,
  PromptInputHoverCardContentProps,
} from './PromptInputHoverCard';

// PromptInputTabs
export {
  PromptInputTabsList,
  PromptInputTab,
  PromptInputTabLabel,
  PromptInputTabBody,
  PromptInputTabItem,
} from './PromptInputTabs';
export type {
  PromptInputTabsListProps,
  PromptInputTabProps,
  PromptInputTabLabelProps,
  PromptInputTabBodyProps,
  PromptInputTabItemProps,
} from './PromptInputTabs';
