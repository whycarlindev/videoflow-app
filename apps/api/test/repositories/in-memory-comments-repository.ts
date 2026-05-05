import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { CommentsRepository } from '@/domain/comment/application/repositories/comments-repository'
import { Comment } from '@/domain/comment/enterprise/entities/comment'

export class InMemoryCommentsRepository implements CommentsRepository {
  public items: Comment[] = []

  async findById(id: string): Promise<Comment | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findManyByVideoId(
    videoId: string,
    { page, perPage = 20 }: PaginationParams,
  ): Promise<Comment[]> {
    return this.items
      .filter((item) => item.videoId.toString() === videoId)
      .slice((page - 1) * perPage, page * perPage)
  }

  async create(comment: Comment): Promise<void> {
    this.items.push(comment)
    DomainEvents.dispatchEventsForAggregate(comment.id)
  }

  async save(comment: Comment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(comment.id))
    if (index >= 0) {
      this.items[index] = comment
    }
    DomainEvents.dispatchEventsForAggregate(comment.id)
  }

  async delete(comment: Comment): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(comment.id))
  }
}
