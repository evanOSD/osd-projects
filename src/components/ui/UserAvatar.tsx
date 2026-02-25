// src/components/ui/UserAvatar.tsx

import React from 'react'

interface UserAvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar({ src, alt, fallback, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm'
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium overflow-hidden shrink-0 ${sizeClasses[size]}`}
    >
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className='w-full h-full object-cover' />
      ) : (
        <span>{fallback || '?'}</span>
      )}
    </div>
  )
}
