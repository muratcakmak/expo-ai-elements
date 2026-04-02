export type ComponentCategory =
  | 'Chatbot'
  | 'Code'
  | 'Reasoning'
  | 'Content'
  | 'Input'
  | 'Utilities';

export type ComponentEntry = {
  name: string;
  slug: string;
  description: string;
  category: ComponentCategory;
};

export const COMPONENT_REGISTRY: ComponentEntry[] = [
  // --- Chatbot ---
  {
    name: 'Conversation',
    slug: 'conversation',
    description: 'Scrollable chat container with auto-scroll and keyboard avoidance.',
    category: 'Chatbot',
  },
  {
    name: 'Message',
    slug: 'message',
    description: 'Role-based message bubbles for user, assistant, and system messages.',
    category: 'Chatbot',
  },
  {
    name: 'MessageResponse',
    slug: 'message-response',
    description: 'Streaming markdown renderer for assistant messages.',
    category: 'Chatbot',
  },
  {
    name: 'Suggestion',
    slug: 'suggestion',
    description: 'Tappable suggestion chips in a horizontal scroll.',
    category: 'Chatbot',
  },
  {
    name: 'Streaming LaTeX',
    slug: 'streaming-latex',
    description: 'Chat demo with LaTeX math formulas streamed in real-time.',
    category: 'Chatbot',
  },
  {
    name: 'Checkpoint',
    slug: 'checkpoint',
    description: 'Visual divider marking conversation checkpoints.',
    category: 'Chatbot',
  },
  {
    name: 'Citation',
    slug: 'citation',
    description: 'Inline citation references and source list.',
    category: 'Chatbot',
  },

  // --- Code ---
  {
    name: 'CodeBlock',
    slug: 'code-block',
    description: 'Syntax-highlighted code display with copy button.',
    category: 'Code',
  },
  {
    name: 'Terminal',
    slug: 'terminal',
    description: 'Monospace terminal output display.',
    category: 'Code',
  },
  {
    name: 'StackTrace',
    slug: 'stack-trace',
    description: 'Collapsible error stack trace display.',
    category: 'Code',
  },
  {
    name: 'TestResults',
    slug: 'test-results',
    description: 'Pass/fail test result display with details.',
    category: 'Code',
  },
  {
    name: 'SchemaDisplay',
    slug: 'schema-display',
    description: 'Interactive JSON/schema viewer with syntax coloring.',
    category: 'Code',
  },

  // --- Reasoning ---
  {
    name: 'Reasoning',
    slug: 'reasoning',
    description: 'Expandable AI thinking/reasoning section with shimmer.',
    category: 'Reasoning',
  },
  {
    name: 'ChainOfThought',
    slug: 'chain-of-thought',
    description: 'Step-by-step thought process visualization.',
    category: 'Reasoning',
  },
  {
    name: 'Tool',
    slug: 'tool',
    description: 'Tool call visualization with args and results.',
    category: 'Reasoning',
  },
  {
    name: 'Plan',
    slug: 'plan',
    description: 'Agent plan display with ordered steps and progress.',
    category: 'Reasoning',
  },
  {
    name: 'Task',
    slug: 'task',
    description: 'Individual task card with status tracking.',
    category: 'Reasoning',
  },
  {
    name: 'Agent',
    slug: 'agent',
    description: 'Agent execution status display with animations.',
    category: 'Reasoning',
  },

  // --- Content ---
  {
    name: 'Artifact',
    slug: 'artifact',
    description: 'Tabbed container for AI-generated content.',
    category: 'Content',
  },
  {
    name: 'FileTree',
    slug: 'file-tree',
    description: 'Recursive file/folder tree with expand/collapse.',
    category: 'Content',
  },
  {
    name: 'WebPreview',
    slug: 'web-preview',
    description: 'WebView wrapper for previewing web content.',
    category: 'Content',
  },
  {
    name: 'Attachments',
    slug: 'attachments',
    description: 'File attachment display with previews.',
    category: 'Content',
  },

  // --- Input ---
  {
    name: 'PromptInput',
    slug: 'prompt-input',
    description: 'Rich chat input with send/stop buttons.',
    category: 'Input',
  },
  {
    name: 'SpeechInput',
    slug: 'speech-input',
    description: 'Speech-to-text mic button with recording animation.',
    category: 'Input',
  },
  {
    name: 'OpenInChat',
    slug: 'open-in-chat',
    description: 'Deep link buttons to external AI apps.',
    category: 'Input',
  },

  // --- Utilities ---
  {
    name: 'Shimmer',
    slug: 'shimmer',
    description: 'Animated loading indicator for streaming states.',
    category: 'Utilities',
  },
];

export const CATEGORIES: ComponentCategory[] = [
  'Chatbot',
  'Code',
  'Reasoning',
  'Content',
  'Input',
  'Utilities',
];

export function getComponentsByCategory(category: ComponentCategory): ComponentEntry[] {
  return COMPONENT_REGISTRY.filter((c) => c.category === category);
}

export function getComponent(slug: string): ComponentEntry | undefined {
  return COMPONENT_REGISTRY.find((c) => c.slug === slug);
}
