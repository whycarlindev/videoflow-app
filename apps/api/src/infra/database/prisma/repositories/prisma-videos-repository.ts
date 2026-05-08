import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { VideosRepository } from '@/domain/video/application/repositories/videos-repository'
import { Video } from '@/domain/video/enterprise/entities/video'
import { PrismaVideoMapper } from '../mappers/prisma-video-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaVideosRepository implements VideosRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Video | null> {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: { tags: true },
    })
    if (!video) return null
    return PrismaVideoMapper.toDomain(video)
  }

  async findBySlug(slug: string): Promise<Video | null> {
    const video = await this.prisma.video.findUnique({
      where: { slug },
      include: { tags: true },
    })
    if (!video) return null
    return PrismaVideoMapper.toDomain(video)
  }

  async findManyByAuthorId(authorId: string, params: PaginationParams): Promise<Video[]> {
    const { page, perPage = 20 } = params
    const videos = await this.prisma.video.findMany({
      where: { authorId },
      include: { tags: true },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    })
    return videos.map(PrismaVideoMapper.toDomain)
  }

  async findMany(params: PaginationParams): Promise<Video[]> {
    const { page, perPage = 20 } = params
    const videos = await this.prisma.video.findMany({
      include: { tags: true },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    })
    return videos.map(PrismaVideoMapper.toDomain)
  }

  async create(video: Video): Promise<void> {
    const data = PrismaVideoMapper.toPrisma(video)
    await this.prisma.video.create({ data })

    const tags = video.tags.getItems()
    if (tags.length > 0) {
      await this.prisma.videoTag.createMany({
        data: tags.map((tag) => ({ videoId: video.id.toString(), tag })),
        skipDuplicates: true,
      })
    }

    DomainEvents.dispatchEventsForAggregate(video.id)
  }

  async save(video: Video): Promise<void> {
    const data = PrismaVideoMapper.toPrisma(video)
    await this.prisma.video.update({ where: { id: data.id }, data })

    const newTags = video.tags.getNewItems()
    const removedTags = video.tags.getRemovedItems()

    if (newTags.length > 0) {
      await this.prisma.videoTag.createMany({
        data: newTags.map((tag) => ({ videoId: video.id.toString(), tag })),
        skipDuplicates: true,
      })
    }

    if (removedTags.length > 0) {
      await this.prisma.videoTag.deleteMany({
        where: {
          videoId: video.id.toString(),
          tag: { in: removedTags },
        },
      })
    }

    DomainEvents.dispatchEventsForAggregate(video.id)
  }

  async delete(video: Video): Promise<void> {
    await this.prisma.video.delete({ where: { id: video.id.toString() } })
  }
}
