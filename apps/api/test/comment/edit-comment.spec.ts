import { makeComment } from 'test/factories/make-comment'
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository'
import { assert } from 'test/utils/assert'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditCommentUseCase } from '@/domain/comment/application/use-cases/edit-comment'

describe('EditCommentUseCase', () => {
  let commentsRepository: InMemoryCommentsRepository
  let sut: EditCommentUseCase

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository()
    sut = new EditCommentUseCase(commentsRepository)
  })

  it('should be able to edit a comment content', async () => {
    const authorId = new UniqueEntityId()
    const comment = makeComment({ authorId, content: 'Old content' })
    commentsRepository.items.push(comment)

    const result = await sut.execute({
      commentId: comment.id.toString(),
      authorId: authorId.toString(),
      content: 'New content',
    })

    assert(result.isRight())
    expect(result.value.comment.content).toBe('New content')
  })

  it('should return NotAllowedError if not the author', async () => {
    const comment = makeComment()
    commentsRepository.items.push(comment)

    const result = await sut.execute({
      commentId: comment.id.toString(),
      authorId: 'wrong-author',
      content: 'Hacked',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should return ResourceNotFoundError if comment does not exist', async () => {
    const result = await sut.execute({
      commentId: 'non-existent',
      authorId: 'any',
      content: 'Content',
    })

    expect(result.isLeft()).toBe(true)
  })
})
