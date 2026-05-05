import { PaginationParams } from '@/core/repositories/pagination-params'
import { SubscriptionsRepository } from '@/domain/account/application/repositories/subscriptions-repository'
import { Subscription } from '@/domain/account/enterprise/entities/subscription'

export class InMemorySubscriptionsRepository implements SubscriptionsRepository {
  public items: Subscription[] = []

  async findBySubscriberAndChannel(
    subscriberId: string,
    channelId: string,
  ): Promise<Subscription | null> {
    return (
      this.items.find(
        (item) =>
          item.subscriberId.toString() === subscriberId && item.channelId.toString() === channelId,
      ) ?? null
    )
  }

  async findManyBySubscriberId(
    subscriberId: string,
    { page, perPage = 20 }: PaginationParams,
  ): Promise<Subscription[]> {
    return this.items
      .filter((item) => item.subscriberId.toString() === subscriberId)
      .slice((page - 1) * perPage, page * perPage)
  }

  async countByChannelId(channelId: string): Promise<number> {
    return this.items.filter((item) => item.channelId.toString() === channelId).length
  }

  async create(subscription: Subscription): Promise<void> {
    this.items.push(subscription)
  }

  async delete(subscription: Subscription): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(subscription.id))
  }
}
