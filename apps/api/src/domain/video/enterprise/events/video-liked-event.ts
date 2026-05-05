import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Video } from '../entities/video'

export class VideoLikedEvent implements DomainEvent {
  public ocurredAt: Date
  public video: Video
  public userId: UniqueEntityId

  constructor(video: Video, userId: UniqueEntityId) {
    this.video = video
    this.userId = userId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.video.id
  }
}
