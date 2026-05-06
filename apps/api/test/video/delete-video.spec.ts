import { makeVideo } from 'test/factories/make-video'
import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteVideoUseCase } from '@/domain/video/application/use-cases/delete-video'

describe('DeleteVideoUseCase', () => {
  let videosRepository: InMemoryVideosRepository
  let sut: DeleteVideoUseCase

  beforeEach(() => {
    videosRepository = new InMemoryVideosRepository()
    sut = new DeleteVideoUseCase(videosRepository)
  })

  it('should soft-delete a video (status → deleted)', async () => {
    const authorId = new UniqueEntityId()
    const video = makeVideo({ authorId })
    videosRepository.items.push(video)

    const result = await sut.execute({
      videoId: video.id.toString(),
      authorId: authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(videosRepository.items[0].status.isDeleted()).toBe(true)
  })

  it('should return NotAllowedError if not the author', async () => {
    const video = makeVideo()
    videosRepository.items.push(video)

    const result = await sut.execute({
      videoId: video.id.toString(),
      authorId: 'wrong-author',
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
})
