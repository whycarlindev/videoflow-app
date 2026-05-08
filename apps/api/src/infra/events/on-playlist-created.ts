import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { PlaylistCreatedEvent } from '@/domain/playlist/enterprise/events/playlist-created-event'

@Injectable()
export class OnPlaylistCreated implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as PlaylistCreatedEvent),
      PlaylistCreatedEvent.name,
    )
  }

  private handle(event: PlaylistCreatedEvent): void {
    console.log(`[OnPlaylistCreated] Playlist created: ${event.playlist.id.toString()}`)
  }
}
