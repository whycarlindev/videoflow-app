import { makeSubscription } from 'test/factories/make-subscription'
import { makeUser } from 'test/factories/make-user'
import { InMemorySubscriptionsRepository } from 'test/repositories/in-memory-subscriptions-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnfollowUserUseCase } from '@/domain/account/application/use-cases/unfollow-user'

describe('UnfollowUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let subscriptionsRepository: InMemorySubscriptionsRepository
  let sut: UnfollowUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    sut = new UnfollowUserUseCase(usersRepository, subscriptionsRepository)
  })

  it('should unfollow a channel and decrement subscriber count', async () => {
    const subscriberId = new UniqueEntityId()
    const channel = makeUser({ subscribersCount: 1 })
    usersRepository.items.push(channel)

    const sub = makeSubscription({ subscriberId, channelId: channel.id })
    subscriptionsRepository.items.push(sub)

    const result = await sut.execute({
      subscriberId: subscriberId.toString(),
      channelId: channel.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(subscriptionsRepository.items).toHaveLength(0)
    expect(usersRepository.items[0].subscribersCount).toBe(0)
  })

  it('should return ResourceNotFoundError if not following', async () => {
    const channel = makeUser()
    usersRepository.items.push(channel)

    const result = await sut.execute({
      subscriberId: 'any',
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
