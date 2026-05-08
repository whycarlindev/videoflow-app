import { Injectable } from '@nestjs/common'

import { WatchEntryProps } from '@/domain/watch-history/enterprise/entities/watch-entry'
import { PrismaWatchEntryMapper } from '@/infra/database/prisma/mappers/prisma-watch-entry-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeWatchEntry } from './make-watch-entry'

@Injectable()
export class WatchEntryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaWatchEntry(override: Partial<WatchEntryProps> = {}) {
    const watchEntry = makeWatchEntry(override)

    await this.prisma.watchEntry.create({
      data: PrismaWatchEntryMapper.toPrisma(watchEntry),
    })

    return watchEntry
  }
}
