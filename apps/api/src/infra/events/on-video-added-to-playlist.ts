import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { VideoAddedToPlaylistEvent } from '@/domain/playlist/enterprise/events/video-added-to-playlist-event'

@Injectable()
export class OnVideoAddedToPlaylist implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as VideoAddedToPlaylistEvent),
      VideoAddedToPlaylistEvent.name,
    )
  }

  private handle(event: VideoAddedToPlaylistEvent): void {
    console.log(
      `[OnVideoAddedToPlaylist] Video ${event.videoId.toString()} added to playlist ${event.playlist.id.toString()}`,
    )
  }
}
