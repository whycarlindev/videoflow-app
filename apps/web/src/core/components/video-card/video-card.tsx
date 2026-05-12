import * as React from 'react'

import { cn } from '@/core/lib/utils'

function VideoCard({ className, ...props }: React.ComponentProps<'article'>) {
  return (
    <article
      data-slot="video-card"
      className={cn('group/video-card flex w-[300px] flex-col gap-2.5', className)}
      {...props}
    />
  )
}

function VideoCardThumbnail({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="video-card-thumbnail"
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-lg bg-surface-container',
        className,
      )}
      {...props}
    />
  )
}

function VideoCardDuration({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="video-card-duration"
      className={cn(
        'absolute right-1.5 bottom-1.5 inline-flex min-h-5 min-w-[30px] items-center justify-center rounded-sm bg-black/80 px-1.5 py-[3px] text-[10px] font-medium leading-none text-white',
        className,
      )}
      {...props}
    />
  )
}

function VideoCardMeta({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="video-card-meta"
      className={cn('flex w-full gap-2.5', className)}
      {...props}
    />
  )
}

function VideoCardAvatar({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="video-card-avatar"
      className={cn('size-7 shrink-0 rounded-full bg-muted', className)}
      {...props}
    />
  )
}

function VideoCardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="video-card-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-[3px]', className)}
      {...props}
    />
  )
}

function VideoCardTitle({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="video-card-title"
      className={cn(
        'line-clamp-2 text-[13px] leading-[1.35] font-semibold text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function VideoCardAuthor({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="video-card-author"
      className={cn('text-xs font-normal text-muted-foreground', className)}
      {...props}
    />
  )
}

function VideoCardStats({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="video-card-stats"
      className={cn('text-[11px] font-normal text-muted-foreground/70', className)}
      {...props}
    />
  )
}

export {
  VideoCard,
  VideoCardAuthor,
  VideoCardAvatar,
  VideoCardContent,
  VideoCardDuration,
  VideoCardMeta,
  VideoCardStats,
  VideoCardThumbnail,
  VideoCardTitle,
}
