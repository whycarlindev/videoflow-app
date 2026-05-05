import { PaginationParams } from '@/core/repositories/pagination-params'
import { WatchEntry } from '../../enterprise/entities/watch-entry'

export abstract class WatchHistoryRepository {
  abstract findByUserAndVideo(userId: string, videoId: string): Promise<WatchEntry | null>
  abstract findManyByUserId(userId: string, params: PaginationParams): Promise<WatchEntry[]>
  abstract upsert(watchEntry: WatchEntry): Promise<void>
  abstract delete(watchEntry: WatchEntry): Promise<void>
  abstract deleteAllByUserId(userId: string): Promise<void>
}
