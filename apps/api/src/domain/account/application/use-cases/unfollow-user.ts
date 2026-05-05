import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SubscriptionsRepository } from '../repositories/subscriptions-repository'
import { UsersRepository } from '../repositories/users-repository'

type UnfollowUserUseCaseRequest = {
  subscriberId: string
  channelId: string
}

type UnfollowUserUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriberId,
    channelId,
  }: UnfollowUserUseCaseRequest): Promise<UnfollowUserUseCaseResponse> {
    const channel = await this.usersRepository.findById(channelId)

    if (!channel) {
      return left(new ResourceNotFoundError())
    }

    const subscription = await this.subscriptionsRepository.findBySubscriberAndChannel(
      subscriberId,
      channelId,
    )

    if (!subscription) {
      return left(new ResourceNotFoundError())
    }

    await this.subscriptionsRepository.delete(subscription)

    channel.decrementSubscribers()

    await this.usersRepository.save(channel)

    return right(null)
  }
}
