import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Comment } from '../entities/comment'

export class CommentLikedEvent implements DomainEvent {
  public ocurredAt: Date
  public comment: Comment
  public userId: UniqueEntityId

  constructor(comment: Comment, userId: UniqueEntityId) {
    this.comment = comment
    this.userId = userId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.comment.id
  }
}
