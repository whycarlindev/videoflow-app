import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { VideosRepository } from '@/domain/video/application/repositories/videos-repository'
import { Comment } from '../../enterprise/entities/comment'
import { CommentsRepository } from '../repositories/comments-repository'

type AddCommentUseCaseRequest = {
  videoId: string
  authorId: string
  content: string
}

type AddCommentUseCaseResponse = Either<ResourceNotFoundError, { comment: Comment }>

@Injectable()
export class AddCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private videosRepository: VideosRepository,
  ) {}

  async execute({
    videoId,
    authorId,
    content,
  }: AddCommentUseCaseRequest): Promise<AddCommentUseCaseResponse> {
    const video = await this.videosRepository.findById(videoId)

    if (!video) {
      return left(new ResourceNotFoundError())
    }

    const comment = Comment.create({
      videoId: new UniqueEntityId(videoId),
      authorId: new UniqueEntityId(authorId),
      content,
    })

    await this.commentsRepository.create(comment)

    return right({ comment })
  }
}
