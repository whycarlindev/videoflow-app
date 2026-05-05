import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UploadVideoUseCase } from '@/domain/video/application/use-cases/upload-video'

describe('UploadVideoUseCase', () => {
  let videosRepository: InMemoryVideosRepository
  let sut: UploadVideoUseCase

  beforeEach(() => {
    videosRepository = new InMemoryVideosRepository()
    sut = new UploadVideoUseCase(videosRepository)
  })

  it('should create a video with pending status', async () => {
    const result = await sut.execute({
      title: 'My First Video',
      description: 'This is a description',
      authorId: 'author-1',
      tags: ['nodejs', 'typescript'],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.video.status.isPending()).toBe(true)
      expect(result.value.video.title).toBe('My First Video')
      expect(result.value.video.slug.value).toBe('my-first-video')
      expect(result.value.video.tags.getItems()).toEqual(['nodejs', 'typescript'])
      expect(videosRepository.items).toHaveLength(1)
    }
  })

  it('should auto-generate slug from title', async () => {
    const result = await sut.execute({
      title: 'Hello World! This is a Video',
      description: 'desc',
      authorId: 'author-1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.video.slug.value).toBe('hello-world-this-is-a-video')
    }
  })
})
