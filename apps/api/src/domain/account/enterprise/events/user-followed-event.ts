import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

export class UserFollowedEvent implements DomainEvent {
  public ocurredAt: Date

  constructor(
    public readonly subscriberId: UniqueEntityId,
    public readonly channelId: UniqueEntityId,
  ) {
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.channelId
  }
}
