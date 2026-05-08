import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { WatchHistoryRepository } from '@/domain/watch-history/application/repositories/watch-history-repository'
import { WatchEntry } from '@/domain/watch-history/enterprise/entities/watch-entry'
import { PrismaWatchEntryMapper } from '../mappers/prisma-watch-entry-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaWatchHistoryRepository implements WatchHistoryRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserAndVideo(userId: string, videoId: string): Promise<WatchEntry | null> {
    const entry = await this.prisma.watchEntry.findFirst({ where: { userId, videoId } })
    if (!entry) return null
    return PrismaWatchEntryMapper.toDomain(entry)
  }

  async findManyByUserId(userId: string, params: PaginationParams): Promise<WatchEntry[]> {
    const { page, perPage = 20 } = params
    const entries = await this.prisma.watchEntry.findMany({
      where: { userId },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { watchedAt: 'desc' },
    })
    return entries.map(PrismaWatchEntryMapper.toDomain)
  }

  async upsert(watchEntry: WatchEntry): Promise<void> {
    const data = PrismaWatchEntryMapper.toPrisma(watchEntry)
    await this.prisma.watchEntry.upsert({
      where: { id: data.id },
      create: data,
      update: {
        progressPercentage: data.progressPercentage,
        completed: data.completed,
        watchedAt: data.watchedAt,
      },
    })
  }

  async delete(watchEntry: WatchEntry): Promise<void> {
    await this.prisma.watchEntry.delete({ where: { id: watchEntry.id.toString() } })
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.prisma.watchEntry.deleteMany({ where: { userId } })
  }
}
