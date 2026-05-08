import { makeVideo } from 'test/factories/make-video'
import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { assert } from 'test/utils/assert'
import { VideoStatus } from '@/domain/video/enterprise/entities/value-objects/video-status'
import { ListVideosUseCase } from '@/domain/video/application/use-cases/list-videos'

describe('ListVideosUseCase', () => {
  let videosRepository: InMemoryVideosRepository
  let sut: ListVideosUseCase

  beforeEach(() => {
    videosRepository = new InMemoryVideosRepository()
    sut = new ListVideosUseCase(videosRepository)
  })

  it('should be able to list published videos', async () => {
    videosRepository.items.push(
      makeVideo({ status: VideoStatus.published() }),
      makeVideo({ status: VideoStatus.published() }),
      makeVideo({ status: VideoStatus.published() }),
    )

    const result = await sut.execute({ page: 1 })

    assert(result.isRight())
    expect(result.value.videos).toHaveLength(3)
  })

  it('should return empty array when no published videos exist', async () => {
    videosRepository.items.push(
      makeVideo({ status: VideoStatus.pending() }),
      makeVideo({ status: VideoStatus.processing() }),
    )

    const result = await sut.execute({ page: 1 })

    assert(result.isRight())
    expect(result.value.videos).toHaveLength(0)
  })

  it('should be able to paginate results', async () => {
    for (let i = 0; i < 25; i++) {
      videosRepository.items.push(makeVideo({ status: VideoStatus.published() }))
    }

    const result = await sut.execute({ page: 2, perPage: 20 })

    assert(result.isRight())
    expect(result.value.videos).toHaveLength(5)
  })
})
