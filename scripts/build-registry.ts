import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const REGISTRY_BASE_URL =
  process.env.REGISTRY_BASE_URL ??
  "https://raw.githubusercontent.com/muratcakmak/expo-ai-elements/main/public/r";
const RNR_BASE_URL = "https://reactnativereusables.com/r/uniwind";

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "public", "r");
const COMPONENTS_DIR = path.join(ROOT, "components", "ai");
const LIB_DIR = path.join(ROOT, "lib");

const EXCLUDED_SLUGS = new Set(["streaming-latex"]);

// Slug → filename overrides (where slug doesn't match the file name)
const SLUG_TO_FILE: Record<string, string> = {
  "message-response": "message-content.tsx",
};

const BUILTIN_MODULES = new Set([
  "react",
  "react-native",
  "react/jsx-runtime",
]);

// ---------------------------------------------------------------------------
// Registry metadata (inline to avoid needing tsconfig path aliases at runtime)
// ---------------------------------------------------------------------------

type ComponentEntry = {
  name: string;
  slug: string;
  description: string;
  category: string;
};

const COMPONENT_REGISTRY: ComponentEntry[] = [
  { name: "Conversation", slug: "conversation", description: "Scrollable chat container with auto-scroll and keyboard avoidance.", category: "Chatbot" },
  { name: "Message", slug: "message", description: "Role-based message bubbles for user, assistant, and system messages.", category: "Chatbot" },
  { name: "MessageResponse", slug: "message-response", description: "Streaming markdown renderer for assistant messages.", category: "Chatbot" },
  { name: "Suggestion", slug: "suggestion", description: "Tappable suggestion chips in a horizontal scroll.", category: "Chatbot" },
  { name: "Streaming LaTeX", slug: "streaming-latex", description: "Chat demo with LaTeX math formulas streamed in real-time.", category: "Chatbot" },
  { name: "Checkpoint", slug: "checkpoint", description: "Visual divider marking conversation checkpoints.", category: "Chatbot" },
  { name: "Citation", slug: "citation", description: "Inline citation references and source list.", category: "Chatbot" },
  { name: "CodeBlock", slug: "code-block", description: "Syntax-highlighted code display with copy button.", category: "Code" },
  { name: "Terminal", slug: "terminal", description: "Monospace terminal output display.", category: "Code" },
  { name: "StackTrace", slug: "stack-trace", description: "Collapsible error stack trace display.", category: "Code" },
  { name: "TestResults", slug: "test-results", description: "Pass/fail test result display with details.", category: "Code" },
  { name: "SchemaDisplay", slug: "schema-display", description: "Interactive JSON/schema viewer with syntax coloring.", category: "Code" },
  { name: "Reasoning", slug: "reasoning", description: "Expandable AI thinking/reasoning section with shimmer.", category: "Reasoning" },
  { name: "ChainOfThought", slug: "chain-of-thought", description: "Step-by-step thought process visualization.", category: "Reasoning" },
  { name: "Tool", slug: "tool", description: "Tool call visualization with args and results.", category: "Reasoning" },
  { name: "Plan", slug: "plan", description: "Agent plan display with ordered steps and progress.", category: "Reasoning" },
  { name: "Task", slug: "task", description: "Individual task card with status tracking.", category: "Reasoning" },
  { name: "Agent", slug: "agent", description: "Agent execution status display with animations.", category: "Reasoning" },
  { name: "Artifact", slug: "artifact", description: "Tabbed container for AI-generated content.", category: "Content" },
  { name: "FileTree", slug: "file-tree", description: "Recursive file/folder tree with expand/collapse.", category: "Content" },
  { name: "WebPreview", slug: "web-preview", description: "WebView wrapper for previewing web content.", category: "Content" },
  { name: "Attachments", slug: "attachments", description: "File attachment display with previews.", category: "Content" },
  { name: "PromptInput", slug: "prompt-input", description: "Rich chat input with send/stop buttons.", category: "Input" },
  { name: "SpeechInput", slug: "speech-input", description: "Speech-to-text mic button with recording animation.", category: "Input" },
  { name: "OpenInChat", slug: "open-in-chat", description: "Deep link buttons to external AI apps.", category: "Input" },
  { name: "Shimmer", slug: "shimmer", description: "Animated loading indicator for streaming states.", category: "Utilities" },
];

// ---------------------------------------------------------------------------
// Import parser
// ---------------------------------------------------------------------------

type ParsedImports = {
  npmDeps: Set<string>;
  uiDeps: Set<string>; // e.g. "button", "text"
  aiDeps: Set<string>; // e.g. "shimmer"
  libFiles: Set<string>; // e.g. "utils", "fonts"
};

// Matches single-line and multi-line import statements.
// Uses [\s\S] to match across newlines for destructured imports.
const IMPORT_RE =
  /import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;

function extractPackageName(specifier: string): string {
  // Scoped: @scope/package/sub → @scope/package
  if (specifier.startsWith("@")) {
    const parts = specifier.split("/");
    return parts.slice(0, 2).join("/");
  }
  // Unscoped: package/sub → package
  return specifier.split("/")[0];
}

function parseImports(source: string): ParsedImports {
  const result: ParsedImports = {
    npmDeps: new Set(),
    uiDeps: new Set(),
    aiDeps: new Set(),
    libFiles: new Set(),
  };

  for (const match of source.matchAll(IMPORT_RE)) {
    const specifier = match[1];

    if (specifier.startsWith("@/components/ui/")) {
      const name = specifier.replace("@/components/ui/", "");
      result.uiDeps.add(name);
    } else if (specifier.startsWith("@/components/ai/")) {
      const name = specifier.replace("@/components/ai/", "");
      result.aiDeps.add(name);
    } else if (specifier.startsWith("@/lib/")) {
      const name = specifier.replace("@/lib/", "");
      result.libFiles.add(name);
    } else if (!BUILTIN_MODULES.has(specifier) && !specifier.startsWith("@/")) {
      result.npmDeps.add(extractPackageName(specifier));
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------

function resolveComponentFile(slug: string): string {
  const filename = SLUG_TO_FILE[slug] ?? `${slug}.tsx`;
  return path.join(COMPONENTS_DIR, filename);
}

function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

// ---------------------------------------------------------------------------
// Build registry items
// ---------------------------------------------------------------------------

type RegistryFile = {
  path: string;
  type: string;
  target: string;
  content: string;
};

type RegistryItem = {
  $schema: string;
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
};

// Pre-read and parse lib files
const libCache = new Map<string, { content: string; npmDeps: Set<string> }>();

function getLibFile(name: string): { content: string; npmDeps: Set<string> } {
  if (libCache.has(name)) return libCache.get(name)!;

  const filePath = path.join(LIB_DIR, `${name}.ts`);
  const content = readFileContent(filePath);
  const parsed = parseImports(content);

  const entry = { content, npmDeps: parsed.npmDeps };
  libCache.set(name, entry);
  return entry;
}

function buildRegistryItem(entry: ComponentEntry): RegistryItem {
  const filePath = resolveComponentFile(entry.slug);
  const source = readFileContent(filePath);
  const imports = parseImports(source);

  // Collect all npm dependencies (component + lib files)
  const allDeps = new Set(imports.npmDeps);

  // Build files array
  const componentRelPath = `components/ai/${path.basename(filePath)}`;
  const files: RegistryFile[] = [
    {
      path: componentRelPath,
      type: "registry:component",
      target: componentRelPath,
      content: source,
    },
  ];

  // Add lib files
  for (const libName of imports.libFiles) {
    const lib = getLibFile(libName);
    files.push({
      path: `lib/${libName}.ts`,
      type: "registry:lib",
      target: `lib/${libName}.ts`,
      content: lib.content,
    });
    for (const dep of lib.npmDeps) {
      allDeps.add(dep);
    }
  }

  // Build registryDependencies
  const registryDeps: string[] = [];

  for (const uiName of imports.uiDeps) {
    registryDeps.push(`${RNR_BASE_URL}/${uiName}.json`);
  }
  for (const aiName of imports.aiDeps) {
    registryDeps.push(`${REGISTRY_BASE_URL}/${aiName}.json`);
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: entry.slug,
    type: "registry:ui",
    title: entry.name,
    description: entry.description,
    dependencies: [...allDeps].sort(),
    registryDependencies: registryDeps.sort(),
    files,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const components = COMPONENT_REGISTRY.filter(
    (c) => !EXCLUDED_SLUGS.has(c.slug)
  );

  const registryItems: RegistryItem[] = [];

  for (const entry of components) {
    const item = buildRegistryItem(entry);
    registryItems.push(item);

    const outPath = path.join(OUTPUT_DIR, `${entry.slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(item, null, 2) + "\n");
  }

  // Build master registry.json (lightweight — no file content)
  const masterItems = registryItems.map((item) => ({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
  }));

  const masterRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "expo-ai-elements",
    homepage: "https://github.com/muratcakmak/expo-ai-elements",
    items: masterItems,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "registry.json"),
    JSON.stringify(masterRegistry, null, 2) + "\n"
  );

  // Print summary
  console.log(`Built ${registryItems.length} registry items → public/r/`);
  for (const item of registryItems) {
    console.log(
      `  ${item.name}.json (${item.dependencies.length} deps, ${item.registryDependencies.length} registry deps, ${item.files.length} files)`
    );
  }
  console.log(`  registry.json (master index)`);
}

main();
