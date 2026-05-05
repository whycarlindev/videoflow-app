import { PaginationParams } from '@/core/repositories/pagination-params'
import { Subscription } from '../../enterprise/entities/subscription'

export abstract class SubscriptionsRepository {
  abstract findBySubscriberAndChannel(
    subscriberId: string,
    channelId: string,
  ): Promise<Subscription | null>

  abstract findManyBySubscriberId(
    subscriberId: string,
    params: PaginationParams,
  ): Promise<Subscription[]>

  abstract countByChannelId(channelId: string): Promise<number>
  abstract create(subscription: Subscription): Promise<void>
  abstract delete(subscription: Subscription): Promise<void>
}
