import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Comment, CommentProps } from '@/domain/comment/enterprise/entities/comment'

export function makeComment(override: Partial<CommentProps> = {}, id?: UniqueEntityId): Comment {
  return Comment.create(
    {
      videoId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: 'A test comment content.',
      ...override,
    },
    id,
  )
}
