import { Playlist as PrismaPlaylist, PlaylistItem as PrismaPlaylistItem } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Playlist } from '@/domain/playlist/enterprise/entities/playlist'
import { PlaylistItem } from '@/domain/playlist/enterprise/entities/playlist-item'
import { PlaylistVideosList } from '@/domain/playlist/enterprise/entities/playlist-videos-list'
import { PrismaPlaylistItemMapper } from './prisma-playlist-item-mapper'

type PrismaPlaylistWithItems = PrismaPlaylist & { items: PrismaPlaylistItem[] }

export class PrismaPlaylistMapper {
  static toDomain(raw: PrismaPlaylistWithItems): Playlist {
    const items = raw.items.map((i) => PrismaPlaylistItemMapper.toDomain(i))

    return Playlist.create(
      {
        title: raw.title,
        description: raw.description,
        authorId: new UniqueEntityId(raw.authorId),
        isPublic: raw.isPublic,
        videos: new PlaylistVideosList(items),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(playlist: Playlist) {
    return {
      id: playlist.id.toString(),
      title: playlist.title,
      description: playlist.description,
      authorId: playlist.authorId.toString(),
      isPublic: playlist.isPublic,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
    }
  }
}
