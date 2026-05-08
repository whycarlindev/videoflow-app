import { PlaylistItem as PrismaPlaylistItem } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PlaylistItem } from '@/domain/playlist/enterprise/entities/playlist-item'

export class PrismaPlaylistItemMapper {
  static toDomain(raw: PrismaPlaylistItem): PlaylistItem {
    return PlaylistItem.create(
      {
        playlistId: new UniqueEntityId(raw.playlistId),
        videoId: new UniqueEntityId(raw.videoId),
        position: raw.position,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(item: PlaylistItem) {
    return {
      id: item.id.toString(),
      playlistId: item.playlistId.toString(),
      videoId: item.videoId.toString(),
      position: item.position,
      addedAt: item.addedAt,
    }
  }
}
