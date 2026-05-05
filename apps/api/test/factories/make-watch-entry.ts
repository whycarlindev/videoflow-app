import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { WatchEntry, WatchEntryProps } from '@/domain/watch-history/enterprise/entities/watch-entry'

export function makeWatchEntry(
  override: Partial<WatchEntryProps> = {},
  id?: UniqueEntityId,
): WatchEntry {
  return WatchEntry.create(
    {
      userId: new UniqueEntityId(),
      videoId: new UniqueEntityId(),
      progressPercentage: 50,
      ...override,
    },
    id,
  )
}
