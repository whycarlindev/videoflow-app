import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { WatchHistoryRepository } from '../repositories/watch-history-repository'

type ClearWatchHistoryUseCaseRequest = {
  userId: string
}

type ClearWatchHistoryUseCaseResponse = Either<never, null>

@Injectable()
export class ClearWatchHistoryUseCase {
  constructor(private watchHistoryRepository: WatchHistoryRepository) {}

  async execute({
    userId,
  }: ClearWatchHistoryUseCaseRequest): Promise<ClearWatchHistoryUseCaseResponse> {
    await this.watchHistoryRepository.deleteAllByUserId(userId)

    return right(null)
  }
}
