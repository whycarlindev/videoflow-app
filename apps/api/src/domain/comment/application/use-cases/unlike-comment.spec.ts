import { makeComment } from 'test/factories/make-comment'
import { makeCommentLike } from 'test/factories/make-comment-like'
import { InMemoryCommentLikesRepository } from 'test/repositories/in-memory-comment-likes-repository'
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository'
import { assert } from 'test/utils/assert'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnlikeCommentUseCase } from '@/domain/comment/application/use-cases/unlike-comment'

describe('UnlikeCommentUseCase', () => {
  let commentsRepository: InMemoryCommentsRepository
  let commentLikesRepository: InMemoryCommentLikesRepository
  let sut: UnlikeCommentUseCase

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository()
    commentLikesRepository = new InMemoryCommentLikesRepository()
    sut = new UnlikeCommentUseCase(commentsRepository, commentLikesRepository)
  })

  it('should be able to unlike a comment and decrement likesCount', async () => {
    const userId = new UniqueEntityId()
    const comment = makeComment()
    comment.addLike(userId)
    commentsRepository.items.push(comment)

    const like = makeCommentLike({ commentId: comment.id, userId })
    commentLikesRepository.items.push(like)

    const result = await sut.execute({
      commentId: comment.id.toString(),
      userId: userId.toString(),
    })

    assert(result.isRight())
    expect(commentsRepository.items[0].likesCount).toBe(0)
    expect(commentLikesRepository.items).toHaveLength(0)
  })

  it('should not be able to unlike if comment does not exist', async () => {
    const result = await sut.execute({
      commentId: 'non-existent',
      userId: 'any',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not be able to unlike if user has not liked the comment', async () => {
    const comment = makeComment()
    commentsRepository.items.push(comment)

    const result = await sut.execute({
      commentId: comment.id.toString(),
      userId: new UniqueEntityId().toString(),
    })

    expect(result.isLeft()).toBe(true)
  })
})
