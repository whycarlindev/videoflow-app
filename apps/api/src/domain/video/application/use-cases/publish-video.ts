import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Video } from '../../enterprise/entities/video'
import { InvalidVideoStateError } from '../../enterprise/errors/invalid-video-state-error'
import { VideosRepository } from '../repositories/videos-repository'
import { VideoAlreadyPublishedError } from './errors/video-already-published-error'

type PublishVideoUseCaseRequest = {
  videoId: string
  authorId: string
}

type PublishVideoUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | VideoAlreadyPublishedError | InvalidVideoStateError,
  { video: Video }
>

@Injectable()
export class PublishVideoUseCase {
  constructor(private videosRepository: VideosRepository) {}

  async execute({
    videoId,
    authorId,
  }: PublishVideoUseCaseRequest): Promise<PublishVideoUseCaseResponse> {
    const video = await this.videosRepository.findById(videoId)

    if (!video) {
      return left(new ResourceNotFoundError())
    }

    if (video.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    if (video.status.isPublished()) {
      return left(new VideoAlreadyPublishedError())
    }

    const publishResult = video.publish()
    if (publishResult.isLeft()) {
      return left(publishResult.value)
    }

    await this.videosRepository.save(video)

    return right({ video })
  }
}
