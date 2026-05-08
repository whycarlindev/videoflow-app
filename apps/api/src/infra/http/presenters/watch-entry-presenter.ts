import { WatchEntry } from '@/domain/watch-history/enterprise/entities/watch-entry'

export class WatchEntryPresenter {
  static toHTTP(watchEntry: WatchEntry) {
    return {
      id: watchEntry.id.toString(),
      userId: watchEntry.userId.toString(),
      videoId: watchEntry.videoId.toString(),
      progressPercentage: watchEntry.progressPercentage,
      completed: watchEntry.completed,
      watchedAt: watchEntry.watchedAt,
    }
  }
}
