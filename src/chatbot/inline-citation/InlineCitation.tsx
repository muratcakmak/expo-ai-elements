import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  Text,
  View,
  type PressableProps,
  type ViewProps,
} from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Badge, type BadgeProps } from '../../primitives/Badge';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '../../primitives/HoverCard';

/* ======================================================================== */
/* InlineCitation                                                            */
/* ======================================================================== */

export type InlineCitationProps = ViewProps & {
  className?: string;
};

export const InlineCitation = ({
  className,
  ...props
}: InlineCitationProps) => (
  <View className={cn('flex-row items-center gap-1', className)} {...props} />
);

/* ======================================================================== */
/* InlineCitationText                                                        */
/* ======================================================================== */

export type InlineCitationTextProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export const InlineCitationText = ({
  className,
  children,
  ...props
}: InlineCitationTextProps) => (
  <View className={cn(className)} {...props}>
    {typeof children === 'string' ? (
      <Text className="text-sm text-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);

/* ======================================================================== */
/* InlineCitationCard                                                        */
/* ======================================================================== */

export type InlineCitationCardProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const InlineCitationCard = (props: InlineCitationCardProps) => (
  <HoverCard closeDelay={0} openDelay={0} {...props} />
);

/* ======================================================================== */
/* InlineCitationCardTrigger                                                 */
/* ======================================================================== */

export type InlineCitationCardTriggerProps = BadgeProps & {
  sources: string[];
};

const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

export const InlineCitationCardTrigger = ({
  sources,
  className,
  ...props
}: InlineCitationCardTriggerProps) => (
  <HoverCardTrigger>
    <Badge
      className={cn('ml-1 rounded-full', className)}
      variant="secondary"
      {...props}
    >
      <Text className="text-xs text-secondary-foreground">
        {sources[0]
          ? `${getHostname(sources[0])}${sources.length > 1 ? ` +${sources.length - 1}` : ''}`
          : 'unknown'}
      </Text>
    </Badge>
  </HoverCardTrigger>
);

/* ======================================================================== */
/* InlineCitationCardBody                                                    */
/* ======================================================================== */

export type InlineCitationCardBodyProps = ViewProps & {
  className?: string;
};

export const InlineCitationCardBody = ({
  className,
  ...props
}: InlineCitationCardBodyProps) => (
  <HoverCardContent className={cn('w-80 p-0', className)} {...props} />
);

/* ======================================================================== */
/* Carousel Context (lightweight pager state)                                */
/* ======================================================================== */

type CarouselContextValue = {
  current: number;
  count: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  setCurrent: (index: number) => void;
  setCount: (count: number) => void;
};

const CarouselContext = createContext<CarouselContextValue | undefined>(
  undefined,
);

const useCarouselContext = () => useContext(CarouselContext);

/* ======================================================================== */
/* InlineCitationCarousel                                                    */
/* ======================================================================== */

export type InlineCitationCarouselProps = ViewProps & {
  className?: string;
  itemCount?: number;
};

export const InlineCitationCarousel = ({
  className,
  itemCount = 0,
  children,
  ...props
}: InlineCitationCarouselProps) => {
  const [current, setCurrentState] = useState(0);
  const [count, setCount] = useState(itemCount);

  const scrollPrev = useCallback(() => {
    setCurrentState((prev) => Math.max(0, prev - 1));
  }, []);

  const scrollNext = useCallback(() => {
    setCurrentState((prev) => Math.min(count - 1, prev + 1));
  }, [count]);

  return (
    <CarouselContext.Provider
      value={{
        current,
        count,
        scrollPrev,
        scrollNext,
        setCurrent: setCurrentState,
        setCount,
      }}
    >
      <View className={cn('w-full', className)} {...props}>
        {children}
      </View>
    </CarouselContext.Provider>
  );
};

/* ======================================================================== */
/* InlineCitationCarouselContent                                             */
/* ======================================================================== */

export type InlineCitationCarouselContentProps = ViewProps & {
  className?: string;
};

export const InlineCitationCarouselContent = (
  props: InlineCitationCarouselContentProps,
) => <View {...props} />;

/* ======================================================================== */
/* InlineCitationCarouselItem                                                */
/* ======================================================================== */

export type InlineCitationCarouselItemProps = ViewProps & {
  className?: string;
};

export const InlineCitationCarouselItem = ({
  className,
  ...props
}: InlineCitationCarouselItemProps) => (
  <View className={cn('w-full gap-2 p-4 pl-8', className)} {...props} />
);

/* ======================================================================== */
/* InlineCitationCarouselHeader                                              */
/* ======================================================================== */

export type InlineCitationCarouselHeaderProps = ViewProps & {
  className?: string;
};

export const InlineCitationCarouselHeader = ({
  className,
  ...props
}: InlineCitationCarouselHeaderProps) => (
  <View
    className={cn(
      'flex-row items-center justify-between gap-2 rounded-t-md bg-secondary p-2',
      className,
    )}
    {...props}
  />
);

/* ======================================================================== */
/* InlineCitationCarouselIndex                                               */
/* ======================================================================== */

export type InlineCitationCarouselIndexProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export const InlineCitationCarouselIndex = ({
  children,
  className,
  ...props
}: InlineCitationCarouselIndexProps) => {
  const ctx = useCarouselContext();
  const current = (ctx?.current ?? 0) + 1;
  const count = ctx?.count ?? 0;

  return (
    <View
      className={cn(
        'flex-1 items-end justify-center px-3 py-1',
        className,
      )}
      {...props}
    >
      {children ?? (
        <Text className="text-xs text-muted-foreground">
          {current}/{count}
        </Text>
      )}
    </View>
  );
};

/* ======================================================================== */
/* InlineCitationCarouselPrev                                                */
/* ======================================================================== */

export type InlineCitationCarouselPrevProps = PressableProps & {
  className?: string;
};

export const InlineCitationCarouselPrev = ({
  className,
  ...props
}: InlineCitationCarouselPrevProps) => {
  const ctx = useCarouselContext();

  const handlePress = useCallback(() => {
    ctx?.scrollPrev();
  }, [ctx]);

  return (
    <Pressable
      accessibilityLabel="Previous"
      className={cn('shrink-0', className)}
      onPress={handlePress}
      accessibilityRole="button"
      {...props}
    >
      <ArrowLeft size={16} className="text-muted-foreground" />
    </Pressable>
  );
};

/* ======================================================================== */
/* InlineCitationCarouselNext                                                */
/* ======================================================================== */

export type InlineCitationCarouselNextProps = PressableProps & {
  className?: string;
};

export const InlineCitationCarouselNext = ({
  className,
  ...props
}: InlineCitationCarouselNextProps) => {
  const ctx = useCarouselContext();

  const handlePress = useCallback(() => {
    ctx?.scrollNext();
  }, [ctx]);

  return (
    <Pressable
      accessibilityLabel="Next"
      className={cn('shrink-0', className)}
      onPress={handlePress}
      accessibilityRole="button"
      {...props}
    >
      <ArrowRight size={16} className="text-muted-foreground" />
    </Pressable>
  );
};

/* ======================================================================== */
/* InlineCitationSource                                                      */
/* ======================================================================== */

export type InlineCitationSourceProps = ViewProps & {
  className?: string;
  title?: string;
  url?: string;
  description?: string;
  children?: React.ReactNode;
};

export const InlineCitationSource = ({
  title,
  url,
  description,
  className,
  children,
  ...props
}: InlineCitationSourceProps) => {
  const handleLinkPress = useCallback(() => {
    if (url) {
      Linking.openURL(url);
    }
  }, [url]);

  return (
    <View className={cn('gap-1', className)} {...props}>
      {title && (
        <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
          {title}
        </Text>
      )}
      {url && (
        <Pressable onPress={handleLinkPress} accessibilityRole="link">
          <Text
            className="text-xs text-muted-foreground"
            numberOfLines={1}
          >
            {url}
          </Text>
        </Pressable>
      )}
      {description && (
        <Text
          className="text-sm leading-relaxed text-muted-foreground"
          numberOfLines={3}
        >
          {description}
        </Text>
      )}
      {children}
    </View>
  );
};

/* ======================================================================== */
/* InlineCitationQuote                                                       */
/* ======================================================================== */

export type InlineCitationQuoteProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export const InlineCitationQuote = ({
  children,
  className,
  ...props
}: InlineCitationQuoteProps) => (
  <View
    className={cn(
      'border-l-2 border-muted pl-3',
      className,
    )}
    {...props}
  >
    {typeof children === 'string' ? (
      <Text className="text-sm italic text-muted-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);
