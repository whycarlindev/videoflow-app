import { makeSubscription } from 'test/factories/make-subscription'
import { makeUser } from 'test/factories/make-user'
import { InMemorySubscriptionsRepository } from 'test/repositories/in-memory-subscriptions-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FollowUserUseCase } from '@/domain/account/application/use-cases/follow-user'

describe('FollowUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let subscriptionsRepository: InMemorySubscriptionsRepository
  let sut: FollowUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    sut = new FollowUserUseCase(usersRepository, subscriptionsRepository)
  })

  it('should follow a channel and increment subscriber count', async () => {
    const channel = makeUser()
    usersRepository.items.push(channel)
    const subscriberId = new UniqueEntityId()

    const result = await sut.execute({
      subscriberId: subscriberId.toString(),
      channelId: channel.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[0].subscribersCount).toBe(1)
    expect(subscriptionsRepository.items).toHaveLength(1)
  })

  it('should return AlreadyFollowingError on duplicate follow', async () => {
    const channel = makeUser()
    usersRepository.items.push(channel)
    const subscriberId = new UniqueEntityId()

    const sub = makeSubscription({
      subscriberId,
      channelId: channel.id,
    })
    subscriptionsRepository.items.push(sub)

    const result = await sut.execute({
      subscriberId: subscriberId.toString(),
      channelId: channel.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should return ResourceNotFoundError if channel does not exist', async () => {
    const result = await sut.execute({
      subscriberId: 'any',
      channelId: 'non-existent',
    })

    expect(result.isLeft()).toBe(true)
  })
})
