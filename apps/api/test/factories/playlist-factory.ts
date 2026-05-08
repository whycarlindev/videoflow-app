import { Injectable } from '@nestjs/common'

import { PlaylistProps } from '@/domain/playlist/enterprise/entities/playlist'
import { PrismaPlaylistMapper } from '@/infra/database/prisma/mappers/prisma-playlist-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makePlaylist } from './make-playlist'

@Injectable()
export class PlaylistFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPlaylist(override: Partial<PlaylistProps> = {}) {
    const playlist = makePlaylist(override)

    await this.prisma.playlist.create({
      data: PrismaPlaylistMapper.toPrisma(playlist),
    })

    return playlist
  }
}
