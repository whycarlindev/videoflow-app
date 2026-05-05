import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Comment } from '../../enterprise/entities/comment'
import { CommentsRepository } from '../repositories/comments-repository'

type EditCommentUseCaseRequest = {
  commentId: string
  authorId: string
  content: string
}

type EditCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { comment: Comment }
>

@Injectable()
export class EditCommentUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    commentId,
    authorId,
    content,
  }: EditCommentUseCaseRequest): Promise<EditCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId)

    if (!comment) {
      return left(new ResourceNotFoundError())
    }

    if (comment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    comment.edit(content)

    await this.commentsRepository.save(comment)

    return right({ comment })
  }
}
