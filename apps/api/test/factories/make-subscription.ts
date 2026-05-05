import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Subscription, SubscriptionProps } from '@/domain/account/enterprise/entities/subscription'

export function makeSubscription(
  override: Partial<SubscriptionProps> = {},
  id?: UniqueEntityId,
): Subscription {
  return Subscription.create(
    {
      subscriberId: new UniqueEntityId(),
      channelId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
