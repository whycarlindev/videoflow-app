import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { VideoLikedEvent } from '@/domain/video/enterprise/events/video-liked-event'

@Injectable()
export class OnVideoLiked implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as VideoLikedEvent),
      VideoLikedEvent.name,
    )
  }

  private handle(event: VideoLikedEvent): void {
    console.log(
      `[OnVideoLiked] Video ${event.video.id.toString()} liked by ${event.userId.toString()}`,
    )
  }
}
