import * as React from 'react';
import { Image as ExpoImage, type ImageProps as ExpoImageProps } from 'expo-image';

import { cn } from '../../utils/cn';

/* ---------------------------------- Types --------------------------------- */

type AIImageProps = Omit<ExpoImageProps, 'source'> & {
  /** Base64-encoded image data (without the data URI prefix) */
  base64?: string;
  /** URL string for remote images */
  src?: string;
  /** MIME type, e.g. "image/png" */
  mediaType?: string;
  /** Accessible description */
  alt?: string;
  className?: string;
};

/* -------------------------------- Component ------------------------------- */

/**
 * AIImage — renders AI-generated images using expo-image.
 * Accepts both base64 data (with mediaType) and URL strings.
 */
function AIImage({
  base64,
  src,
  mediaType,
  alt,
  className,
  ...props
}: AIImageProps) {
  const source = React.useMemo(() => {
    if (base64 && mediaType) {
      return { uri: `data:${mediaType};base64,${base64}` };
    }
    if (src) {
      return { uri: src };
    }
    return undefined;
  }, [base64, src, mediaType]);

  return (
    <ExpoImage
      source={source}
      accessibilityLabel={alt}
      className={cn('h-auto max-w-full overflow-hidden rounded-md', className)}
      contentFit="contain"
      {...props}
    />
  );
}

export { AIImage, type AIImageProps };
