import { makeComment } from 'test/factories/make-comment'
import { makeCommentLike } from 'test/factories/make-comment-like'
import { InMemoryCommentLikesRepository } from 'test/repositories/in-memory-comment-likes-repository'
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { LikeCommentUseCase } from '@/domain/comment/application/use-cases/like-comment'

describe('LikeCommentUseCase', () => {
  let commentsRepository: InMemoryCommentsRepository
  let commentLikesRepository: InMemoryCommentLikesRepository
  let sut: LikeCommentUseCase

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository()
    commentLikesRepository = new InMemoryCommentLikesRepository()
    sut = new LikeCommentUseCase(commentsRepository, commentLikesRepository)
  })

  it('should like a comment and increment likes count', async () => {
    const comment = makeComment()
    commentsRepository.items.push(comment)
    const userId = new UniqueEntityId()

    const result = await sut.execute({
      commentId: comment.id.toString(),
      userId: userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(commentsRepository.items[0].likesCount).toBe(1)
    expect(commentLikesRepository.items).toHaveLength(1)
  })

  it('should return CommentAlreadyLikedError on duplicate', async () => {
    const comment = makeComment()
    commentsRepository.items.push(comment)
    const userId = new UniqueEntityId()

    const like = makeCommentLike({ commentId: comment.id, userId })
    commentLikesRepository.items.push(like)

    const result = await sut.execute({
      commentId: comment.id.toString(),
      userId: userId.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should return ResourceNotFoundError if comment does not exist', async () => {
    const result = await sut.execute({
      commentId: 'non-existent',
      userId: 'any',
    })

    expect(result.isLeft()).toBe(true)
  })
})
