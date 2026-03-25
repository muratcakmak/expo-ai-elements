import React, { createContext, useContext, useMemo } from 'react';
import { View, Text, type ViewProps } from 'react-native';
import type { ToolUIPart } from 'ai';
import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';

/* --------------------------------- Types --------------------------------- */

type ToolUIPartApproval =
  | {
      id: string;
      approved?: never;
      reason?: never;
    }
  | {
      id: string;
      approved: boolean;
      reason?: string;
    }
  | {
      id: string;
      approved: true;
      reason?: string;
    }
  | {
      id: string;
      approved: false;
      reason?: string;
    }
  | undefined;

interface ConfirmationContextValue {
  approval: ToolUIPartApproval;
  state: ToolUIPart['state'];
}

/* -------------------------------- Context -------------------------------- */

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);

const useConfirmation = () => {
  const context = useContext(ConfirmationContext);

  if (!context) {
    throw new Error('Confirmation components must be used within Confirmation');
  }

  return context;
};

/* ------------------------------ Confirmation ----------------------------- */

export type ConfirmationProps = ViewProps & {
  className?: string;
  approval?: ToolUIPartApproval;
  state: ToolUIPart['state'];
};

export const Confirmation = ({
  className,
  approval,
  state,
  ...props
}: ConfirmationProps) => {
  const contextValue = useMemo(() => ({ approval, state }), [approval, state]);

  if (!approval || state === 'input-streaming' || state === 'input-available') {
    return null;
  }

  return (
    <ConfirmationContext.Provider value={contextValue}>
      <View
        className={cn(
          'flex-col gap-2 rounded-md border border-border bg-background p-4',
          className,
        )}
        {...props}
      />
    </ConfirmationContext.Provider>
  );
};

/* -------------------------- ConfirmationTitle --------------------------- */

export type ConfirmationTitleProps = ViewProps & {
  className?: string;
  children?: ReactNode;
};

export const ConfirmationTitle = ({
  className,
  children,
  ...props
}: ConfirmationTitleProps) => (
  <View className={cn(className)} {...props}>
    {typeof children === 'string' ? (
      <Text className="text-sm text-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);

/* ----------------------- ConfirmationRequest --------------------------- */

export type ConfirmationRequestProps = {
  children?: ReactNode;
};

export const ConfirmationRequest = ({ children }: ConfirmationRequestProps) => {
  const { state } = useConfirmation();

  if (state !== 'approval-requested') {
    return null;
  }

  return <>{children}</>;
};

/* ----------------------- ConfirmationAccepted -------------------------- */

export type ConfirmationAcceptedProps = {
  children?: ReactNode;
};

export const ConfirmationAccepted = ({
  children,
}: ConfirmationAcceptedProps) => {
  const { approval, state } = useConfirmation();

  if (
    !approval?.approved ||
    (state !== 'approval-responded' &&
      state !== 'output-denied' &&
      state !== 'output-available')
  ) {
    return null;
  }

  return <>{children}</>;
};

/* ----------------------- ConfirmationRejected -------------------------- */

export type ConfirmationRejectedProps = {
  children?: ReactNode;
};

export const ConfirmationRejected = ({
  children,
}: ConfirmationRejectedProps) => {
  const { approval, state } = useConfirmation();

  if (
    approval?.approved !== false ||
    (state !== 'approval-responded' &&
      state !== 'output-denied' &&
      state !== 'output-available')
  ) {
    return null;
  }

  return <>{children}</>;
};

/* ----------------------- ConfirmationActions --------------------------- */

export type ConfirmationActionsProps = ViewProps & {
  className?: string;
};

export const ConfirmationActions = ({
  className,
  ...props
}: ConfirmationActionsProps) => {
  const { state } = useConfirmation();

  if (state !== 'approval-requested') {
    return null;
  }

  return (
    <View
      className={cn('flex-row items-center justify-end gap-2 self-end', className)}
      {...props}
    />
  );
};

/* ----------------------- ConfirmationAction ---------------------------- */

export type ConfirmationActionProps = ButtonProps;

export const ConfirmationAction = (props: ConfirmationActionProps) => (
  <Button size="sm" {...props} />
);
