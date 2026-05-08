import { Comment as PrismaComment } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Comment } from '@/domain/comment/enterprise/entities/comment'

export class PrismaCommentMapper {
  static toDomain(raw: PrismaComment): Comment {
    return Comment.create(
      {
        videoId: new UniqueEntityId(raw.videoId),
        authorId: new UniqueEntityId(raw.authorId),
        content: raw.content,
        likesCount: raw.likesCount,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(comment: Comment) {
    return {
      id: comment.id.toString(),
      videoId: comment.videoId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      likesCount: comment.likesCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
