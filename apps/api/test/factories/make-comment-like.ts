import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CommentLike, CommentLikeProps } from '@/domain/comment/enterprise/entities/comment-like'

export function makeCommentLike(
  override: Partial<CommentLikeProps> = {},
  id?: UniqueEntityId,
): CommentLike {
  return CommentLike.create(
    {
      commentId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
