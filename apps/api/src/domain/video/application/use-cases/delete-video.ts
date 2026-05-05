import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { VideosRepository } from '../repositories/videos-repository'

type DeleteVideoUseCaseRequest = {
  videoId: string
  authorId: string
}

type DeleteVideoUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>

@Injectable()
export class DeleteVideoUseCase {
  constructor(private videosRepository: VideosRepository) {}

  async execute({
    videoId,
    authorId,
  }: DeleteVideoUseCaseRequest): Promise<DeleteVideoUseCaseResponse> {
    const video = await this.videosRepository.findById(videoId)

    if (!video) {
      return left(new ResourceNotFoundError())
    }

    if (video.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    video.delete()

    await this.videosRepository.save(video)

    return right(null)
  }
}
