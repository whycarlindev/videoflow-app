import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { VideoRemovedFromPlaylistEvent } from '@/domain/playlist/enterprise/events/video-removed-from-playlist-event'

@Injectable()
export class OnVideoRemovedFromPlaylist implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as VideoRemovedFromPlaylistEvent),
      VideoRemovedFromPlaylistEvent.name,
    )
  }

  private handle(event: VideoRemovedFromPlaylistEvent): void {
    console.log(
      `[OnVideoRemovedFromPlaylist] Video ${event.videoId.toString()} removed from playlist ${event.playlist.id.toString()}`,
    )
  }
}
