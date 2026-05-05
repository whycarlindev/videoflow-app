import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface SubscriptionProps {
  subscriberId: UniqueEntityId
  channelId: UniqueEntityId
  createdAt: Date
}

export class Subscription extends Entity<SubscriptionProps> {
  get subscriberId(): UniqueEntityId {
    return this.props.subscriberId
  }
  get channelId(): UniqueEntityId {
    return this.props.channelId
  }
  get createdAt(): Date {
    return this.props.createdAt
  }

  private constructor(props: SubscriptionProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(props: Omit<SubscriptionProps, 'createdAt'>, id?: UniqueEntityId): Subscription {
    return new Subscription({ ...props, createdAt: new Date() }, id)
  }
}
