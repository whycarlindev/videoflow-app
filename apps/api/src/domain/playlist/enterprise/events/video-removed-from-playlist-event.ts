import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Playlist } from '../entities/playlist'

export class VideoRemovedFromPlaylistEvent implements DomainEvent {
  public ocurredAt: Date

  constructor(
    public readonly playlist: Playlist,
    public readonly videoId: UniqueEntityId,
  ) {
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.playlist.id
  }
}
