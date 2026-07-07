import React, { createContext, useContext, useMemo } from 'react';
import { Text, View, type ViewProps } from 'react-native';
import { ArrowRight, Minus, Package, Plus } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Badge } from '../../primitives/Badge';

/* ---------------------------------- Types --------------------------------- */

type ChangeType = 'major' | 'minor' | 'patch' | 'added' | 'removed';

/* --------------------------------- Context -------------------------------- */

interface PackageInfoContextType {
  name: string;
  currentVersion?: string;
  newVersion?: string;
  changeType?: ChangeType;
}

const PackageInfoContext = createContext<PackageInfoContextType>({
  name: '',
});

/* --------------------------------- Styles --------------------------------- */

const changeTypeStyles: Record<ChangeType, string> = {
  added: 'bg-blue-100 dark:bg-blue-900/30',
  major: 'bg-red-100 dark:bg-red-900/30',
  minor: 'bg-yellow-100 dark:bg-yellow-900/30',
  patch: 'bg-green-100 dark:bg-green-900/30',
  removed: 'bg-gray-100 dark:bg-gray-900/30',
};

const changeTypeTextStyles: Record<ChangeType, string> = {
  added: 'text-blue-700 dark:text-blue-400',
  major: 'text-red-700 dark:text-red-400',
  minor: 'text-yellow-700 dark:text-yellow-400',
  patch: 'text-green-700 dark:text-green-400',
  removed: 'text-gray-700 dark:text-gray-400',
};

/* --------------------------------- Header --------------------------------- */

type PackageInfoHeaderProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const PackageInfoHeader = ({
  className,
  children,
  ...props
}: PackageInfoHeaderProps) => (
  <View
    className={cn('flex-row items-center justify-between gap-2', className)}
    {...props}
  >
    {children}
  </View>
);

/* ---------------------------------- Name ---------------------------------- */

type PackageInfoNameProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const PackageInfoName = ({
  className,
  children,
  ...props
}: PackageInfoNameProps) => {
  const { name } = useContext(PackageInfoContext);

  return (
    <View className={cn('flex-row items-center gap-2', className)} {...props}>
      <Package size={16} className="text-muted-foreground" />
      <Text className="font-mono text-sm font-medium text-foreground">
        {children ?? name}
      </Text>
    </View>
  );
};

/* ------------------------------ Change Type ------------------------------- */

type PackageInfoChangeTypeProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const PackageInfoChangeType = ({
  className,
  children,
  ...props
}: PackageInfoChangeTypeProps) => {
  const { changeType } = useContext(PackageInfoContext);

  if (!changeType) {
    return null;
  }

  const IconComponent =
    changeType === 'added'
      ? Plus
      : changeType === 'removed'
        ? Minus
        : ArrowRight;

  return (
    <Badge
      className={cn(changeTypeStyles[changeType], className)}
      variant="secondary"
      {...props}
    >
      <View className="flex-row items-center gap-1">
        <IconComponent size={12} className={changeTypeTextStyles[changeType]} />
        <Text
          className={cn(
            'text-xs font-medium capitalize',
            changeTypeTextStyles[changeType],
          )}
        >
          {children ?? changeType}
        </Text>
      </View>
    </Badge>
  );
};

/* -------------------------------- Version --------------------------------- */

type PackageInfoVersionProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const PackageInfoVersion = ({
  className,
  children,
  ...props
}: PackageInfoVersionProps) => {
  const { currentVersion, newVersion } = useContext(PackageInfoContext);

  if (!(currentVersion || newVersion)) {
    return null;
  }

  return (
    <View
      className={cn('mt-2 flex-row items-center gap-2', className)}
      {...props}
    >
      {children ?? (
        <>
          {currentVersion ? (
            <Text className="font-mono text-sm text-muted-foreground">
              {currentVersion}
            </Text>
          ) : null}
          {currentVersion && newVersion ? (
            <ArrowRight size={12} className="text-muted-foreground" />
          ) : null}
          {newVersion ? (
            <Text className="font-mono text-sm font-medium text-foreground">
              {newVersion}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
};

/* ---------------------------------- Root ---------------------------------- */

type PackageInfoProps = ViewProps & {
  className?: string;
  name: string;
  currentVersion?: string;
  newVersion?: string;
  changeType?: ChangeType;
  children?: React.ReactNode;
};

const PackageInfo = ({
  name,
  currentVersion,
  newVersion,
  changeType,
  className,
  children,
  ...props
}: PackageInfoProps) => {
  const contextValue = useMemo(
    () => ({ changeType, currentVersion, name, newVersion }),
    [changeType, currentVersion, name, newVersion],
  );

  return (
    <PackageInfoContext.Provider value={contextValue}>
      <View
        className={cn(
          'rounded-lg border border-border bg-background p-4',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <PackageInfoHeader>
              <PackageInfoName />
              {changeType ? <PackageInfoChangeType /> : null}
            </PackageInfoHeader>
            {currentVersion || newVersion ? <PackageInfoVersion /> : null}
          </>
        )}
      </View>
    </PackageInfoContext.Provider>
  );
};

/* ------------------------------ Description ------------------------------- */

type PackageInfoDescriptionProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const PackageInfoDescription = ({
  className,
  children,
  ...props
}: PackageInfoDescriptionProps) => (
  <View className={cn('mt-2', className)} {...props}>
    {typeof children === 'string' ? (
      <Text className="text-sm text-muted-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);

/* -------------------------------- Content --------------------------------- */

type PackageInfoContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const PackageInfoContent = ({
  className,
  children,
  ...props
}: PackageInfoContentProps) => (
  <View
    className={cn('mt-3 border-t border-border pt-3', className)}
    {...props}
  >
    {children}
  </View>
);

/* ----------------------------- Dependencies ------------------------------- */

type PackageInfoDependenciesProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const PackageInfoDependencies = ({
  className,
  children,
  ...props
}: PackageInfoDependenciesProps) => (
  <View className={cn('gap-2', className)} {...props}>
    <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      Dependencies
    </Text>
    <View className="gap-1">{children}</View>
  </View>
);

/* ------------------------------- Dependency ------------------------------- */

type PackageInfoDependencyProps = ViewProps & {
  className?: string;
  name: string;
  version?: string;
  children?: React.ReactNode;
};

const PackageInfoDependency = ({
  name,
  version,
  className,
  children,
  ...props
}: PackageInfoDependencyProps) => (
  <View
    className={cn('flex-row items-center justify-between', className)}
    {...props}
  >
    {children ?? (
      <>
        <Text className="font-mono text-sm text-muted-foreground">{name}</Text>
        {version ? (
          <Text className="font-mono text-xs text-foreground">{version}</Text>
        ) : null}
      </>
    )}
  </View>
);

export {
  PackageInfo,
  PackageInfoHeader,
  PackageInfoName,
  PackageInfoChangeType,
  PackageInfoVersion,
  PackageInfoDescription,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
  type PackageInfoProps,
  type PackageInfoHeaderProps,
  type PackageInfoNameProps,
  type PackageInfoChangeTypeProps,
  type PackageInfoVersionProps,
  type PackageInfoDescriptionProps,
  type PackageInfoContentProps,
  type PackageInfoDependenciesProps,
  type PackageInfoDependencyProps,
  type ChangeType,
};
