import { makeVideo } from 'test/factories/make-video'
import { makeVideoLike } from 'test/factories/make-video-like'
import { InMemoryVideoLikesRepository } from 'test/repositories/in-memory-video-likes-repository'
import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { LikeVideoUseCase } from '@/domain/video/application/use-cases/like-video'

describe('LikeVideoUseCase', () => {
  let videosRepository: InMemoryVideosRepository
  let videoLikesRepository: InMemoryVideoLikesRepository
  let sut: LikeVideoUseCase

  beforeEach(() => {
    videosRepository = new InMemoryVideosRepository()
    videoLikesRepository = new InMemoryVideoLikesRepository()
    sut = new LikeVideoUseCase(videosRepository, videoLikesRepository)
  })

  it('should like a video and increment likes count', async () => {
    const video = makeVideo()
    videosRepository.items.push(video)
    const userId = new UniqueEntityId()

    const result = await sut.execute({
      videoId: video.id.toString(),
      userId: userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(videosRepository.items[0].likesCount).toBe(1)
    expect(videoLikesRepository.items).toHaveLength(1)
  })

  it('should return VideoAlreadyLikedError on duplicate like', async () => {
    const video = makeVideo()
    videosRepository.items.push(video)
    const userId = new UniqueEntityId()

    const like = makeVideoLike({ videoId: video.id, userId })
    videoLikesRepository.items.push(like)

    const result = await sut.execute({
      videoId: video.id.toString(),
      userId: userId.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should return ResourceNotFoundError if video does not exist', async () => {
    const result = await sut.execute({
      videoId: 'non-existent',
      userId: 'any',
    })

    expect(result.isLeft()).toBe(true)
  })
})
