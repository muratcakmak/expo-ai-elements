import type { FileUIPart, SourceDocumentUIPart } from 'ai';
import { nanoid } from 'nanoid';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, type ViewProps } from 'react-native';

import { InputGroup, InputGroupAddon } from '../../primitives/InputGroup';
import { cn } from '../../utils/cn';

// ============================================================================
// Native File Type
// ============================================================================

/**
 * Represents a file picked via expo-document-picker or expo-image-picker.
 * On native we work with URIs directly — no blob URLs or FileReader needed.
 */
export type NativeFile = {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * Checks whether a file's MIME type matches the `accept` pattern string.
 * Pattern format mirrors the HTML `<input accept>` attribute:
 *   - `"image/*"` matches any image type
 *   - `"image/png,application/pdf"` matches specific types
 */
export const matchesAccept = (
  mimeType: string,
  accept: string | undefined,
): boolean => {
  if (!accept || accept.trim() === '') {
    return true;
  }

  const patterns = accept
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return patterns.some((pattern) => {
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -1);
      return mimeType.startsWith(prefix);
    }
    return mimeType === pattern;
  });
};

// ============================================================================
// Provider Context & Types
// ============================================================================

export type AttachmentsContext = {
  files: (FileUIPart & { id: string })[];
  add: (files: NativeFile[]) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFilePicker: () => void;
};

export type TextInputContext = {
  value: string;
  setInput: (v: string) => void;
  clear: () => void;
};

export type PromptInputControllerProps = {
  textInput: TextInputContext;
  attachments: AttachmentsContext;
  /** INTERNAL: Allows PromptInput to register its "open file picker" callback */
  __registerFilePicker: (open: () => void) => void;
};

const PromptInputController = createContext<PromptInputControllerProps | null>(
  null,
);
const ProviderAttachmentsContext = createContext<AttachmentsContext | null>(
  null,
);

export const usePromptInputController = () => {
  const ctx = useContext(PromptInputController);
  if (!ctx) {
    throw new Error(
      'Wrap your component inside <PromptInputProvider> to use usePromptInputController().',
    );
  }
  return ctx;
};

const useOptionalPromptInputController = () =>
  useContext(PromptInputController);

export const useProviderAttachments = () => {
  const ctx = useContext(ProviderAttachmentsContext);
  if (!ctx) {
    throw new Error(
      'Wrap your component inside <PromptInputProvider> to use useProviderAttachments().',
    );
  }
  return ctx;
};

const useOptionalProviderAttachments = () =>
  useContext(ProviderAttachmentsContext);

// ============================================================================
// PromptInputProvider
// ============================================================================

export type PromptInputProviderProps = PropsWithChildren<{
  initialInput?: string;
}>;

/**
 * Optional global provider that lifts PromptInput state outside of PromptInput.
 * If you don't use it, PromptInput stays fully self-managed.
 */
export const PromptInputProvider = ({
  initialInput: initialTextInput = '',
  children,
}: PromptInputProviderProps) => {
  // ----- textInput state
  const [textInput, setTextInput] = useState(initialTextInput);
  const clearInput = useCallback(() => setTextInput(''), []);

  // ----- attachments state (global when wrapped)
  const [attachmentFiles, setAttachmentFiles] = useState<
    (FileUIPart & { id: string })[]
  >([]);

  const openRef = useRef<() => void>(() => {});

  const add = useCallback((files: NativeFile[]) => {
    if (files.length === 0) {
      return;
    }

    setAttachmentFiles((prev) => [
      ...prev,
      ...files.map((file) => ({
        filename: file.name,
        id: nanoid(),
        mediaType: file.mimeType,
        type: 'file' as const,
        url: file.uri,
      })),
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setAttachmentFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clear = useCallback(() => {
    setAttachmentFiles([]);
  }, []);

  const openFilePicker = useCallback(() => {
    openRef.current?.();
  }, []);

  const attachments = useMemo<AttachmentsContext>(
    () => ({
      add,
      clear,
      files: attachmentFiles,
      openFilePicker,
      remove,
    }),
    [attachmentFiles, add, remove, clear, openFilePicker],
  );

  const __registerFilePicker = useCallback((open: () => void) => {
    openRef.current = open;
  }, []);

  const controller = useMemo<PromptInputControllerProps>(
    () => ({
      __registerFilePicker,
      attachments,
      textInput: {
        clear: clearInput,
        setInput: setTextInput,
        value: textInput,
      },
    }),
    [textInput, clearInput, attachments, __registerFilePicker],
  );

  return (
    <PromptInputController.Provider value={controller}>
      <ProviderAttachmentsContext.Provider value={attachments}>
        {children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  );
};

// ============================================================================
// Component Context & Hooks
// ============================================================================

const LocalAttachmentsContext = createContext<AttachmentsContext | null>(null);

export const usePromptInputAttachments = () => {
  const provider = useOptionalProviderAttachments();
  const local = useContext(LocalAttachmentsContext);
  const context = local ?? provider;
  if (!context) {
    throw new Error(
      'usePromptInputAttachments must be used within a PromptInput or PromptInputProvider',
    );
  }
  return context;
};

// ============================================================================
// Referenced Sources (Local to PromptInput)
// ============================================================================

export type ReferencedSourcesContext = {
  sources: (SourceDocumentUIPart & { id: string })[];
  add: (sources: SourceDocumentUIPart[] | SourceDocumentUIPart) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const LocalReferencedSourcesContext =
  createContext<ReferencedSourcesContext | null>(null);

export const usePromptInputReferencedSources = () => {
  const ctx = useContext(LocalReferencedSourcesContext);
  if (!ctx) {
    throw new Error(
      'usePromptInputReferencedSources must be used within a LocalReferencedSourcesContext.Provider',
    );
  }
  return ctx;
};

// ============================================================================
// PromptInput Message Type
// ============================================================================

export type PromptInputMessage = {
  text: string;
  files: FileUIPart[];
};

// ============================================================================
// PromptInput Main Component
// ============================================================================

export type PromptInputProps = ViewProps & {
  /** Allowed MIME types, e.g. "image/*" or "image/png,application/pdf" */
  accept?: string;
  /** Allow multiple file attachments */
  multiple?: boolean;
  /** Maximum number of files */
  maxFiles?: number;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Called when a validation error occurs */
  onError?: (err: {
    code: 'max_files' | 'max_file_size' | 'accept';
    message: string;
  }) => void;
  /** Called when the user submits the prompt */
  onSubmit: (message: PromptInputMessage) => void | Promise<void>;
  children?: ReactNode;
};

export const PromptInput = ({
  className,
  accept,
  maxFiles,
  maxFileSize,
  onError,
  onSubmit,
  children,
  ...props
}: PromptInputProps) => {
  const controller = useOptionalPromptInputController();
  const usingProvider = !!controller;

  // ----- Local attachments (only used when no provider)
  const [items, setItems] = useState<(FileUIPart & { id: string })[]>([]);
  const files = usingProvider ? controller.attachments.files : items;

  // ----- Local referenced sources (always local to PromptInput)
  const [referencedSources, setReferencedSources] = useState<
    (SourceDocumentUIPart & { id: string })[]
  >([]);

  // ----- Validate and add files (local mode)
  const addLocal = useCallback(
    (incoming: NativeFile[]) => {
      if (incoming.length === 0) {
        return;
      }

      const accepted = incoming.filter((f) =>
        matchesAccept(f.mimeType, accept),
      );
      if (incoming.length > 0 && accepted.length === 0) {
        onError?.({
          code: 'accept',
          message: 'No files match the accepted types.',
        });
        return;
      }

      const withinSize = (f: NativeFile) =>
        maxFileSize && f.size ? f.size <= maxFileSize : true;
      const sized = accepted.filter(withinSize);
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: 'max_file_size',
          message: 'All files exceed the maximum size.',
        });
        return;
      }

      setItems((prev) => {
        const capacity =
          typeof maxFiles === 'number'
            ? Math.max(0, maxFiles - prev.length)
            : undefined;
        const capped =
          typeof capacity === 'number' ? sized.slice(0, capacity) : sized;
        if (typeof capacity === 'number' && sized.length > capacity) {
          onError?.({
            code: 'max_files',
            message: 'Too many files. Some were not added.',
          });
        }
        const next: (FileUIPart & { id: string })[] = [];
        for (const file of capped) {
          next.push({
            filename: file.name,
            id: nanoid(),
            mediaType: file.mimeType,
            type: 'file',
            url: file.uri,
          });
        }
        return [...prev, ...next];
      });
    },
    [accept, maxFiles, maxFileSize, onError],
  );

  const removeLocal = useCallback(
    (id: string) =>
      setItems((prev) => prev.filter((file) => file.id !== id)),
    [],
  );

  // Wrapper that validates files before calling provider's add
  const addWithProviderValidation = useCallback(
    (incoming: NativeFile[]) => {
      if (incoming.length === 0) {
        return;
      }

      const accepted = incoming.filter((f) =>
        matchesAccept(f.mimeType, accept),
      );
      if (incoming.length > 0 && accepted.length === 0) {
        onError?.({
          code: 'accept',
          message: 'No files match the accepted types.',
        });
        return;
      }

      const withinSize = (f: NativeFile) =>
        maxFileSize && f.size ? f.size <= maxFileSize : true;
      const sized = accepted.filter(withinSize);
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: 'max_file_size',
          message: 'All files exceed the maximum size.',
        });
        return;
      }

      const currentCount = files.length;
      const capacity =
        typeof maxFiles === 'number'
          ? Math.max(0, maxFiles - currentCount)
          : undefined;
      const capped =
        typeof capacity === 'number' ? sized.slice(0, capacity) : sized;
      if (typeof capacity === 'number' && sized.length > capacity) {
        onError?.({
          code: 'max_files',
          message: 'Too many files. Some were not added.',
        });
      }

      if (capped.length > 0) {
        controller?.attachments.add(capped);
      }
    },
    [accept, maxFileSize, maxFiles, onError, files.length, controller],
  );

  const clearAttachments = useCallback(
    () => (usingProvider ? controller?.attachments.clear() : setItems([])),
    [usingProvider, controller],
  );

  const clearReferencedSources = useCallback(
    () => setReferencedSources([]),
    [],
  );

  const add = usingProvider ? addWithProviderValidation : addLocal;
  const remove = usingProvider ? controller.attachments.remove : removeLocal;
  const openFilePicker = usingProvider
    ? controller.attachments.openFilePicker
    : () => {};

  const clear = useCallback(() => {
    clearAttachments();
    clearReferencedSources();
  }, [clearAttachments, clearReferencedSources]);

  // Let provider know about our file picker so external menus can trigger it
  useEffect(() => {
    if (!usingProvider) {
      return;
    }
    controller.__registerFilePicker(() => {
      // Will be overridden by PromptInputAttachments when mounted
    });
  }, [usingProvider, controller]);

  const attachmentsCtx = useMemo<AttachmentsContext>(
    () => ({
      add,
      clear: clearAttachments,
      files: files.map((item) => ({ ...item, id: item.id })),
      openFilePicker,
      remove,
    }),
    [files, add, remove, clearAttachments, openFilePicker],
  );

  const refsCtx = useMemo<ReferencedSourcesContext>(
    () => ({
      add: (incoming: SourceDocumentUIPart[] | SourceDocumentUIPart) => {
        const array = Array.isArray(incoming) ? incoming : [incoming];
        setReferencedSources((prev) => [
          ...prev,
          ...array.map((s) => ({ ...s, id: nanoid() })),
        ]);
      },
      clear: clearReferencedSources,
      remove: (id: string) => {
        setReferencedSources((prev) => prev.filter((s) => s.id !== id));
      },
      sources: referencedSources,
    }),
    [referencedSources, clearReferencedSources],
  );

  /** Exposed to children via PromptInputSubmitContext */
  const handleSubmit = useCallback(async () => {
    const text = usingProvider ? controller.textInput.value : '';

    // Files are already URIs on native — no blob conversion needed
    const convertedFiles: FileUIPart[] = files.map(
      ({ id: _id, ...item }) => item,
    );

    try {
      const result = onSubmit({ files: convertedFiles, text });

      if (result instanceof Promise) {
        await result;
        clear();
        if (usingProvider) {
          controller.textInput.clear();
        }
      } else {
        clear();
        if (usingProvider) {
          controller.textInput.clear();
        }
      }
    } catch {
      // Don't clear on error — user may want to retry
    }
  }, [usingProvider, controller, files, onSubmit, clear]);

  const inner = (
    <View className={cn('w-full', className)} {...props}>
      <InputGroup className="overflow-hidden">{children}</InputGroup>
    </View>
  );

  const withReferencedSources = (
    <LocalReferencedSourcesContext.Provider value={refsCtx}>
      <SubmitContext.Provider value={handleSubmit}>
        {inner}
      </SubmitContext.Provider>
    </LocalReferencedSourcesContext.Provider>
  );

  return (
    <LocalAttachmentsContext.Provider value={attachmentsCtx}>
      {withReferencedSources}
    </LocalAttachmentsContext.Provider>
  );
};

// ============================================================================
// Submit Context — allows textarea & submit button to trigger form submission
// ============================================================================

const SubmitContext = createContext<(() => void) | null>(null);

export const usePromptInputSubmit = () => {
  const ctx = useContext(SubmitContext);
  if (!ctx) {
    throw new Error(
      'usePromptInputSubmit must be used within a PromptInput',
    );
  }
  return ctx;
};

// ============================================================================
// PromptInputBody
// ============================================================================

export type PromptInputBodyProps = ViewProps;

export const PromptInputBody = ({
  className,
  ...props
}: PromptInputBodyProps) => <View className={cn(className)} {...props} />;

// ============================================================================
// PromptInputHeader / Footer / Tools
// ============================================================================

export type PromptInputHeaderProps = ViewProps;

export const PromptInputHeader = ({
  className,
  ...props
}: PromptInputHeaderProps) => (
  <InputGroupAddon
    align="start"
    className={cn('flex-row flex-wrap gap-1', className)}
    {...props}
  />
);

export type PromptInputFooterProps = ViewProps;

export const PromptInputFooter = ({
  className,
  ...props
}: PromptInputFooterProps) => (
  <InputGroupAddon
    align="end"
    className={cn('flex-row justify-between gap-1', className)}
    {...props}
  />
);

export type PromptInputToolsProps = ViewProps;

export const PromptInputTools = ({
  className,
  ...props
}: PromptInputToolsProps) => (
  <View
    className={cn('min-w-0 flex-row items-center gap-1', className)}
    {...props}
  />
);

// ============================================================================
// PromptInputButton
// ============================================================================

export { InputGroupButton as PromptInputButton } from '../../primitives/InputGroup';
