import React, { createContext, useContext, useMemo } from 'react';
import {
  Pressable,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { cn } from '../../utils/cn';
import { Badge } from '../../primitives/Badge';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../primitives/Collapsible';

/* ---------------------------------- Types --------------------------------- */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface SchemaParameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  location?: 'path' | 'query' | 'header';
}

interface SchemaProperty {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  properties?: SchemaProperty[];
  items?: SchemaProperty;
}

/* --------------------------------- Context -------------------------------- */

interface SchemaDisplayContextType {
  method: HttpMethod;
  path: string;
  description?: string;
  parameters?: SchemaParameter[];
  requestBody?: SchemaProperty[];
  responseBody?: SchemaProperty[];
}

const SchemaDisplayContext = createContext<SchemaDisplayContextType>({
  method: 'GET',
  path: '',
});

/* --------------------------------- Styles --------------------------------- */

const methodStyles: Record<HttpMethod, string> = {
  DELETE: 'bg-red-100 dark:bg-red-900/30',
  GET: 'bg-green-100 dark:bg-green-900/30',
  PATCH: 'bg-yellow-100 dark:bg-yellow-900/30',
  POST: 'bg-blue-100 dark:bg-blue-900/30',
  PUT: 'bg-orange-100 dark:bg-orange-900/30',
};

const methodTextStyles: Record<HttpMethod, string> = {
  DELETE: 'text-red-700 dark:text-red-400',
  GET: 'text-green-700 dark:text-green-400',
  PATCH: 'text-yellow-700 dark:text-yellow-400',
  POST: 'text-blue-700 dark:text-blue-400',
  PUT: 'text-orange-700 dark:text-orange-400',
};

/* --------------------------------- Header --------------------------------- */

type SchemaDisplayHeaderProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayHeader = ({
  className,
  children,
  ...props
}: SchemaDisplayHeaderProps) => (
  <View
    className={cn(
      'flex-row items-center gap-3 border-b border-border px-4 py-3',
      className,
    )}
    {...props}
  >
    {children}
  </View>
);

/* --------------------------------- Method --------------------------------- */

type SchemaDisplayMethodProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayMethod = ({
  className,
  children,
  ...props
}: SchemaDisplayMethodProps) => {
  const { method } = useContext(SchemaDisplayContext);

  return (
    <Badge
      className={cn('font-mono', methodStyles[method], className)}
      variant="secondary"
      {...props}
    >
      <Text className={cn('text-xs font-medium', methodTextStyles[method])}>
        {children ?? method}
      </Text>
    </Badge>
  );
};

/* ---------------------------------- Path ---------------------------------- */

type SchemaDisplayPathProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayPath = ({
  className,
  children,
  ...props
}: SchemaDisplayPathProps) => {
  const { path } = useContext(SchemaDisplayContext);

  return (
    <View className={cn(className)} {...props}>
      <Text className="font-mono text-sm text-foreground">
        {children ?? path}
      </Text>
    </View>
  );
};

/* ------------------------------ Description ------------------------------- */

type SchemaDisplayDescriptionProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayDescription = ({
  className,
  children,
  ...props
}: SchemaDisplayDescriptionProps) => {
  const { description } = useContext(SchemaDisplayContext);

  return (
    <View
      className={cn('border-b border-border px-4 py-3', className)}
      {...props}
    >
      <Text className="text-sm text-muted-foreground">
        {children ?? description}
      </Text>
    </View>
  );
};

/* -------------------------------- Content --------------------------------- */

type SchemaDisplayContentProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayContent = ({
  className,
  children,
  ...props
}: SchemaDisplayContentProps) => (
  <View className={cn(className)} {...props}>
    {children}
  </View>
);

/* ------------------------------ Parameter --------------------------------- */

type SchemaDisplayParameterProps = ViewProps & {
  className?: string;
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  location?: 'path' | 'query' | 'header';
};

const SchemaDisplayParameter = ({
  name,
  type,
  required,
  description,
  location,
  className,
  ...props
}: SchemaDisplayParameterProps) => (
  <View className={cn('px-4 py-3 pl-10', className)} {...props}>
    <View className="flex-row flex-wrap items-center gap-2">
      <Text className="font-mono text-sm text-foreground">{name}</Text>
      <Badge variant="outline">
        <Text className="text-xs text-foreground">{type}</Text>
      </Badge>
      {location ? (
        <Badge variant="secondary">
          <Text className="text-xs text-secondary-foreground">{location}</Text>
        </Badge>
      ) : null}
      {required ? (
        <Badge className="bg-red-100 dark:bg-red-900/30" variant="secondary">
          <Text className="text-xs text-red-700 dark:text-red-400">
            required
          </Text>
        </Badge>
      ) : null}
    </View>
    {description ? (
      <Text className="mt-1 text-sm text-muted-foreground">{description}</Text>
    ) : null}
  </View>
);

/* ------------------------------ Parameters -------------------------------- */

type SchemaDisplayParametersProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayParameters = ({
  className,
  children,
  ...props
}: SchemaDisplayParametersProps) => {
  const { parameters } = useContext(SchemaDisplayContext);

  return (
    <Collapsible className={cn(className)} defaultOpen {...props}>
      <CollapsibleTrigger className="flex-row w-full items-center gap-2 px-4 py-3">
        <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
        <Text className="text-sm font-medium text-foreground">Parameters</Text>
        <Badge className="ml-auto" variant="secondary">
          <Text className="text-xs text-secondary-foreground">
            {parameters?.length}
          </Text>
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <View className="border-t border-border">
          {children ??
            parameters?.map((param) => (
              <SchemaDisplayParameter key={param.name} {...param} />
            ))}
        </View>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* -------------------------------- Property -------------------------------- */

type SchemaDisplayPropertyProps = ViewProps &
  SchemaProperty & {
    className?: string;
    depth?: number;
  };

const SchemaDisplayProperty = ({
  name,
  type,
  required,
  description,
  properties,
  items,
  depth = 0,
  className,
  ...props
}: SchemaDisplayPropertyProps) => {
  const hasChildren = properties || items;
  const paddingLeft = 40 + depth * 16;

  if (hasChildren) {
    return (
      <Collapsible defaultOpen={depth < 2}>
        <CollapsibleTrigger
          className={cn('flex-row w-full items-center gap-2 py-3', className)}
          style={{ paddingLeft }}
        >
          <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
          <Text className="font-mono text-sm text-foreground">{name}</Text>
          <Badge variant="outline">
            <Text className="text-xs text-foreground">{type}</Text>
          </Badge>
          {required ? (
            <Badge className="bg-red-100 dark:bg-red-900/30" variant="secondary">
              <Text className="text-xs text-red-700 dark:text-red-400">
                required
              </Text>
            </Badge>
          ) : null}
        </CollapsibleTrigger>
        {description ? (
          <View style={{ paddingLeft: paddingLeft + 24 }}>
            <Text className="pb-2 text-sm text-muted-foreground">
              {description}
            </Text>
          </View>
        ) : null}
        <CollapsibleContent>
          <View className="border-t border-border">
            {properties?.map((prop) => (
              <SchemaDisplayProperty
                key={prop.name}
                {...prop}
                depth={depth + 1}
              />
            ))}
            {items ? (
              <SchemaDisplayProperty
                {...items}
                depth={depth + 1}
                name={`${name}[]`}
              />
            ) : null}
          </View>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <View
      className={cn('py-3 pr-4', className)}
      style={{ paddingLeft }}
      {...props}
    >
      <View className="flex-row flex-wrap items-center gap-2">
        {/* Spacer for alignment */}
        <View className="h-4 w-4" />
        <Text className="font-mono text-sm text-foreground">{name}</Text>
        <Badge variant="outline">
          <Text className="text-xs text-foreground">{type}</Text>
        </Badge>
        {required ? (
          <Badge className="bg-red-100 dark:bg-red-900/30" variant="secondary">
            <Text className="text-xs text-red-700 dark:text-red-400">
              required
            </Text>
          </Badge>
        ) : null}
      </View>
      {description ? (
        <Text className="mt-1 pl-6 text-sm text-muted-foreground">
          {description}
        </Text>
      ) : null}
    </View>
  );
};

/* -------------------------------- Request --------------------------------- */

type SchemaDisplayRequestProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayRequest = ({
  className,
  children,
  ...props
}: SchemaDisplayRequestProps) => {
  const { requestBody } = useContext(SchemaDisplayContext);

  return (
    <Collapsible className={cn(className)} defaultOpen {...props}>
      <CollapsibleTrigger className="flex-row w-full items-center gap-2 px-4 py-3">
        <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
        <Text className="text-sm font-medium text-foreground">
          Request Body
        </Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <View className="border-t border-border">
          {children ??
            requestBody?.map((prop) => (
              <SchemaDisplayProperty key={prop.name} {...prop} depth={0} />
            ))}
        </View>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* -------------------------------- Response -------------------------------- */

type SchemaDisplayResponseProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayResponse = ({
  className,
  children,
  ...props
}: SchemaDisplayResponseProps) => {
  const { responseBody } = useContext(SchemaDisplayContext);

  return (
    <Collapsible className={cn(className)} defaultOpen {...props}>
      <CollapsibleTrigger className="flex-row w-full items-center gap-2 px-4 py-3">
        <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
        <Text className="text-sm font-medium text-foreground">Response</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <View className="border-t border-border">
          {children ??
            responseBody?.map((prop) => (
              <SchemaDisplayProperty key={prop.name} {...prop} depth={0} />
            ))}
        </View>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* ---------------------------------- Root ---------------------------------- */

type SchemaDisplayProps = ViewProps & {
  className?: string;
  method: HttpMethod;
  path: string;
  description?: string;
  parameters?: SchemaParameter[];
  requestBody?: SchemaProperty[];
  responseBody?: SchemaProperty[];
  children?: React.ReactNode;
};

const SchemaDisplay = ({
  method,
  path,
  description,
  parameters,
  requestBody,
  responseBody,
  className,
  children,
  ...props
}: SchemaDisplayProps) => {
  const contextValue = useMemo(
    () => ({
      description,
      method,
      parameters,
      path,
      requestBody,
      responseBody,
    }),
    [description, method, parameters, path, requestBody, responseBody],
  );

  return (
    <SchemaDisplayContext.Provider value={contextValue}>
      <View
        className={cn(
          'overflow-hidden rounded-lg border border-border bg-background',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <SchemaDisplayHeader>
              <View className="flex-row items-center gap-3">
                <SchemaDisplayMethod />
                <SchemaDisplayPath />
              </View>
            </SchemaDisplayHeader>
            {description ? <SchemaDisplayDescription /> : null}
            <SchemaDisplayContent>
              {parameters && parameters.length > 0 ? (
                <SchemaDisplayParameters />
              ) : null}
              {requestBody && requestBody.length > 0 ? (
                <SchemaDisplayRequest />
              ) : null}
              {responseBody && responseBody.length > 0 ? (
                <SchemaDisplayResponse />
              ) : null}
            </SchemaDisplayContent>
          </>
        )}
      </View>
    </SchemaDisplayContext.Provider>
  );
};

/* ---------------------------------- Body ---------------------------------- */

type SchemaDisplayBodyProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayBody = ({
  className,
  children,
  ...props
}: SchemaDisplayBodyProps) => (
  <View className={cn(className)} {...props}>
    {children}
  </View>
);

/* -------------------------------- Example --------------------------------- */

type SchemaDisplayExampleProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

const SchemaDisplayExample = ({
  className,
  children,
  ...props
}: SchemaDisplayExampleProps) => (
  <View
    className={cn('mx-4 mb-4 overflow-auto rounded-md bg-muted p-4', className)}
    {...props}
  >
    {typeof children === 'string' ? (
      <Text className="font-mono text-sm text-foreground">{children}</Text>
    ) : (
      children
    )}
  </View>
);

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
  SchemaDisplayBody,
  SchemaDisplayExample,
  type SchemaDisplayProps,
  type SchemaDisplayHeaderProps,
  type SchemaDisplayMethodProps,
  type SchemaDisplayPathProps,
  type SchemaDisplayDescriptionProps,
  type SchemaDisplayContentProps,
  type SchemaDisplayParameterProps,
  type SchemaDisplayParametersProps,
  type SchemaDisplayPropertyProps,
  type SchemaDisplayRequestProps,
  type SchemaDisplayResponseProps,
  type SchemaDisplayBodyProps,
  type SchemaDisplayExampleProps,
  type HttpMethod,
  type SchemaParameter,
  type SchemaProperty,
};
