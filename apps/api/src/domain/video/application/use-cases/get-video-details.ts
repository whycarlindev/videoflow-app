import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Video } from '../../enterprise/entities/video'
import { VideosRepository } from '../repositories/videos-repository'

type GetVideoDetailsUseCaseRequest = {
  videoId: string
}

type GetVideoDetailsUseCaseResponse = Either<ResourceNotFoundError, { video: Video }>

@Injectable()
export class GetVideoDetailsUseCase {
  constructor(private videosRepository: VideosRepository) {}

  async execute({
    videoId,
  }: GetVideoDetailsUseCaseRequest): Promise<GetVideoDetailsUseCaseResponse> {
    const video = await this.videosRepository.findById(videoId)

    if (!video) {
      return left(new ResourceNotFoundError())
    }

    return right({ video })
  }
}
