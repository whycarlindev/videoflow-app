import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { WatchEntry } from '../../enterprise/entities/watch-entry'
import { WatchHistoryRepository } from '../repositories/watch-history-repository'

type GetUserWatchHistoryUseCaseRequest = {
  userId: string
  page: number
  perPage?: number
}

type GetUserWatchHistoryUseCaseResponse = Either<never, { watchHistory: WatchEntry[] }>

@Injectable()
export class GetUserWatchHistoryUseCase {
  constructor(private watchHistoryRepository: WatchHistoryRepository) {}

  async execute({
    userId,
    page,
    perPage = 20,
  }: GetUserWatchHistoryUseCaseRequest): Promise<GetUserWatchHistoryUseCaseResponse> {
    const watchHistory = await this.watchHistoryRepository.findManyByUserId(userId, {
      page,
      perPage,
    })

    return right({ watchHistory })
  }
}
