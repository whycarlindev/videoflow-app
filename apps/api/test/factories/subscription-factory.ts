import { Injectable } from '@nestjs/common'

import { SubscriptionProps } from '@/domain/account/enterprise/entities/subscription'
import { PrismaSubscriptionMapper } from '@/infra/database/prisma/mappers/prisma-subscription-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeSubscription } from './make-subscription'

@Injectable()
export class SubscriptionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSubscription(override: Partial<SubscriptionProps> = {}) {
    const subscription = makeSubscription(override)

    await this.prisma.subscription.create({
      data: PrismaSubscriptionMapper.toPrisma(subscription),
    })

    return subscription
  }
}
