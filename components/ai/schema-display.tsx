import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ChevronRightIcon } from 'lucide-react-native';
import * as Collapsible from '@rn-primitives/collapsible';
import * as React from 'react';
import { Pressable, View } from 'react-native';

// --- Types ---

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type SchemaParameter = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  location?: 'path' | 'query' | 'header';
};

type SchemaProperty = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  properties?: SchemaProperty[];
  items?: SchemaProperty;
};

// --- Context ---

type SchemaDisplayContextValue = {
  method: HttpMethod;
  path: string;
  description?: string;
  parameters?: SchemaParameter[];
  requestBody?: SchemaProperty[];
  responseBody?: SchemaProperty[];
};

const SchemaDisplayContext = React.createContext<SchemaDisplayContextValue>({
  method: 'GET',
  path: '',
});

// --- Method color map ---

const methodStyles: Record<HttpMethod, { bg: string; text: string }> = {
  GET: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  POST: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  PUT: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
  PATCH: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  DELETE: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
};

// --- SchemaDisplay (Root) ---

type SchemaDisplayProps = {
  method: HttpMethod;
  path: string;
  description?: string;
  parameters?: SchemaParameter[];
  requestBody?: SchemaProperty[];
  responseBody?: SchemaProperty[];
  children?: React.ReactNode;
  className?: string;
};

const SchemaDisplay = React.memo(function SchemaDisplay({
  method,
  path,
  description,
  parameters,
  requestBody,
  responseBody,
  children,
  className,
}: SchemaDisplayProps) {
  const contextValue = React.useMemo(
    () => ({ method, path, description, parameters, requestBody, responseBody }),
    [method, path, description, parameters, requestBody, responseBody]
  );

  return (
    <SchemaDisplayContext.Provider value={contextValue}>
      <View
        className={cn('overflow-hidden rounded-lg border border-border bg-background', className)}
      >
        {children ?? (
          <>
            <SchemaDisplayHeader>
              <SchemaDisplayMethod />
              <SchemaDisplayPath />
            </SchemaDisplayHeader>
            {description ? <SchemaDisplayDescription /> : null}
            <SchemaDisplayContent>
              {parameters && parameters.length > 0 && <SchemaDisplayParameters />}
              {requestBody && requestBody.length > 0 && <SchemaDisplayRequest />}
              {responseBody && responseBody.length > 0 && <SchemaDisplayResponse />}
            </SchemaDisplayContent>
          </>
        )}
      </View>
    </SchemaDisplayContext.Provider>
  );
});

SchemaDisplay.displayName = 'SchemaDisplay';

// --- SchemaDisplayHeader ---

type SchemaDisplayHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

const SchemaDisplayHeader = React.memo(function SchemaDisplayHeader({
  children,
  className,
}: SchemaDisplayHeaderProps) {
  return (
    <View className={cn('flex-row items-center gap-3 border-b border-border px-4 py-3', className)}>
      {children}
    </View>
  );
});

SchemaDisplayHeader.displayName = 'SchemaDisplayHeader';

// --- SchemaDisplayMethod ---

type SchemaDisplayMethodProps = {
  children?: React.ReactNode;
  className?: string;
};

const SchemaDisplayMethod = React.memo(function SchemaDisplayMethod({
  children,
  className,
}: SchemaDisplayMethodProps) {
  const { method } = React.useContext(SchemaDisplayContext);
  const style = methodStyles[method];

  return (
    <View className={cn('rounded-md px-2 py-0.5', style.bg, className)}>
      <Text className={cn('font-mono text-xs font-semibold', style.text)}>
        {children ?? method}
      </Text>
    </View>
  );
});

SchemaDisplayMethod.displayName = 'SchemaDisplayMethod';

// --- SchemaDisplayPath ---

type SchemaDisplayPathProps = {
  children?: React.ReactNode;
  className?: string;
};

const SchemaDisplayPath = React.memo(function SchemaDisplayPath({
  children,
  className,
}: SchemaDisplayPathProps) {
  const { path } = React.useContext(SchemaDisplayContext);

  return (
    <Text className={cn('font-mono text-sm', className)}>{children ?? path}</Text>
  );
});

SchemaDisplayPath.displayName = 'SchemaDisplayPath';

// --- SchemaDisplayDescription ---

type SchemaDisplayDescriptionProps = {
  children?: React.ReactNode;
  className?: string;
};

const SchemaDisplayDescription = React.memo(function SchemaDisplayDescription({
  children,
  className,
}: SchemaDisplayDescriptionProps) {
  const { description } = React.useContext(SchemaDisplayContext);

  return (
    <View className={cn('border-b border-border px-4 py-3', className)}>
      <Text className="text-muted-foreground text-sm">{children ?? description}</Text>
    </View>
  );
});

SchemaDisplayDescription.displayName = 'SchemaDisplayDescription';

// --- SchemaDisplayContent ---

type SchemaDisplayContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const SchemaDisplayContent = React.memo(function SchemaDisplayContent({
  children,
  className,
}: SchemaDisplayContentProps) {
  return <View className={className}>{children}</View>;
});

SchemaDisplayContent.displayName = 'SchemaDisplayContent';

// --- SchemaDisplayParameter ---

type SchemaDisplayParameterProps = SchemaParameter & {
  className?: string;
};

const SchemaDisplayParameter = React.memo(function SchemaDisplayParameter({
  name,
  type,
  required,
  description,
  location,
  className,
}: SchemaDisplayParameterProps) {
  return (
    <View className={cn('px-4 py-3 pl-10', className)}>
      <View className="flex-row flex-wrap items-center gap-2">
        <Text className="font-mono text-sm">{name}</Text>
        <View className="rounded-md border border-border px-1.5 py-0.5">
          <Text className="text-xs">{type}</Text>
        </View>
        {location && (
          <View className="rounded-md bg-muted px-1.5 py-0.5">
            <Text className="text-xs">{location}</Text>
          </View>
        )}
        {required && (
          <View className="rounded-md bg-red-100 px-1.5 py-0.5 dark:bg-red-900/30">
            <Text className="text-xs text-red-700 dark:text-red-400">required</Text>
          </View>
        )}
      </View>
      {description ? (
        <Text className="mt-1 text-muted-foreground text-sm">{description}</Text>
      ) : null}
    </View>
  );
});

SchemaDisplayParameter.displayName = 'SchemaDisplayParameter';

// --- SchemaDisplayParameters ---

type SchemaDisplayParametersProps = {
  children?: React.ReactNode;
  className?: string;
};

const SchemaDisplayParameters = React.memo(function SchemaDisplayParameters({
  children,
  className,
}: SchemaDisplayParametersProps) {
  const { parameters } = React.useContext(SchemaDisplayContext);

  return (
    <Collapsible.Root defaultOpen className={cn('border-b border-border', className)}>
      <Collapsible.Trigger asChild>
        <Pressable className="flex-row items-center gap-2 px-4 py-3">
          <Icon as={ChevronRightIcon} className="size-4 shrink-0 text-muted-foreground" />
          <Text className="text-sm font-medium">Parameters</Text>
          <View className="ml-auto rounded-md bg-muted px-1.5 py-0.5">
            <Text className="text-xs">{parameters?.length}</Text>
          </View>
        </Pressable>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <View className="border-t border-border">
          {children ??
            parameters?.map((param) => (
              <SchemaDisplayParameter key={param.name} {...param} />
            ))}
        </View>
      </Collapsible.Content>
    </Collapsible.Root>
  );
});

SchemaDisplayParameters.displayName = 'SchemaDisplayParameters';

// --- SchemaDisplayProperty ---

type SchemaDisplayPropertyProps = SchemaProperty & {
  depth?: number;
  className?: string;
};

const SchemaDisplayProperty = React.memo(function SchemaDisplayProperty({
  name,
  type,
  required,
  description,
  properties,
  items,
  depth = 0,
  className,
}: SchemaDisplayPropertyProps) {
  const hasChildren = properties || items;
  const paddingLeft = 40 + depth * 16;

  if (hasChildren) {
    return (
      <Collapsible.Root defaultOpen={depth < 2}>
        <Collapsible.Trigger asChild>
          <Pressable
            className={cn('flex-row items-center gap-2 py-3 pr-4', className)}
            style={{ paddingLeft }}
          >
            <Icon as={ChevronRightIcon} className="size-4 shrink-0 text-muted-foreground" />
            <Text className="font-mono text-sm">{name}</Text>
            <View className="rounded-md border border-border px-1.5 py-0.5">
              <Text className="text-xs">{type}</Text>
            </View>
            {required && (
              <View className="rounded-md bg-red-100 px-1.5 py-0.5 dark:bg-red-900/30">
                <Text className="text-xs text-red-700 dark:text-red-400">required</Text>
              </View>
            )}
          </Pressable>
        </Collapsible.Trigger>
        {description ? (
          <Text
            className="pb-2 text-muted-foreground text-sm"
            style={{ paddingLeft: paddingLeft + 24 }}
          >
            {description}
          </Text>
        ) : null}
        <Collapsible.Content>
          <View className="border-t border-border">
            {properties?.map((prop) => (
              <SchemaDisplayProperty key={prop.name} {...prop} depth={depth + 1} />
            ))}
            {items && (
              <SchemaDisplayProperty {...items} name={`${name}[]`} depth={depth + 1} />
            )}
          </View>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }

  return (
    <View className={cn('py-3 pr-4', className)} style={{ paddingLeft }}>
      <View className="flex-row flex-wrap items-center gap-2">
        <View className="w-4" />
        <Text className="font-mono text-sm">{name}</Text>
        <View className="rounded-md border border-border px-1.5 py-0.5">
          <Text className="text-xs">{type}</Text>
        </View>
        {required && (
          <View className="rounded-md bg-red-100 px-1.5 py-0.5 dark:bg-red-900/30">
            <Text className="text-xs text-red-700 dark:text-red-400">required</Text>
          </View>
        )}
      </View>
      {description ? (
        <Text className="mt-1 pl-6 text-muted-foreground text-sm">{description}</Text>
      ) : null}
    </View>
  );
});

SchemaDisplayProperty.displayName = 'SchemaDisplayProperty';

// --- SchemaDisplayRequest ---

type SchemaDisplayRequestProps = {
  children?: React.ReactNode;
  className?: string;
};

const SchemaDisplayRequest = React.memo(function SchemaDisplayRequest({
  children,
  className,
}: SchemaDisplayRequestProps) {
  const { requestBody } = React.useContext(SchemaDisplayContext);

  return (
    <Collapsible.Root defaultOpen className={cn('border-b border-border', className)}>
      <Collapsible.Trigger asChild>
        <Pressable className="flex-row items-center gap-2 px-4 py-3">
          <Icon as={ChevronRightIcon} className="size-4 shrink-0 text-muted-foreground" />
          <Text className="text-sm font-medium">Request Body</Text>
        </Pressable>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <View className="border-t border-border">
          {children ??
            requestBody?.map((prop) => (
              <SchemaDisplayProperty key={prop.name} {...prop} depth={0} />
            ))}
        </View>
      </Collapsible.Content>
    </Collapsible.Root>
  );
});

SchemaDisplayRequest.displayName = 'SchemaDisplayRequest';

// --- SchemaDisplayResponse ---

type SchemaDisplayResponseProps = {
  children?: React.ReactNode;
  className?: string;
};

const SchemaDisplayResponse = React.memo(function SchemaDisplayResponse({
  children,
  className,
}: SchemaDisplayResponseProps) {
  const { responseBody } = React.useContext(SchemaDisplayContext);

  return (
    <Collapsible.Root defaultOpen className={className}>
      <Collapsible.Trigger asChild>
        <Pressable className="flex-row items-center gap-2 px-4 py-3">
          <Icon as={ChevronRightIcon} className="size-4 shrink-0 text-muted-foreground" />
          <Text className="text-sm font-medium">Response</Text>
        </Pressable>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <View className="border-t border-border">
          {children ??
            responseBody?.map((prop) => (
              <SchemaDisplayProperty key={prop.name} {...prop} depth={0} />
            ))}
        </View>
      </Collapsible.Content>
    </Collapsible.Root>
  );
});

SchemaDisplayResponse.displayName = 'SchemaDisplayResponse';

export {
  SchemaDisplay,
  SchemaDisplayHeader,
  SchemaDisplayMethod,
  SchemaDisplayPath,
  SchemaDisplayDescription,
  SchemaDisplayContent,
  SchemaDisplayParameter,
  SchemaDisplayParameters,
  SchemaDisplayProperty,
  SchemaDisplayRequest,
  SchemaDisplayResponse,
};
export type {
  SchemaDisplayProps,
  SchemaDisplayHeaderProps,
  SchemaDisplayMethodProps,
  SchemaDisplayPathProps,
  SchemaDisplayDescriptionProps,
  SchemaDisplayContentProps,
  SchemaDisplayParameterProps,
  SchemaDisplayParametersProps,
  SchemaDisplayPropertyProps,
  SchemaDisplayRequestProps,
  SchemaDisplayResponseProps,
  HttpMethod,
  SchemaParameter,
  SchemaProperty,
};
