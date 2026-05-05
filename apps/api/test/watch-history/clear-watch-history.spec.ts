import { makeWatchEntry } from 'test/factories/make-watch-entry'
import { InMemoryWatchHistoryRepository } from 'test/repositories/in-memory-watch-history-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ClearWatchHistoryUseCase } from '@/domain/watch-history/application/use-cases/clear-watch-history'

describe('ClearWatchHistoryUseCase', () => {
  let watchHistoryRepository: InMemoryWatchHistoryRepository
  let sut: ClearWatchHistoryUseCase

  beforeEach(() => {
    watchHistoryRepository = new InMemoryWatchHistoryRepository()
    sut = new ClearWatchHistoryUseCase(watchHistoryRepository)
  })

  it('should clear all watch entries for a user', async () => {
    const userId = new UniqueEntityId()
    const anotherUserId = new UniqueEntityId()

    watchHistoryRepository.items.push(
      makeWatchEntry({ userId }),
      makeWatchEntry({ userId }),
      makeWatchEntry({ userId: anotherUserId }),
    )

    const result = await sut.execute({ userId: userId.toString() })

    expect(result.isRight()).toBe(true)
    expect(watchHistoryRepository.items).toHaveLength(1)
    expect(watchHistoryRepository.items[0].userId.equals(anotherUserId)).toBe(true)
  })

  it('should succeed even if user has no watch history', async () => {
    const result = await sut.execute({ userId: 'user-with-no-history' })

    expect(result.isRight()).toBe(true)
    expect(watchHistoryRepository.items).toHaveLength(0)
  })
})
