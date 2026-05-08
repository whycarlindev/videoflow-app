import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { CommentsRepository } from '@/domain/comment/application/repositories/comments-repository'
import { Comment } from '@/domain/comment/enterprise/entities/comment'
import { PrismaCommentMapper } from '../mappers/prisma-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCommentsRepository implements CommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({ where: { id } })
    if (!comment) return null
    return PrismaCommentMapper.toDomain(comment)
  }

  async findManyByVideoId(videoId: string, params: PaginationParams): Promise<Comment[]> {
    const { page, perPage = 20 } = params
    const comments = await this.prisma.comment.findMany({
      where: { videoId },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    })
    return comments.map(PrismaCommentMapper.toDomain)
  }

  async create(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment)
    await this.prisma.comment.create({ data })
    DomainEvents.dispatchEventsForAggregate(comment.id)
  }

  async save(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment)
    await this.prisma.comment.update({ where: { id: data.id }, data })
    DomainEvents.dispatchEventsForAggregate(comment.id)
  }

  async delete(comment: Comment): Promise<void> {
    await this.prisma.comment.delete({ where: { id: comment.id.toString() } })
  }
}
