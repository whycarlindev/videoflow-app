import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { VideoLikesRepository } from '../repositories/video-likes-repository'
import { VideosRepository } from '../repositories/videos-repository'

type UnlikeVideoUseCaseRequest = {
  videoId: string
  userId: string
}

type UnlikeVideoUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class UnlikeVideoUseCase {
  constructor(
    private videosRepository: VideosRepository,
    private videoLikesRepository: VideoLikesRepository,
  ) {}

  async execute({
    videoId,
    userId,
  }: UnlikeVideoUseCaseRequest): Promise<UnlikeVideoUseCaseResponse> {
    const video = await this.videosRepository.findById(videoId)

    if (!video) {
      return left(new ResourceNotFoundError())
    }

    const like = await this.videoLikesRepository.findByVideoAndUser(videoId, userId)

    if (!like) {
      return left(new ResourceNotFoundError())
    }

    await this.videoLikesRepository.delete(like)

    video.removeLike()

    await this.videosRepository.save(video)

    return right(null)
  }
}
