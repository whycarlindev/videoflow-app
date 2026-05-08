import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { SubscriptionsRepository } from '@/domain/account/application/repositories/subscriptions-repository'
import { Subscription } from '@/domain/account/enterprise/entities/subscription'
import { PrismaSubscriptionMapper } from '../mappers/prisma-subscription-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  constructor(private prisma: PrismaService) {}

  async findBySubscriberAndChannel(
    subscriberId: string,
    channelId: string,
  ): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { subscriberId, channelId },
    })
    if (!subscription) return null
    return PrismaSubscriptionMapper.toDomain(subscription)
  }

  async findManyBySubscriberId(
    subscriberId: string,
    params: PaginationParams,
  ): Promise<Subscription[]> {
    const { page, perPage = 20 } = params
    const subscriptions = await this.prisma.subscription.findMany({
      where: { subscriberId },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    })
    return subscriptions.map(PrismaSubscriptionMapper.toDomain)
  }

  async countByChannelId(channelId: string): Promise<number> {
    return this.prisma.subscription.count({ where: { channelId } })
  }

  async create(subscription: Subscription): Promise<void> {
    const data = PrismaSubscriptionMapper.toPrisma(subscription)
    await this.prisma.subscription.create({ data })
  }

  async delete(subscription: Subscription): Promise<void> {
    await this.prisma.subscription.delete({ where: { id: subscription.id.toString() } })
  }
}
