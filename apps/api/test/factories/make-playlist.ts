import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Playlist, PlaylistProps } from '@/domain/playlist/enterprise/entities/playlist'

export function makePlaylist(override: Partial<PlaylistProps> = {}, id?: UniqueEntityId): Playlist {
  return Playlist.create(
    {
      title: 'My Test Playlist',
      authorId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
