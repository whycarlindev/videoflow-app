import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CommentLikesRepository } from '../repositories/comment-likes-repository'
import { CommentsRepository } from '../repositories/comments-repository'

type UnlikeCommentUseCaseRequest = {
  commentId: string
  userId: string
}

type UnlikeCommentUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class UnlikeCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private commentLikesRepository: CommentLikesRepository,
  ) {}

  async execute({
    commentId,
    userId,
  }: UnlikeCommentUseCaseRequest): Promise<UnlikeCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId)

    if (!comment) {
      return left(new ResourceNotFoundError())
    }

    const like = await this.commentLikesRepository.findByCommentAndUser(commentId, userId)

    if (!like) {
      return left(new ResourceNotFoundError())
    }

    await this.commentLikesRepository.delete(like)

    comment.removeLike()

    await this.commentsRepository.save(comment)

    return right(null)
  }
}
