import { makeVideo } from 'test/factories/make-video'
import { makeVideoLike } from 'test/factories/make-video-like'
import { InMemoryVideoLikesRepository } from 'test/repositories/in-memory-video-likes-repository'
import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnlikeVideoUseCase } from '@/domain/video/application/use-cases/unlike-video'

describe('UnlikeVideoUseCase', () => {
  let videosRepository: InMemoryVideosRepository
  let videoLikesRepository: InMemoryVideoLikesRepository
  let sut: UnlikeVideoUseCase

  beforeEach(() => {
    videosRepository = new InMemoryVideosRepository()
    videoLikesRepository = new InMemoryVideoLikesRepository()
    sut = new UnlikeVideoUseCase(videosRepository, videoLikesRepository)
  })

  it('should remove a like and decrement likes count', async () => {
    const userId = new UniqueEntityId()
    const video = makeVideo({ likesCount: 1 })
    videosRepository.items.push(video)

    const like = makeVideoLike({ videoId: video.id, userId })
    videoLikesRepository.items.push(like)

    const result = await sut.execute({
      videoId: video.id.toString(),
      userId: userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(videoLikesRepository.items).toHaveLength(0)
    expect(videosRepository.items[0].likesCount).toBe(0)
  })

  it('should return ResourceNotFoundError if like does not exist', async () => {
    const video = makeVideo()
    videosRepository.items.push(video)

    const result = await sut.execute({
      videoId: video.id.toString(),
      userId: 'no-like-user',
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
