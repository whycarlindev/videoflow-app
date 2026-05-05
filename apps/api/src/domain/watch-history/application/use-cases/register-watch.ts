import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { VideosRepository } from '@/domain/video/application/repositories/videos-repository'
import { WatchEntry } from '../../enterprise/entities/watch-entry'
import { WatchHistoryRepository } from '../repositories/watch-history-repository'

type RegisterWatchUseCaseRequest = {
  userId: string
  videoId: string
  progressPercentage: number
}

type RegisterWatchUseCaseResponse = Either<ResourceNotFoundError, { watchEntry: WatchEntry }>

@Injectable()
export class RegisterWatchUseCase {
  constructor(
    private watchHistoryRepository: WatchHistoryRepository,
    private videosRepository: VideosRepository,
  ) {}

  async execute({
    userId,
    videoId,
    progressPercentage,
  }: RegisterWatchUseCaseRequest): Promise<RegisterWatchUseCaseResponse> {
    const video = await this.videosRepository.findById(videoId)

    if (!video) {
      return left(new ResourceNotFoundError())
    }

    const existingEntry = await this.watchHistoryRepository.findByUserAndVideo(userId, videoId)

    if (existingEntry) {
      existingEntry.updateProgress(progressPercentage)
      await this.watchHistoryRepository.upsert(existingEntry)
      return right({ watchEntry: existingEntry })
    }

    const watchEntry = WatchEntry.create({
      userId: new UniqueEntityId(userId),
      videoId: new UniqueEntityId(videoId),
      progressPercentage,
    })

    await this.watchHistoryRepository.upsert(watchEntry)

    video.incrementViews()
    await this.videosRepository.save(video)

    return right({ watchEntry })
  }
}
