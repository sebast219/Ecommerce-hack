'use client';

import { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: string;
  className?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  fallback = '/favicon.ico', 
  className = '',
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={`overflow-hidden ${className}`}
    >
      {isInView && !hasError ? (
        <Image
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            transition-opacity duration-300 ease-in-out
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          {...props}
        />
      ) : hasError ? (
        <Image
          src={fallback}
          alt={alt}
          className="opacity-50"
          {...props}
        />
      ) : (
        <div 
          className="bg-gray-200 animate-pulse"
          style={{ width: props.width || '100%', height: props.height || '100%' }}
        />
      )}
    </div>
  );
}
