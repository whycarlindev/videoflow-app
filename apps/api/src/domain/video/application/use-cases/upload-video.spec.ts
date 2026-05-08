import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { FakeVideoUploader } from 'test/storage/fake-video-uploader'
import { assert } from 'test/utils/assert'
import { UploadVideoUseCase } from '@/domain/video/application/use-cases/upload-video'

describe('UploadVideoUseCase', () => {
  let videosRepository: InMemoryVideosRepository
  let videoUploader: FakeVideoUploader
  let sut: UploadVideoUseCase

  beforeEach(() => {
    videosRepository = new InMemoryVideosRepository()
    videoUploader = new FakeVideoUploader()
    sut = new UploadVideoUseCase(videosRepository, videoUploader)
  })

  it('should create a video with pending status and set the storage url', async () => {
    const result = await sut.execute({
      title: 'My First Video',
      description: 'This is a description',
      authorId: 'author-1',
      fileName: 'my-first-video.mp4',
      fileType: 'video/mp4',
      fileBody: Buffer.from('fake-content'),
      tags: ['nodejs', 'typescript'],
    })

    expect(result.isRight()).toBe(true)
    assert(result.isRight())
    expect(result.value.video.status.isPending()).toBe(true)
    expect(result.value.video.title).toBe('My First Video')
    expect(result.value.video.slug.value).toBe('my-first-video')
    expect(result.value.video.tags.getItems()).toEqual(['nodejs', 'typescript'])
    expect(result.value.video.url).toBe('https://storage.fake/my-first-video.mp4')
    expect(videosRepository.items).toHaveLength(1)
    expect(videoUploader.uploads).toHaveLength(1)
  })

  it('should auto-generate slug from title', async () => {
    const result = await sut.execute({
      title: 'Hello World! This is a Video',
      description: 'desc',
      authorId: 'author-1',
      fileName: 'video.mp4',
      fileType: 'video/mp4',
      fileBody: Buffer.from('fake-content'),
    })

    assert(result.isRight())
    expect(result.value.video.slug.value).toBe('hello-world-this-is-a-video')
  })
})
