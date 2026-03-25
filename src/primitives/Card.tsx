import * as React from 'react';
import { View, Text, type ViewProps } from 'react-native';

import { cn } from '../utils/cn';

/* ---------------------------------- Card ----------------------------------- */

type CardProps = ViewProps & {
  className?: string;
};

function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        'flex-col gap-6 rounded-xl border border-border bg-card py-6 shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}

/* --------------------------------- Header ---------------------------------- */

type CardHeaderProps = ViewProps & {
  className?: string;
};

function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <View className={cn('flex-col gap-2 px-6', className)} {...props}>
      {children}
    </View>
  );
}

/* ---------------------------------- Title ---------------------------------- */

type CardTitleProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <View className={cn(className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="font-semibold leading-none text-card-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

/* ------------------------------ Description -------------------------------- */

type CardDescriptionProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <View className={cn(className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="text-sm text-muted-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

/* --------------------------------- Content --------------------------------- */

type CardContentProps = ViewProps & {
  className?: string;
};

function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <View className={cn('px-6', className)} {...props}>
      {children}
    </View>
  );
}

/* --------------------------------- Footer ---------------------------------- */

type CardFooterProps = ViewProps & {
  className?: string;
};

function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <View className={cn('flex-row items-center px-6', className)} {...props}>
      {children}
    </View>
  );
}

/* --------------------------------- Action ---------------------------------- */

type CardActionProps = ViewProps & {
  className?: string;
};

function CardAction({ children, className, ...props }: CardActionProps) {
  return (
    <View className={cn('self-start', className)} {...props}>
      {children}
    </View>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction };
