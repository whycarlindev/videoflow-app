import { makeVideo } from 'test/factories/make-video'
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository'
import { InMemoryVideosRepository } from 'test/repositories/in-memory-videos-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AddCommentUseCase } from '@/domain/comment/application/use-cases/add-comment'

describe('AddCommentUseCase', () => {
  let commentsRepository: InMemoryCommentsRepository
  let videosRepository: InMemoryVideosRepository
  let sut: AddCommentUseCase

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository()
    videosRepository = new InMemoryVideosRepository()
    sut = new AddCommentUseCase(commentsRepository, videosRepository)
  })

  it('should add a comment to an existing video', async () => {
    const video = makeVideo()
    videosRepository.items.push(video)

    const result = await sut.execute({
      videoId: video.id.toString(),
      authorId: 'author-1',
      content: 'Great video!',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.comment.content).toBe('Great video!')
      expect(commentsRepository.items).toHaveLength(1)
    }
  })

  it('should return ResourceNotFoundError if video does not exist', async () => {
    const result = await sut.execute({
      videoId: 'non-existent',
      authorId: 'author-1',
      content: 'Comment',
    })

    expect(result.isLeft()).toBe(true)
  })
})
