import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { VideoLike } from '../../enterprise/entities/video-like'
import { VideoLikesRepository } from '../repositories/video-likes-repository'
import { VideosRepository } from '../repositories/videos-repository'
import { VideoAlreadyLikedError } from './errors/video-already-liked-error'

type LikeVideoUseCaseRequest = {
  videoId: string
  userId: string
}

type LikeVideoUseCaseResponse = Either<
  ResourceNotFoundError | VideoAlreadyLikedError,
  { like: VideoLike }
>

@Injectable()
export class LikeVideoUseCase {
  constructor(
    private videosRepository: VideosRepository,
    private videoLikesRepository: VideoLikesRepository,
  ) {}

  async execute({ videoId, userId }: LikeVideoUseCaseRequest): Promise<LikeVideoUseCaseResponse> {
    const video = await this.videosRepository.findById(videoId)

    if (!video) {
      return left(new ResourceNotFoundError())
    }

    const existingLike = await this.videoLikesRepository.findByVideoAndUser(videoId, userId)

    if (existingLike) {
      return left(new VideoAlreadyLikedError())
    }

    const like = VideoLike.create({
      videoId: new UniqueEntityId(videoId),
      userId: new UniqueEntityId(userId),
    })

    await this.videoLikesRepository.create(like)

    video.addLike(new UniqueEntityId(userId))

    await this.videosRepository.save(video)

    return right({ like })
  }
}
