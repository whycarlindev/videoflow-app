import { makeComment } from 'test/factories/make-comment'
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteCommentUseCase } from '@/domain/comment/application/use-cases/delete-comment'

describe('DeleteCommentUseCase', () => {
  let commentsRepository: InMemoryCommentsRepository
  let sut: DeleteCommentUseCase

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository()
    sut = new DeleteCommentUseCase(commentsRepository)
  })

  it('should delete a comment', async () => {
    const authorId = new UniqueEntityId()
    const comment = makeComment({ authorId })
    commentsRepository.items.push(comment)

    const result = await sut.execute({
      commentId: comment.id.toString(),
      authorId: authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(commentsRepository.items).toHaveLength(0)
  })

  it('should return NotAllowedError if not the author', async () => {
    const comment = makeComment()
    commentsRepository.items.push(comment)

    const result = await sut.execute({
      commentId: comment.id.toString(),
      authorId: 'wrong-author',
    })

    expect(result.isLeft()).toBe(true)
    expect(commentsRepository.items).toHaveLength(1)
  })

  it('should return ResourceNotFoundError if comment does not exist', async () => {
    const result = await sut.execute({
      commentId: 'non-existent',
      authorId: 'any',
    })

    expect(result.isLeft()).toBe(true)
  })
})
