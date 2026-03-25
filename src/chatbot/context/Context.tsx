import React, { createContext, useContext, useMemo } from 'react';
import { View, Text, type ViewProps } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { LanguageModelUsage } from 'ai';
import { getUsage } from 'tokenlens';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '../../primitives/HoverCard';
import { Progress } from '../../primitives/Progress';

/* ------------------------------- Constants ------------------------------- */

const PERCENT_MAX = 100;
const ICON_RADIUS = 10;
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_STROKE_WIDTH = 2;
const ICON_SIZE = 20;

/* --------------------------------- Types --------------------------------- */

type ModelId = string;

interface ContextSchema {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: ModelId;
}

/* -------------------------------- Context -------------------------------- */

const ContextContext = createContext<ContextSchema | null>(null);

const useContextValue = () => {
  const context = useContext(ContextContext);

  if (!context) {
    throw new Error('Context components must be used within Context');
  }

  return context;
};

/* -------------------------------- Root ----------------------------------- */

export type ContextProps = {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
} & ContextSchema;

export const Context = ({
  usedTokens,
  maxTokens,
  usage,
  modelId,
  children,
  ...props
}: ContextProps) => {
  const contextValue = useMemo(
    () => ({ maxTokens, modelId, usage, usedTokens }),
    [maxTokens, modelId, usage, usedTokens],
  );

  return (
    <ContextContext.Provider value={contextValue}>
      <HoverCard closeDelay={0} openDelay={0} {...props}>
        {children}
      </HoverCard>
    </ContextContext.Provider>
  );
};

/* ------------------------------ ContextIcon ------------------------------ */

const ContextIcon = () => {
  const { usedTokens, maxTokens } = useContextValue();
  const circumference = 2 * Math.PI * ICON_RADIUS;
  const usedPercent = usedTokens / maxTokens;
  const dashOffset = circumference * (1 - usedPercent);

  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      accessibilityLabel="Model context usage"
      accessibilityRole="image"
    >
      <Circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        r={ICON_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
        opacity={0.25}
      />
      <Circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        r={ICON_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        opacity={0.7}
        rotation={-90}
        origin={`${ICON_CENTER}, ${ICON_CENTER}`}
      />
    </Svg>
  );
};

/* ----------------------------- ContextTrigger ----------------------------- */

export type ContextTriggerProps = ButtonProps;

export const ContextTrigger = ({
  children,
  ...props
}: ContextTriggerProps) => {
  const { usedTokens, maxTokens } = useContextValue();
  const usedPercent = usedTokens / maxTokens;
  const renderedPercent = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    style: 'percent',
  }).format(usedPercent);

  return (
    <HoverCardTrigger>
      {children ?? (
        <Button variant="ghost" {...props}>
          <Text className="font-medium text-muted-foreground">
            {renderedPercent}
          </Text>
          <ContextIcon />
        </Button>
      )}
    </HoverCardTrigger>
  );
};

/* ----------------------------- ContextContent ----------------------------- */

export type ContextContentProps = ViewProps & {
  className?: string;
};

export const ContextContent = ({
  className,
  ...props
}: ContextContentProps) => (
  <HoverCardContent
    className={cn('min-w-[240px] overflow-hidden p-0', className)}
    {...props}
  />
);

/* ----------------------- ContextContentHeader ---------------------------- */

export type ContextContentHeaderProps = ViewProps & {
  className?: string;
};

export const ContextContentHeader = ({
  children,
  className,
  ...props
}: ContextContentHeaderProps) => {
  const { usedTokens, maxTokens } = useContextValue();
  const usedPercent = usedTokens / maxTokens;
  const displayPct = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    style: 'percent',
  }).format(usedPercent);
  const used = new Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(usedTokens);
  const total = new Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(maxTokens);

  return (
    <View className={cn('w-full gap-2 p-3', className)} {...props}>
      {children ?? (
        <>
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-xs text-foreground">{displayPct}</Text>
            <Text className="font-mono text-xs text-muted-foreground">
              {used} / {total}
            </Text>
          </View>
          <Progress value={usedPercent * PERCENT_MAX} className="bg-muted" />
        </>
      )}
    </View>
  );
};

/* ----------------------- ContextContentBody ------------------------------ */

export type ContextContentBodyProps = ViewProps & {
  className?: string;
};

export const ContextContentBody = ({
  children,
  className,
  ...props
}: ContextContentBodyProps) => (
  <View className={cn('w-full p-3', className)} {...props}>
    {children}
  </View>
);

/* ---------------------- ContextContentFooter ------------------------------ */

export type ContextContentFooterProps = ViewProps & {
  className?: string;
};

export const ContextContentFooter = ({
  children,
  className,
  ...props
}: ContextContentFooterProps) => {
  const { modelId, usage } = useContextValue();
  const costUSD = modelId
    ? getUsage({
        modelId,
        usage: {
          input: usage?.inputTokens ?? 0,
          output: usage?.outputTokens ?? 0,
        },
      }).costUSD?.totalUSD
    : undefined;
  const totalCost = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(costUSD ?? 0);

  return (
    <View
      className={cn(
        'flex-row w-full items-center justify-between gap-3 bg-secondary p-3',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <Text className="text-xs text-muted-foreground">Total cost</Text>
          <Text className="text-xs text-foreground">{totalCost}</Text>
        </>
      )}
    </View>
  );
};

/* ----------------------------- TokensWithCost ----------------------------- */

const TokensWithCost = ({
  tokens,
  costText,
}: {
  tokens?: number;
  costText?: string;
}) => (
  <View className="flex-row items-center">
    <Text className="text-xs text-foreground">
      {tokens === undefined
        ? '\u2014'
        : new Intl.NumberFormat('en-US', {
            notation: 'compact',
          }).format(tokens)}
    </Text>
    {costText ? (
      <Text className="ml-2 text-xs text-muted-foreground">{'\u2022'} {costText}</Text>
    ) : null}
  </View>
);

/* --------------------------- ContextInputUsage --------------------------- */

export type ContextInputUsageProps = ViewProps & {
  className?: string;
};

export const ContextInputUsage = ({
  className,
  children,
  ...props
}: ContextInputUsageProps) => {
  const { usage, modelId } = useContextValue();
  const inputTokens = usage?.inputTokens ?? 0;

  if (children) {
    return <>{children}</>;
  }

  if (!inputTokens) {
    return null;
  }

  const inputCost = modelId
    ? getUsage({
        modelId,
        usage: { input: inputTokens, output: 0 },
      }).costUSD?.totalUSD
    : undefined;
  const inputCostText = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(inputCost ?? 0);

  return (
    <View
      className={cn('flex-row items-center justify-between', className)}
      {...props}
    >
      <Text className="text-xs text-muted-foreground">Input</Text>
      <TokensWithCost costText={inputCostText} tokens={inputTokens} />
    </View>
  );
};

/* -------------------------- ContextOutputUsage --------------------------- */

export type ContextOutputUsageProps = ViewProps & {
  className?: string;
};

export const ContextOutputUsage = ({
  className,
  children,
  ...props
}: ContextOutputUsageProps) => {
  const { usage, modelId } = useContextValue();
  const outputTokens = usage?.outputTokens ?? 0;

  if (children) {
    return <>{children}</>;
  }

  if (!outputTokens) {
    return null;
  }

  const outputCost = modelId
    ? getUsage({
        modelId,
        usage: { input: 0, output: outputTokens },
      }).costUSD?.totalUSD
    : undefined;
  const outputCostText = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(outputCost ?? 0);

  return (
    <View
      className={cn('flex-row items-center justify-between', className)}
      {...props}
    >
      <Text className="text-xs text-muted-foreground">Output</Text>
      <TokensWithCost costText={outputCostText} tokens={outputTokens} />
    </View>
  );
};

/* ------------------------ ContextReasoningUsage -------------------------- */

export type ContextReasoningUsageProps = ViewProps & {
  className?: string;
};

export const ContextReasoningUsage = ({
  className,
  children,
  ...props
}: ContextReasoningUsageProps) => {
  const { usage, modelId } = useContextValue();
  const reasoningTokens = usage?.reasoningTokens ?? 0;

  if (children) {
    return <>{children}</>;
  }

  if (!reasoningTokens) {
    return null;
  }

  const reasoningCost = modelId
    ? getUsage({
        modelId,
        usage: { reasoningTokens },
      }).costUSD?.totalUSD
    : undefined;
  const reasoningCostText = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(reasoningCost ?? 0);

  return (
    <View
      className={cn('flex-row items-center justify-between', className)}
      {...props}
    >
      <Text className="text-xs text-muted-foreground">Reasoning</Text>
      <TokensWithCost costText={reasoningCostText} tokens={reasoningTokens} />
    </View>
  );
};

/* -------------------------- ContextCacheUsage ----------------------------- */

export type ContextCacheUsageProps = ViewProps & {
  className?: string;
};

export const ContextCacheUsage = ({
  className,
  children,
  ...props
}: ContextCacheUsageProps) => {
  const { usage, modelId } = useContextValue();
  const cacheTokens = usage?.cachedInputTokens ?? 0;

  if (children) {
    return <>{children}</>;
  }

  if (!cacheTokens) {
    return null;
  }

  const cacheCost = modelId
    ? getUsage({
        modelId,
        usage: { cacheReads: cacheTokens, input: 0, output: 0 },
      }).costUSD?.totalUSD
    : undefined;
  const cacheCostText = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(cacheCost ?? 0);

  return (
    <View
      className={cn('flex-row items-center justify-between', className)}
      {...props}
    >
      <Text className="text-xs text-muted-foreground">Cache</Text>
      <TokensWithCost costText={cacheCostText} tokens={cacheTokens} />
    </View>
  );
};
