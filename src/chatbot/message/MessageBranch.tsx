import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { ReactElement } from 'react';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../../primitives/Button';

/* --------------------------------- Context --------------------------------- */

type MessageBranchContextType = {
  currentBranch: number;
  totalBranches: number;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: ReactElement[];
  setBranches: (branches: ReactElement[]) => void;
};

const MessageBranchContext = createContext<MessageBranchContextType | null>(
  null,
);

const useMessageBranch = () => {
  const context = useContext(MessageBranchContext);
  if (!context) {
    throw new Error(
      'MessageBranch components must be used within MessageBranch',
    );
  }
  return context;
};

/* ------------------------------- MessageBranch ------------------------------ */

export type MessageBranchProps = ViewProps & {
  className?: string;
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};

export const MessageBranch = ({
  defaultBranch = 0,
  onBranchChange,
  className,
  ...props
}: MessageBranchProps) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState<ReactElement[]>([]);

  const handleBranchChange = useCallback(
    (newBranch: number) => {
      setCurrentBranch(newBranch);
      onBranchChange?.(newBranch);
    },
    [onBranchChange],
  );

  const goToPrevious = useCallback(() => {
    const newBranch =
      currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
    handleBranchChange(newBranch);
  }, [currentBranch, branches.length, handleBranchChange]);

  const goToNext = useCallback(() => {
    const newBranch =
      currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
    handleBranchChange(newBranch);
  }, [currentBranch, branches.length, handleBranchChange]);

  const contextValue = useMemo<MessageBranchContextType>(
    () => ({
      branches,
      currentBranch,
      goToNext,
      goToPrevious,
      setBranches,
      totalBranches: branches.length,
    }),
    [branches, currentBranch, goToNext, goToPrevious],
  );

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <View className={cn('w-full gap-2', className)} {...props} />
    </MessageBranchContext.Provider>
  );
};

/* ----------------------------- MessageBranchContent -------------------------- */

export type MessageBranchContentProps = ViewProps & {
  className?: string;
};

export const MessageBranchContent = ({
  children,
  ...props
}: MessageBranchContentProps) => {
  const { currentBranch, setBranches, branches } = useMessageBranch();
  const childrenArray = useMemo(
    () =>
      Array.isArray(children)
        ? (children as ReactElement[])
        : ([children] as ReactElement[]),
    [children],
  );

  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [childrenArray, branches, setBranches]);

  return (
    <>
      {childrenArray.map((branch, index) => (
        <View
          className={cn(
            'gap-2 overflow-hidden',
            index === currentBranch ? 'flex' : 'hidden',
          )}
          key={branch?.key ?? index}
          {...props}
        >
          {branch}
        </View>
      ))}
    </>
  );
};

/* ----------------------------- MessageBranchSelector -------------------------- */

export type MessageBranchSelectorProps = ViewProps & {
  className?: string;
};

export const MessageBranchSelector = ({
  className,
  children,
  ...props
}: MessageBranchSelectorProps) => {
  const { totalBranches } = useMessageBranch();

  if (totalBranches <= 1) {
    return null;
  }

  return (
    <View
      className={cn('flex-row items-center', className)}
      {...props}
    >
      {children}
    </View>
  );
};

/* ----------------------------- MessageBranchPrevious -------------------------- */

export type MessageBranchPreviousProps = ButtonProps & {
  className?: string;
};

export const MessageBranchPrevious = ({
  children,
  ...props
}: MessageBranchPreviousProps) => {
  const { goToPrevious, totalBranches } = useMessageBranch();

  return (
    <Button
      accessibilityLabel="Previous branch"
      disabled={totalBranches <= 1}
      onPress={goToPrevious}
      size="icon-sm"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronLeft size={14} className="text-foreground" />}
    </Button>
  );
};

/* ----------------------------- MessageBranchNext ------------------------------ */

export type MessageBranchNextProps = ButtonProps & {
  className?: string;
};

export const MessageBranchNext = ({
  children,
  ...props
}: MessageBranchNextProps) => {
  const { goToNext, totalBranches } = useMessageBranch();

  return (
    <Button
      accessibilityLabel="Next branch"
      disabled={totalBranches <= 1}
      onPress={goToNext}
      size="icon-sm"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronRight size={14} className="text-foreground" />}
    </Button>
  );
};

/* ----------------------------- MessageBranchPage ------------------------------ */

export type MessageBranchPageProps = ViewProps & {
  className?: string;
};

export const MessageBranchPage = ({
  className,
  ...props
}: MessageBranchPageProps) => {
  const { currentBranch, totalBranches } = useMessageBranch();

  return (
    <View className={cn('px-1', className)} {...props}>
      <Text className="text-xs text-muted-foreground">
        {currentBranch + 1} of {totalBranches}
      </Text>
    </View>
  );
};
