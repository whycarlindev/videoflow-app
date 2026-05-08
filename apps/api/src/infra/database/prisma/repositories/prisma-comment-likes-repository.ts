import { Injectable } from '@nestjs/common'
import { CommentLikesRepository } from '@/domain/comment/application/repositories/comment-likes-repository'
import { CommentLike } from '@/domain/comment/enterprise/entities/comment-like'
import { PrismaCommentLikeMapper } from '../mappers/prisma-comment-like-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCommentLikesRepository implements CommentLikesRepository {
  constructor(private prisma: PrismaService) {}

  async findByCommentAndUser(commentId: string, userId: string): Promise<CommentLike | null> {
    const like = await this.prisma.commentLike.findFirst({ where: { commentId, userId } })
    if (!like) return null
    return PrismaCommentLikeMapper.toDomain(like)
  }

  async create(commentLike: CommentLike): Promise<void> {
    const data = PrismaCommentLikeMapper.toPrisma(commentLike)
    await this.prisma.commentLike.create({ data })
  }

  async delete(commentLike: CommentLike): Promise<void> {
    await this.prisma.commentLike.delete({ where: { id: commentLike.id.toString() } })
  }
}
