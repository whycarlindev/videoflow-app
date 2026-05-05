import { makeVideo } from 'test/factories/make-video'
import { makeWatchEntry } from 'test/factories/make-watch-entry'
import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { InMemoryWatchHistoryRepository } from 'test/repositories/in-memory-watch-history-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { RegisterWatchUseCase } from '@/domain/watch-history/application/use-cases/register-watch'

describe('RegisterWatchUseCase', () => {
  let watchHistoryRepository: InMemoryWatchHistoryRepository
  let videosRepository: InMemoryVideosRepository
  let sut: RegisterWatchUseCase

  beforeEach(() => {
    watchHistoryRepository = new InMemoryWatchHistoryRepository()
    videosRepository = new InMemoryVideosRepository()
    sut = new RegisterWatchUseCase(watchHistoryRepository, videosRepository)
  })

  it('should create a new watch entry and increment video views', async () => {
    const video = makeVideo()
    videosRepository.items.push(video)
    const userId = new UniqueEntityId()

    const result = await sut.execute({
      userId: userId.toString(),
      videoId: video.id.toString(),
      progressPercentage: 50,
    })

    expect(result.isRight()).toBe(true)
    expect(watchHistoryRepository.items).toHaveLength(1)
    expect(videosRepository.items[0].viewsCount).toBe(1)
  })

  it('should update an existing watch entry without incrementing views again', async () => {
    const userId = new UniqueEntityId()
    const video = makeVideo({ viewsCount: 1 })
    videosRepository.items.push(video)

    const entry = makeWatchEntry({
      userId,
      videoId: video.id,
      progressPercentage: 30,
    })
    watchHistoryRepository.items.push(entry)

    const result = await sut.execute({
      userId: userId.toString(),
      videoId: video.id.toString(),
      progressPercentage: 80,
    })

    expect(result.isRight()).toBe(true)
    expect(watchHistoryRepository.items).toHaveLength(1)
    expect(watchHistoryRepository.items[0].progressPercentage).toBe(80)
    expect(videosRepository.items[0].viewsCount).toBe(1)
  })

  it('should mark as completed when progress >= 95%', async () => {
    const video = makeVideo()
    videosRepository.items.push(video)

    const result = await sut.execute({
      userId: new UniqueEntityId().toString(),
      videoId: video.id.toString(),
      progressPercentage: 97,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.watchEntry.completed).toBe(true)
    }
  })

  it('should return ResourceNotFoundError if video does not exist', async () => {
    const result = await sut.execute({
      userId: 'any',
      videoId: 'non-existent',
      progressPercentage: 50,
    })

    expect(result.isLeft()).toBe(true)
  })
})
