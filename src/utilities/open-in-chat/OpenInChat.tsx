import * as React from 'react';
import { Text, Linking, type ViewProps, type PressableProps } from 'react-native';

import { cn } from '../../utils/cn';
import { Button } from '../../primitives/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../../primitives/DropdownMenu';

/* -------------------------------- Providers ------------------------------- */

const providers = {
  chatgpt: {
    createUrl: (prompt: string) =>
      `https://chatgpt.com/?${new URLSearchParams({ hints: 'search', prompt })}`,
    title: 'Open in ChatGPT',
  },
  claude: {
    createUrl: (q: string) =>
      `https://claude.ai/new?${new URLSearchParams({ q })}`,
    title: 'Open in Claude',
  },
  cursor: {
    createUrl: (text: string) => {
      const url = new URL('https://cursor.com/link/prompt');
      url.searchParams.set('text', text);
      return url.toString();
    },
    title: 'Open in Cursor',
  },
  github: {
    createUrl: (url: string) => url,
    title: 'Open in GitHub',
  },
  scira: {
    createUrl: (q: string) =>
      `https://scira.ai/?${new URLSearchParams({ q })}`,
    title: 'Open in Scira',
  },
  t3: {
    createUrl: (q: string) =>
      `https://t3.chat/new?${new URLSearchParams({ q })}`,
    title: 'Open in T3 Chat',
  },
  v0: {
    createUrl: (q: string) =>
      `https://v0.app?${new URLSearchParams({ q })}`,
    title: 'Open in v0',
  },
} as const;

type ProviderKey = keyof typeof providers;

/* --------------------------------- Context -------------------------------- */

type OpenInContextValue = { query: string };

const OpenInContext = React.createContext<OpenInContextValue | undefined>(undefined);

function useOpenInContext(): OpenInContextValue {
  const context = React.useContext(OpenInContext);
  if (!context) {
    throw new Error('OpenIn components must be used within an OpenIn provider');
  }
  return context;
}

/* ---------------------------------- Root ---------------------------------- */

type OpenInProps = {
  query: string;
  children: React.ReactNode;
};

function OpenIn({ query, children }: OpenInProps) {
  const contextValue = React.useMemo(() => ({ query }), [query]);

  return (
    <OpenInContext.Provider value={contextValue}>
      <DropdownMenu>{children}</DropdownMenu>
    </OpenInContext.Provider>
  );
}

/* --------------------------------- Trigger -------------------------------- */

type OpenInTriggerProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

function OpenInTrigger({ children, ...props }: OpenInTriggerProps) {
  return (
    <DropdownMenuTrigger {...props}>
      {children ?? (
        <Button variant="outline">
          <Text className="text-sm text-foreground">Open in chat</Text>
        </Button>
      )}
    </DropdownMenuTrigger>
  );
}

/* --------------------------------- Content -------------------------------- */

type OpenInContentProps = ViewProps & {
  className?: string;
};

function OpenInContent({ className, ...props }: OpenInContentProps) {
  return <DropdownMenuContent className={cn('w-60', className)} {...props} />;
}

/* ---------------------------------- Item ---------------------------------- */

type OpenInItemProps = PressableProps & {
  className?: string;
  children?: React.ReactNode;
};

function OpenInItem(props: OpenInItemProps) {
  return <DropdownMenuItem {...props} />;
}

/* --------------------------------- Label ---------------------------------- */

type OpenInLabelProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function OpenInLabel(props: OpenInLabelProps) {
  return <DropdownMenuLabel {...props} />;
}

/* ------------------------------- Separator -------------------------------- */

type OpenInSeparatorProps = ViewProps & {
  className?: string;
};

function OpenInSeparator(props: OpenInSeparatorProps) {
  return <DropdownMenuSeparator {...props} />;
}

/* ----------------------------- Provider Items ----------------------------- */

type ProviderItemProps = PressableProps & {
  className?: string;
};

function openProviderUrl(provider: ProviderKey, query: string) {
  const url = providers[provider].createUrl(query);
  Linking.openURL(url);
}

function OpenInChatGPT(props: ProviderItemProps) {
  const { query } = useOpenInContext();
  return (
    <DropdownMenuItem
      label={providers.chatgpt.title}
      onPress={() => openProviderUrl('chatgpt', query)}
      {...props}
    />
  );
}

function OpenInClaude(props: ProviderItemProps) {
  const { query } = useOpenInContext();
  return (
    <DropdownMenuItem
      label={providers.claude.title}
      onPress={() => openProviderUrl('claude', query)}
      {...props}
    />
  );
}

function OpenInCursor(props: ProviderItemProps) {
  const { query } = useOpenInContext();
  return (
    <DropdownMenuItem
      label={providers.cursor.title}
      onPress={() => openProviderUrl('cursor', query)}
      {...props}
    />
  );
}

function OpenInGitHub(props: ProviderItemProps) {
  const { query } = useOpenInContext();
  return (
    <DropdownMenuItem
      label={providers.github.title}
      onPress={() => openProviderUrl('github', query)}
      {...props}
    />
  );
}

function OpenInScira(props: ProviderItemProps) {
  const { query } = useOpenInContext();
  return (
    <DropdownMenuItem
      label={providers.scira.title}
      onPress={() => openProviderUrl('scira', query)}
      {...props}
    />
  );
}

function OpenInT3(props: ProviderItemProps) {
  const { query } = useOpenInContext();
  return (
    <DropdownMenuItem
      label={providers.t3.title}
      onPress={() => openProviderUrl('t3', query)}
      {...props}
    />
  );
}

function OpenInV0(props: ProviderItemProps) {
  const { query } = useOpenInContext();
  return (
    <DropdownMenuItem
      label={providers.v0.title}
      onPress={() => openProviderUrl('v0', query)}
      {...props}
    />
  );
}

export {
  OpenIn,
  OpenInTrigger,
  OpenInContent,
  OpenInItem,
  OpenInLabel,
  OpenInSeparator,
  OpenInChatGPT,
  OpenInClaude,
  OpenInCursor,
  OpenInGitHub,
  OpenInScira,
  OpenInT3,
  OpenInV0,
  providers as openInProviders,
  type OpenInProps,
  type OpenInTriggerProps,
  type OpenInContentProps,
  type OpenInItemProps,
  type OpenInLabelProps,
  type OpenInSeparatorProps,
  type ProviderItemProps as OpenInProviderItemProps,
  type ProviderKey as OpenInProviderKey,
};
