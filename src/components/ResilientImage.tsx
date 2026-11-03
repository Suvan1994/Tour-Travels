import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  fallbackLabel?: string;
  eager?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackIcon = 'directions_car',
  fallbackLabel,
  eager = false,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className="w-full h-full bg-gradient-to-br from-primary-container via-primary to-secondary/80 flex flex-col items-center justify-center p-4 text-center select-none"
        role="img"
        aria-label={alt}
      >
        <span className="material-symbols-outlined text-rating-gold text-[40px] mb-1.5">
          {fallbackIcon}
        </span>
        {fallbackLabel && (
          <span className="text-label-md text-surface-canvas/90 font-semibold line-clamp-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
