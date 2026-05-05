import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { VideosRepository } from '@/domain/video/application/repositories/videos-repository'
import { Video } from '@/domain/video/enterprise/entities/video'

export class InMemoryVideosRepository implements VideosRepository {
  public items: Video[] = []

  async findById(id: string): Promise<Video | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findBySlug(slug: string): Promise<Video | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findManyByAuthorId(
    authorId: string,
    { page, perPage = 20 }: PaginationParams,
  ): Promise<Video[]> {
    return this.items
      .filter((item) => item.authorId.toString() === authorId)
      .slice((page - 1) * perPage, page * perPage)
  }

  async findMany({ page, perPage = 20 }: PaginationParams): Promise<Video[]> {
    return this.items
      .filter((item) => item.status.isPublished())
      .slice((page - 1) * perPage, page * perPage)
  }

  async create(video: Video): Promise<void> {
    this.items.push(video)
    DomainEvents.dispatchEventsForAggregate(video.id)
  }

  async save(video: Video): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(video.id))
    if (index >= 0) {
      this.items[index] = video
    }
    DomainEvents.dispatchEventsForAggregate(video.id)
  }

  async delete(video: Video): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(video.id))
  }
}
