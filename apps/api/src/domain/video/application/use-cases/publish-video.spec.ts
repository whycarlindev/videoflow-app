import { makeVideo } from 'test/factories/make-video'
import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { assert } from 'test/utils/assert'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PublishVideoUseCase } from '@/domain/video/application/use-cases/publish-video'
import { VideoStatus } from '@/domain/video/enterprise/entities/value-objects/video-status'

describe('PublishVideoUseCase', () => {
  let videosRepository: InMemoryVideosRepository
  let sut: PublishVideoUseCase

  beforeEach(() => {
    videosRepository = new InMemoryVideosRepository()
    sut = new PublishVideoUseCase(videosRepository)
  })

  it('should publish a pending video', async () => {
    const authorId = new UniqueEntityId()
    const video = makeVideo({ authorId })
    videosRepository.items.push(video)

    const result = await sut.execute({
      videoId: video.id.toString(),
      authorId: authorId.toString(),
    })

    assert(result.isRight())
    expect(result.value.video.status.isPublished()).toBe(true)
  })

  it('should return NotAllowedError if not the author', async () => {
    const video = makeVideo()
    videosRepository.items.push(video)

    const result = await sut.execute({
      videoId: video.id.toString(),
      authorId: 'wrong-author-id',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should return ResourceNotFoundError if video does not exist', async () => {
    const result = await sut.execute({
      videoId: 'non-existent',
      authorId: 'any',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should return VideoAlreadyPublishedError if already published', async () => {
    const authorId = new UniqueEntityId()
    const video = makeVideo({ authorId, status: VideoStatus.published() })
    videosRepository.items.push(video)

    const result = await sut.execute({
      videoId: video.id.toString(),
      authorId: authorId.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })
})
