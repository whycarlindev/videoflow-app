import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Playlist } from '../entities/playlist'

export class PlaylistCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public playlist: Playlist

  constructor(playlist: Playlist) {
    this.playlist = playlist
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.playlist.id
  }
}
