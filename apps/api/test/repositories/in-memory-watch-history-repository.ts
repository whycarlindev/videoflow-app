import { PaginationParams } from '@/core/repositories/pagination-params'
import { WatchHistoryRepository } from '@/domain/watch-history/application/repositories/watch-history-repository'
import { WatchEntry } from '@/domain/watch-history/enterprise/entities/watch-entry'

export class InMemoryWatchHistoryRepository implements WatchHistoryRepository {
  public items: WatchEntry[] = []

  async findByUserAndVideo(userId: string, videoId: string): Promise<WatchEntry | null> {
    return (
      this.items.find(
        (item) => item.userId.toString() === userId && item.videoId.toString() === videoId,
      ) ?? null
    )
  }

  async findManyByUserId(
    userId: string,
    { page, perPage = 20 }: PaginationParams,
  ): Promise<WatchEntry[]> {
    return this.items
      .filter((item) => item.userId.toString() === userId)
      .sort((a, b) => b.watchedAt.getTime() - a.watchedAt.getTime())
      .slice((page - 1) * perPage, page * perPage)
  }

  async upsert(watchEntry: WatchEntry): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(watchEntry.id))
    if (index >= 0) {
      this.items[index] = watchEntry
    } else {
      this.items.push(watchEntry)
    }
  }

  async delete(watchEntry: WatchEntry): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(watchEntry.id))
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    this.items = this.items.filter((item) => item.userId.toString() !== userId)
  }
}
