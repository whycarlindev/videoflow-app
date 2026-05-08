import { makeVideo } from 'test/factories/make-video'
import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { assert } from 'test/utils/assert'
import { GetVideoDetailsUseCase } from '@/domain/video/application/use-cases/get-video-details'

describe('GetVideoDetailsUseCase', () => {
  let videosRepository: InMemoryVideosRepository
  let sut: GetVideoDetailsUseCase

  beforeEach(() => {
    videosRepository = new InMemoryVideosRepository()
    sut = new GetVideoDetailsUseCase(videosRepository)
  })

  it('should be able to get a video by id', async () => {
    const video = makeVideo()
    videosRepository.items.push(video)

    const result = await sut.execute({
      videoId: video.id.toString(),
    })

    assert(result.isRight())
    expect(result.value.video.id).toEqual(video.id)
  })

  it('should not be able to get if video does not exist', async () => {
    const result = await sut.execute({
      videoId: 'non-existent',
    })

    expect(result.isLeft()).toBe(true)
  })
})
