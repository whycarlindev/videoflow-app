import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CommentLike } from '../../enterprise/entities/comment-like'
import { CommentLikesRepository } from '../repositories/comment-likes-repository'
import { CommentsRepository } from '../repositories/comments-repository'
import { CommentAlreadyLikedError } from './errors/comment-already-liked-error'

type LikeCommentUseCaseRequest = {
  commentId: string
  userId: string
}

type LikeCommentUseCaseResponse = Either<
  ResourceNotFoundError | CommentAlreadyLikedError,
  { like: CommentLike }
>

@Injectable()
export class LikeCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private commentLikesRepository: CommentLikesRepository,
  ) {}

  async execute({
    commentId,
    userId,
  }: LikeCommentUseCaseRequest): Promise<LikeCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId)

    if (!comment) {
      return left(new ResourceNotFoundError())
    }

    const existingLike = await this.commentLikesRepository.findByCommentAndUser(commentId, userId)

    if (existingLike) {
      return left(new CommentAlreadyLikedError())
    }

    const like = CommentLike.create({
      commentId: new UniqueEntityId(commentId),
      userId: new UniqueEntityId(userId),
    })

    await this.commentLikesRepository.create(like)

    comment.addLike(new UniqueEntityId(userId))

    await this.commentsRepository.save(comment)

    return right({ like })
  }
}
