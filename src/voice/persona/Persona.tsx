import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image, View, useColorScheme, type ViewProps } from 'react-native';

import { cn } from '../../utils/cn';

/* --------------------------------- Types --------------------------------- */

export type PersonaState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'asleep';

type PersonaVariant = keyof typeof sources;

type PersonaProps = ViewProps & {
  className?: string;
  state?: PersonaState;
  variant?: PersonaVariant;
  /** Called when the Rive animation successfully loads. */
  onLoad?: () => void;
  /** Called when the Rive animation fails to load. Falls back to static image. */
  onLoadError?: (error: unknown) => void;
  /** Called when the animation is ready. */
  onReady?: () => void;
  /** Static fallback image source (local require or { uri }). */
  fallbackImage?: React.ComponentProps<typeof Image>['source'];
};

/* -------------------------------- Sources -------------------------------- */

const stateMachine = 'default';

const sources = {
  command: {
    dynamicColor: true,
    hasModel: true,
    source:
      'https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/command-2.0.riv',
  },
  glint: {
    dynamicColor: true,
    hasModel: true,
    source:
      'https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/glint-2.0.riv',
  },
  halo: {
    dynamicColor: true,
    hasModel: true,
    source:
      'https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/halo-2.0.riv',
  },
  mana: {
    dynamicColor: false,
    hasModel: true,
    source:
      'https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/mana-2.0.riv',
  },
  obsidian: {
    dynamicColor: true,
    hasModel: true,
    source:
      'https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/obsidian-2.0.riv',
  },
  opal: {
    dynamicColor: false,
    hasModel: false,
    source:
      'https://ejiidnob33g9ap1r.public.blob.vercel-storage.com/orb-1.2.riv',
  },
} as const;

/* ----------------------------- Rive helpers ------------------------------ */

/**
 * Attempt to load @rive-app/react-native at runtime.
 * Returns null if the package is not installed, allowing fallback to
 * a static image. This avoids a hard dependency on the Rive package.
 */
let riveModule: typeof import('@rive-app/react-native') | null = null;
let riveLoadAttempted = false;

function getRiveModule(): typeof import('@rive-app/react-native') | null {
  if (riveLoadAttempted) {
    return riveModule;
  }
  riveLoadAttempted = true;
  try {
    // Dynamic require so the app still works without Rive installed
    riveModule = require('@rive-app/react-native');
  } catch {
    riveModule = null;
  }
  return riveModule;
}

/* ----------------------- Rive-backed Persona ----------------------------- */

type RivePersonaProps = {
  source: (typeof sources)[PersonaVariant];
  state: PersonaState;
  className?: string;
  onLoad?: () => void;
  onLoadError?: (error: unknown) => void;
  onReady?: () => void;
};

/**
 * Inner component that renders using @rive-app/react-native.
 * Separated so that the Rive import is only evaluated when available.
 */
const RivePersona = memo(function RivePersona({
  source,
  state,
  className,
  onLoad,
  onLoadError,
  onReady,
}: RivePersonaProps) {
  const Rive = getRiveModule();
  if (!Rive) {
    return null;
  }

  const colorScheme = useColorScheme();
  const riveRef = useRef<InstanceType<typeof Rive.default> | null>(null);

  // Stabilize callbacks
  const callbacksRef = useRef({ onLoad, onLoadError, onReady });
  useEffect(() => {
    callbacksRef.current = { onLoad, onLoadError, onReady };
  }, [onLoad, onLoadError, onReady]);

  // Map state to Rive state machine inputs
  useEffect(() => {
    const ref = riveRef.current;
    if (!ref) {
      return;
    }

    try {
      ref.setInputState(stateMachine, 'listening', state === 'listening');
      ref.setInputState(stateMachine, 'thinking', state === 'thinking');
      ref.setInputState(stateMachine, 'speaking', state === 'speaking');
      ref.setInputState(stateMachine, 'asleep', state === 'asleep');
    } catch {
      // State machine inputs may not exist in all variants
    }
  }, [state]);

  // Dynamic color based on theme
  useEffect(() => {
    if (!source.dynamicColor || !riveRef.current) {
      return;
    }
    // Colors are handled through Rive view model when available
    // For basic integration, the theme affects the surrounding context
  }, [colorScheme, source.dynamicColor]);

  const handleLoad = useCallback(() => {
    callbacksRef.current.onReady?.();
    callbacksRef.current.onLoad?.();
  }, []);

  const handleError = useCallback((error: unknown) => {
    callbacksRef.current.onLoadError?.(error);
  }, []);

  const RiveComponent = Rive.default;

  return (
    <View className={cn('h-16 w-16 shrink-0', className)}>
      <RiveComponent
        ref={riveRef}
        url={source.source}
        stateMachineName={stateMachine}
        autoplay
        style={{ width: '100%', height: '100%' }}
        onPlay={handleLoad}
        onError={handleError}
      />
    </View>
  );
});

/* ----------------------------- Fallback ---------------------------------- */

type FallbackPersonaProps = {
  className?: string;
  fallbackImage?: React.ComponentProps<typeof Image>['source'];
  state: PersonaState;
};

const FallbackPersona = memo(function FallbackPersona({
  className,
  fallbackImage,
  state,
}: FallbackPersonaProps) {
  // When Rive is unavailable, show a static image with an opacity
  // change to indicate state transitions.
  const opacity = state === 'asleep' ? 0.5 : 1;

  if (!fallbackImage) {
    // Render a placeholder circle when no fallback image is provided
    return (
      <View
        className={cn(
          'h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted',
          className,
        )}
        style={{ opacity }}
        accessibilityLabel={`Persona: ${state}`}
      />
    );
  }

  return (
    <View
      className={cn('h-16 w-16 shrink-0', className)}
      style={{ opacity }}
      accessibilityLabel={`Persona: ${state}`}
    >
      <Image
        source={fallbackImage}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    </View>
  );
});

/* ----------------------------- Main Persona ------------------------------ */

const Persona = memo(function Persona({
  variant = 'obsidian',
  state = 'idle',
  className,
  onLoad,
  onLoadError,
  onReady,
  fallbackImage,
  ...props
}: PersonaProps) {
  const source = sources[variant];

  if (!source) {
    throw new Error(`Invalid Persona variant: ${variant}`);
  }

  const [useRive, setUseRive] = useState(true);

  // Check if Rive is available on mount
  useEffect(() => {
    const rive = getRiveModule();
    if (!rive) {
      setUseRive(false);
    }
  }, []);

  const handleRiveError = useCallback(
    (error: unknown) => {
      setUseRive(false);
      onLoadError?.(error);
    },
    [onLoadError],
  );

  // Strip custom props from View props
  const viewProps = { ...props } as Record<string, unknown>;
  delete viewProps.fallbackImage;

  if (useRive) {
    return (
      <RivePersona
        source={source}
        state={state}
        className={className}
        onLoad={onLoad}
        onLoadError={handleRiveError}
        onReady={onReady}
      />
    );
  }

  return (
    <FallbackPersona
      className={className}
      fallbackImage={fallbackImage}
      state={state}
    />
  );
});

Persona.displayName = 'Persona';

/* -------------------------------- Exports -------------------------------- */

export {
  Persona,
  sources as personaSources,
  type PersonaProps,
  type PersonaVariant,
};
