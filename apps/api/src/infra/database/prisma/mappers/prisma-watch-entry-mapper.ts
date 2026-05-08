import { WatchEntry as PrismaWatchEntry } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { WatchEntry } from '@/domain/watch-history/enterprise/entities/watch-entry'

export class PrismaWatchEntryMapper {
  static toDomain(raw: PrismaWatchEntry): WatchEntry {
    return WatchEntry.create(
      {
        userId: new UniqueEntityId(raw.userId),
        videoId: new UniqueEntityId(raw.videoId),
        progressPercentage: raw.progressPercentage,
        completed: raw.completed,
        watchedAt: raw.watchedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(watchEntry: WatchEntry) {
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
