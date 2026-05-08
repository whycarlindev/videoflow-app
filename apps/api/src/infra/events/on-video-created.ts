import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { VideoCreatedEvent } from '@/domain/video/enterprise/events/video-created-event'

@Injectable()
export class OnVideoCreated implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as VideoCreatedEvent),
      VideoCreatedEvent.name,
    )
  }

  private handle(event: VideoCreatedEvent): void {
    console.log(`[OnVideoCreated] Video created: ${event.video.id.toString()}`)
  }
}
