import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  PlaylistItem,
  PlaylistItemProps,
} from '@/domain/playlist/enterprise/entities/playlist-item'

export function makePlaylistItem(
  override: Partial<PlaylistItemProps> = {},
  id?: UniqueEntityId,
): PlaylistItem {
  return PlaylistItem.create(
    {
      playlistId: new UniqueEntityId(),
      videoId: new UniqueEntityId(),
      position: 1,
      ...override,
    },
    id,
  )
}
