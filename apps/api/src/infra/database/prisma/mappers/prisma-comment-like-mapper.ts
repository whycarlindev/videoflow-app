import { CommentLike as PrismaCommentLike } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CommentLike } from '@/domain/comment/enterprise/entities/comment-like'

export class PrismaCommentLikeMapper {
  static toDomain(raw: PrismaCommentLike): CommentLike {
    return CommentLike.create(
      {
        commentId: new UniqueEntityId(raw.commentId),
        userId: new UniqueEntityId(raw.userId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(commentLike: CommentLike) {
    return {
      id: commentLike.id.toString(),
      commentId: commentLike.commentId.toString(),
      userId: commentLike.userId.toString(),
      createdAt: commentLike.createdAt,
    }
  }
}
