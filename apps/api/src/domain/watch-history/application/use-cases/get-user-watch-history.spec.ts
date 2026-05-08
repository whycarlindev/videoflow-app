import { makeWatchEntry } from 'test/factories/make-watch-entry'
import { InMemoryWatchHistoryRepository } from 'test/repositories/in-memory-watch-history-repository'
import { assert } from 'test/utils/assert'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { GetUserWatchHistoryUseCase } from '@/domain/watch-history/application/use-cases/get-user-watch-history'

describe('GetUserWatchHistoryUseCase', () => {
  let watchHistoryRepository: InMemoryWatchHistoryRepository
  let sut: GetUserWatchHistoryUseCase

  beforeEach(() => {
    watchHistoryRepository = new InMemoryWatchHistoryRepository()
    sut = new GetUserWatchHistoryUseCase(watchHistoryRepository)
  })

  it('should be able to get watch history for a user', async () => {
    const userId = new UniqueEntityId()

    watchHistoryRepository.items.push(
      makeWatchEntry({ userId }),
      makeWatchEntry({ userId }),
      makeWatchEntry({ userId }),
    )

    const result = await sut.execute({
      userId: userId.toString(),
      page: 1,
    })

    assert(result.isRight())
    expect(result.value.watchHistory).toHaveLength(3)
  })

  it('should return only entries belonging to the requested user', async () => {
    const userId = new UniqueEntityId()
    const otherUserId = new UniqueEntityId()

    watchHistoryRepository.items.push(
      makeWatchEntry({ userId }),
      makeWatchEntry({ userId }),
      makeWatchEntry({ userId: otherUserId }),
    )

    const result = await sut.execute({
      userId: userId.toString(),
      page: 1,
    })

    assert(result.isRight())
    expect(result.value.watchHistory).toHaveLength(2)
    expect(
      result.value.watchHistory.every((entry) => entry.userId.equals(userId)),
    ).toBe(true)
  })

  it('should be able to paginate results', async () => {
    const userId = new UniqueEntityId()

    for (let i = 0; i < 25; i++) {
      watchHistoryRepository.items.push(makeWatchEntry({ userId }))
    }

    const result = await sut.execute({
      userId: userId.toString(),
      page: 2,
      perPage: 20,
    })

    assert(result.isRight())
    expect(result.value.watchHistory).toHaveLength(5)
  })
})
