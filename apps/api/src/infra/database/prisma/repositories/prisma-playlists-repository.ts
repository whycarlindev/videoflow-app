import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PlaylistsRepository } from '@/domain/playlist/application/repositories/playlists-repository'
import { Playlist } from '@/domain/playlist/enterprise/entities/playlist'
import { PrismaPlaylistItemMapper } from '../mappers/prisma-playlist-item-mapper'
import { PrismaPlaylistMapper } from '../mappers/prisma-playlist-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaPlaylistsRepository implements PlaylistsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Playlist | null> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: { items: { orderBy: { position: 'asc' } } },
    })
    if (!playlist) return null
    return PrismaPlaylistMapper.toDomain(playlist)
  }

  async findManyByAuthorId(authorId: string, params: PaginationParams): Promise<Playlist[]> {
    const { page, perPage = 20 } = params
    const playlists = await this.prisma.playlist.findMany({
      where: { authorId },
      include: { items: { orderBy: { position: 'asc' } } },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    })
    return playlists.map(PrismaPlaylistMapper.toDomain)
  }

  async create(playlist: Playlist): Promise<void> {
    const data = PrismaPlaylistMapper.toPrisma(playlist)
    await this.prisma.playlist.create({ data })

    const items = playlist.videos.getItems()
    if (items.length > 0) {
      await this.prisma.playlistItem.createMany({
        data: items.map((item) => PrismaPlaylistItemMapper.toPrisma(item)),
        skipDuplicates: true,
      })
    }

    DomainEvents.dispatchEventsForAggregate(playlist.id)
  }

  async save(playlist: Playlist): Promise<void> {
    const data = PrismaPlaylistMapper.toPrisma(playlist)
    await this.prisma.playlist.update({ where: { id: data.id }, data })

    const newItems = playlist.videos.getNewItems()
    const removedItems = playlist.videos.getRemovedItems()

    if (newItems.length > 0) {
      await this.prisma.playlistItem.createMany({
        data: newItems.map((item) => PrismaPlaylistItemMapper.toPrisma(item)),
        skipDuplicates: true,
      })
    }

    if (removedItems.length > 0) {
      await this.prisma.playlistItem.deleteMany({
        where: {
          playlistId: playlist.id.toString(),
          videoId: { in: removedItems.map((i) => i.videoId.toString()) },
        },
      })
    }

    DomainEvents.dispatchEventsForAggregate(playlist.id)
  }

  async delete(playlist: Playlist): Promise<void> {
    await this.prisma.playlist.delete({ where: { id: playlist.id.toString() } })
  }
}
