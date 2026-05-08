import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { VideoPublishedEvent } from '@/domain/video/enterprise/events/video-published-event'

@Injectable()
export class OnVideoPublished implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as VideoPublishedEvent),
      VideoPublishedEvent.name,
    )
  }

  private handle(event: VideoPublishedEvent): void {
    console.log(`[OnVideoPublished] Video published: ${event.video.id.toString()}`)
  }
}
