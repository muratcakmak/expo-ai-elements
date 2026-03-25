/**
 * Design tokens for expo-ai-elements.
 * These mirror the CSS @theme values in global.css so that
 * components can reference colours / radii / fonts in JS when
 * Tailwind class-names are not sufficient (e.g. Reanimated
 * shared values, SVG fills, etc.).
 */

// ── Colour palette ──────────────────────────────────────────

export const colors = {
  primary: '#6366f1',
  primaryForeground: '#ffffff',
  secondary: '#8b5cf6',
  secondaryForeground: '#ffffff',
  accent: '#a78bfa',
  accentForeground: '#1e1b4b',

  surface: '#f8fafc',
  surfaceAlt: '#f1f5f9',
  background: '#ffffff',
  foreground: '#0f172a',

  muted: '#94a3b8',
  mutedForeground: '#64748b',
  border: '#e2e8f0',
  ring: '#6366f1',

  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  success: '#22c55e',
  successForeground: '#ffffff',
  warning: '#f59e0b',
  warningForeground: '#1e1b4b',

  // Dark mode
  dark: {
    surface: '#0f172a',
    surfaceAlt: '#1e293b',
    background: '#020617',
    foreground: '#f8fafc',
    border: '#334155',
  },
} as const;

// ── Border radii ────────────────────────────────────────────

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ── Font families ───────────────────────────────────────────

export const fonts = {
  sans: 'Inter',
  mono: 'JetBrains Mono',
} as const;

// ── Spacing scale (multiples of 4) ─────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

// ── Convenience re-export ───────────────────────────────────

export const tokens = {
  colors,
  radii,
  fonts,
  spacing,
} as const;

export type Tokens = typeof tokens;
