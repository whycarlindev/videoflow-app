import { Subscription as PrismaSubscription } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Subscription } from '@/domain/account/enterprise/entities/subscription'

export class PrismaSubscriptionMapper {
  static toDomain(raw: PrismaSubscription): Subscription {
    return Subscription.create(
      {
        subscriberId: new UniqueEntityId(raw.subscriberId),
        channelId: new UniqueEntityId(raw.channelId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(subscription: Subscription) {
    return {
      id: subscription.id.toString(),
      subscriberId: subscription.subscriberId.toString(),
      channelId: subscription.channelId.toString(),
      createdAt: subscription.createdAt,
    }
  }
}
