import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Subscription } from '../../enterprise/entities/subscription'
import { SubscriptionsRepository } from '../repositories/subscriptions-repository'
import { UsersRepository } from '../repositories/users-repository'
import { AlreadyFollowingError } from './errors/already-following-error'

type FollowUserUseCaseRequest = {
  subscriberId: string
  channelId: string
}

type FollowUserUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyFollowingError,
  { subscription: Subscription }
>

@Injectable()
export class FollowUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    subscriberId,
    channelId,
  }: FollowUserUseCaseRequest): Promise<FollowUserUseCaseResponse> {
    const channel = await this.usersRepository.findById(channelId)

    if (!channel) {
      return left(new ResourceNotFoundError())
    }

    const existingSubscription = await this.subscriptionsRepository.findBySubscriberAndChannel(
      subscriberId,
      channelId,
    )

    if (existingSubscription) {
      return left(new AlreadyFollowingError())
    }

    const subscription = Subscription.create({
      subscriberId: new UniqueEntityId(subscriberId),
      channelId: new UniqueEntityId(channelId),
    })

    await this.subscriptionsRepository.create(subscription)

    channel.incrementSubscribers()

    await this.usersRepository.save(channel)

    return right({ subscription })
  }
}
