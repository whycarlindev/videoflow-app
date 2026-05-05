import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Video } from '../entities/video'

export class VideoCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public video: Video

  constructor(video: Video) {
    this.video = video
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.video.id
  }
}
